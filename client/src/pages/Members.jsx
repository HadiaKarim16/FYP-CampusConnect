import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectFilteredMembers, setMembers, searchMembers } from "../redux/slices/memberSlice";
import { mockMembers } from "../data/mockMembers";
import SectionHeader from "../components/common/SectionHeader";
import MemberCard from "../components/common/MemberCard";
import Button from "../components/common/Button";
import LoginPromptModal from "../components/modals/LoginPromptModal";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { sendConnectionRequest } from "../redux/slices/academicNetworkSlice";

export default function Members() {
  const dispatch = useDispatch();
  const members = useSelector(selectFilteredMembers);
  const [searchTerm, setSearchTerm] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { isAuthenticated } = useAuth();

  // FIX: Track loading state per member for connect button spinner
  const actionLoading = useSelector(
    (state) => state.academicNetwork?.actionLoading ?? {}
  );

  // Initialize mock members data in Redux
  useEffect(() => {
    if (members.length === 0) {
      dispatch(setMembers(mockMembers));
    }
  }, [dispatch, members.length]);

  // Live search — dispatches on every keystroke
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    dispatch(searchMembers(value));
  };

  const handleClear = () => {
    setSearchTerm("");
    dispatch(searchMembers(""));
  };

  // FIX: Connect button logic with auth check and loading indicators
  const handleConnect = (memberId) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    dispatch(sendConnectionRequest(memberId));
  };



  return (
    <div className="w-full bg-[#0d1117] text-[#e6edf3] min-h-screen py-10 px-4 sm:px-10 md:px-20 lg:px-40">
      <div className="max-w-[960px] mx-auto">
        {/* Header */}
        <div className="mb-10">
          <SectionHeader
            title="Community Members"
            subtitle="Meet the talented students and professionals in the CampusConnect community."
            align="left"
          />
        </div>

        {/* Search Bar — live filtering */}
        <div className="mb-8">
          <div className="relative max-w-lg">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e] text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search by name, role, or interest..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-[#0d1117] border border-[#30363d] text-[#e6edf3] text-sm placeholder-[#484f58] focus:outline-none focus:border-[#3fb950] transition-colors"
            />
            {searchTerm && (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b949e] hover:text-white"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="text-[#8b949e] text-xs mt-2">
              Showing {members.length} result{members.length !== 1 ? 's' : ''} for "{searchTerm}"
            </p>
          )}
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {members.map((member) => (
            <MemberCard
              key={member.id}
              name={member.name}
              role={member.role}
              interests={member.interests}
              joinDate={member.joinDate}
              followers={member.followers}
              onConnect={() => handleConnect(member.id)}
              connectLoading={actionLoading[member.id]}
              connectionStatus={member.connectionStatus || 'none'}
            />
          ))}
        </div>

        {members.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#8b949e] text-lg mb-4">No members found matching "{searchTerm}"</p>
            <Button variant="secondary" onClick={handleClear}>
              Clear Search
            </Button>
          </div>
        )}


      </div>

      {/* Login Prompt Modal */}
      <LoginPromptModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        message="Please log in to connect with members or create events."
      />
    </div>
  );
}
