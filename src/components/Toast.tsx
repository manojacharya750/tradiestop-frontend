import React from 'react';
import { motion } from 'framer-motion';
import { ToastMessage } from '../types';
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon } from './icons';

interface ToastProps {
  message: ToastMessage;
  onDismiss: () => void;
}

const ICONS = {
  success: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
  error: <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />,
  info: <InformationCircleIcon className="h-6 w-6 text-blue-500" />,
};

const Toast: React.FC<ToastProps> = ({ message, onDismiss }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className="bg-white shadow-lg rounded-lg p-4 flex items-start space-x-4"
    >
      <div className="flex-shrink-0">{ICONS[message.type]}</div>
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-800">{message.message}</p>
      </div>
      <div className="flex-shrink-0">
        <button
          onClick={onDismiss}
          className="p-1 text-slate-400 rounded-full hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
};

export default Toast;
