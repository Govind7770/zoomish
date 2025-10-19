// src/pages/Meetings.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Keyboard } from 'lucide-react';

export default function Meetings() {
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();

  // Function to handle joining a room
  const handleJoinRoom = () => {
    if (roomCode.trim()) {
      navigate(`/room/${roomCode.trim()}`);
    }
  };

  // Function to create a new room with a random ID
  const handleCreateNewMeeting = () => {
    // Generate a simple random ID for the new room
    const newRoomId = Math.random().toString(36).substring(2, 12);
    navigate(`/room/${newRoomId}`);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Header */}
      <header className="absolute top-0 left-0 w-full p-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-700">ConnectSphere</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">14:26 • Sun 19 Oct</span>
          {/* Add other header icons if needed */}
        </div>
      </header>
      
      {/* Sidebar */}
      <aside className="w-64 p-4 pt-20">
        <nav>
          <ul>
            <li>
              <a href="#" className="flex items-center p-3 text-lg font-medium text-white bg-blue-600 rounded-lg">
                Meetings
              </a>
            </li>
            {/* The 'Calls' option is removed as requested */}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center pt-20">
        <div className="text-center max-w-2xl">
          <h2 className="text-5xl font-light tracking-tight text-gray-800">Video calls and meetings for everyone</h2>
          <p className="mt-4 text-lg text-gray-600">
            Connect, collaborate and celebrate from anywhere with ConnectSphere
          </p>
        </div>
        
        <div className="mt-12 flex items-center gap-4 border-t border-b py-8 w-full justify-center">
          <button
            onClick={handleCreateNewMeeting}
            className="flex items-center gap-2 px-6 py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Video size={20} />
            New meeting
          </button>
          
          <div className="flex items-center">
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
              placeholder="Enter a code or link"
              className="px-4 py-3 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:outline-none w-64"
            />
            <button
              onClick={handleJoinRoom}
              disabled={!roomCode.trim()}
              className="px-6 py-3 font-semibold text-gray-600 border border-l-0 border-gray-300 rounded-r-md disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Join
            </button>
          </div>
        </div>
        
        {/* Illustration Section (Static) */}
        <div className="mt-16 text-center">
            {/* Using a placeholder SVG, you can replace this with your own image */}
            <svg width="250" height="200" viewBox="0 0 250 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="25" y="50" width="200" height="120" rx="10" fill="#E0E7FF"/>
                <circle cx="125" cy="110" r="40" fill="#C7D2FE"/>
                <path d="M115 110 L135 110 M125 100 L125 120" stroke="#4F46E5" stroke-width="4" stroke-linecap="round"/>
            </svg>
        </div>
      </main>
    </div>
  );
}