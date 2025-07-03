import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface DropdownItem {
    label: string;
    onClick: () => void;
    isDestructive?: boolean;
}

interface DropdownMenuProps {
    items: DropdownItem[];
    triggerIcon: React.ReactNode;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ items, triggerIcon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <span className="sr-only">Open options</span>
                {triggerIcon}
            </button>
             <AnimatePresence>
                {isOpen && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: -10 }} 
                    animate={{ opacity: 1, scale: 1, y: 0 }} 
                    exit={{ opacity: 0, scale: 0.95, y: -10 }} 
                    transition={{ duration: 0.1 }} 
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10"
                  >
                    {items.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => {
                          item.onClick();
                          setIsOpen(false);
                        }}
                        className={`w-full text-left block px-4 py-2 text-sm ${item.isDestructive ? 'text-red-700 hover:bg-red-50' : 'text-slate-700 hover:bg-slate-100'}`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DropdownMenu;
