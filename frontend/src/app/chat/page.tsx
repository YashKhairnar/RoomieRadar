'use client';
import { useState, useEffect, useRef } from 'react';
import { List } from 'lucide-react'; // chat list icon
import Link from 'next/link';

type Message = { id: number; sender: 'me' | 'them'; text: string; timestamp: string };
type Chat = { id: number; name: string; lastMessage: string };

const mockChats: Chat[] = [
  { id: 1, name: 'Alice', lastMessage: 'Hey, are you there?' },
  { id: 2, name: 'Bob', lastMessage: 'Let’s meet tomorrow.' },
  { id: 3, name: 'Charlie', lastMessage: 'Nice photo!' },
];

const mockMessages: Record<number, Message[]> = {
  1: [
    { id: 1, sender: 'them', text: 'Hey!', timestamp: '10:00 AM' },
    { id: 2, sender: 'me', text: 'Hi! How are you?', timestamp: '10:01 AM' },
  ],
  2: [
    { id: 3, sender: 'them', text: 'Tomorrow work for you?', timestamp: '9:15 AM' },
  ],
  3: [
    { id: 4, sender: 'them', text: 'Check this out!', timestamp: 'Yesterday' },
  ],
};

export default function ChatPage() {
  const [chats] = useState(mockChats);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedChatId !== null) {
      setMessages(mockMessages[selectedChatId] ?? []);
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [selectedChatId]);

  const sendMessage = () => {
    if (!newMessage.trim() || selectedChatId === null) return;
    const msg: Message = {
      id: Date.now(),
      sender: 'me',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, msg]);
    setNewMessage('');
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    // You’d also send to your backend here
  };

  return (
    <div className="flex h-screen">
      {/* 🗣️ Sidebar: Chats */}
      <div className="w-1/3 border-r bg-gray-100 text-black">
        <h2 className="text-xl font-semibold p-4 border-b">Chats</h2>
        <ul>
          {chats.map((chat) => (
            <li key={chat.id}>
              <button
                onClick={() => setSelectedChatId(chat.id)}
                className={`flex w-full justify-between items-center p-4 hover:bg-gray-200 transition ${
                  chat.id === selectedChatId ? 'bg-white font-medium' : ''
                }`}
              >
                <span>{chat.name}</span>
                <span className="text-sm text-gray-500 truncate max-w-xs">
                  {chat.lastMessage}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 💬 Main: Conversation */}
      <div className="flex flex-1 flex-col">
        {selectedChatId ? (
          <>
            <div className="flex-1 overflow-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs p-2 rounded-lg ${
                      msg.sender === 'me' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-900'
                  }`}>
                    <p>{msg.text}</p>
                    <span className="text-xs block text-right opacity-70">{msg.timestamp}</span>
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            <div className="p-4 border-t flex items-center space-x-2">
              <input
                type="text"
                className="flex-1 border bg-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Type a message…"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center">
            <List className="w-12 h-12 text-gray-400" />
            <p className="mt-4 text-gray-600">Select a chat to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}