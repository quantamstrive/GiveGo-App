import React, { useState, useEffect } from 'react';
import { User, Event, Application, ApplicationStatus } from '../types';
import { mockService } from '../services/mockService';
import { generateEventDescription } from '../services/geminiService';
import PixelCard from './PixelCard';
import PixelButton from './PixelButton';

interface NGODashboardProps {
  user: User;
}

const NGODashboard: React.FC<NGODashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'CREATE' | 'MANAGE' | 'CERTIFICATES'>('MANAGE');
  const [events, setEvents] = useState<Event[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  
  // Create Event Form State
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    skillsGained: [],
    requiredQuestions: []
  });
  const [skillInput, setSkillInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const allEvents = await mockService.getEvents();
    // In real app, filter by NGO ID
    const myEvents = allEvents.filter(e => e.ngoId === 'ngo1' || e.ngoId === user.id); 
    setEvents(myEvents);
    
    const apps = await mockService.getApplicationsForNGO(user.id);
    setApplications(apps);
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const event: Event = {
      ...newEvent as Event,
      id: Date.now().toString(),
      ngoId: user.id,
      // Mock coordinates near Pune center (approx)
      coordinates: { 
        lat: 18.5204 + (Math.random() - 0.5) * 0.05, 
        lng: 73.8567 + (Math.random() - 0.5) * 0.05 
      },
      bannerUrl: `https://picsum.photos/800/400?random=${Date.now()}`,
      contactEmail: user.email
    };
    
    await mockService.createEvent(event);
    alert("MISSION UPLOADED TO NETWORK");
    setEvents([...events, event]);
    setActiveTab('MANAGE');
    setNewEvent({ title: '', description: '', location: '', skillsGained: [] });
  };

  const handleAIAutoFill = async () => {
    if (!newEvent.title) {
      alert("PLEASE ENTER A TITLE FIRST");
      return;
    }
    setIsGenerating(true);
    const desc = await generateEventDescription(newEvent.title, skillInput || "General Volunteering");
    setNewEvent(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handleAppStatus = async (appId: string, status: ApplicationStatus) => {
    await mockService.updateApplicationStatus(appId, status);
    setApplications(apps => apps.map(a => a.id === appId ? { ...a, status } : a));
  };

  return (
    <div className="space-y-6">
       {/* Pixel Art Banner for NGO (B&W) */}
       <div className="w-full h-32 md:h-48 overflow-hidden border-b-4 border-white relative bg-white/5 mb-6">
         <img 
            src="https://placehold.co/1200x300/000000/ffffff/png?text=NGO+COMMAND+CENTER&font=vt323" 
            alt="NGO Pixel Art" 
            className="w-full h-full object-cover opacity-80 pixelated grayscale" 
         />
         <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
         {/* Decorative grid overlay */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02),rgba(255,255,255,0.06))] bg-[length:100%_4px,6px_100%] pointer-events-none"></div>
         <h1 className="absolute bottom-4 left-4 text-4xl text-white text-glow">ORG_DASHBOARD</h1>
      </div>

       <div className="flex gap-4 border-b border-gray-800 pb-4">
        {['MANAGE', 'CREATE', 'CERTIFICATES'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 text-xl font-bold transition-colors ${
              activeTab === tab 
                ? 'text-white border-b-2 border-white text-glow' 
                : 'text-gray-500 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'CREATE' && (
        <PixelCard>
          <h2 className="text-2xl mb-6 text-white text-glow">INITIATE NEW MISSION</h2>
          <form onSubmit={handleCreateEvent} className="space-y-4 max-w-3xl">
            <div>
              <label className="block text-sm mb-1 text-gray-400">MISSION TITLE</label>
              <input required type="text" className="w-full bg-black border border-gray-500 p-2 text-white focus:border-white focus:outline-none"
                value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
            </div>

            <div className="relative">
              <label className="block text-sm mb-1 text-gray-400">DESCRIPTION</label>
              <div className="flex gap-2 mb-2">
                 <PixelButton type="button" onClick={handleAIAutoFill} isLoading={isGenerating} className="text-xs py-1" variant="secondary">
                    ✨ AI GENERATE
                 </PixelButton>
                 <span className="text-xs text-gray-500 self-center">Fill title first</span>
              </div>
              <textarea required className="w-full bg-black border border-gray-500 p-2 text-white focus:border-white focus:outline-none h-32"
                value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1 text-gray-400">DATE</label>
                <input required type="date" className="w-full bg-black border border-gray-500 p-2 text-white focus:border-white focus:outline-none"
                  value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-400">TIME</label>
                <input required type="time" className="w-full bg-black border border-gray-500 p-2 text-white focus:border-white focus:outline-none"
                  value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-400">LOCATION (PUNE)</label>
              <input required type="text" className="w-full bg-black border border-gray-500 p-2 text-white focus:border-white focus:outline-none"
                placeholder="e.g. Shivaji Nagar"
                value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-400">MINIMUM AGE</label>
              <input required type="number" className="w-full bg-black border border-gray-500 p-2 text-white focus:border-white focus:outline-none"
                value={newEvent.ageRequirement || ''} onChange={e => setNewEvent({...newEvent, ageRequirement: parseInt(e.target.value)})} />
            </div>

             <div>
              <label className="block text-sm mb-1 text-gray-400">SKILLS (Comma separated)</label>
              <input type="text" className="w-full bg-black border border-gray-500 p-2 text-white focus:border-white focus:outline-none"
                placeholder="Teamwork, Coding, etc."
                onChange={e => setNewEvent({...newEvent, skillsGained: e.target.value.split(',').map(s => s.trim())})} />
            </div>

            <PixelButton type="submit" className="w-full mt-6">LAUNCH EVENT</PixelButton>
          </form>
        </PixelCard>
      )}

      {activeTab === 'MANAGE' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-xl text-white">ACTIVE MISSIONS</h3>
            {events.map(ev => (
              <div key={ev.id} className="border border-gray-700 p-4 hover:bg-white/5 transition-colors">
                <h4 className="font-bold text-lg text-white">{ev.title}</h4>
                <p className="text-sm text-gray-500">{ev.date} @ {ev.location}</p>
                <div className="mt-2 text-xs text-gray-400">APPLICANTS: {applications.filter(a => a.eventId === ev.id).length}</div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-xl text-white">INCOMING TRANSMISSIONS (APPLICATIONS)</h3>
            {applications.filter(a => a.status === ApplicationStatus.PENDING).length === 0 && (
              <div className="text-gray-500">NO PENDING REQUESTS.</div>
            )}
            {applications.filter(a => a.status === ApplicationStatus.PENDING).map(app => (
              <PixelCard key={app.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                   <div className="font-bold text-lg text-white">{app.volunteerName}</div>
                   <div className="text-xs bg-white/20 px-2 py-1">LEVEL 1</div>
                </div>
                <div className="text-sm text-gray-400 mb-4">
                  Requesting access to: <span className="text-white">{events.find(e => e.id === app.eventId)?.title}</span>
                </div>
                
                {/* Mock showing answers */}
                <div className="text-xs bg-black p-2 mb-4 border border-gray-800 text-gray-300">
                  <div className="text-gray-500 mb-1">QUALIFICATIONS:</div>
                  "Ready to work properly."
                </div>

                <div className="flex gap-2">
                  <PixelButton onClick={() => handleAppStatus(app.id, ApplicationStatus.ACCEPTED)} className="flex-1 text-xs py-1">ACCEPT</PixelButton>
                  <PixelButton onClick={() => handleAppStatus(app.id, ApplicationStatus.REJECTED)} variant="secondary" className="flex-1 text-xs py-1">REJECT</PixelButton>
                </div>
              </PixelCard>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'CERTIFICATES' && (
        <PixelCard>
          <div className="text-center py-12">
             <h3 className="text-2xl mb-4 text-white">CERTIFICATE GENERATOR</h3>
             <p className="text-gray-500 mb-8">Select verified volunteers to auto-generate secure PDF credentials.</p>
             <div className="border-2 border-dashed border-gray-600 p-8 inline-block cursor-pointer hover:bg-white/10 hover:border-white transition-colors">
               GENERATE BATCH FOR COMPLETED EVENTS
             </div>
          </div>
        </PixelCard>
      )}
    </div>
  );
};

export default NGODashboard;