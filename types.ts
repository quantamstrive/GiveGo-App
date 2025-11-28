export enum UserRole {
  VOLUNTEER = 'VOLUNTEER',
  NGO = 'NGO',
  GUEST = 'GUEST'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  // Volunteer specific
  phone?: string;
  skills?: string[];
  totalHours?: number;
  // NGO specific
  organizationName?: string;
  registrationNumber?: string;
  verified?: boolean;
}

export interface Event {
  id: string;
  ngoId: string;
  title: string;
  description: string;
  location: string;
  coordinates: { lat: number; lng: number }; // Real coordinates
  date: string;
  time: string;
  ageRequirement: number;
  skillsGained: string[];
  bannerUrl: string;
  contactEmail: string;
  requiredQuestions?: string[];
}

export enum ApplicationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export interface Application {
  id: string;
  eventId: string;
  volunteerId: string;
  volunteerName: string;
  status: ApplicationStatus;
  answers: Record<string, string>;
  appliedAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
}

export interface Certificate {
  id: string;
  volunteerId: string;
  eventId: string;
  eventName: string;
  issueDate: string;
  hours: number;
}