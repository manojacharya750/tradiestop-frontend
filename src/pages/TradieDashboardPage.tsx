import React, { useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import { useToast } from '../hooks/useToast';
import { Booking, BookingStatus, ChartData, Review } from '../types';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import BarChart from '../components/BarChart';
import ContactSupportModal from '../components/ContactSupportModal';
import { StarIcon as SolidStarIcon, EnvelopeIcon, ChevronDownIcon, CalendarDaysIcon, CheckCircleIcon, XMarkIcon, QuestionMarkCircleIcon, StarIcon } from '../components/icons';

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <SolidStarIcon key={i} className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-slate-300'}`} />
  ));
};

const BookingRequestItem: React.FC<{ booking: Booking }> = ({ booking }) => {
  const { updateBookingStatus } = useData();
  const { addToast } = useToast();
  const [isUpdating, setIsUpdating] = useState<BookingStatus | null>(null);

  const handleUpdate = async (status: BookingStatus) => {
    setIsUpdating(status);
    try {
      await updateBookingStatus(booking.id, status);
      addToast(`Booking ${status.toLowerCase()}.`, 'success');
    } catch (e) {
      addToast('Failed to update booking.', 'error');
    } finally {
        setIsUpdating(null);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md border border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-4">
            <img src={booking.clientImageUrl} alt={booking.clientName} className="h-12 w-12 rounded-full object-cover" />
            <div>
                <p className="font-semibold text-slate-800">{booking.details}</p>
                <p className="text-sm text-slate-500">From: {booking.clientName} - {booking.serviceDate}</p>
            </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button 
            onClick={() => handleUpdate(BookingStatus.CANCELLED)}
            disabled={!!isUpdating}
            className="flex items-center justify-center w-28 px-3 py-1 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50">
            {isUpdating === BookingStatus.CANCELLED ? <Spinner size="sm"/> : <><XMarkIcon className="h-4 w-4 mr-1"/> Decline</>}
          </button>
          <button 
            onClick={() => handleUpdate(BookingStatus.CONFIRMED)}
            disabled={!!isUpdating}
            className="flex items-center justify-center w-28 px-3 py-1 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50">
            {isUpdating === BookingStatus.CONFIRMED ? <Spinner size="sm"/> : <><CheckCircleIcon className="h-4 w-4 mr-1"/> Accept</>}
          </button>
        </div>
      </div>
    </div>
  );
};

const ReviewItem: React.FC<{ review: Review }> = ({ review }) => (
    <div className="py-3 border-b border-slate-200 last:border-b-0">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
            <img src={review.reviewerImageUrl} alt={review.reviewerName} className="h-10 w-10 rounded-full object-cover" />
            <div>
              <p className="font-semibold text-slate-800">{review.reviewerName}</p>
              <p className="text-sm text-slate-500 truncate max-w-xs">{review.comment}</p>
            </div>
        </div>
        <div className="flex-shrink-0">
            {renderStars(review.rating)}
        </div>
      </div>
    </div>
);


const TradieDashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { data, isLoading } = useData();
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  
  const tradieProfile = useMemo(() => data.tradies.find(t => t.id === currentUser?.id), [data.tradies, currentUser]);
  const tradieBookings = useMemo(() => data.bookings.filter(b => b.tradieId === currentUser?.id), [data.bookings, currentUser]);
  const tradieReviews = useMemo(() => data.reviews.filter(r => r.tradieId === currentUser?.id), [data.reviews, currentUser]);
  
  const newRequests = useMemo(() => tradieBookings.filter(b => b.status === BookingStatus.REQUESTED), [tradieBookings]);
  const upcomingJobs = useMemo(() => tradieBookings.filter(b => b.status === BookingStatus.CONFIRMED), [tradieBookings]);
  const jobsCompleted = useMemo(() => tradieBookings.filter(b => b.status === BookingStatus.COMPLETED).length, [tradieBookings]);

  const monthlyEarningsData: ChartData = useMemo(() => {
    // This is mock data for demonstration
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const earnings = [1200, 1800, 1500, 2100, 1750, 2500];
    return { labels, data: earnings };
  }, []);

  if (isLoading && !tradieProfile) {
    return <div className="flex justify-center items-center h-full"><Spinner size="lg" /></div>;
  }

  return (
    <div className="space-y-8">
       <ContactSupportModal isOpen={isSupportModalOpen} onClose={() => setIsSupportModalOpen(false)} />
       <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-800">Welcome, {currentUser?.name.split(' ')[0]}!</h1>
            <p className="text-slate-500 mt-1">Here’s what’s happening with your business today.</p>
        </div>
        <button onClick={() => setIsSupportModalOpen(true)} className="flex items-center justify-center px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50">
            <QuestionMarkCircleIcon className="mr-2 h-5 w-5 text-slate-500" />
            Contact Support
        </button>
      </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-lg shadow-sm">
                <h3 className="text-base font-medium text-slate-500">Your Rating</h3>
                <div className="mt-1 flex items-center gap-2">
                    {renderStars(tradieProfile?.rating || 0)}
                    <p className="text-2xl font-semibold text-slate-800">{tradieProfile?.rating.toFixed(1)}</p>
                </div>
            </div>
             <div className="bg-white p-5 rounded-lg shadow-sm">
                <h3 className="text-base font-medium text-slate-500">New Requests</h3>
                <p className="mt-1 text-2xl font-semibold text-slate-800">{newRequests.length}</p>
            </div>
             <div className="bg-white p-5 rounded-lg shadow-sm">
                <h3 className="text-base font-medium text-slate-500">Upcoming Jobs</h3>
                <p className="mt-1 text-2xl font-semibold text-slate-800">{upcomingJobs.length}</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm">
                <h3 className="text-base font-medium text-slate-500">Jobs Completed</h3>
                <p className="mt-1 text-2xl font-semibold text-slate-800">{jobsCompleted}</p>
            </div>
       </div>

        <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-slate-700 mb-4">Monthly Earnings</h2>
            <div style={{height: '300px'}}>
                <BarChart data={monthlyEarningsData} yAxisLabel="$" />
            </div>
        </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="bg-white p-6 rounded-lg shadow-sm lg:col-span-2">
          <h2 className="text-xl font-semibold text-slate-700 mb-4">New Booking Requests</h2>
          <div className="space-y-4">
            {newRequests.length > 0 ? (
                newRequests.map(booking => <BookingRequestItem key={booking.id} booking={booking} />)
            ) : (
                <EmptyState icon={<CalendarDaysIcon className="h-8 w-8"/>} title="No new requests" message="New booking requests from clients will appear here." />
            )}
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm lg:col-span-1">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-slate-700">Recent Reviews</h2>
                <StarIcon className="h-6 w-6 text-yellow-500" />
            </div>
            <div className="space-y-2">
             {tradieReviews.length > 0 ? (
                tradieReviews.slice(0, 5).map(review => <ReviewItem key={review.id} review={review} />)
            ) : (
                <EmptyState icon={<StarIcon className="h-8 w-8"/>} title="No reviews yet" message="Client reviews will appear here." />
            )}
            </div>
        </section>
      </div>
    </div>
  );
};

export default TradieDashboardPage;