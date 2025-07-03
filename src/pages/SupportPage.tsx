import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import { useToast } from '../hooks/useToast';
import { SupportTicket, SupportTicketStatus, Role } from '../types';
import Spinner from '../components/Spinner';
import Modal from '../components/Modal';
import { LifebuoyIcon, CheckCircleIcon } from '../components/icons';

const getRoleColor = (role: Role) => {
    switch (role) {
        case Role.ADMIN: return 'text-purple-700 bg-purple-100';
        case Role.TRADIE: return 'text-blue-700 bg-blue-100';
        case Role.CLIENT: return 'text-indigo-700 bg-indigo-100';
        default: return 'text-slate-700 bg-slate-100';
    }
}
const getTicketStatusColor = (status: SupportTicketStatus) => {
    return status === SupportTicketStatus.OPEN ? 'text-green-700 bg-green-100' : 'text-slate-700 bg-slate-100';
}

const TicketDetailsModal: React.FC<{ ticket: SupportTicket; onClose: () => void; }> = ({ ticket, onClose }) => {
    const { updateTicketStatus, isLoading: isUpdating } = useData();
    const { addToast } = useToast();
    
    const handleResolve = async () => {
        try {
            await updateTicketStatus(ticket.id, SupportTicketStatus.CLOSED);
            addToast("Ticket has been marked as closed.", "success");
            onClose();
        } catch(e) {
            addToast("Failed to update ticket.", "error");
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose} title={`Ticket #${ticket.id}`}>
            <div className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-slate-800">{ticket.subject}</h3>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span>From: <strong>{ticket.userName}</strong></span>
                     <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(ticket.userRole)}`}>{ticket.userRole}</span>
                     <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getTicketStatusColor(ticket.status)}`}>{ticket.status}</span>
                </div>
                <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-slate-600">{ticket.description}</p>
                </div>
            </div>
            {ticket.status === SupportTicketStatus.OPEN && (
                <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Close</button>
                    <button onClick={handleResolve} disabled={isUpdating} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50">
                       <CheckCircleIcon className="h-5 w-5 mr-2"/> {isUpdating ? 'Updating...' : 'Mark as Resolved'}
                    </button>
                </div>
            )}
        </Modal>
    );
};


const SupportPage: React.FC = () => {
    const { data, isLoading } = useData();
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

    return (
        <div className="space-y-8">
            {selectedTicket && <TicketDetailsModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />}
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Support Center</h1>
                <p className="text-slate-500 mt-1">Manage and resolve user support tickets.</p>
            </div>
            
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    {isLoading && data.supportTickets.length === 0 ? (
                         <div className="flex justify-center p-16"><Spinner size="lg" /></div>
                    ) : (
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Subject</th>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                                    <th scope="col" className="relative p-4"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {data.supportTickets.map(ticket => (
                                    <tr key={ticket.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 whitespace-nowrap">
                                            <div className="font-medium text-slate-800">{ticket.userName}</div>
                                            <div className={`text-xs inline-flex px-2 py-0.5 rounded-full ${getRoleColor(ticket.userRole)}`}>{ticket.userRole}</div>
                                        </td>
                                        <td className="p-4 whitespace-nowrap text-sm text-slate-600">{ticket.subject}</td>
                                        <td className="p-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTicketStatusColor(ticket.status)}`}>
                                                {ticket.status}
                                            </span>
                                        </td>
                                        <td className="p-4 whitespace-nowrap text-sm text-slate-500">{ticket.date}</td>
                                        <td className="p-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => setSelectedTicket(ticket)} className="text-blue-600 hover:text-blue-900">
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SupportPage;
