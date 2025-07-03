import React, { useState } from 'react';
import Modal from './Modal';
import Spinner from './Spinner';
import { useData } from '../hooks/useData';
import { useToast } from '../hooks/useToast';
import { Role, User } from '../types';
import { UserPlusIcon } from './icons';

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose }) => {
    const { addUser } = useData();
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ id: '', name: '', password: '', role: Role.CLIENT });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!formData.id || !formData.name || !formData.password || !formData.role) {
            setError('All fields are required.');
            return;
        }
        setIsLoading(true);
        try {
            await addUser(formData);
            addToast('User created successfully!', 'success');
            onClose();
        } catch (err) {
            setError((err as Error).message || 'Failed to create user.');
            addToast((err as Error).message || 'Failed to create user.', 'error');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New User" titleIcon={<UserPlusIcon className="h-6 w-6 text-blue-500"/>}>
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">User ID</label>
                        <input type="text" name="id" value={formData.id} onChange={handleChange} className="mt-1 w-full p-2 border border-slate-300 rounded-md" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Full Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 w-full p-2 border border-slate-300 rounded-md" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} className="mt-1 w-full p-2 border border-slate-300 rounded-md" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Role</label>
                        <select name="role" value={formData.role} onChange={handleChange} className="mt-1 w-full p-2 border border-slate-300 rounded-md bg-white">
                            <option value={Role.CLIENT}>Client</option>
                            <option value={Role.TRADIE}>Tradie</option>
                            <option value={Role.ADMIN}>Admin</option>
                        </select>
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                </div>
                <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Cancel</button>
                    <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center">
                        {isLoading && <Spinner size="sm" className="mr-2"/>}
                        {isLoading ? 'Creating...' : 'Create User'}
                    </button>
                </div>
            </form>
        </Modal>
    )
}

export default AddUserModal;