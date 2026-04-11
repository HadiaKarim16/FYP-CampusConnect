import { Connection } from "../models/connection.model.js";

/**
 * Send a connection request
 * POST /api/v1/connections/request/:userId
 */
export const sendRequest = async (req, res) => {
    try {
        const requesterId = req.user._id;
        const recipientId = req.params.userId;

        if (requesterId.toString() === recipientId) {
            return res.status(400).json({ message: "Cannot connect with yourself" });
        }

        // Check if a connection already exists in either direction
        const existing = await Connection.findOne({
            $or: [
                { requester: requesterId, recipient: recipientId },
                { requester: recipientId, recipient: requesterId },
            ],
        });

        if (existing) {
            if (existing.status === "accepted") {
                return res.status(400).json({ message: "Already connected" });
            }
            if (existing.status === "pending") {
                return res.status(400).json({ message: "Request already pending" });
            }
            // If rejected, allow re-request by updating status
            existing.requester = requesterId;
            existing.recipient = recipientId;
            existing.status = "pending";
            await existing.save();
            return res.json({ message: "Connection request sent", connection: existing });
        }

        const connection = await Connection.create({
            requester: requesterId,
            recipient: recipientId,
            status: "pending",
        });

        res.status(201).json({ message: "Connection request sent", connection });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Connection request already exists" });
        }
        res.status(500).json({ message: "Failed to send request", error: error.message });
    }
};

/**
 * Accept a connection request
 * PATCH /api/v1/connections/accept/:connectionId
 */
export const acceptRequest = async (req, res) => {
    try {
        const connection = await Connection.findById(req.params.connectionId);
        if (!connection) {
            return res.status(404).json({ message: "Connection request not found" });
        }

        // Only the recipient can accept
        if (connection.recipient.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Only the recipient can accept this request" });
        }

        if (connection.status !== "pending") {
            return res.status(400).json({ message: `Request is already ${connection.status}` });
        }

        connection.status = "accepted";
        await connection.save();

        res.json({ message: "Connection accepted", connection });
    } catch (error) {
        res.status(500).json({ message: "Failed to accept request", error: error.message });
    }
};

/**
 * Reject a connection request
 * PATCH /api/v1/connections/reject/:connectionId
 */
export const rejectRequest = async (req, res) => {
    try {
        const connection = await Connection.findById(req.params.connectionId);
        if (!connection) {
            return res.status(404).json({ message: "Connection request not found" });
        }

        if (connection.recipient.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Only the recipient can reject this request" });
        }

        if (connection.status !== "pending") {
            return res.status(400).json({ message: `Request is already ${connection.status}` });
        }

        connection.status = "rejected";
        await connection.save();

        res.json({ message: "Connection rejected", connection });
    } catch (error) {
        res.status(500).json({ message: "Failed to reject request", error: error.message });
    }
};

/**
 * Get pending requests received by the current user
 * GET /api/v1/connections/pending
 */
export const getPendingRequests = async (req, res) => {
    try {
        const requests = await Connection.find({
            recipient: req.user._id,
            status: "pending",
        })
            .populate("requester", "email profile.displayName profile.firstName profile.lastName profile.avatar academic.department roles")
            .sort({ createdAt: -1 });

        res.json({ requests });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch pending requests", error: error.message });
    }
};

/**
 * Get all accepted connections for the current user
 * GET /api/v1/connections
 */
export const getConnections = async (req, res) => {
    try {
        const connections = await Connection.find({
            $or: [
                { requester: req.user._id, status: "accepted" },
                { recipient: req.user._id, status: "accepted" },
            ],
        })
            .populate("requester", "email profile.displayName profile.firstName profile.lastName profile.avatar academic.department roles")
            .populate("recipient", "email profile.displayName profile.firstName profile.lastName profile.avatar academic.department roles")
            .sort({ updatedAt: -1 });

        // Normalize: always return the "other" user
        const normalized = connections.map(conn => {
            const isRequester = conn.requester._id.toString() === req.user._id.toString();
            const otherUser = isRequester ? conn.recipient : conn.requester;
            return {
                connectionId: conn._id,
                user: otherUser,
                connectedAt: conn.updatedAt,
            };
        });

        res.json({ connections: normalized });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch connections", error: error.message });
    }
};

/**
 * Get connection statuses for a list of user IDs (bulk lookup)
 * POST /api/v1/connections/statuses
 * Body: { userIds: ["id1", "id2", ...] }
 */
export const getConnectionStatuses = async (req, res) => {
    try {
        const { userIds } = req.body;
        if (!Array.isArray(userIds)) {
            return res.status(400).json({ message: "userIds must be an array" });
        }

        const currentUserId = req.user._id;

        // Find all connections involving the current user and the given user IDs
        const connections = await Connection.find({
            $or: [
                { requester: currentUserId, recipient: { $in: userIds } },
                { recipient: currentUserId, requester: { $in: userIds } },
            ],
            status: { $in: ["pending", "accepted"] },
        });

        // Build a map: userId → { status, connectionId, direction }
        const statusMap = {};
        connections.forEach(conn => {
            const isRequester = conn.requester.toString() === currentUserId.toString();
            const otherUserId = isRequester ? conn.recipient.toString() : conn.requester.toString();
            statusMap[otherUserId] = {
                status: conn.status,
                connectionId: conn._id,
                direction: isRequester ? "outgoing" : "incoming",
            };
        });

        res.json({ statuses: statusMap });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch statuses", error: error.message });
    }
};

/**
 * Remove a connection (unfriend)
 * DELETE /api/v1/connections/:connectionId
 */
export const removeConnection = async (req, res) => {
    try {
        const connection = await Connection.findById(req.params.connectionId);
        if (!connection) {
            return res.status(404).json({ message: "Connection not found" });
        }

        const userId = req.user._id.toString();
        if (connection.requester.toString() !== userId && connection.recipient.toString() !== userId) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await connection.deleteOne();
        res.json({ message: "Connection removed" });
    } catch (error) {
        res.status(500).json({ message: "Failed to remove connection", error: error.message });
    }
};
