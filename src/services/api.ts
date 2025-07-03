
import { User, Role, Booking, Tradie, Invoice, Review, SupportTicket, Notification, CompanyDetails, InvoiceItem, PaymentStatus, ClientReview, BookingStatus, SupportTicketStatus } from '../types';
import { AppData, InvoiceCreationPayload } from '../contexts/DataContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

const getAuthToken = () => {
    try {
        const savedUser = localStorage.getItem('tradieStopUser');
        if (savedUser) {
            const user = JSON.parse(savedUser);
            return user.token;
        }
    } catch (e) {
        return null;
    }
    return null;
}

const apiRequest = async <T>(endpoint: string, method: string = 'GET', body: any = null): Promise<T> => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    const token = getAuthToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
        method,
        headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'An API error occurred');
        }
        
        if (response.status === 204) { // No content
            return null as T;
        }

        return await response.json();
    } catch (error) {
        console.error(`API Error on ${method} ${endpoint}:`, error);
        throw error;
    }
};

// --- AUTH ---
export const apiLogin = (userId: string, password: string): Promise<User & { token: string }> => {
    return apiRequest('/auth/login', 'POST', { userId, password });
};

export const createUser = (userData: Omit<User, 'imageUrl' | 'joinedDate'>): Promise<User> => {
     return apiRequest('/auth/signup', 'POST', userData);
};

// --- DATA FETCHING ---
export const fetchAllDataForRole = (): Promise<AppData> => {
    return apiRequest('/data/all');
};

export const fetchNotificationsForUser = (): Promise<Notification[]> => {
    return apiRequest('/data/notifications');
};

// --- DATA MUTATION ---
export const markNotificationsAsRead = (): Promise<void> => {
    return apiRequest('/data/notifications/read', 'PUT');
};

export const updateBookingStatus = (bookingId: string, status: BookingStatus): Promise<Booking> => {
    return apiRequest(`/bookings/${bookingId}/status`, 'PUT', { status });
};

export const rescheduleBooking = (bookingId: string, newDate: string): Promise<Booking> => {
    return apiRequest(`/bookings/${bookingId}/reschedule`, 'PUT', { newDate });
};

export const updateTicketStatus = (ticketId: string, status: SupportTicketStatus): Promise<SupportTicket> => {
    return apiRequest(`/support/${ticketId}/status`, 'PUT', { status });
};

export const addReview = (review: Omit<Review, 'id' | 'date' | 'reviewerImageUrl' | 'reviewerId' | 'reviewerName'>): Promise<Review> => {
    return apiRequest('/reviews', 'POST', review);
};

export const addClientReview = (review: Omit<ClientReview, 'id' | 'date' | 'reviewerImageUrl' | 'reviewerId' | 'reviewerName'>): Promise<ClientReview> => {
    return apiRequest('/reviews/client', 'POST', review);
};

export const createBooking = (tradieId: string, serviceDate: string, details: string): Promise<Booking> => {
    return apiRequest('/bookings', 'POST', { tradieId, serviceDate, details });
};

export const createSupportTicket = (ticketData: Omit<SupportTicket, 'id'|'date'|'status'|'userId'|'userName'|'userRole'>): Promise<SupportTicket> => {
    return apiRequest('/support', 'POST', ticketData);
};

export const updateUserProfile = (updates: Partial<Pick<User, 'name' | 'imageUrl'>>): Promise<User> => {
    return apiRequest('/users/profile', 'PUT', updates);
};

export const deleteUser = (userId: string): Promise<void> => {
    return apiRequest(`/users/${userId}`, 'DELETE');
};

export const updateCompanyDetails = (details: CompanyDetails): Promise<Tradie> => {
    return apiRequest('/tradies/company-details', 'PUT', details);
};

export const createInvoice = (invoiceData: InvoiceCreationPayload): Promise<Invoice> => {
    return apiRequest('/invoices', 'POST', invoiceData);
};
