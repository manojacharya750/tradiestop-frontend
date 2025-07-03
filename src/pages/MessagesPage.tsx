import React, { useMemo, useState } from 'react';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { Role } from '../types';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import { MagnifyingGlassIcon, ChatBubbleLeftEllipsisIcon } from '../components/icons';
import { AnimatePresence, motion } from 'framer-motion';

const MessagesPage: React.FC = () => {
    const { currentUser } = useAuth();
    const { data, isLoading } = useData();
    
    const contacts = useMemo(() => {
        if (!currentUser) return [];
        const uniqueContacts = new Map<string, { name: string; imageUrl: string; snippet: string }>();

        data.bookings.forEach(booking => {
            if (currentUser.role === Role.CLIENT && currentUser.id === booking.clientId) {
                if (!uniqueContacts.has(booking.tradieId)) {
                    uniqueContacts.set(booking.tradieId, { name: booking.tradieName, imageUrl: booking.tradieImageUrl, snippet: "Talk about your booking..." });
                }
            }
            if (currentUser.role === Role.TRADIE && currentUser.id === booking.tradieId) {
                if (!uniqueContacts.has(booking.clientId)) {
                    uniqueContacts.set(booking.clientId, { name: booking.clientName, imageUrl: booking.clientImageUrl, snippet: "Discussing the job..." });
                }
            }
        });

        // For admins, show all users
        if (currentUser.role === Role.ADMIN) {
             data.users.filter(u => u.id !== currentUser.id).forEach(user => {
                 uniqueContacts.set(user.id, { name: user.name, imageUrl: user.imageUrl, snippet: `Role: ${user.role}` });
             })
        }

        return Array.from(uniqueContacts.values());
    }, [data.bookings, data.users, currentUser]);

    const [selectedContact, setSelectedContact] = useState<{ name: string; imageUrl: string; } | null>(null);

    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><Spinner size="lg" /></div>;
    }

    return (
        <div className="h-full flex flex-col">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Messages</h1>
                <p className="text-slate-500 mt-1">Your conversations with clients and tradies.</p>
            </div>

            <div className="mt-8 flex-grow flex bg-white shadow-sm rounded-lg overflow-hidden">
                {/* Contact List */}
                <div className={`w-full md:w-1/3 border-r border-slate-200 flex flex-col ${selectedContact ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-4 border-b border-slate-200">
                        <div className="relative">
                            <MagnifyingGlassIcon className="h-5 w-5 text-slate-400 absolute top-1/2 left-3 -translate-y-1/2" />
                            <input type="text" placeholder="Search messages..." className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg" />
                        </div>
                    </div>
                    <ul className="flex-grow overflow-y-auto">
                       {contacts.length > 0 ? contacts.map(contact => (
                            <li key={contact.name}>
                                <button onClick={() => setSelectedContact(contact)} className="w-full text-left flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                                    <img src={contact.imageUrl} alt={contact.name} className="h-12 w-12 rounded-full object-cover"/>
                                    <div className="flex-grow">
                                        <p className="font-semibold text-slate-800">{contact.name}</p>
                                        <p className="text-sm text-slate-500 truncate">{contact.snippet}</p>
                                    </div>
                                </button>
                            </li>
                       )) : (
                           <div className="p-8 text-center">
                               <p className="text-slate-500">No contacts found.</p>
                           </div>
                       )}
                    </ul>
                </div>

                {/* Chat Window */}
                <div className={`w-full md:w-2/3 flex-col ${selectedContact ? 'flex' : 'hidden md:flex'}`}>
                    <AnimatePresence mode="wait">
                    {selectedContact ? (
                        <motion.div key={selectedContact.name} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="h-full flex flex-col">
                            <div className="p-4 border-b border-slate-200 flex items-center gap-4">
                                <button onClick={() => setSelectedContact(null)} className="md:hidden p-1 hover:bg-slate-100 rounded-full">{"<"}</button>
                                <img src={selectedContact.imageUrl} alt={selectedContact.name} className="h-10 w-10 rounded-full object-cover"/>
                                <h2 className="font-semibold text-slate-800 text-lg">{selectedContact.name}</h2>
                            </div>
                            <div className="flex-grow p-6 bg-slate-50 overflow-y-auto flex flex-col-reverse">
                                {/* Messages will be shown here */}
                                <div className="text-center text-slate-400">
                                    <p>This is a read-only message preview.</p>
                                    <p>Full chat functionality is coming soon.</p>
                                </div>
                            </div>
                            <div className="p-4 bg-white border-t border-slate-200">
                                <input type="text" placeholder={`Message ${selectedContact.name}...`} className="w-full px-4 py-2 border border-slate-300 rounded-lg" disabled />
                            </div>
                        </motion.div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-center text-slate-500">
                            <div>
                                <ChatBubbleLeftEllipsisIcon className="h-16 w-16 mx-auto text-slate-300"/>
                                <h2 className="mt-2 text-lg font-medium">Select a conversation</h2>
                                <p>Choose a contact from the left to view messages.</p>
                            </div>
                        </div>
                    )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default MessagesPage;
