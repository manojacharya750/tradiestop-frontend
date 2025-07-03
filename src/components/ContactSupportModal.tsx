import React, { useState } from 'react';
import Modal from './Modal';
import Spinner from './Spinner';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import { useToast } from '../hooks/useToast';
import { QuestionMarkCircleIcon } from './icons';

interface ContactSupportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ContactSupportModal: React.FC<ContactSupportModalProps> = ({ isOpen, onClose }) => {
    const { currentUser } = useAuth();
    const { createSupportTicket } = useData();
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim() || !description.trim() || !currentUser) return;
        
        setIsLoading(true);
        try {
            await createSupportTicket({
                subject,
                description,
            });
            addToast('Support ticket submitted successfully!', 'success');
            onClose();
            setSubject('');
            setDescription('');
        } catch (err) {
            addToast('Failed to submit support ticket.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Contact Support" titleIcon={<QuestionMarkCircleIcon className="h-6 w-6 text-blue-500"/>}>
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Subject</label>
                        <input type="text" value={subject} onChange={e => setSubject(e.target.value)} className="mt-1 w-full p-2 border border-slate-300 rounded-md" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700">Description</label>
                        <textarea rows={5} value={description} onChange={e => setDescription(e.target.value)} className="mt-1 w-full p-2 border border-slate-300 rounded-md" required placeholder="Please describe your issue in detail..."></textarea>
                    </div>
                </div>
                <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Cancel</button>
                    <button type="submit" disabled={isLoading || !subject.trim() || !description.trim()} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center">
                        {isLoading && <Spinner size="sm" className="mr-2"/>}
                        {isLoading ? 'Submitting...' : 'Submit Ticket'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

export default ContactSupportModal;