'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function ChatPage() {
  const { id } = useParams();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [convMessages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [session_id, setSessionId] = useState<any>(null)

  //get the session Id
  useEffect(()=>{
    const sesId = window.__SESSION_ID__
    setSessionId(sesId)
  },[])

  // Send message logic
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/send_message?session_id=${session_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: selectedChat,
          sender_id: id,
          content: newMessage,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      const sentMessage = await response.json();
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // to get all the conversations of the user
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/conversations?user_id=${id}`);
        if (!response.ok) {
          console.log('Failed to fetch conversations');
          return;
        }
        const data = await response.json();
        setConversations(data);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };
    fetchConversations();
  }, [id]);

  // to get the messages of the selected conversation
  const getMessages = async (chatId: any) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/messages?conversation_id=${chatId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Fetch messages when a chat is selected
  useEffect(() => {
    if (selectedChat) {
      getMessages(selectedChat);
    }
  }, [selectedChat]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* 🗣️ Sidebar: Chats */}
      <div className="w-1/3 max-w-xs border-r border-purple-200 bg-white/80 backdrop-blur-sm shadow-lg overflow-y-auto">
        <div className="bg-purple-100 shadow-md text-black p-2">
          <h2 className="text-lg font-semibold px-2 ">Conversations</h2>
          <p className="text-black text-sm px-2">Select a chat to start messaging</p>
        </div>
        
        <div className="p-2">
          {conversations.length !== 0 ? (
            conversations.map((chat: any, index) => {
              return (
                <div key={chat.id} className="mb-2">
                  <li
                    className={`p-4 flex items-center space-x-4 cursor-pointer rounded-xl transition-all duration-200 ${
                      selectedChat === chat.id 
                        ? 'bg-gradient-to-r from-purple-100 to-indigo-100 shadow-md border-l-4 border-purple-500' 
                        : 'hover:bg-purple-50 hover:shadow-sm'
                    }`}
                    onClick={() => {
                      setSelectedChat(chat.id);
                    }}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full text-white flex items-center justify-center text-lg font-bold shadow-md">
                        {chat.roommate_profile?.first_name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        User {chat.roommate_profile_id}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">Click to view messages</p>
                    </div>
                  </li>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No conversations yet</p>
              <p className="text-sm text-gray-400 mt-1">Start a new conversation to see it here</p>
            </div>
          )}
        </div>
      </div>

      {/* 💬 Main: Conversation */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white/60 backdrop-blur-sm">
        {selectedChat ? (
          <>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {convMessages.length > 0 ? (
                convMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${Number(message.sender_id) === Number(id) ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl text-sm shadow-sm ${
                        Number(message.sender_id) === Number(id)
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
                          : 'bg-white border border-purple-100 text-gray-800'
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className={`text-xs mt-2 ${
                        Number(message.sender_id) === Number(id) ? 'text-purple-100' : 'text-gray-400'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h2m-4 0V6a2 2 0 012-2h6a2 2 0 012 2v2m-6 12h10a2 2 0 002-2v-8a2 2 0 00-2-2H12a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 font-medium">No messages yet</p>
                    <p className="text-sm text-gray-400 mt-1">Start the conversation!</p>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input Area */}
            <div className="border-t border-purple-200 bg-white/80 backdrop-blur-sm p-4 text-black">
              <div className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="w-full px-4 py-3 rounded-2xl border border-purple-200 bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder-gray-400"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') sendMessage();
                    }}
                  />
                </div>
                <button 
                  onClick={sendMessage}
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Welcome to your messages</h3>
              <p className="text-gray-500">Select a conversation from the sidebar to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}