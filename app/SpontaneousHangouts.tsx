'use client';
import React, { useEffect, useState } from 'react';
import { MapPin, Users, Plus } from 'lucide-react';
import icon from "./icon.svg"
import Image from 'next/image'
// TODO:
// - allow them to edit their hangout
// - let them know if their hangout was successfully created
// - allow them to delete their hangouts
// - allow them to see all the hangouts in the area
// - have a your events page that shows all the hangouts they have created
// - have a your invites page that shows all the hangouts they have been invited to
// - have a your notifications page that shows all the notifications they have received
// - have a your settings page that shows all the settings they have configured
// - have a your profile page that shows all the profile information they have provided
// - have a your friends page that shows all the friends they have added
// - have a your messages page that shows all the messages they have sent
// - have a your notifications page that shows all the notifications they have received
// - add a feature where they can search for hangouts (hopefully it will match to their location)
// - when they sign up, they will have to provide their name and location 
// (maybe we can request their location from chrome)
// - allow them to leave a hangout

type Hangout = {
  id: number;
  activity: string;
  hour: string;
  minute: string;
  attendees: number;
  maxAttendees: number;
  location: string;
  description: string;
};
export default function SpontaneousHangouts() {
  const [view, setView] = useState('browse'); // 'browse' or 'create'
  const [hangouts, setHangouts] = useState<Hangout[]>([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  
  console.log(API_URL)

  useEffect(()=> {
    fetch(`${API_URL}/hangouts`)
    .then(res => res.json())
    .then(data=> setHangouts(data))
  }, [API_URL])

 
  const [newHangout, setNewHangout] = useState({
    activity: '',
    location: '',
    hour: '0',
    minute: '0',
    maxAttendees: 4,
    description: ''
  });
  const minutes = ["0","15", "30", "45"];
  
  const handleCreateHangout = async() => {
    if (!newHangout.activity || !newHangout.location || 
      newHangout.minute === "0" && newHangout.hour === "0") {
      return;
    }
    const  response = await fetch(`${API_URL}/hangouts`, {
      method: 'POST',
      headers: {'Content-Type': "application/json"},
      body: JSON.stringify(newHangout)
    });

    response.json().then(createdHangout => {
      setHangouts([createdHangout, ...hangouts]);

    })
    
    setNewHangout({
      activity: '',
      location: '',
      hour: '0',
      minute: '0',
      maxAttendees: 4,
      description: ''
    });
    setView('browse');
  };
  const handleDelete = async (id: number) => {
    await fetch(`${API_URL}/hangouts/${id}`, {
      method: 'DELETE'
    });
    
    // Remove from local state
      setHangouts(hangouts.filter(h => h.id !== id));
    };
    const handleJoin = async (id: number) => {
      // Get current hangout
      const hangout = hangouts.find(h => h.id === id);
      if (!hangout) return; // hangout may be undefined
      if (hangout.attendees >= hangout.maxAttendees) {
        return; // Already full
      }
      // Update on backend
      await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                  attendees: hangout.attendees + 1
                })
  });
  

    setHangouts(hangouts.map(h => 
      h.id === id && h.attendees < h.maxAttendees
        ? { ...h, attendees: h.attendees + 1 }
        : h
    ));
    
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-black shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src={icon} alt="Heart logo" className='w-24 h-16'/>
              <h1 className="text-2xl font-bold text-gray-100">Spontaneous</h1>
            </div>
            <button
              onClick={() => setView(view === 'browse' ? 'create' : 'browse')}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              {view === 'browse' ? (
                <>
                  <Plus className="w-5 h-5" />
                  Create Hangout
                </>
              ) : (
                'Back to Browse'
              )}
            </button>
            
          </div>
          <p className="text-gray-100 mt-2">Find people to hang out with right now, no planning needed</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {view === 'browse' ? (
          // Browse View
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Happening Near You</h2>
              <div className="text-sm text-gray-600">Santa Clara, CA</div>
            </div>

            {hangouts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-2">No hangouts yet</p>
                <p className="text-gray-500 text-sm"> Be the first to create one!</p>
              </div>
            ) : (
              hangouts.map(hangout => (
                <div key={hangout.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        {hangout.activity}
                      </h3>
                      <p className="text-gray-600 text-sm">{hangout.description}</p>
                    </div>
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                      In {' '}
                      {/* {hangout.minute} */}
                        {hangout.hour !== "0" && hangout.minute !== "0"? (
                          <span>{hangout.hour} hour(s) and {hangout.minute} mins </span>
                        ): hangout.hour !== "0" ? (
                          <span>{hangout.hour} hour(s) </span>
                        ):
                          <span> {hangout.minute} mins</span>
                        }
                    </span>
                  </div>

                  <div className="flex gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {hangout.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {hangout.attendees}/{hangout.maxAttendees} people
                    </div>
                  </div>
                    
                  <button className=" my-2 rounded-sm text-blue-700  rounded-med text-sm font-medium cursor-pointer">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(hangout.id)}
                    className="mt-2 my-2 w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleJoin(hangout.id)}
                    disabled={hangout.attendees >= hangout.maxAttendees}
                    className={`w-full py-2 rounded-lg font-medium transition ${
                      hangout.attendees >= hangout.maxAttendees
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    {hangout.attendees >= hangout.maxAttendees ? 'Full' : "I'm In!"}
                  </button>
                </div>
              ))
            )}
          </div>
        ) : (
          // Create View
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Create a Hangout</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What do you want to do?
                </label>
                <input
                  type="text"
                  value={newHangout.activity}
                  onChange={(e) => setNewHangout({...newHangout, activity: e.target.value})}
                  placeholder="e.g. Coffee, Walk in the park, Study session, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Where?
                </label>
                <input
                  type="text"
                  value={newHangout.location}
                  onChange={(e) => setNewHangout({...newHangout, location: e.target.value})}
                  placeholder="e.g. Starbucks on Main St"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-400"
                  required
                />
              </div>

                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    When? (from now)
                  </label>
                  <div className='text-sm font-medium text-gray-700'>
                    hr:
                    <input
                      type="number"
                      min="0"
                     
                      max="4"
                      onChange={(e) => setNewHangout({...newHangout, hour: e.target.value})}
                      className="mx-1 px-1 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-400"
                      required
                      // onClick={(e)=> setNewHangout{...newHangout, hour}}
                    />
                    min:
                    <select 
                    className="mx-1 px-1 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-400"
                    onChange= {(e) => setNewHangout({...newHangout, minute: e.target.value})}
                    >
                      {minutes.map(minute => (
                        <option key={minute}>{minute}</option>
                      ))
                    }
                    </select>
                </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max people (including you)
                </label>
                <input
                  type="number"
                  min="2"
                  max="10"
                  value={newHangout.maxAttendees}
                  onChange={(e) => setNewHangout({...newHangout, maxAttendees: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <textarea
                  value={newHangout.description}
                  onChange={(e) => setNewHangout({...newHangout, description: e.target.value})}
                  placeholder="Tell people a bit more..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-400"
                />
              </div>

              <button
                onClick={handleCreateHangout}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition cursor-pointer"
              >
                Create Hangout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

