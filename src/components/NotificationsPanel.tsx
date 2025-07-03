import React, { useState, useEffect, useRef } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { AnimatePresence, motion } from 'framer-motion';
import { BellIcon, CheckCircleIcon } from './icons';

const NotificationsPanel: React.FC<{onNavClick: (page: string) => void}> = ({ onNavClick }) => {
    const { notifications, unreadCount, markAllAsRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    const handleToggle = () => {
        setIsOpen(!isOpen);
        if (!isOpen && unreadCount > 0) {
            markAllAsRead();
        }
    };
    
    const handleNotificationClick = (link?: string) => {
        if(link) {
            onNavClick(link);
        }
        setIsOpen(false);
    }

    return (
        <div className="relative" ref={panelRef}>
            <button
                type="button"
                onClick={handleToggle}
                className="relative p-1 rounded-full text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 items-center justify-center text-white text-xs">
                            {unreadCount}
                        </span>
                    </span>
                )}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.1 }}
                        className="origin-top-right absolute right-0 mt-2 w-80 max-h-[80vh] flex flex-col rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                    >
                        <div className="p-4 border-b border-slate-200">
                            <h3 className="text-lg font-semibold text-slate-800">Notifications</h3>
                        </div>
                        <div className="flex-grow overflow-y-auto">
                        {notifications.length > 0 ? (
                            <ul className="divide-y divide-slate-100">
                                {notifications.map(n => (
                                    <li key={n.id} className={`${n.read ? '' : 'bg-blue-50'}`}>
                                        <button onClick={() => handleNotificationClick(n.link)} className="w-full text-left block p-4 hover:bg-slate-100">
                                            <p className="text-sm text-slate-700">{n.message}</p>
                                            <p className="text-xs text-slate-400 mt-1">{new Date(n.timestamp).toLocaleString()}</p>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center p-8 text-slate-500">
                                <CheckCircleIcon className="h-10 w-10 mx-auto text-slate-300"/>
                                <p className="mt-2 text-sm">You're all caught up!</p>
                            </div>
                        )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationsPanel;
