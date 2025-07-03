import React, { useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import { Tradie, Booking, Message, Review, BookingStatus, PaymentStatus, ChartData } from '../types';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import BarChart from '../components/BarChart';
import ContactSupportModal from '../components/ContactSupportModal';
import BookingModal from '../components/BookingModal';
import { MagnifyingGlassIcon, ChevronDownIcon, StarIcon as SolidStarIcon, ChevronRightIcon, SparklesIcon, BuildingStorefrontIcon, CalendarDaysIcon, ChatBubbleLeftEllipsisIcon, QuestionMarkCircleIcon, CreditCardIcon } from '../components/icons';

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <SolidStarIcon
      key={i}
      className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-slate-300'}`}
    />
  ));
};

const TradieCard: React.FC<{ tradie: Tradie; onBook: () => void; }> = ({ tradie, onBook }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center md:flex-row md:text-left md:items-start space-y-4 md:space-y-0 md:space-x-6">
    <img className="w-24 h-24 rounded-full object-cover flex-shrink-0" src={tradie.imageUrl} alt={tradie.name} />
    <div className="flex-grow">
      <h3 className="text-xl font-semibold text-slate-800">{tradie.name}</h3>
      <p className="text-slate-600">{tradie.profession}</p>
      <div className="flex items-center justify-center md:justify-start mt-2">
        {renderStars(tradie.rating)}
        <span className="ml-2 text-slate-600 font-medium">{tradie.rating.toFixed(1)}</span>
      </div>
    </div>
    <button
      onClick={onBook}
      className="mt-4 md:mt-0 md:self-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-150 ease-in-out whitespace-nowrap w-32 flex justify-center items-center"
    >
      {'Book Now'}
    </button>
  </div>
);

const BookingListItem: React.FC<{ booking: Booking }> = ({ booking }) => {
  const statusColors: { [key in BookingStatus]: string } = {
    [BookingStatus.CONFIRMED]: 'text-green-600 bg-green-100',
    [BookingStatus.REQUESTED]: 'text-yellow-600 bg-yellow-100',
    [BookingStatus.CANCELLED]: 'text-red-600 bg-red-100',
    [BookingStatus.COMPLETED]: 'text-blue-600 bg-blue-100',
  };
  return (
    <div className="py-3 border-b border-slate-200 last:border-b-0">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold text-slate-800">{booking.tradieName}</p>
          <p className="text-sm text-slate-500">{booking.details}</p>
        </div>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[booking.status]}`}>
          {booking.status}
        </span>
      </div>
    </div>
  );
};

const ClientDashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { data, isLoading } = useData();
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingModalTradie, setBookingModalTradie] = useState<Tradie | null>(null);

  const clientBookings = useMemo(() => data.bookings.filter(b => b.clientId === currentUser?.id), [data.bookings, currentUser]);
  const tradieList = useMemo(() => data.tradies.filter(t => t.id !== currentUser?.id), [data.tradies, currentUser]);

  const monthlySpendingData: ChartData = useMemo(() => {
    // This is mock data for demonstration as we don't have real timestamps
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const spending = [150, 220, 300, 180, 450, 209];
    return { labels, data: spending };
  }, []);

  const filteredTradies = useMemo(() => {
    if (!searchQuery.trim()) return tradieList.slice(0, 3);
    const lowercasedQuery = searchQuery.toLowerCase();
    return tradieList.filter(tradie => 
        tradie.name.toLowerCase().includes(lowercasedQuery) ||
        tradie.profession.toLowerCase().includes(lowercasedQuery)
    );
  }, [tradieList, searchQuery]);

  if (isLoading && !data.tradies.length) {
    return <div className="flex justify-center items-center h-full"><Spinner size="lg" /></div>;
  }
  
  return (
    <div className="space-y-8">
      {bookingModalTradie && <BookingModal tradie={bookingModalTradie} onClose={() => setBookingModalTradie(null)} />}
      <ContactSupportModal isOpen={isSupportModalOpen} onClose={() => setIsSupportModalOpen(false)} />
      
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-800">Welcome, {currentUser?.name.split(' ')[0]}!</h1>
            <p className="text-slate-500 mt-1">Here's a quick overview of your account.</p>
        </div>
        <button onClick={() => setIsSupportModalOpen(true)} className="flex items-center justify-center px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50">
            <QuestionMarkCircleIcon className="mr-2 h-5 w-5 text-slate-500" />
            Contact Support
        </button>
      </div>

      <section className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-slate-700">Find a Tradie</h2>
        <div className="flex flex-col md:flex-row flex-wrap gap-3 my-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MagnifyingGlassIcon className="h-5 w-5 text-slate-400" /></div>
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by trade or name, e.g., 'Electrician'" className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
          </div>
          <button className="flex items-center justify-center px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50">
            Availability <ChevronDownIcon className="ml-2 h-4 w-4" />
          </button>
        </div>
        {filteredTradies.length > 0 ? (
            <div className="space-y-4">{filteredTradies.map(tradie => (<TradieCard key={tradie.id} tradie={tradie} onBook={() => setBookingModalTradie(tradie)} />))}</div>
          ) : (
            <EmptyState icon={<BuildingStorefrontIcon className="h-8 w-8"/>} title="No Tradies Found" message="We couldn't find any tradies matching your search. Try a different query."/>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="bg-white p-6 rounded-lg shadow-sm lg:col-span-2">
            <h2 className="text-xl font-semibold text-slate-700 mb-4">Monthly Spending</h2>
             <div style={{height: '250px'}}>
                <BarChart data={monthlySpendingData} yAxisLabel="$" />
            </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-slate-700 mb-4">Messages</h2>
            {data.messages.length > 0 ? (
                 <div className="space-y-4">{data.messages.map(message => (<div key={message.id} className="flex items-start space-x-3"><img src={message.avatarUrl} alt={message.senderName} className="h-10 w-10 rounded-full object-cover" /><div><p className="font-medium text-slate-800">{message.senderName}</p><p className="text-sm text-slate-500 truncate">{message.snippet}</p></div><span className="text-xs text-slate-400 ml-auto whitespace-nowrap">{message.timestamp}</span></div>))}</div>
            ) : (
                <EmptyState icon={<ChatBubbleLeftEllipsisIcon className="h-8 w-8"/>} title="No Messages" message="Your conversations with tradies will appear here."/>
            )}
        </section>
      </div>

       <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-slate-700 mb-4">My Bookings</h2>
          {clientBookings.length > 0 ? (
            <div className="space-y-2">{clientBookings.slice(0, 5).map(booking => <BookingListItem key={booking.id} booking={booking} />)}</div>
          ) : (
            <EmptyState icon={<CalendarDaysIcon className="h-8 w-8"/>} title="No Bookings Yet" message="When you book a tradie, your appointments will show up here."/>
          )}
        </section>
    </div>
  );
};

export default ClientDashboardPage;