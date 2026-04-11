import api from './axios';

/**
 * Academic Network API — Real backend calls
 * All connection operations persist in MongoDB.
 */

// Fetch all user profiles + their connection status for the current user
export const getNetworkProfiles = async (params = {}) => {
    try {
        const response = await api.get('/users/search', { params: { ...params, limit: 0 } });
        const payload = response.data?.data;
        const docs = payload?.docs || payload?.users || [];

        // Get current user ID to exclude self
        let currentUserId = null;
        try {
            const authState = JSON.parse(localStorage.getItem('authState') || '{}');
            currentUserId = authState?.user?._id || authState?.user?.id;
        } catch { /* ignore */ }

        // Filter out the logged-in user from the list
        const profiles = docs
            .filter(user => user._id !== currentUserId)
            .map(user => ({
                id: user._id,
                name: user.profile?.displayName
                    || `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim()
                    || user.email?.split('@')[0]
                    || 'User',
                email: user.email || '',
                department: user.academic?.department || '',
                bio: user.profile?.bio || '',
                role: (user.roles || []).includes('mentor') ? 'Mentor'
                    : (user.roles || []).includes('society_head') ? 'Society Head'
                        : (user.roles || []).includes('admin') ? 'Admin'
                            : 'Student',
                year: user.academic?.semester ? `Semester ${user.academic.semester}` : '',
                avatar: user.profile?.avatar || '',
                isOnline: false,
                academicInterests: user.interests || user.academic?.interests || [],
                societies: (user.societies || []).map(s => typeof s === 'string' ? s : s._id),
                connectionStatus: 'none', // Will be updated by bulk status call
                connectionId: null,
            }));

        // Bulk-fetch connection statuses from backend
        if (profiles.length > 0) {
            try {
                const userIds = profiles.map(p => p.id);
                const statusResponse = await api.post('/connections/statuses', { userIds });
                const statuses = statusResponse.data?.statuses || {};

                profiles.forEach(profile => {
                    const info = statuses[profile.id];
                    if (info) {
                        profile.connectionStatus = info.status; // "pending" or "accepted"
                        profile.connectionId = info.connectionId;
                        profile.connectionDirection = info.direction; // "outgoing" or "incoming"
                    }
                });
            } catch (statusErr) {
                console.warn('[NetworkApi] Could not fetch connection statuses:', statusErr);
            }
        }

        return profiles;
    } catch (error) {
        console.error('[NetworkApi] Failed to fetch profiles:', error);
        throw error.response?.data || error;
    }
};

// Send a connection request (real backend)
export const sendConnectionRequest = async (profileId) => {
    const response = await api.post(`/connections/request/${profileId}`);
    return { success: true, profileId, connection: response.data?.connection };
};

// Accept a connection request (real backend)
export const acceptConnectionRequest = async (connectionId) => {
    const response = await api.patch(`/connections/accept/${connectionId}`);
    return response.data;
};

// Reject a connection request (real backend)
export const rejectConnectionRequest = async (connectionId) => {
    const response = await api.patch(`/connections/reject/${connectionId}`);
    return response.data;
};

// Get pending connection requests (real backend)
export const getPendingRequests = async () => {
    const response = await api.get('/connections/pending');
    return response.data?.requests || [];
};

// Get all accepted connections (real backend)
export const getAcceptedConnections = async () => {
    const response = await api.get('/connections');
    return response.data?.connections || [];
};

// Remove a connection (real backend)
export const removeConnection = async (connectionId) => {
    const response = await api.delete(`/connections/${connectionId}`);
    return response.data;
};
