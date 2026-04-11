import mongoose from "mongoose";

/**
 * Connection Model — tracks connection requests between users.
 * Status flow: pending → accepted | rejected
 */
const connectionSchema = new mongoose.Schema({
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
        index: true,
    },
    message: {
        type: String,
        trim: true,
        maxlength: 200,
        default: "",
    },
}, {
    timestamps: true,
});

// Compound index to prevent duplicate requests
connectionSchema.index({ requester: 1, recipient: 1 }, { unique: true });

// Static: get connection status between two users
connectionSchema.statics.getStatus = async function (userA, userB) {
    const conn = await this.findOne({
        $or: [
            { requester: userA, recipient: userB },
            { requester: userB, recipient: userA },
        ],
    });
    if (!conn) return "none";
    if (conn.status === "rejected") return "none";
    return conn.status; // "pending" or "accepted"
};

export const Connection = mongoose.model("Connection", connectionSchema);
