import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

const ChatBox = ({ paperId, currentUser, onClose, isVisible }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [paperInfo, setPaperInfo] = useState(null);
  const [loadingPaperInfo, setLoadingPaperInfo] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load paper information
  const loadPaperInfo = useCallback(async () => {
    try {
      setLoadingPaperInfo(true);
      const response = await axios.get(`/api/papers/${paperId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data && response.data.paper) {
        setPaperInfo(response.data.paper);
      }
    } catch (error) {
      console.error("Error loading paper info:", error);
      // Don't show error for paper info, just use fallback
    } finally {
      setLoadingPaperInfo(false);
    }
  }, [paperId]);

  // Load messages when component mounts or paperId changes
  const loadMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/chat/papers/${paperId}/messages`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        setMessages(response.data.messages || []);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      setError("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  }, [paperId]);

  useEffect(() => {
    if (paperId && isVisible) {
      loadPaperInfo();
      loadMessages();
    }
  }, [paperId, isVisible, loadPaperInfo, loadMessages]);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 5) {
      setError("Maximum 5 files allowed per message");
      return;
    }

    // Validate file types and sizes
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const validFiles = files.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        setError(
          `File ${file.name} is not allowed. Only images and PDFs are supported.`
        );
        return false;
      }
      if (file.size > maxSize) {
        setError(`File ${file.name} is too large. Maximum size is 5MB.`);
        return false;
      }
      return true;
    });

    setAttachments(validFiles);
    setError(null);
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const sendMessage = async () => {
    if (!newMessage.trim() && attachments.length === 0) {
      setError("Please enter a message or attach a file");
      return;
    }

    try {
      setIsSending(true);
      setError(null);

      const formData = new FormData();
      formData.append("message", newMessage.trim());

      attachments.forEach((file) => {
        formData.append("attachments", file);
      });

      const response = await axios.post(
        `/api/chat/papers/${paperId}/messages`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setMessages((prev) => [...prev, response.data.chatMessage]);
        setNewMessage("");
        setAttachments([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setError(error.response?.data?.message || "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType === "image") {
      return (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      );
    } else if (fileType === "pdf") {
      return (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      );
    } else {
      return (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      );
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col border border-white border-opacity-30">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-opacity-90 backdrop-blur-sm text-white p-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg">
                {loadingPaperInfo
                  ? "Loading paper info..."
                  : paperInfo?.title || "Paper Discussion"}
              </h3>
              <p className="text-blue-100 text-sm">
                {loadingPaperInfo
                  ? "Please wait..."
                  : paperInfo?.ictacemId
                  ? `ICTACEM ID: ${paperInfo.ictacemId}`
                  : `Paper ID: ${paperId}`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-600 bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors text-white"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Messages Container */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 from-opacity-80 to-white to-opacity-80 backdrop-blur-sm"
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading messages...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Start the Conversation
              </h4>
              <p className="text-gray-500">
                Send a message to begin discussing this paper.
              </p>
            </div>
          ) : (
            messages.map((message, index) => {
              const isOwnMessage = message.sender._id === currentUser._id;
              const isAdmin = message.senderRole === "admin";

              return (
                <div
                  key={message._id || index}
                  className={`flex ${
                    isOwnMessage ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md ${
                      isOwnMessage ? "order-2" : "order-1"
                    }`}
                  >
                    {/* Sender Info */}
                    <div
                      className={`flex items-center space-x-2 mb-1 ${
                        isOwnMessage ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                          isAdmin ? "bg-red-500" : "bg-blue-500"
                        }`}
                      >
                        {message.sender.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs text-gray-500 font-medium">
                        {message.sender.username}
                        {isAdmin && (
                          <span className="ml-1 text-red-500">(Reviewer)</span>
                        )}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatTimestamp(message.timestamp)}
                      </span>
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`relative p-3 rounded-2xl shadow-sm ${
                        isOwnMessage
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                          : "bg-white border border-gray-200 text-gray-800"
                      }`}
                    >
                      {/* Message Text */}
                      {message.message && (
                        <p className="whitespace-pre-wrap break-words leading-relaxed">
                          {message.message}
                        </p>
                      )}

                      {/* Attachments */}
                      {message.attachments &&
                        message.attachments.length > 0 && (
                          <div
                            className={`space-y-3 ${
                              message.message ? "mt-4" : ""
                            }`}
                          >
                            {message.attachments.map((attachment, attIndex) => (
                              <div
                                key={attIndex}
                                className={`group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] ${
                                  isOwnMessage
                                    ? "bg-blue-400 bg-opacity-20 backdrop-blur-md border border-white border-opacity-30 shadow-lg"
                                    : "bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 hover:border-blue-300"
                                }`}
                              >
                                {/* Enhanced File Type Indicator with Glow */}
                                <div
                                  className={`absolute top-0 left-0 w-1.5 h-full ${
                                    attachment.fileType === "image"
                                      ? isOwnMessage
                                        ? "bg-gradient-to-b from-emerald-300 to-emerald-500 shadow-emerald-300/50 shadow-lg"
                                        : "bg-green-400"
                                      : attachment.fileType === "pdf"
                                      ? isOwnMessage
                                        ? "bg-gradient-to-b from-rose-300 to-rose-500 shadow-rose-300/50 shadow-lg"
                                        : "bg-red-400"
                                      : isOwnMessage
                                      ? "bg-gradient-to-b from-blue-300 to-blue-500 shadow-blue-300/50 shadow-lg"
                                      : "bg-blue-400"
                                  }`}
                                ></div>

                                <div
                                  className={`p-4 pl-6 ${
                                    isOwnMessage ? "relative z-10" : ""
                                  }`}
                                >
                                  <div className="flex items-start space-x-3">
                                    {/* Enhanced File Icon with Animation */}
                                    <div
                                      className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 ${
                                        attachment.fileType === "image"
                                          ? isOwnMessage
                                            ? "bg-gradient-to-br from-emerald-400/30 to-emerald-600/30 text-white backdrop-blur-sm border border-emerald-300/30"
                                            : "bg-green-100 text-green-600"
                                          : attachment.fileType === "pdf"
                                          ? isOwnMessage
                                            ? "bg-gradient-to-br from-rose-400/30 to-rose-600/30 text-white backdrop-blur-sm border border-rose-300/30"
                                            : "bg-red-100 text-red-600"
                                          : isOwnMessage
                                          ? "bg-gradient-to-br from-blue-400/30 to-blue-600/30 text-white backdrop-blur-sm border border-blue-300/30"
                                          : "bg-blue-100 text-blue-600"
                                      }`}
                                    >
                                      {attachment.fileType === "image" ? (
                                        <svg
                                          className="w-7 h-7"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                          />
                                        </svg>
                                      ) : attachment.fileType === "pdf" ? (
                                        <svg
                                          className="w-7 h-7"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                          />
                                        </svg>
                                      ) : (
                                        <svg
                                          className="w-7 h-7"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                          />
                                        </svg>
                                      )}
                                    </div>

                                    {/* Enhanced File Information */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                          <p
                                            className={`text-sm font-bold truncate leading-tight mb-1 ${
                                              isOwnMessage
                                                ? "text-white drop-shadow-sm"
                                                : "text-gray-800"
                                            }`}
                                          >
                                            {attachment.fileName}
                                          </p>
                                          <div className="flex items-center space-x-2 mt-1">
                                            <span
                                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                                                attachment.fileType === "image"
                                                  ? isOwnMessage
                                                    ? "bg-gradient-to-r from-emerald-400/40 to-emerald-500/40 text-white backdrop-blur-sm border border-emerald-300/30"
                                                    : "bg-green-100 text-green-700"
                                                  : attachment.fileType ===
                                                    "pdf"
                                                  ? isOwnMessage
                                                    ? "bg-gradient-to-r from-rose-400/40 to-rose-500/40 text-white backdrop-blur-sm border border-rose-300/30"
                                                    : "bg-red-100 text-red-700"
                                                  : isOwnMessage
                                                  ? "bg-gradient-to-r from-blue-400/40 to-blue-500/40 text-white backdrop-blur-sm border border-blue-300/30"
                                                  : "bg-blue-100 text-blue-700"
                                              }`}
                                            >
                                              {attachment.fileType === "image"
                                                ? "🖼️ Image"
                                                : attachment.fileType === "pdf"
                                                ? "📄 PDF"
                                                : "📎 Document"}
                                            </span>
                                            <span
                                              className={`text-xs font-medium ${
                                                isOwnMessage
                                                  ? "text-blue-100 drop-shadow-sm"
                                                  : "text-gray-500"
                                              }`}
                                            >
                                              {formatFileSize(
                                                attachment.fileSize
                                              )}
                                            </span>
                                          </div>
                                        </div>

                                        {/* Enhanced Action Buttons with Glass Effect */}
                                        <div className="flex items-center space-x-2 ml-3">
                                          <button
                                            onClick={() =>
                                              window.open(
                                                `/ictacem2025/api/chat/papers/${paperId}/messages/${message._id}/attachments/${attIndex}/view`,
                                                "_blank"
                                              )
                                            }
                                            className={`group/btn inline-flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300 ${
                                              isOwnMessage
                                                ? "bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border border-white/20 hover:border-white/40 shadow-lg hover:shadow-xl"
                                                : "bg-blue-100 hover:bg-blue-200 text-blue-600 hover:text-blue-700"
                                            } hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                              isOwnMessage
                                                ? "focus:ring-white/50"
                                                : "focus:ring-blue-500"
                                            } transform active:scale-95`}
                                            title="View file"
                                          >
                                            <svg
                                              className="w-4 h-4 transition-transform duration-200 group-hover/btn:scale-110"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2.5}
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                              />
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2.5}
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                              />
                                            </svg>
                                          </button>
                                          <button
                                            onClick={() =>
                                              window.open(
                                                `/ictacem2025/api/chat/papers/${paperId}/messages/${message._id}/attachments/${attIndex}/download`,
                                                "_blank"
                                              )
                                            }
                                            className={`group/btn inline-flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300 ${
                                              isOwnMessage
                                                ? "bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border border-white/20 hover:border-white/40 shadow-lg hover:shadow-xl"
                                                : "bg-green-100 hover:bg-green-200 text-green-600 hover:text-green-700"
                                            } hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                              isOwnMessage
                                                ? "focus:ring-white/50"
                                                : "focus:ring-green-500"
                                            } transform active:scale-95`}
                                            title="Download file"
                                          >
                                            <svg
                                              className="w-4 h-4 transition-transform duration-200 group-hover/btn:scale-110"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2.5}
                                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                              />
                                            </svg>
                                          </button>
                                        </div>
                                      </div>

                                      {/* Enhanced Preview for Images */}
                                      {attachment.fileType === "image" && (
                                        <div className="mt-4">
                                          <div
                                            className={`relative rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                                              isOwnMessage
                                                ? "bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg"
                                                : "bg-gray-100"
                                            }`}
                                          >
                                            <img
                                              src={`/ictacem2025/api/chat/papers/${paperId}/messages/${message._id}/attachments/${attIndex}/view`}
                                              alt={attachment.fileName}
                                              className="w-full h-40 object-cover cursor-pointer transition-all duration-300 hover:scale-105"
                                              onClick={() =>
                                                window.open(
                                                  `/ictacem2025/api/chat/papers/${paperId}/messages/${message._id}/attachments/${attIndex}/view`,
                                                  "_blank"
                                                )
                                              }
                                              loading="lazy"
                                            />
                                            {/* Enhanced Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                                              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 transform scale-75 hover:scale-100 transition-transform duration-200">
                                                <svg
                                                  className="w-6 h-6 text-white drop-shadow-lg"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  viewBox="0 0 24 24"
                                                >
                                                  <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                                                  />
                                                </svg>
                                              </div>
                                            </div>
                                            {/* Image Border Glow for Own Messages */}
                                            {isOwnMessage && (
                                              <div className="absolute inset-0 rounded-xl border-2 border-white/30 pointer-events-none"></div>
                                            )}
                                          </div>
                                        </div>
                                      )}

                                      {/* Enhanced PDF Preview for Own Messages */}
                                      {/* {attachment.fileType === "pdf" &&
                                        isOwnMessage && (
                                          <div className="mt-4">
                                            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-all duration-300">
                                              <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-rose-400/30 to-rose-600/30 rounded-lg flex items-center justify-center">
                                                  <svg
                                                    className="w-6 h-6 text-white"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                  >
                                                    <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      strokeWidth={2}
                                                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                                    />
                                                  </svg>
                                                </div>
                                                <div className="flex-1">
                                                  <p className="text-white font-medium text-sm drop-shadow-sm">
                                                    PDF Document
                                                  </p>
                                                  <p className="text-blue-100 text-xs">
                                                    Click to view or download
                                                  </p>
                                                </div>
                                                <div className="text-white/60">
                                                  <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                  >
                                                    <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      strokeWidth={2}
                                                      d="M9 5l7 7-7 7"
                                                    />
                                                  </svg>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        )} */}
                                    </div>
                                  </div>
                                </div>

                                {/* Glass Morphism Background for Own Messages */}
                                {isOwnMessage && (
                                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 pointer-events-none rounded-xl"></div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-4 mb-2 p-3 bg-red-50 bg-opacity-90 backdrop-blur-sm border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Attachment Preview */}
        {attachments.length > 0 && (
          <div className="mx-4 mb-2 p-3 bg-blue-50 bg-opacity-90 backdrop-blur-sm border border-blue-200 rounded-lg">
            <p className="text-blue-700 text-sm font-medium mb-2">
              Files to send:
            </p>
            <div className="space-y-2">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white p-2 rounded border"
                >
                  <div className="flex items-center space-x-2">
                    <div className="text-blue-600">
                      {getFileIcon(
                        file.type.startsWith("image/") ? "image" : "pdf"
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeAttachment(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 bg-white bg-opacity-90 backdrop-blur-sm rounded-b-2xl">
          <div className="flex items-end space-x-3">
            {/* File Attachment Button */}
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                title="Attach files"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
              </button>
            </div>

            {/* Message Input */}
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                rows="2"
                disabled={isSending}
              />
            </div>

            {/* Send Button */}
            <button
              onClick={sendMessage}
              disabled={
                isSending || (!newMessage.trim() && attachments.length === 0)
              }
              className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-full flex items-center justify-center transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
            >
              {isSending ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
