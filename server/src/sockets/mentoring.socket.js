import { systemEvents } from "../utils/events.js";

/**
 * Mentoring Socket Handlers
 * 
 * Listens for internal system events related to mentoring 
 * and broadcasts them to the relevant user via Socket.io.
 */
export const registerMentoringHandlers = (io, socket) => {
    // Mentoring-specific client-to-server events can be added here
    // For now, we mainly focus on server-to-client broadcasts
};

/**
 * Initialize global mentoring event listeners
 * This listens to the internal EventEmitter and pushes to Socket.io
 */
export const initMentoringSocketListeners = (io) => {
    if (!io) return;

    // Listen for new notifications to see if they are mentoring related
    systemEvents.on("notification:create", (payload) => {
        const { userId, type } = payload;
        
        // If it's a mentoring notification, push a real-time update event
        // Backend emits type: "mentor_booking", "mentor_review", etc.
        if (type?.startsWith("mentor_")) {
            const userIdStr = userId.toString();
            
            // Emit a specific event so the mentoring tab can refresh instantly
            io.to(`user:${userIdStr}`).emit("mentoring:session_update", {
                type,
                bookingId: payload.ref?.toString(),
                timestamp: new Date()
            });
        }
    });

    console.log("[Mentoring Socket] Global event listeners initialized");
};
