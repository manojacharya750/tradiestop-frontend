import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import { useToast } from '../hooks/useToast';
import { Booking, BookingStatus, Role } from '../types';
import { EllipsisVerticalIcon, CalendarDaysIcon, PencilSquareIcon, CheckCircleIcon } from '../components/icons';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import DropdownMenu from '../components/DropdownMenu';
import RescheduleModal from '../components/RescheduleModal';

const classNames = <T,>(...classes: T[]) => classes.filter(Boolean).join(' ');

interface PageProps {
  onNavigate: (page: string, params: object) => void;
}

const getStatusColor = (status: BookingStatus) => {
  switch (status) {
    case BookingStatus.CONFIRMED: return 'text-green-700 bg-green-100';
    case BookingStatus.REQUESTED: return 'text-yellow-700 bg-yellow-100';
    case BookingStatus.CANCELLED: return 'text-red-700 bg-red-100';
    case BookingStatus.COMPLETED: return 'text-blue-700 bg-blue-100';
    default: return 'text-slate-700 bg-slate-100';
  }
};

const BookingCard: React.FC<{ booking: Booking; userRole: Role; onNavigate: PageProps['onNavigate']; existingInvoiceId?: string; }> = ({ booking, userRole, onNavigate, existingInvoiceId }) => {
  const { updateBookingStatus } = useData();
  const { addToast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  
  const handleUpdate = async (status: BookingStatus) => {
    setIsUpdating(true);
    try {
      await updateBookingStatus(booking.id, status);
      addToast(`Booking has been ${status.toLowerCase()}.`, 'success');
    } catch (e) {
      addToast('Failed to update booking.', 'error');
    } finally {
      setIsUpdating(false);
    }
  }

  const dropdownItems = userRole === Role.ADMIN ? [
      { label: 'View Client Profile', onClick: () => addToast('Feature coming soon!', 'info')},
      { label: 'View Tradie Profile', onClick: () => addToast('Feature coming soon!', 'info')},
      { label: 'Cancel Booking (Admin)', isDestructive: true, onClick: () => handleUpdate(BookingStatus.CANCELLED) }
  ] : [];

  return (
    <>
    {isRescheduleModalOpen && <RescheduleModal booking={booking} onClose={() => setRescheduleModalOpen(false)} />}
    <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg"
    >
      <div className="p-5 flex flex-col sm:flex-row items-start gap-5">
        <img
          src={userRole === Role.CLIENT ? booking.tradieImageUrl : booking.clientImageUrl}
          alt={userRole === Role.CLIENT ? booking.tradieName : booking.clientName}
          className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
        />
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-slate-800">{userRole === Role.CLIENT ? booking.tradieName : booking.clientName}</h3>
              {userRole === Role.CLIENT && <p className="text-sm text-slate-500 -mt-1">{booking.tradieProfession}</p>}
              {userRole === Role.ADMIN && <p className="text-sm text-slate-500 -mt-1">{booking.tradieName} for {booking.clientName}</p>}
            </div>
            <div className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
              {booking.status}
            </div>
          </div>
          <div className="mt-3 border-t border-slate-200 pt-3">
            <p className="text-sm font-medium text-slate-700">Service Date:</p>
            <p className="text-sm text-slate-600">{booking.serviceDate}</p>
            <p className="text-sm font-medium text-slate-700 mt-2">Details:</p>
            <p className="text-sm text-slate-600">{booking.details}</p>
          </div>
        </div>
        {userRole === Role.ADMIN && (
            <DropdownMenu items={dropdownItems} triggerIcon={<EllipsisVerticalIcon className="h-5 w-5" />} />
        )}
      </div>
       <div className="bg-slate-50 px-5 py-3 flex flex-col sm:flex-row justify-end items-center gap-3">
          {userRole === Role.TRADIE && booking.status === BookingStatus.REQUESTED && (
             <>
              <button disabled={isUpdating} onClick={() => handleUpdate(BookingStatus.CANCELLED)} className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50">Decline</button>
              <button disabled={isUpdating} onClick={() => handleUpdate(BookingStatus.CONFIRMED)} className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50">Accept</button>
            </>
          )}
          {userRole === Role.TRADIE && booking.status === BookingStatus.CONFIRMED && (
              <button 
                disabled={isUpdating} 
                onClick={() => handleUpdate(BookingStatus.COMPLETED)} 
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center">
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                Mark as Completed
            </button>
          )}
          {userRole === Role.TRADIE && booking.status === BookingStatus.COMPLETED && (
              existingInvoiceId ? (
                <button onClick={() => onNavigate('Payments', {})} className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50">View Invoice</button>
              ) : (
                <button onClick={() => onNavigate('CreateInvoice', { bookingId: booking.id })} className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 flex items-center justify-center">
                    <PencilSquareIcon className="h-4 w-4 mr-2" />
                    Create Invoice
                </button>
              )
          )}
          {userRole === Role.CLIENT && (booking.status === BookingStatus.CONFIRMED || booking.status === BookingStatus.REQUESTED) && (
            <button onClick={() => setRescheduleModalOpen(true)} disabled={isUpdating} className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50">Reschedule</button>
          )}
          {userRole === Role.CLIENT && booking.status === BookingStatus.REQUESTED && (
              <button disabled={isUpdating} onClick={() => handleUpdate(BookingStatus.CANCELLED)} className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50">Cancel Booking</button>
          )}
           {userRole === Role.CLIENT && booking.status === BookingStatus.COMPLETED && (
             <button onClick={() => onNavigate('Payments', {})} className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50">View Invoice</button>
          )}
        </div>
    </motion.div>
    </>
  );
};

const BookingsPage: React.FC<PageProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const { data, isLoading } = useData();

  type FilterStatus = 'Upcoming' | 'Completed' | 'Cancelled' | 'All';
  const [filter, setFilter] = useState<FilterStatus>('Upcoming');

  const allBookings = useMemo(() => {
    if (!currentUser) return [];
    switch(currentUser.role) {
        case Role.CLIENT: return data.bookings.filter(b => b.clientId === currentUser.id);
        case Role.TRADIE: return data.bookings.filter(b => b.tradieId === currentUser.id);
        case Role.ADMIN: return data.bookings;
        default: return [];
    }
  }, [data.bookings, currentUser]);

  const invoiceMap = useMemo(() => {
    const map = new Map<string, string>();
    data.invoices.forEach(inv => map.set(inv.bookingId, inv.id));
    return map;
  }, [data.invoices]);

  const filteredBookings = useMemo(() => {
    const sorted = [...allBookings].sort((a, b) => new Date(b.serviceDate).getTime() - new Date(a.serviceDate).getTime());
    switch (filter) {
      case 'Upcoming':
        return sorted.filter(b => b.status === BookingStatus.CONFIRMED || b.status === BookingStatus.REQUESTED);
      case 'Completed':
        return sorted.filter(b => b.status === BookingStatus.COMPLETED);
      case 'Cancelled':
        return sorted.filter(b => b.status === BookingStatus.CANCELLED);
      case 'All':
        return sorted;
      default:
        return sorted;
    }
  }, [filter, allBookings]);

  const tabs: FilterStatus[] = currentUser?.role === Role.ADMIN ? ['All', 'Upcoming', 'Completed', 'Cancelled'] : ['Upcoming', 'Completed', 'Cancelled'];
  const pageTitle = currentUser?.role === Role.TRADIE ? "My Schedule" : "My Bookings";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">{pageTitle}</h1>
        <p className="text-slate-500 mt-1">Manage all your appointments here.</p>
      </div>
      <div>
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={classNames(
                  tab === filter
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300',
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors'
                )}
                aria-current={tab === filter ? 'page' : undefined}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>
      
      {isLoading && allBookings.length === 0 ? (
        <div className="flex justify-center pt-16"><Spinner size="lg"/></div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {filteredBookings.length > 0 ? (
              filteredBookings.map(booking => (
                <BookingCard 
                    key={booking.id} 
                    booking={booking} 
                    userRole={currentUser!.role} 
                    onNavigate={onNavigate}
                    existingInvoiceId={invoiceMap.get(booking.id)}
                />
              ))
            ) : (
              <EmptyState 
                icon={<CalendarDaysIcon className="w-10 h-10"/>}
                title="No Bookings Found"
                message={`There are no bookings matching the "${filter}" filter.`}
              />
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;