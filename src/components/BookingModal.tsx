import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import { useToast } from '../hooks/useToast';
import { Tradie } from '../types';
import Modal from './Modal';
import Spinner from './Spinner';
import Calendar from './Calendar';
import { CalendarDaysIcon } from './icons';

interface BookingModalProps {
  tradie: Tradie;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ tradie, onClose }) => {
    const { createBooking, isLoading } = useData();
    const { addToast } = useToast();
    
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState('09:00');
    const [details, setDetails] = useState('');
    
    const handleSubmit = async () => {
        if (!details.trim()) {
            addToast("Please provide some details about the job.", "error");
            return;
        }
        const serviceDate = `${selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}, ${selectedTime}`;
        try {
            await createBooking(tradie.id, serviceDate, details);
            addToast("Booking request sent successfully!", "success");
            onClose();
        } catch(e) {
            addToast("Failed to send booking request.", "error");
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose} title={`Book ${tradie.name}`} titleIcon={<CalendarDaysIcon className="h-6 w-6 text-blue-500"/>}>
            <div className="p-6 space-y-4">
                <p>Select a preferred date and time and provide details for your job with <span className="font-semibold">{tradie.name}</span>.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <Calendar selectedDate={selectedDate} onDateChange={setSelectedDate} />
                    </div>
                    <div className="flex-1 space-y-4">
                        <div>
                            <label htmlFor="time" className="block text-sm font-medium text-slate-700 mb-1">Select a time</label>
                            <input 
                                type="time" 
                                id="time"
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label htmlFor="details" className="block text-sm font-medium text-slate-700 mb-1">Job Details</label>
                             <textarea 
                                id="details"
                                rows={4} 
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                className="w-full mt-1 p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder={`Please describe the work you need done...\ne.g., Install a new ceiling fan.`}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3">
                <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Cancel</button>
                <button 
                    onClick={handleSubmit} 
                    disabled={isLoading || !details.trim()}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {isLoading ? <Spinner size="sm"/> : 'Send Booking Request'}
                </button>
            </div>
        </Modal>
    );
};

export default BookingModal;