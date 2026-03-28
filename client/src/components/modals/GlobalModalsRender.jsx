import React, { useState } from 'react';
import { useModal, MODAL_TYPES } from '../../contexts/ModalContext';
import BaseModal from '../shared/BaseModal';
import { useDispatch } from 'react-redux';
import MentorAvailabilityModal from './MentorAvailabilityModal';
import EditProfileModal from './EditProfileModal';
import CreateSocietyModal from './CreateSocietyModal';

export default function GlobalModalsRender() {
  const { modal, closeModal } = useModal();
  const dispatch = useDispatch();

  if (!modal.type) return null;

  switch (modal.type) {
    case MODAL_TYPES.REGISTER_EVENT:
      return (
        <BaseModal size="md">
          <h2 className="text-xl font-bold text-white mb-4">Register for Event</h2>
          <p className="text-[#c9d1d9] mb-6">Are you sure you want to register for this event?</p>
          <div className="flex justify-end gap-3">
            <button onClick={closeModal} className="px-4 py-2 border border-[#30363d] text-[#c9d1d9] rounded-lg hover:bg-[#30363d] transition-colors font-medium">Cancel</button>
            <button onClick={() => { modal.props.onConfirm(); closeModal(); }} className="px-4 py-2 bg-[#238636] text-white rounded-lg hover:bg-[#2ea043] transition-colors font-bold">Confirm Registration</button>
          </div>
        </BaseModal>
      );

    case MODAL_TYPES.CANCEL_EVENT_REGISTRATION:
      return (
        <BaseModal size="md">
          <h2 className="text-xl font-bold text-white mb-4">Cancel Registration</h2>
          <p className="text-[#c9d1d9] mb-6">Are you sure you want to cancel your registration? You might lose your spot.</p>
          <div className="flex justify-end gap-3">
            <button onClick={closeModal} className="px-4 py-2 border border-[#30363d] text-[#c9d1d9] rounded-lg hover:bg-[#30363d] transition-colors font-medium">Keep Spot</button>
            <button onClick={() => { modal.props.onConfirm(); closeModal(); }} className="px-4 py-2 bg-[#f85149] text-white rounded-lg hover:bg-[#ff7b72] transition-colors font-bold">Cancel Registration</button>
          </div>
        </BaseModal>
      );

    case MODAL_TYPES.JOIN_SOCIETY:
      return (
        <BaseModal size="md">
          <h2 className="text-xl font-bold text-white mb-4">Join Society</h2>
          <p className="text-[#c9d1d9] mb-6">Would you like to become a member of <strong>{modal.props.societyName}</strong>?</p>
          <div className="flex justify-end gap-3">
            <button onClick={closeModal} className="px-4 py-2 border border-[#30363d] text-[#c9d1d9] rounded-lg hover:bg-[#30363d] transition-colors font-medium">Cancel</button>
            <button onClick={() => { modal.props.onConfirm(); closeModal(); }} className="px-4 py-2 bg-[#238636] text-white rounded-lg hover:bg-[#2ea043] transition-colors font-bold">Join Society</button>
          </div>
        </BaseModal>
      );

    case MODAL_TYPES.LEAVE_SOCIETY:
      return (
        <BaseModal size="md">
          <h2 className="text-xl font-bold text-white mb-4">Leave Society</h2>
          <p className="text-[#c9d1d9] mb-6">Are you sure you want to leave <strong>{modal.props.societyName}</strong>?</p>
          <div className="flex justify-end gap-3">
            <button onClick={closeModal} className="px-4 py-2 border border-[#30363d] text-[#c9d1d9] rounded-lg hover:bg-[#30363d] transition-colors font-medium">Cancel</button>
            <button onClick={() => { modal.props.onConfirm(); closeModal(); }} className="px-4 py-2 bg-[#f85149] text-white rounded-lg hover:bg-[#ff7b72] transition-colors font-bold">Leave Society</button>
          </div>
        </BaseModal>
      );

    case MODAL_TYPES.CANCEL_SESSION:
      return (
        <BaseModal size="md">
          <h2 className="text-xl font-bold text-white mb-4">Cancel Session</h2>
          <p className="text-[#c9d1d9] mb-6">Are you sure you want to cancel your mentoring session with <strong>{modal.props.mentorName}</strong>?</p>
          <div className="flex justify-end gap-3">
            <button onClick={closeModal} className="px-4 py-2 border border-[#30363d] text-[#c9d1d9] rounded-lg hover:bg-[#30363d] transition-colors font-medium">Go Back</button>
            <button onClick={() => { modal.props.onConfirm(); closeModal(); }} className="px-4 py-2 bg-[#f85149] text-white rounded-lg hover:bg-[#ff7b72] transition-colors font-bold">Cancel Session</button>
          </div>
        </BaseModal>
      );

    case MODAL_TYPES.SESSION_FEEDBACK:
      return <SessionFeedbackModal modalProps={modal.props} closeModal={closeModal} dispatch={dispatch} />;

    case MODAL_TYPES.BOOK_MENTOR:
      return <BookMentorModal modalProps={modal.props} closeModal={closeModal} dispatch={dispatch} />;

    case MODAL_TYPES.SET_AVAILABILITY:
      return <MentorAvailabilityModal closeModal={closeModal} />;

    case MODAL_TYPES.EDIT_PROFILE:
      return <EditProfileModal closeModal={closeModal} />;

    case MODAL_TYPES.CREATE_SOCIETY:
      return <CreateSocietyModal closeModal={closeModal} />;

    default:
      return null;
  }
}

function SessionFeedbackModal({ modalProps, closeModal, dispatch }) {
  const [feedback, setFeedback] = useState("");
  // using dynamic import fallback just in case, but assume submitSessionFeedback is known in context where used
  // to avoid circular dep, we can just dispatch an action type string if needed, but best practice is import:
  const handleSubmit = async () => {
    if (!feedback.trim()) return;
    try {
      // Dynamic import to prevent circular loops if they occur, otherwise direct import works
      const { submitSessionFeedback } = await import('../../redux/slices/sessionsSlice');
      dispatch(submitSessionFeedback({ sessionId: modalProps.sessionId, feedbackText: feedback }));
      closeModal();
    } catch (e) { console.error(e); }
  };

  return (
    <BaseModal size="md">
      <h2 className="text-xl font-bold text-white mb-4">Session Feedback</h2>
      <p className="text-[#8b949e] text-sm mb-4">How was your session with {modalProps.mentorName}?</p>
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        className="w-full bg-[#0d1117] border border-[#30363d] focus:border-[#238636] focus:ring-1 focus:ring-[#238636] rounded-lg p-3 text-white h-32 mb-6 outline-none resize-none"
        placeholder="Share your thoughts..."
      />
      <div className="flex justify-end gap-3">
        <button onClick={closeModal} className="px-4 py-2 border border-[#30363d] text-[#c9d1d9] rounded-lg hover:bg-[#30363d] transition-colors font-medium">Cancel</button>
        <button onClick={handleSubmit} disabled={!feedback.trim()} className="px-4 py-2 bg-[#238636] text-white rounded-lg hover:bg-[#2ea043] transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed">Submit Feedback</button>
      </div>
    </BaseModal>
  );
}

function BookMentorModal({ modalProps, closeModal, dispatch }) {
  const [topic, setTopic] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  const mentor = modalProps.mentor;
  // Fallback if slots missing
  const slots = mentor.availableSlots || ["10:00 AM", "2:00 PM", "4:00 PM"];
  
  const handleConfirm = async () => {
    if (!topic.trim() || !selectedSlot) return;
    try {
      const { bookMentorSession } = await import('../../redux/slices/sessionsSlice');
      dispatch(bookMentorSession({
        mentorId: mentor._id,
        mentorName: mentor.name,
        mentorTitle: mentor.title,
        mentorCompany: mentor.company,
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days from now mock
        time: selectedSlot,
        duration: "1",
        topic: topic
      }));
      closeModal();
    } catch (e) { console.error(e); }
  };

  return (
    <BaseModal size="md">
      <h2 className="text-xl font-bold text-white mb-1">Book a Session</h2>
      <p className="text-[#8b949e] mb-6">with <strong className="text-white">{mentor.name}</strong> • {mentor.title}</p>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-[#c9d1d9] mb-2">Topic (Required)</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full bg-[#0d1117] border border-[#30363d] focus:border-[#238636] focus:ring-1 focus:ring-[#238636] rounded-lg p-2.5 text-white outline-none"
            placeholder="What do you want to discuss?"
          />
        </div>

        <div>
           <label className="block text-sm font-medium text-[#c9d1d9] mb-2">Available Slots (Next 7 Days)</label>
           <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {slots.map((slot, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedSlot(slot)}
                  className={`px-3 py-2 text-sm font-medium rounded border transition-colors ${
                    selectedSlot === slot 
                      ? "border-[#238636] bg-[#238636]/20 text-white" 
                      : "border-[#30363d] bg-[#0d1117] text-[#8b949e] hover:border-[#8b949e]"
                  }`}
                >
                  {slot}
                </button>
              ))}
           </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-[#30363d]">
        <button onClick={closeModal} className="px-4 py-2 border border-[#30363d] text-[#c9d1d9] rounded-lg hover:bg-[#30363d] transition-colors font-medium">Cancel</button>
        <button 
          onClick={handleConfirm} 
          disabled={!topic.trim() || !selectedSlot} 
          className="px-4 py-2 bg-[#238636] text-white rounded-lg hover:bg-[#2ea043] transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm Booking
        </button>
      </div>
    </BaseModal>
  );
}
