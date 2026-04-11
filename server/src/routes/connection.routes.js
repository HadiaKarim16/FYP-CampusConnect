import express from "express";
import {
    sendRequest,
    acceptRequest,
    rejectRequest,
    getPendingRequests,
    getConnections,
    getConnectionStatuses,
    removeConnection,
} from "../controllers/connection.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All connection routes are protected
router.use(verifyJWT);

// Get all accepted connections
router.get("/", getConnections);

// Get pending incoming requests
router.get("/pending", getPendingRequests);

// Bulk status lookup
router.post("/statuses", getConnectionStatuses);

// Send a connection request
router.post("/request/:userId", sendRequest);

// Accept a pending request
router.patch("/accept/:connectionId", acceptRequest);

// Reject a pending request
router.patch("/reject/:connectionId", rejectRequest);

// Remove/unfriend a connection
router.delete("/:connectionId", removeConnection);

export default router;
