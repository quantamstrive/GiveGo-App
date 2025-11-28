import React, { useState, useEffect, useRef } from 'react';
import { User, Event, Application, ApplicationStatus } from '../types';
import { mockService } from '../services/mockService';
import PixelCard from './PixelCard';
import PixelButton from './PixelButton';
import ChatInterface from './ChatInterface';

declare global {
  interface Window {
    L: any;
  }
}

interface VolunteerDashboardProps {
  user: User;
}

const VolunteerDashboard: React.FC<VolunteerDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'EVENTS' | 'PROFILE' | 'CHATS'>('EVENTS');
  const [events, setEvents] = useState<Event[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applicationAnswers, setApplicationAnswers] = useState<Record<string, string>>({});
  
  // Map State
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<any[]>([]);
  
  // For Chat
  const [activeChatEventId, setActiveChatEventId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  // Initialize Map when events are loaded and tab is EVENTS
  useEffect(() => {
    if (activeTab === 'EVENTS' && events.length > 0 && mapContainerRef.current) {
      // Small timeout to allow DOM to paint correctly before map initializes
      const timer = setTimeout(() => {
        initMap();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [activeTab, events]);

  const initMap = () => {
    if (!window.L || !mapContainerRef.current) return;

    // If map already exists, just invalidate size and update markers
    if (mapRef.current) {
      mapRef.current.invalidateSize();
      updateMarkers(mapRef.current);
      return;
    }

    // Initialize Map
    const map = window.L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView([18.5204, 73.8567], 13);
    
    // Add Zoom Control manually to top right to avoid overlap
    window.L.control.zoom({ position: 'topright' }).addTo(map);

    // CartoDB Dark Matter tile layer (B&W)
    window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    mapRef.current = map;
    updateMarkers(map);
  };

  const updateMarkers = (map: any) => {
    // Clear existing markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    const bounds = window.L.latLngBounds([]);

    events.forEach((ev) => {
      const customIcon = window.L.divIcon({
        className: 'custom-div-icon',
        // White square with pulsing animation
        html: `<div class="marker-pulse" style="background-color: #ffffff; width: 16px; height: 16px; border: 2px solid #000;"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      const marker = window.L.marker([ev.coordinates.lat, ev.coordinates.lng], { icon: customIcon }).addTo(map);
      marker.bindPopup(`
        <div class="font-bold text-sm text-white font-mono text-center">
          ${ev.title}<br/>
          <span class="text-xs text-gray-400">${ev.location}</span>
        </div>
      `);
      
      marker.on('click', () => {
        setSelectedEvent(ev);
        // Also scroll to event in list?
      });

      markersRef.current.push(marker);
      bounds.extend([ev.coordinates.lat, ev.coordinates.lng]);
    });

    // Fit map to show all markers
    if (events.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  const loadData = async () => {
    const [e, a] = await Promise.all([
      mockService.getEvents(),
      mockService.getVolunteerApplications(user.id)
    ]);
    setEvents(e);
    setApplications(a);
  };

  const getApplicationStatus = (eventId: string) => {
    return applications.find(a => a.eventId === eventId)?.status;
  };

  const handleApply = async () => {
    if (!selectedEvent) return;
    
    const newApp: Application = {
      id: Date.now().toString(),
      eventId: selectedEvent.id,
      volunteerId: user.id,
      volunteerName: user.name,
      status: ApplicationStatus.PENDING,
      answers: applicationAnswers,
      appliedAt: new Date().toISOString()
    };

    await mockService.applyToEvent(newApp);
    setApplications([...applications, newApp]);
    setShowApplyModal(false);
    setApplicationAnswers({});
    alert("TRANSMISSION SENT. STATUS: PENDING");
  };

  return (
    <div className="space-y-6">
      {/* Pixel Art Banner (B&W) */}
      <div className="w-full h-32 md:h-48 overflow-hidden border-b-4 border-white relative bg-white/5 mb-6 group">
         <img 
            src="https://placehold.co/1200x300/000000/ffffff/png?text=VOLUNTEER+NETWORK&font=vt323" 
            alt="Volunteer Pixel Art" 
            className="w-full h-full object-cover opacity-80 pixelated grayscale" 
         />
         <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
         <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02),rgba(255,255,255,0.06))] bg-[length:100%_4px,6px_100%] pointer-events-none"></div>
         <h1 className="absolute bottom-4 left-4 text-4xl text-white text-glow">DASHBOARD_V1 // PUNE_LINK</h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 border-b border-gray-800 pb-4 overflow-x-auto">
        {['EVENTS', 'PROFILE', 'CHATS'].map(tab => (
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

      {activeTab === 'EVENTS' && (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-320px)] min-h-[600px]">
          {/* List View - Left Half */}
          <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide border-2 border-white p-4 relative h-full">
            <h2 className="text-xl mb-4 text-glow bg-black sticky top-0 z-10 py-2 border-b border-gray-800 flex justify-between items-center">
              <span>AVAILABLE MISSIONS</span>
              <span className="text-xs text-gray-400">SCROLL FOR MORE</span>
            </h2>
            <div className="space-y-4 pb-4">
              {events.map(event => {
                const status = getApplicationStatus(event.id);
                const isSelected = selectedEvent?.id === event.id;
                return (
                  <div 
                    key={event.id} 
                    className={`border-2 p-4 transition-all cursor-pointer ${isSelected ? 'border-white bg-white/20' : 'border-gray-800 hover:border-white bg-black'}`}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold">{event.title}</h3>
                        {status && (
                           <span className={`text-xs px-2 py-1 border ${
                             status === 'ACCEPTED' ? 'border-white text-white' : 
                             status === 'REJECTED' ? 'border-gray-500 text-gray-500 line-through' : 
                             'border-gray-300 text-gray-300'
                           }`}>
                             {status}
                           </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">{event.location} // {event.date}</p>
                      <p className="text-sm line-clamp-2 text-gray-500">{event.description}</p>
                      <div className="flex gap-2 mt-2">
                         <PixelButton 
                           onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); setShowApplyModal(true); }}
                           disabled={!!status}
                           className="text-xs py-1 px-3 w-full text-center"
                         >
                           {status ? 'STATUS: APPLIED' : 'INITIATE APPLICATION'}
                         </PixelButton>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real Map View - Right Half */}
          <div className="flex-1 border-2 border-white relative h-full min-h-[400px]">
             <div ref={mapContainerRef} className="w-full h-full z-10 bg-gray-900" id="map"></div>
             {/* Map Overlay UI */}
             <div className="absolute bottom-2 left-2 z-[400] bg-black/90 p-2 border border-white text-[10px] text-white pointer-events-none">
               SECTOR: PUNE<br/>
               LAT: 18.52 | LNG: 73.85<br/>
               TARGETS: {events.length}
             </div>
          </div>
        </div>
      )}

      {activeTab === 'PROFILE' && (
        <PixelCard>
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-black flex items-center justify-center text-4xl border-2 border-white text-glow">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-3xl text-white">{user.name}</h2>
              <p className="text-gray-400">LEVEL 1 VOLUNTEER</p>
              <p className="text-sm mt-2 text-gray-500">ID: {user.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl mb-4 border-b border-gray-800 pb-2">STATS</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>TOTAL HOURS</span>
                  <span className="text-white text-glow">24.5 HRS</span>
                </div>
                <div className="flex justify-between">
                  <span>MISSIONS COMPLETED</span>
                  <span className="text-white text-glow">3</span>
                </div>
              </div>
            </div>

            <div>
               <h3 className="text-xl mb-4 border-b border-gray-800 pb-2">CERTIFICATES</h3>
               <div className="space-y-2">
                 <div className="flex justify-between items-center p-2 border border-gray-800 hover:border-white cursor-pointer group">
                   <span>River Cleanup 2024</span>
                   <span className="text-xs group-hover:text-white text-gray-500">[DOWNLOAD]</span>
                 </div>
                 <div className="flex justify-between items-center p-2 border border-gray-800 hover:border-white cursor-pointer group">
                   <span>Pune Food Drive</span>
                   <span className="text-xs group-hover:text-white text-gray-500">[DOWNLOAD]</span>
                 </div>
               </div>
            </div>
          </div>
        </PixelCard>
      )}

      {activeTab === 'CHATS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
          <div className="md:col-span-1 overflow-y-auto pr-2">
            <h3 className="text-xl mb-4 text-glow">ACTIVE CHANNELS</h3>
            {applications.filter(a => a.status === 'ACCEPTED').map(app => {
               const event = events.find(e => e.id === app.eventId);
               if(!event) return null;
               return (
                 <div 
                   key={app.id}
                   onClick={() => setActiveChatEventId(event.id)}
                   className={`p-4 border-2 mb-2 cursor-pointer transition-colors ${activeChatEventId === event.id ? 'border-white bg-white/20' : 'border-gray-800 hover:border-white'}`}
                 >
                   <div className="font-bold truncate">{event.title}</div>
                   <div className="text-xs text-gray-500">GROUP COMM</div>
                 </div>
               )
            })}
             {applications.filter(a => a.status === 'ACCEPTED').length === 0 && (
               <div className="text-gray-500 text-sm">NO ACTIVE MISSIONS. APPLY TO EVENTS TO UNLOCK COMMS.</div>
             )}
          </div>
          <div className="md:col-span-2 h-full">
            {activeChatEventId ? (
              <ChatInterface eventId={activeChatEventId} currentUser={user} />
            ) : (
              <div className="h-full border-2 border-gray-800 border-dashed flex items-center justify-center text-gray-600">
                SELECT A CHANNEL TO INITIALIZE
              </div>
            )}
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[1000] p-4 backdrop-blur-sm">
          <PixelCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-white">
            <div className="flex justify-between items-start mb-6 border-b border-gray-800 pb-2">
              <h2 className="text-2xl text-glow">{selectedEvent.title}</h2>
              <button onClick={() => setShowApplyModal(false)} className="text-white text-xl hover:text-gray-400">X</button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm bg-white/10 p-4 border border-gray-800">
                <div>DATE: {selectedEvent.date}</div>
                <div>TIME: {selectedEvent.time}</div>
                <div>LOC: {selectedEvent.location}</div>
                <div>AGE: {selectedEvent.ageRequirement}+</div>
              </div>
              
              <p className="text-gray-300 leading-relaxed">{selectedEvent.description}</p>
              
              {selectedEvent.requiredQuestions && selectedEvent.requiredQuestions.length > 0 && (
                <div className="border-t border-gray-800 pt-4">
                  <h3 className="text-lg mb-4 text-white">REQUIRED PROTOCOLS</h3>
                  {selectedEvent.requiredQuestions.map((q, idx) => (
                    <div key={idx} className="mb-4">
                      <label className="block text-sm mb-2 text-gray-400">{q}</label>
                      <textarea
                        className="w-full bg-black border border-gray-600 p-2 text-white focus:border-white focus:outline-none"
                        rows={2}
                        value={applicationAnswers[idx] || ''}
                        onChange={(e) => setApplicationAnswers({...applicationAnswers, [idx]: e.target.value})}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-4 mt-8">
                <PixelButton variant="secondary" onClick={() => setShowApplyModal(false)}>CANCEL</PixelButton>
                <PixelButton onClick={handleApply}>CONFIRM APPLICATION</PixelButton>
              </div>
            </div>
          </PixelCard>
        </div>
      )}
    </div>
  );
};

export default VolunteerDashboard;