import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import { useToast } from '../hooks/useToast';
import { Booking } from '../types';
import Modal from './Modal';
import Spinner from './Spinner';
import Calendar from './Calendar';
import { CalendarDaysIcon } from './icons';


interface RescheduleModalProps {
  booking: Booking;
  onClose: () => void;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({ booking, onClose }) => {
    const { rescheduleBooking, isLoading } = useData();
    const { addToast } = useToast();
    
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState('09:00');
    
    const handleSubmit = async () => {
        const newDateTime = `${selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}, ${selectedTime}`;
        try {
            await rescheduleBooking(booking.id, newDateTime);
            addToast("Booking rescheduled successfully!", "success");
            onClose();
        } catch(e) {
            addToast("Failed to reschedule booking.", "error");
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="Reschedule Booking" titleIcon={<CalendarDaysIcon className="h-6 w-6 text-blue-500"/>}>
            <div className="p-6 space-y-4">
                <p>Select a new date and time for your booking with <span className="font-semibold">{booking.tradieName}</span>.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <Calendar selectedDate={selectedDate} onDateChange={setSelectedDate} />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="time" className="block text-sm font-medium text-slate-700 mb-2">Select a time</label>
                        <input 
                            type="time" 
                            id="time"
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-md"
                        />
                    </div>
                </div>
            </div>
            <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3">
                <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Cancel</button>
                <button 
                    onClick={handleSubmit} 
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {isLoading ? <Spinner size="sm"/> : 'Confirm Reschedule'}
                </button>
            </div>
        </Modal>
    );
};

export default RescheduleModal;
