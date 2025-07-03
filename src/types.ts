import React from 'react';

export interface CompanyDetails {
    name: string;
    address: string;
    phone: string;
    email: string;
    taxId: string;
    logoUrl: string;
}

export interface Tradie {
  id: string;
  name: string;
  profession: string;
  rating: number;
  availability?: string;
  imageUrl: string;
  reviewsCount: number;
  companyDetails: CompanyDetails;
}

export enum BookingStatus {
  REQUESTED = 'Requested',
  CONFIRMED = 'Confirmed',
  CANCELLED = 'Cancelled',
  COMPLETED = 'Completed',
}

export interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  clientImageUrl: string;
  tradieId: string;
  tradieName: string;
  tradieProfession: string;
  tradieImageUrl: string;
  serviceDate: string;
  status: BookingStatus;
  details: string;
}

export interface Message {
  id: string;
  senderName: string;
  snippet: string;
  timestamp: string;
  avatarUrl: string;
}

export enum PaymentStatus {
  PAID = 'Paid',
  PENDING = 'Pending',
  OVERDUE = 'Overdue',
}

export interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
}

export interface Invoice {
  id: string;
  bookingId: string;
  tradie: { id: string; name: string; profession: string; companyDetails: CompanyDetails; };
  client: { 
    id: string; 
    name: string; 
    address: string; 
    email?: string;
    phone?: string;
  };
  jobAddress?: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  notes: string;
  subtotal: number;
  tax: number; // This is the calculated tax amount
  total: number;
  status: PaymentStatus;
  // New customizable fields
  taxRate: number;
  themeColor: string;
  footerNotes?: string;
  logoDataUrl?: string;
  signatureDataUrl?: string;
}


export interface Review {
  id: string;
  bookingId: string;
  reviewerId: string;
  reviewerName: string; 
  reviewerImageUrl: string;
  tradieId: string;
  tradieName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ClientReview {
  id: string;
  bookingId: string;
  reviewerId: string; // The tradie
  reviewerName: string;
  reviewerImageUrl: string;
  clientId: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface NavItem {
  name: string;
  href: string; // Will be used as the page identifier
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactNode;
}

export enum Role {
  CLIENT = 'Client',
  TRADIE = 'Tradie',
  ADMIN = 'Admin',
}

export interface User {
  id: string;
  password?: string;
  role: Role;
  name:string;
  imageUrl: string;
  joinedDate: string;
  suspended?: boolean;
}

export enum SupportTicketStatus {
    OPEN = 'Open',
    CLOSED = 'Closed'
}
export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userRole: Role;
  subject: string;
  description: string;
  status: SupportTicketStatus;
  date: string;
}

// For Gemini AI Assistant
export interface AIAssistantResponse {
    trade?: string;
    description?: string;
    location?: string;
}

// For Toast Notifications
export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

// For Notifications
export interface Notification {
    id: string;
    userId: string; // The user this notification is for
    message: string;
    link?: string; // Optional page to navigate to (e.g., 'Bookings')
    read: boolean;
    timestamp: string;
}

// For Bar Charts
export interface ChartData {
    labels: string[];
    data: number[];
}
