import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../../components/common/Avatar";
import MentorWidget from "@/components/dashboard/MentorWidget";
import SharedFooter from "../../components/common/SharedFooter";
import MentorTopBar from "../../components/mentoring/MentorTopBar";
import { useModal, MODAL_TYPES } from "../../contexts/ModalContext";
import { 
  fetchSessionsThunk, 
  selectScheduledSessions, 
  selectCompletedSessions, 
  selectMentoringLoading
} from "../../redux/slices/mentoringSlice";

export default function MentorDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { openModal } = useModal();
  const [searchValue, setSearchValue] = useState("");

  const scheduledSessions = useSelector(selectScheduledSessions);
  const completedSessions = useSelector(selectCompletedSessions);
  const loading = useSelector(selectMentoringLoading);
  const authUser = useSelector(state => state.auth?.user);

  useEffect(() => {
    dispatch(fetchSessionsThunk());
  }, [dispatch]);

  const safeSearchValue = (searchValue || "").toLowerCase();

  const filteredScheduled = scheduledSessions.filter(s => 
    !safeSearchValue || (s.menteeId?.profile?.displayName || "").toLowerCase().includes(safeSearchValue)
  );
  const filteredCompleted = completedSessions.filter(s => 
    !safeSearchValue || (s.menteeId?.profile?.displayName || "").toLowerCase().includes(safeSearchValue)
  );

  const upcomingSessions = filteredScheduled.slice(0, 3);
  const recentRatings = filteredCompleted
    .filter(s => s.reviewId?.rating)
    .slice(0, 2);
  const pendingFeedback = filteredCompleted.filter(s => !s.reviewId);

  const totalEarnings = completedSessions.reduce((sum, s) => sum + (s.mentorPayout || s.fee || 0), 0);

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col font-display text-[#c9d1d9] group/design-root overflow-x-hidden bg-[#112118]">
      <div className="layout-container flex h-full grow flex-col">
        <MentorTopBar
          showBack={false}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
        >
          <button
            onClick={() => navigate("/mentor-mentees")}
            className="text-white text-sm font-medium leading-normal hover:text-[#1dc964] transition-colors"
          >
            Mentees
          </button>
          <button
            onClick={() => navigate("/mentor-events")}
            className="text-white text-sm font-medium leading-normal hover:text-[#1dc964] transition-colors"
          >
            Events
          </button>
          <button
            onClick={() => navigate("/mentor-profile-view")}
            className="text-white text-sm font-medium leading-normal hover:text-[#1dc964] transition-colors"
          >
            Profile
          </button>
        </MentorTopBar>

        <main className="px-6 lg:px-10 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-full max-w-6xl flex-1">
            {/* Page Heading */}
            <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
              <div className="flex min-w-72 flex-col gap-2">
                <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                  Mentor Portal
                </p>
                <p className="text-[#9eb7a9] text-base font-normal leading-normal">
                  Manage your sessions, ratings, and mentee feedback.
                </p>
              </div>
              <button
                onClick={() => openModal(MODAL_TYPES.SET_AVAILABILITY)}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-[#1dc964] text-[#112118] text-base font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity"
              >
                <span className="material-symbols-outlined mr-2">
                  calendar_add_on
                </span>
                <span className="truncate">Set Your Availability</span>
              </button>
            </div>

            {/* Widgets Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Upcoming Sessions (2 columns) */}
              <MentorWidget
                title="Upcoming Sessions"
                actionLabel={scheduledSessions.length > 0 ? "View All" : null}
                actionIcon="arrow_forward"
                onAction={() => navigate("/my-sessions")}
                actionClassName="text-[#1dc964] text-sm font-semibold hover:text-white transition-colors flex items-center gap-1"
                className="lg:col-span-2"
              >
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <div className="w-8 h-8 border-3 border-[#1dc964] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : upcomingSessions.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {upcomingSessions.map((session) => (
                      <div key={session._id} className="flex items-center justify-between p-4 bg-[#0d1117] rounded-xl border border-[#30363d] hover:border-[#1dc964] transition-colors cursor-pointer" onClick={() => navigate("/my-sessions")}>
                        <div className="flex items-center gap-3">
                          <img 
                            src={session.menteeId?.profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.menteeId?.profile?.displayName}`} 
                            className="w-10 h-10 rounded-full"
                            alt="Mentee"
                          />
                          <div>
                            <p className="text-white font-semibold text-sm">{session.menteeId?.profile?.displayName || "Student"}</p>
                            <p className="text-[#9eb7a9] text-xs">{new Date(session.startAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          session.status === 'confirmed' ? 'bg-[#1dc96422] text-[#1dc964]' : 'bg-[#e3b34122] text-[#e3b341]'
                        }`}>
                          {session.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-6 py-10 text-center">
                    <div className="text-[#1dc964]">
                      <span
                        className="material-symbols-outlined inline-block"
                        style={{ fontSize: "64px" }}
                      >
                        event_busy
                      </span>
                    </div>
                    <div className="flex max-w-[480px] flex-col items-center gap-2">
                      <p className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                        No sessions yet
                      </p>
                      <p className="text-[#9eb7a9] text-sm font-normal leading-normal max-w-[480px]">
                        Once a student books a session, it will appear here!
                      </p>
                    </div>
                  </div>
                )}
              </MentorWidget>

              {/* Earnings Overview */}
              <MentorWidget
                title="Earnings Overview"
                actionIcon="arrow_forward"
                onAction={() => navigate("/earnings")}
                actionClassName="text-[#1dc964] text-sm font-semibold hover:text-white transition-colors"
              >
                <div className="flex flex-col gap-6 flex-1">
                  <div className="flex flex-col gap-2">
                    <p className="text-[#9eb7a9] text-sm">Total Earnings</p>
                    <p className="text-white text-4xl font-bold tracking-tight">
                      ${totalEarnings.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-[#9eb7a9] text-sm">Sessions Completed</p>
                    <p className="text-white text-2xl font-bold">{completedSessions.length}</p>
                  </div>
                  <div className="mt-auto">
                    <button
                      onClick={() => navigate("/earnings")}
                      className="flex w-full min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#30363d] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#404851] transition-colors gap-2"
                    >
                      <span className="material-symbols-outlined">
                        account_balance_wallet
                      </span>
                      <span className="truncate">Withdraw Earnings</span>
                    </button>
                  </div>
                </div>
              </MentorWidget>

              {/* Pending Feedback */}
              <MentorWidget
                title="Pending Feedback"
                actionIcon="arrow_forward"
                onAction={() => navigate("/my-sessions")}
                actionClassName="text-[#1dc964] text-sm font-semibold hover:text-white transition-colors"
              >
                {pendingFeedback.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {pendingFeedback.slice(0, 3).map((session) => (
                      <div key={session._id} className="flex items-center gap-3 p-3 bg-[#0d1117] rounded-xl border border-[#30363d]">
                        <img 
                          src={session.menteeId?.profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.menteeId?.profile?.displayName}`} 
                          className="w-8 h-8 rounded-full"
                          alt="Mentee"
                        />
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{session.menteeId?.profile?.displayName || "Student"}</p>
                          <p className="text-[#9eb7a9] text-xs">Awaiting review</p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-[#e3b34122] text-[#e3b341]">Pending</span>
                      </div>
                    ))}
                  </div>
                ) : (
                <div
                  className="flex flex-col items-center justify-center gap-6 py-10 text-center cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => navigate("/my-sessions")}
                >
                  <div className="text-[#1dc964]">
                    <span
                      className="material-symbols-outlined inline-block"
                      style={{ fontSize: "64px" }}
                    >
                      rate_review
                    </span>
                  </div>
                  <div className="flex max-w-[480px] flex-col items-center gap-2">
                    <p className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                      All Caught Up!
                    </p>
                    <p className="text-[#9eb7a9] text-sm font-normal leading-normal max-w-[480px]">
                      You have no pending feedback requests.
                    </p>
                  </div>
                </div>
                )}
              </MentorWidget>

              {/* Recent Mentee Ratings (2 columns) */}
              <MentorWidget
                title="Recent Mentee Ratings"
                actionLabel={recentRatings.length > 0 ? "View All" : null}
                actionIcon="arrow_forward"
                onAction={() => navigate("/my-sessions")}
                actionClassName="text-[#1dc964] text-sm font-semibold hover:text-white transition-colors flex items-center gap-1"
                className="lg:col-span-2"
              >
                {recentRatings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recentRatings.map((session) => (
                      <div key={session._id} className="p-4 bg-[#0d1117] rounded-xl border border-[#30363d]">
                        <div className="flex items-center gap-3 mb-3">
                          <img 
                            src={session.menteeId?.profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.menteeId?.profile?.displayName}`} 
                            className="w-8 h-8 rounded-full"
                            alt="Mentee"
                          />
                          <p className="text-white font-semibold text-sm">{session.menteeId?.profile?.displayName || "Student"}</p>
                          <div className="flex ml-auto">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < (session.reviewId?.rating || 0) ? "text-yellow-400 text-xs" : "text-[#30363d] text-xs"}>
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        {session.reviewId?.comment && (
                          <p className="text-[#9eb7a9] text-xs italic line-clamp-2">"{session.reviewId.comment}"</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-6 py-10 text-center">
                    <div className="text-[#1dc964]">
                      <span
                        className="material-symbols-outlined inline-block"
                        style={{ fontSize: "64px" }}
                      >
                        star_outline
                      </span>
                    </div>
                    <div className="flex max-w-[480px] flex-col items-center gap-2">
                      <p className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                        No ratings yet
                      </p>
                      <p className="text-[#9eb7a9] text-sm font-normal leading-normal max-w-[480px]">
                        Your mentee ratings will appear here after completed
                        sessions.
                      </p>
                    </div>
                  </div>
                )}
              </MentorWidget>
            </div>
          </div>
        </main>
        <SharedFooter />
      </div>
    </div>
  );
}
