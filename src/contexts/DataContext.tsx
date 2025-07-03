import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as api from '../services/api';
import { Tradie, Booking, Message, Invoice, Review, SupportTicket, User, BookingStatus, SupportTicketStatus, CompanyDetails, InvoiceItem, ClientReview } from '../types';

export interface AppData {
  users: User[];
  tradies: Tradie[];
  bookings: Booking[];
  messages: Message[];
  invoices: Invoice[];
  reviews: Review[];
  clientReviews: ClientReview[];
  supportTickets: SupportTicket[];
}

export interface DataContextType {
  data: AppData;
  isLoading: boolean;
  error: Error | null;
  fetchData: () => void;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => Promise<void>;
  rescheduleBooking: (bookingId: string, newDate: string) => Promise<void>;
  updateTicketStatus: (ticketId: string, status: SupportTicketStatus) => Promise<void>;
  addReview: (reviewData: Omit<Review, 'id' | 'date' | 'reviewerImageUrl' | 'reviewerId' | 'reviewerName'>) => Promise<void>;
  addClientReview: (reviewData: Omit<ClientReview, 'id' | 'date'| 'reviewerImageUrl' | 'reviewerId' | 'reviewerName'>) => Promise<void>;
  createBooking: (tradieId: string, serviceDate: string, details: string) => Promise<void>;
  addUser: (userData: Omit<User, 'imageUrl' | 'joinedDate'>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  createSupportTicket: (ticketData: Omit<SupportTicket, 'id'|'date'|'status'|'userId'|'userName'|'userRole'>) => Promise<void>;
  updateCompanyDetails: (details: CompanyDetails) => Promise<void>;
  updateUserProfile: (updates: Partial<Pick<User, 'name' | 'imageUrl'>>) => Promise<User | null>;
  createInvoice: (bookingId: string, items: Omit<InvoiceItem, 'id'>[], notes: string) => Promise<Invoice|null>;
  markInvoiceAsPaid: (invoiceId: string) => Promise<void>;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [data, setData] = useState<AppData>({ users: [], tradies: [], bookings: [], messages: [], invoices: [], reviews: [], clientReviews: [], supportTickets: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!currentUser) return;
    setIsLoading(true);
    setError(null);
    try {
      const allData = await api.fetchAllDataForRole();
      setData(allData);
    } catch (err) {
      setError(err as Error);
      console.error("Failed to fetch data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchData();
    } else {
      setData({ users: [], tradies: [], bookings: [], messages: [], invoices: [], reviews: [], clientReviews: [], supportTickets: [] });
    }
  }, [currentUser, fetchData]);
  
  const updateBookingStatus = async (bookingId: string, status: BookingStatus) => {
    try {
        const updatedBooking = await api.updateBookingStatus(bookingId, status);
        setData(prevData => ({
            ...prevData,
            bookings: prevData.bookings.map(b => b.id === bookingId ? updatedBooking : b),
        }));
    } catch (err) {
        console.error("Failed to update booking status", err);
        throw err;
    }
  };
  
  const rescheduleBooking = async (bookingId: string, newDate: string) => {
    try {
        const updatedBooking = await api.rescheduleBooking(bookingId, newDate);
        setData(prevData => ({
            ...prevData,
            bookings: prevData.bookings.map(b => b.id === bookingId ? updatedBooking : b),
        }));
      } catch (err) {
          console.error("Failed to reschedule booking", err);
          throw err;
      }
  };

  const updateTicketStatus = async (ticketId: string, status: SupportTicketStatus) => {
    try {
        const updatedTicket = await api.updateTicketStatus(ticketId, status);
        setData(prevData => ({
            ...prevData,
            supportTickets: prevData.supportTickets.map(t => t.id === ticketId ? updatedTicket : t),
        }));
    } catch (err) {
        console.error("Failed to update ticket status", err);
        throw err;
    }
  };
  
  const addReview = async (reviewData: Omit<Review, 'id'|'date' | 'reviewerImageUrl' | 'reviewerId' | 'reviewerName'>) => {
    try {
        const newReview = await api.addReview(reviewData);
        setData(prevData => ({ ...prevData, reviews: [...prevData.reviews, newReview] }));
    } catch (err) {
        console.error("Failed to add review", err);
        throw err;
    }
  };
  
  const addClientReview = async (reviewData: Omit<ClientReview, 'id'|'date' | 'reviewerImageUrl' | 'reviewerId' | 'reviewerName'>) => {
    try {
        const newReview = await api.addClientReview(reviewData);
        setData(prevData => ({ ...prevData, clientReviews: [...prevData.clientReviews, newReview] }));
    } catch (err) {
        console.error("Failed to add client review", err);
        throw err;
    }
  };

  const createBooking = async (tradieId: string, serviceDate: string, details: string) => {
    try {
        const newBooking = await api.createBooking(tradieId, serviceDate, details);
        setData(prevData => ({ ...prevData, bookings: [newBooking, ...prevData.bookings] }));
    } catch(err) {
        console.error("Failed to create booking", err);
        throw err;
    }
  };
  
  const addUser = async (userData: Omit<User, 'imageUrl' | 'joinedDate'>) => {
    try {
        await api.createUser(userData);
        fetchData(); // Refetch all data to get the new user list
    } catch(err) {
        console.error("Failed to add user", err);
        throw err;
    }
  };
  
  const deleteUser = async (userId: string) => {
      try {
          await api.deleteUser(userId);
          setData(prevData => ({
              ...prevData,
              users: prevData.users.filter(u => u.id !== userId),
              tradies: prevData.tradies.filter(t => t.id !== userId),
          }));
      } catch (err) {
        console.error("Failed to delete user", err);
        throw err;
      }
  }

  const createSupportTicket = async (ticketData: Omit<SupportTicket, 'id'|'date'|'status'|'userId'|'userName'|'userRole'>) => {
    try {
        const newTicket = await api.createSupportTicket(ticketData);
        setData(prevData => ({ ...prevData, supportTickets: [newTicket, ...prevData.supportTickets] }));
    } catch(err) {
        console.error("Failed to create support ticket", err);
        throw err;
    }
  };

  const updateUserProfile = async (updates: Partial<Pick<User, 'name' | 'imageUrl'>>): Promise<User | null> => {
      if (!currentUser) throw new Error("No user logged in");
      try {
          const updatedUser = await api.updateUserProfile(updates);
          setData(prevData => ({
              ...prevData,
              users: prevData.users.map(u => u.id === currentUser.id ? updatedUser : u),
              tradies: prevData.tradies.map(t => t.id === currentUser.id ? {...t, ...updates} : t)
          }));
          return updatedUser;
      } catch (err) {
          console.error("Failed to update profile", err);
          throw err;
      }
  }

  const updateCompanyDetails = async (details: CompanyDetails) => {
      if (!currentUser || currentUser.role !== 'Tradie') throw new Error("User is not a tradie");
      try {
          const updatedTradie = await api.updateCompanyDetails(details);
          setData(prevData => ({
              ...prevData,
              tradies: prevData.tradies.map(t => t.id === currentUser.id ? updatedTradie : t)
          }));
      } catch (err) {
          console.error("Failed to update company details", err);
          throw err;
      }
  };

  const createInvoice = async (bookingId: string, items: Omit<InvoiceItem, 'id'>[], notes: string): Promise<Invoice|null> => {
      try {
          const newInvoice = await api.createInvoice(bookingId, items, notes);
          setData(prevData => ({ ...prevData, invoices: [newInvoice, ...prevData.invoices] }));
          return newInvoice;
      } catch (err) {
          console.error("Failed to create invoice", err);
          throw err;
      }
  };

  const markInvoiceAsPaid = async (invoiceId: string) => {
      try {
          const updatedInvoice = await api.markInvoiceAsPaid(invoiceId);
          setData(prevData => ({
              ...prevData,
              invoices: prevData.invoices.map(inv => inv.id === invoiceId ? updatedInvoice : inv),
          }));
      } catch (err) {
          console.error("Failed to mark invoice as paid", err);
          throw err;
      }
  };

  return (
    <DataContext.Provider value={{ data, isLoading, error, fetchData, updateBookingStatus, rescheduleBooking, updateTicketStatus, addReview, addClientReview, createBooking, addUser, deleteUser, createSupportTicket, updateCompanyDetails, updateUserProfile, createInvoice, markInvoiceAsPaid }}>
      {children}
    </DataContext.Provider>
  );
};