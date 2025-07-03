import React, { useState, useMemo } from 'react';
import { useData } from '../hooks/useData';
import { useToast } from '../hooks/useToast';
import { User, Role } from '../types';
import Spinner from '../components/Spinner';
import AddUserModal from '../components/AddUserModal';
import DropdownMenu from '../components/DropdownMenu';
import { MagnifyingGlassIcon, EllipsisVerticalIcon, UserPlusIcon } from '../components/icons';

const getRoleColor = (role: Role) => {
    switch (role) {
        case Role.ADMIN: return 'text-purple-700 bg-purple-100';
        case Role.TRADIE: return 'text-blue-700 bg-blue-100';
        case Role.CLIENT: return 'text-indigo-700 bg-indigo-100';
        default: return 'text-slate-700 bg-slate-100';
    }
}

const UserRow: React.FC<{ user: User; onDelete: (userId: string, userName: string) => void; }> = ({ user, onDelete }) => {
    const dropdownItems = [
        { label: 'View Profile', onClick: () => {} },
        { label: 'Suspend User', onClick: () => {} },
        { label: 'Delete User', isDestructive: true, onClick: () => onDelete(user.id, user.name) }
    ];

    return (
        <tr className="hover:bg-slate-50 transition-colors">
            <td className="p-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full object-cover" src={user.imageUrl} alt={user.name} />
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">{user.name}</div>
                        <div className="text-sm text-slate-500">{user.id}</div>
                    </div>
                </div>
            </td>
            <td className="p-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>
                    {user.role}
                </span>
            </td>
            <td className="p-4 whitespace-nowrap text-sm text-slate-500">{user.joinedDate}</td>
            <td className="p-4 whitespace-nowrap text-right text-sm font-medium">
                <DropdownMenu items={dropdownItems} triggerIcon={<EllipsisVerticalIcon className="h-5 w-5" />} />
            </td>
        </tr>
    );
};

const UsersPage: React.FC = () => {
    const { data, isLoading, addUser, deleteUser } = useData();
    const { addToast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredUsers = useMemo(() => {
        if (!searchQuery.trim()) return data.users;
        const lowercasedQuery = searchQuery.toLowerCase();
        return data.users.filter(user =>
            user.name.toLowerCase().includes(lowercasedQuery) ||
            user.id.toLowerCase().includes(lowercasedQuery)
        );
    }, [data.users, searchQuery]);
    
    const handleDeleteUser = async (userId: string, userName: string) => {
        if (window.confirm(`Are you sure you want to delete the user "${userName}"? This action cannot be undone.`)) {
            try {
                await deleteUser(userId);
                addToast(`User ${userName} deleted successfully.`, 'success');
            } catch (e) {
                addToast('Failed to delete user.', 'error');
            }
        }
    };
    
    return (
        <div className="space-y-8">
            <AddUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <div>
                <h1 className="text-3xl font-bold text-slate-800">User Management</h1>
                <p className="text-slate-500 mt-1">View and manage all users on the platform.</p>
            </div>
            
             <div className="flex justify-between items-center">
                <div className="relative flex-grow max-w-xs">
                    <MagnifyingGlassIcon className="h-5 w-5 text-slate-400 absolute top-1/2 left-3 -translate-y-1/2" />
                    <input 
                        type="text" 
                        placeholder="Search users..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500" 
                    />
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
                    <UserPlusIcon className="h-5 w-5 mr-2"/>
                    Add User
                </button>
            </div>
            
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    {isLoading && data.users.length === 0 ? (
                         <div className="flex justify-center p-16"><Spinner size="lg" /></div>
                    ) : (
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                                    <th scope="col" className="p-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Joined Date</th>
                                    <th scope="col" className="relative p-4"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {filteredUsers.map(user => <UserRow key={user.id} user={user} onDelete={handleDeleteUser} />)}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UsersPage;