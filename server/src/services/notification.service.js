import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { Notification } from "../models/notification.model.js";
import { paginate } from "../utils/paginate.js";
import { systemEvents } from "../utils/events.js";
import { emitNotification } from "../sockets/notification.socket.js";
import { EventTeam } from "../models/eventTeam.model.js";
import { Event } from "../models/event.model.js";

export const getMyNotifications = async (queryParams, requestUser) => {
    const { page = 1, limit = 20, unreadOnly } = queryParams;

    const filter = { userId: requestUser._id };
    if (unreadOnly === "true") {
        filter.read = false;
    }

    return await paginate(Notification, filter, {
        page,
        limit,
        sort: { createdAt: -1 },
        populate: [
            {
                path: "actorId",
                select: "profile.displayName profile.avatar",
            },
        ],
    });
};

export const getUnreadCount = async (userId) => {
    return await Notification.getUnreadCount(userId);
};

export const markAsRead = async (notificationId, userId) => {
    if (!mongoose.isValidObjectId(notificationId)) {
        throw new ApiError(400, "Invalid notification ID format");
    }

    const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { $set: { read: true, readAt: new Date() } },
        { new: true }
    );

    if (!notification) {
        throw new ApiError(404, "Notification not found");
    }

    return notification;
};

export const markAllAsRead = async (userId) => {
    const result = await Notification.markAllRead(userId);
    return { modifiedCount: result.modifiedCount };
};

export const deleteNotification = async (notificationId, userId) => {
    if (!mongoose.isValidObjectId(notificationId)) {
        throw new ApiError(400, "Invalid notification ID format");
    }

    const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        userId,
    });

    if (!notification) {
        throw new ApiError(404, "Notification not found");
    }

    return true;
};

/**
 * Global Notification Listener
 * 
 * Listens to internal system events and persists them to the DB,
 * then broadcasts them via Socket.io.
 */
export const initNotificationService = (app) => {
    const io = app.get("io");
    if (!io) {
        console.warn("[Notification Service] Socket.io instance not found on app, live push disabled");
    }

    // --- Single Notification ---
    systemEvents.on("notification:create", async (payload) => {
        try {
            const { userId, ...rest } = payload;
            if (!userId) return;

            const notification = await Notification.create({
                userId,
                ...rest
            });

            if (io) {
                emitNotification(io, userId, notification);
            }
        } catch (error) {
            console.error("[Notification Service] Failed to create notification:", error.message);
        }
    });

    // --- Bulk Notification (e.g. for Event participants) ---
    systemEvents.on("notification:create:bulk", async (payload) => {
        try {
            let { userIds, eventId, societyId, ...rest } = payload;
            
            // If explicit userIds provided, use them
            if (!userIds || !Array.isArray(userIds)) {
                userIds = [];
                
                // If eventId provided, notify all registered participants
                if (eventId) {
                    const teams = await EventTeam.find({ eventId, status: { $in: ["registered", "forming"] } })
                        .select("members.userId");
                    
                    const participants = new Set();
                    teams.forEach(t => t.members.forEach(m => participants.add(m.userId.toString())));
                    
                    // Also find solo registrations if any (depending on schema)
                    // For now, teams cover most cases in this app
                    userIds = Array.from(participants);
                }
                
                // If societyId provided, notify all members
                // (Society member model lookup would go here)
            }

            if (userIds.length === 0) return;

            // Create notification records in bulk
            const docs = userIds.map(uid => ({
                ...rest,
                userId: uid
            }));

            const created = await Notification.insertMany(docs);

            // Push to individual sockets
            if (io) {
                created.forEach(n => emitNotification(io, n.userId, n));
            }
        } catch (error) {
            console.error("[Notification Service] Failed to create bulk notifications:", error.message);
        }
    });

    console.log("[Notification Service] Global event listeners initialized");
};
