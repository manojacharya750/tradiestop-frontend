import React, { useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import { useToast } from '../hooks/useToast';
import { Review, Role, Booking, BookingStatus, ClientReview } from '../types';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import { StarIcon, PencilSquareIcon } from '../components/icons';

const renderStars = (rating: number, setRating?: (r: number) => void) => {
    return (
        <div className="flex items-center space-x-1">
        {Array.from({ length: 5 }, (_, i) => (
            <button key={i} onClick={setRating ? () => setRating(i + 1) : undefined} disabled={!setRating} aria-label={`Set rating to ${i+1}`}>
                 <StarIcon
                    className={`h-6 w-6 ${i < rating ? 'text-yellow-400' : 'text-slate-300'} ${setRating ? 'cursor-pointer' : ''}`}
                />
            </button>
        ))}
        </div>
    );
};

const TradieReviewCard: React.FC<{ review: Review }> = ({ review }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <div className="flex items-start gap-4">
            <img src={review.reviewerImageUrl} alt={review.reviewerName} className="h-12 w-12 rounded-full object-cover"/>
            <div className="flex-grow">
                <div className="flex justify-between items-center">
                    <p className="font-semibold text-slate-800">{review.reviewerName}</p>
                    {renderStars(review.rating)}
                </div>
                 <p className="mt-2 text-slate-600 italic">"{review.comment}"</p>
                 <p className="mt-2 text-right text-xs text-slate-400">{review.date}</p>
            </div>
        </div>
    </div>
);

const ClientReviewCard: React.FC<{ review: ClientReview }> = ({ review }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <div className="flex items-start gap-4">
            <img src={review.reviewerImageUrl} alt={review.reviewerName} className="h-12 w-12 rounded-full object-cover"/>
            <div className="flex-grow">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-semibold text-slate-800">{review.clientName}</p>
                         <p className="text-sm text-slate-500">Reviewed by {review.reviewerName}</p>
                    </div>
                    {renderStars(review.rating)}
                </div>
                 <p className="mt-2 text-slate-600 italic">"{review.comment}"</p>
                 <p className="mt-2 text-right text-xs text-slate-400">{review.date}</p>
            </div>
        </div>
    </div>
);

const WriteTradieReviewModal: React.FC<{ booking: Booking; onClose: () => void; }> = ({ booking, onClose }) => {
    const { currentUser } = useAuth();
    const { addReview: submitReview, isLoading: isSubmitting } = useData();
    const { addToast } = useToast();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = async () => {
        if (rating === 0 || !comment.trim() || !currentUser) return;
        try {
            await submitReview({
                bookingId: booking.id,
                tradieId: booking.tradieId,
                tradieName: booking.tradieName,
                rating,
                comment
            });
            addToast("Review submitted successfully!", "success");
            onClose();
        } catch(e) {
            addToast("Failed to submit review.", "error");
        }
    };
    
    return (
        <Modal isOpen={true} onClose={onClose} title={`Review your job with ${booking.tradieName}`}>
            <div className="p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700">Rating</label>
                    {renderStars(rating, setRating)}
                </div>
                 <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-slate-700">Comment</label>
                    <textarea 
                        id="comment"
                        rows={4} 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full mt-1 p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Share your experience with the tradie..."
                    />
                </div>
            </div>
            <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3">
                <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Cancel</button>
                <button 
                    onClick={handleSubmit} 
                    disabled={rating === 0 || !comment.trim() || isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {isSubmitting ? <Spinner size="sm"/> : 'Submit Review'}
                </button>
            </div>
        </Modal>
    )
};

const WriteClientReviewModal: React.FC<{ booking: Booking; onClose: () => void; }> = ({ booking, onClose }) => {
    const { currentUser } = useAuth();
    const { addClientReview, isLoading: isSubmitting } = useData();
    const { addToast } = useToast();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = async () => {
        if (rating === 0 || !comment.trim() || !currentUser) return;
        try {
            await addClientReview({
                bookingId: booking.id,
                clientId: booking.clientId,
                clientName: booking.clientName,
                rating,
                comment
            });
            addToast("Client review submitted successfully!", "success");
            onClose();
        } catch(e) {
            addToast("Failed to submit review.", "error");
        }
    };
    
    return (
        <Modal isOpen={true} onClose={onClose} title={`Review your client ${booking.clientName}`}>
            <div className="p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700">Rating</label>
                    {renderStars(rating, setRating)}
                </div>
                 <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-slate-700">Comment</label>
                    <textarea 
                        id="comment"
                        rows={4} 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full mt-1 p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Share your experience with the client (e.g., communication, preparedness)..."
                    />
                </div>
            </div>
            <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3">
                <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Cancel</button>
                <button 
                    onClick={handleSubmit} 
                    disabled={rating === 0 || !comment.trim() || isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {isSubmitting ? <Spinner size="sm"/> : 'Submit Review'}
                </button>
            </div>
        </Modal>
    )
};


const ReviewsPage: React.FC = () => {
    const { currentUser } = useAuth();
    const { data, isLoading } = useData();
    const [reviewModalBooking, setReviewModalBooking] = useState<Booking | null>(null);

    const userRole = currentUser?.role;

    // Reviews written BY this user (if client) or ABOUT this user (if tradie/admin)
    const tradieReviews = useMemo(() => {
        if (!currentUser) return [];
        if (userRole === Role.CLIENT) return data.reviews.filter(r => r.reviewerId === currentUser.id);
        if (userRole === Role.TRADIE) return data.reviews.filter(r => r.tradieId === currentUser.id);
        return data.reviews; // Admin
    }, [data.reviews, currentUser, userRole]);

    // Reviews written BY this user (if tradie) or ABOUT this user (if client/admin)
    const clientReviews = useMemo(() => {
        if (!currentUser) return [];
        if (userRole === Role.TRADIE) return data.clientReviews.filter(r => r.reviewerId === currentUser.id);
        if (userRole === Role.CLIENT) return data.clientReviews.filter(r => r.clientId === currentUser.id);
        return data.clientReviews;
    }, [data.clientReviews, currentUser, userRole]);
    
    const completedBookingsToReview = useMemo(() => {
        if (!currentUser) return [];
        if (userRole === Role.CLIENT) {
            const reviewedBookingIds = new Set(data.reviews.map(r => r.bookingId));
            return data.bookings.filter(b => 
                b.clientId === currentUser.id && 
                b.status === BookingStatus.COMPLETED &&
                !reviewedBookingIds.has(b.id)
            );
        }
        if (userRole === Role.TRADIE) {
            const reviewedBookingIds = new Set(data.clientReviews.map(r => r.bookingId));
            return data.bookings.filter(b => 
                b.tradieId === currentUser.id &&
                b.status === BookingStatus.COMPLETED &&
                !reviewedBookingIds.has(b.id)
            );
        }
        return [];
    }, [data.bookings, data.reviews, data.clientReviews, currentUser, userRole]);

    const handleWriteReviewClick = (booking: Booking) => {
        setReviewModalBooking(booking);
    };

    const pageTitle = userRole === Role.TRADIE ? "Client Reviews" : "Tradie Reviews";
    const pageDescription = userRole === Role.CLIENT
        ? "Manage the reviews you've written for tradies."
        : "Manage reviews for your clients and see what they say about you.";

    return (
        <div className="space-y-8">
            {reviewModalBooking && userRole === Role.CLIENT && <WriteTradieReviewModal booking={reviewModalBooking} onClose={() => setReviewModalBooking(null)} />}
            {reviewModalBooking && userRole === Role.TRADIE && <WriteClientReviewModal booking={reviewModalBooking} onClose={() => setReviewModalBooking(null)} />}
            
            <div>
                <h1 className="text-3xl font-bold text-slate-800">My Reviews</h1>
                <p className="text-slate-500 mt-1">{pageDescription}</p>
            </div>

            {completedBookingsToReview.length > 0 && (
                <section>
                     <h2 className="text-xl font-semibold text-slate-700 mb-4">Pending Reviews</h2>
                     <div className="bg-white p-4 rounded-lg shadow-sm">
                        <ul className="divide-y divide-slate-200">
                           {completedBookingsToReview.map(booking => (
                               <li key={booking.id} className="py-3 flex justify-between items-center">
                                   <div>
                                       <p className="font-medium text-slate-800">Job with {userRole === Role.CLIENT ? booking.tradieName : booking.clientName}</p>
                                       <p className="text-sm text-slate-500">{booking.details}</p>
                                   </div>
                                   <button onClick={() => handleWriteReviewClick(booking)} className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                                       <PencilSquareIcon className="h-4 w-4 mr-2"/>
                                       Write Review
                                   </button>
                               </li>
                           ))}
                        </ul>
                     </div>
                </section>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section>
                    <h2 className="text-xl font-semibold text-slate-700 mb-4">
                        {userRole === Role.CLIENT ? "Reviews You've Written" : "Reviews From Clients"}
                    </h2>
                    {isLoading && tradieReviews.length === 0 ? (
                        <div className="flex justify-center p-16"><Spinner size="lg" /></div>
                    ) : tradieReviews.length > 0 ? (
                        <div className="space-y-6">
                            {tradieReviews.map(review => <TradieReviewCard key={review.id} review={review} />)}
                        </div>
                    ) : (
                        <EmptyState 
                            icon={<StarIcon className="h-10 w-10"/>}
                            title="No Tradie Reviews"
                            message="Reviews about tradies will appear here."
                        />
                    )}
                </section>
                <section>
                    <h2 className="text-xl font-semibold text-slate-700 mb-4">
                        {userRole === Role.TRADIE ? "Reviews You've Written" : "Reviews About You"}
                    </h2>
                    {isLoading && clientReviews.length === 0 ? (
                        <div className="flex justify-center p-16"><Spinner size="lg" /></div>
                    ) : clientReviews.length > 0 ? (
                        <div className="space-y-6">
                            {clientReviews.map(review => <ClientReviewCard key={review.id} review={review} />)}
                        </div>
                    ) : (
                        <EmptyState 
                            icon={<StarIcon className="h-10 w-10"/>}
                            title="No Client Reviews"
                            message="Reviews about clients will appear here."
                        />
                    )}
                </section>
            </div>
        </div>
    );
};

export default ReviewsPage;