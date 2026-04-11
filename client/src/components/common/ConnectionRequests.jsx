import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchPendingRequests,
    acceptConnection,
    rejectConnection,
    selectPendingRequests,
} from '../../redux/slices/academicNetworkSlice';

/**
 * ConnectionRequests — shows incoming connection requests with Accept/Reject buttons.
 * Can be placed on any dashboard (Student, Mentor, Society Head).
 */
export default function ConnectionRequests() {
    const dispatch = useDispatch();
    const pendingRequests = useSelector(selectPendingRequests);

    useEffect(() => {
        dispatch(fetchPendingRequests());
    }, [dispatch]);

    if (!pendingRequests || pendingRequests.length === 0) {
        return null; // Don't render anything if no pending requests
    }

    const handleAccept = (connectionId) => {
        dispatch(acceptConnection(connectionId)).then(() => {
            dispatch(fetchPendingRequests()); // Refresh list
        });
    };

    const handleReject = (connectionId) => {
        dispatch(rejectConnection(connectionId)).then(() => {
            dispatch(fetchPendingRequests()); // Refresh list
        });
    };

    return (
        <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-text-primary text-lg font-bold">
                    Connection Requests
                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-bold">
                        {pendingRequests.length}
                    </span>
                </h2>
            </div>
            <div className="space-y-3">
                {pendingRequests.map((request) => {
                    const user = request.requester;
                    const displayName = user?.profile?.displayName
                        || `${user?.profile?.firstName || ''} ${user?.profile?.lastName || ''}`.trim()
                        || user?.email?.split('@')[0]
                        || 'User';
                    const department = user?.academic?.department || '';
                    const avatar = user?.profile?.avatar;
                    const initial = displayName[0]?.toUpperCase() || 'U';

                    return (
                        <div
                            key={request._id}
                            className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background"
                        >
                            {/* Avatar */}
                            {avatar ? (
                                <img
                                    src={avatar}
                                    alt={displayName}
                                    className="w-10 h-10 rounded-full object-cover shrink-0"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                                    {initial}
                                </div>
                            )}

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-text-primary text-sm font-semibold truncate">{displayName}</p>
                                {department && (
                                    <p className="text-text-secondary text-[11px] mt-0.5">{department}</p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 shrink-0">
                                <button
                                    onClick={() => handleAccept(request._id)}
                                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-primary text-white hover:opacity-90 transition-opacity"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => handleReject(request._id)}
                                    className="px-3 py-1.5 text-xs font-bold rounded-lg border border-border text-text-secondary hover:text-text-primary hover:border-red-500/50 transition-colors"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
