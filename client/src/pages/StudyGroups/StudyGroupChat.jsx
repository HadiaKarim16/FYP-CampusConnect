import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStudyGroupById,
  selectSelectedGroup,
  selectStudyGroupLoading,
} from "../../redux/slices/studyGroupSlice";
import {
  fetchMessages,
  sendMessage as sendRealMessage,
  receiveMessage
} from "../../redux/slices/messagesSlice";
import PageHeader from "../../components/common/PageHeader";
import ChatMessage from "../../components/studyGroups/ChatMessage";
import GroupChatInput from "../../components/studyGroups/GroupChatInput";
import { useSocket } from "../../contexts/SocketContext";

export default function StudyGroupChat() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [message, setMessage] = useState("");

  const group = useSelector(selectSelectedGroup);
  const loading = useSelector(selectStudyGroupLoading);
  const sendingStatus = useSelector((state) => state.messages?.sendingStatus);
  const chatMessages = useSelector((state) => (group && group.chatId) ? (state.messages?.messages[group.chatId] || []) : []);

  const { on, off, joinChat, leaveChat } = useSocket();

  useEffect(() => {
    if (id) {
      dispatch(fetchStudyGroupById(id));
    }
  }, [dispatch, id]);

  // Handle fetching messages and socket joining once group is loaded
  useEffect(() => {
    if (group?.chatId) {
      dispatch(fetchMessages({ conversationId: group.chatId }));
      joinChat(group.chatId);

      const handleNewMessage = (data) => {
        if (!data) return;
        const chatId = data.chatId || data.chat?._id?.toString() || data.chat?.toString();
        if (chatId === group.chatId) {
          dispatch(receiveMessage({ chatId, message: data.message || data }));
        }
      };

      on('message:new', handleNewMessage);

      return () => {
        off('message:new', handleNewMessage);
        leaveChat(group.chatId);
      };
    }
  }, [group?.chatId, dispatch, joinChat, leaveChat, on, off]);

  const handleSend = () => {
    if (message.trim() && group?.chatId && sendingStatus !== 'sending') {
      dispatch(sendRealMessage({ conversationId: group.chatId, content: message.trim() }));
      setMessage("");
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-background text-text-primary flex items-center justify-center">
        <p className="text-text-secondary">Loading chat...</p>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="h-screen bg-background text-text-primary flex items-center justify-center">
        <p className="text-text-secondary">Study group not found.</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background text-text-primary flex flex-col">
      {/* Header */}
      <PageHeader
        title={group.name}
        subtitle={`${group.memberCount || 0} members`}
        icon="chat"
        backPath={`/study-groups/${id}`}
      />

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
          {chatMessages.length === 0 ? (
            <div className="text-center py-10 text-text-secondary">
              <span className="material-symbols-outlined text-5xl mb-4 block">chat</span>
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            chatMessages.map((msg) => {
              // Get current user ID to determine which messages are "mine"
              let currentUserId = null;
              try {
                const authState = JSON.parse(localStorage.getItem('authState') || '{}');
                currentUserId = authState?.user?._id || authState?.user?.id;
              } catch { /* ignore */ }

              const msgSenderId = msg.sender?._id?.toString() || msg.sender?.toString() || msg.senderId;
              const isOwn = msgSenderId === currentUserId;

              // Transform backend message to format expected by ChatMessage component
              const transformedMsg = {
                _id: msg._id,
                author: msg.sender?.profile?.displayName || "Unknown",
                avatar: (msg.sender?.profile?.avatar) || (msg.sender?.profile?.displayName || "U").substring(0, 2).toUpperCase(),
                message: msg.content,
                timestamp: new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                isOwn
              };

              return <ChatMessage key={msg._id || msg.id} message={transformedMsg} isOwn={isOwn} />;
            })
          )}
        </div>
      </div>

      {/* Message Input */}
      <GroupChatInput
        message={message}
        setMessage={setMessage}
        onSend={handleSend}
      />
    </div>
  );
}
