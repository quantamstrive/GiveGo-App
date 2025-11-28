import { User, UserRole, Event, Application, ApplicationStatus, Certificate, ChatMessage } from '../types';

// Initial Mock Data
const MOCK_EVENTS: Event[] = [
  {
    id: 'e1',
    ngoId: 'ngo1',
    title: 'Mula-Mutha River Cleanup',
    description: 'Join us to clean the river banks near Koregaon Park. Gloves and masks provided.',
    location: 'Koregaon Park, Pune',
    coordinates: { lat: 18.5362, lng: 73.8940 }, // Koregaon Park
    date: '2024-11-15',
    time: '08:00 AM',
    ageRequirement: 18,
    skillsGained: ['Environmental Awareness', 'Teamwork'],
    bannerUrl: 'https://picsum.photos/800/400?random=1',
    contactEmail: 'cleanriver@pune.org',
    requiredQuestions: ['Do you have any allergies?']
  },
  {
    id: 'e2',
    ngoId: 'ngo1',
    title: 'Digital Skills for Youth',
    description: 'Teaching basic computer skills to students in Yerwada.',
    location: 'Yerwada, Pune',
    coordinates: { lat: 18.5529, lng: 73.8797 }, // Yerwada
    date: '2024-11-20',
    time: '04:00 PM',
    ageRequirement: 20,
    skillsGained: ['Teaching', 'Communication', 'IT Basics'],
    bannerUrl: 'https://picsum.photos/800/400?random=2',
    contactEmail: 'teach@pune.org'
  },
  {
    id: 'e3',
    ngoId: 'ngo2',
    title: 'Midnight Food Distribution',
    description: 'Distributing meals to homeless individuals near Pune Station.',
    location: 'Pune Railway Station',
    coordinates: { lat: 18.5289, lng: 73.8744 }, // Pune Station
    date: '2024-11-22',
    time: '10:00 PM',
    ageRequirement: 21,
    skillsGained: ['Logistics', 'Empathy'],
    bannerUrl: 'https://picsum.photos/800/400?random=3',
    contactEmail: 'feed@pune.org'
  }
];

// In-memory store (persists for session)
let events = [...MOCK_EVENTS];
let applications: Application[] = [];
let certificates: Certificate[] = [];
let chats: Record<string, ChatMessage[]> = {}; // eventId -> messages

export const mockService = {
  // Event Methods
  getEvents: () => Promise.resolve(events),
  
  createEvent: (event: Event) => {
    events.push(event);
    return Promise.resolve(event);
  },

  // Application Methods
  applyToEvent: (app: Application) => {
    applications.push(app);
    return Promise.resolve(app);
  },

  getApplicationsForNGO: (ngoId: string) => {
    // In a real app, we'd filter by events owned by this NGO. 
    // For mock, assuming current user owns all for simplicity or filtering by stored events.
    const myEventIds = events.filter(e => e.ngoId === ngoId).map(e => e.id);
    return Promise.resolve(applications.filter(a => myEventIds.includes(a.eventId)));
  },

  getVolunteerApplications: (volunteerId: string) => {
    return Promise.resolve(applications.filter(a => a.volunteerId === volunteerId));
  },

  updateApplicationStatus: (appId: string, status: ApplicationStatus) => {
    const app = applications.find(a => a.id === appId);
    if (app) {
      app.status = status;
      if (status === ApplicationStatus.ACCEPTED) {
        // Auto-join chat logic
        const welcomeMsg: ChatMessage = {
          id: Date.now().toString(),
          senderId: 'system',
          senderName: 'SYSTEM',
          text: `${app.volunteerName} has joined the operation.`,
          timestamp: Date.now(),
          isSystem: true
        };
        const currentChat = chats[app.eventId] || [];
        chats[app.eventId] = [...currentChat, welcomeMsg];
      }
    }
    return Promise.resolve(app);
  },

  // Chat Methods
  getChatMessages: (eventId: string) => {
    if (!chats[eventId]) {
      chats[eventId] = [
        { id: '1', senderId: 'system', senderName: 'SYSTEM', text: 'Channel initialized. Welcome team.', timestamp: Date.now() - 10000, isSystem: true }
      ];
    }
    return Promise.resolve(chats[eventId]);
  },

  sendMessage: (eventId: string, message: ChatMessage) => {
    if (!chats[eventId]) chats[eventId] = [];
    chats[eventId].push(message);
    return Promise.resolve(message);
  },

  // Certificate Methods
  issueCertificate: (cert: Certificate) => {
    certificates.push(cert);
    return Promise.resolve(cert);
  },

  getMyCertificates: (volunteerId: string) => {
    return Promise.resolve(certificates.filter(c => c.volunteerId === volunteerId));
  }
};