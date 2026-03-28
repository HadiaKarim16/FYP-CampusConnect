import { useNavigate } from "react-router-dom";

/**
 * LoginPromptModal — Reusable modal shown when unauthenticated users
 * try to perform protected actions (Register, Join Society, etc.)
 *
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {function} onClose - Close handler
 * @param {string} message - Custom message (default provided)
 */
export default function LoginPromptModal({
  isOpen,
  onClose,
  message = "You need to be logged in to perform this action.",
}) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Blurred backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal content */}
      <div
        className="relative z-10 w-full max-w-md mx-4 bg-[#161b22] border border-[#30363d] rounded-xl p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8b949e] hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#238636]/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-[#238636] text-3xl">
              lock
            </span>
          </div>
        </div>

        {/* Text */}
        <h3 className="text-white text-xl font-bold text-center mb-2">
          Login Required
        </h3>
        <p className="text-[#8b949e] text-sm text-center mb-8">{message}</p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/login")}
            className="w-full h-11 rounded-lg bg-[#238636] text-white font-bold text-sm hover:bg-[#2ea043] transition-colors"
          >
            Log In
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="w-full h-11 rounded-lg border border-[#30363d] bg-transparent text-white font-bold text-sm hover:bg-[#21262d] transition-colors"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
