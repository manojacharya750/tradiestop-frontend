import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Role } from '../types';
import Spinner from '../components/Spinner';
import { BuildingStorefrontIcon, ArrowLeftIcon } from '../components/icons';
import { tradieProfessions } from '../constants';

const SignupPage: React.FC<{ onSwitchToLogin: () => void, onBackToHome: () => void }> = ({ onSwitchToLogin, onBackToHome }) => {
    const { signup } = useAuth();
    const [formData, setFormData] = useState({ id: '', name: '', password: '', confirmPassword: '', role: Role.CLIENT, profession: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (!formData.id || !formData.name || !formData.password || !formData.role) {
            setError('All fields are required.');
            return;
        }
        
        const userData: Parameters<typeof signup>[0] = {
            id: formData.id,
            name: formData.name,
            password: formData.password,
            role: formData.role,
        };

        if (formData.role === Role.TRADIE) {
            if (!formData.profession) {
                setError('Please select a profession.');
                return;
            }
            userData.profession = formData.profession;
        }

        setIsLoading(true);
        const { success, error: apiError } = await signup(userData);

        if (!success) {
            setError(apiError || 'An unknown error occurred during signup.');
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
             <div className="absolute top-4 left-4">
                <button onClick={onBackToHome} className="flex items-center gap-2 text-slate-600 hover:text-slate-800 font-medium">
                    <ArrowLeftIcon className="w-5 h-5" />
                    Back to Home
                </button>
            </div>
            <div className="max-w-md w-full mx-auto">
                 <div className="flex justify-center items-center mb-6 text-blue-600">
                    <BuildingStorefrontIcon className="h-10 w-10 mr-3" />
                    <h1 className="text-4xl font-bold">TradieStop</h1>
                </div>
                <div className="bg-white shadow-xl rounded-lg p-8">
                    <h2 className="text-2xl font-semibold text-center text-slate-800 mb-6">Create a new account</h2>
                    <form onSubmit={handleSignup} className="space-y-4">
                         <div>
                            <label className="block text-sm font-medium text-slate-700">Full Name</label>
                            <input type="text" name="name" onChange={handleChange} required className="mt-1 w-full p-2 border border-slate-300 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">User ID</label>
                            <input type="text" name="id" onChange={handleChange} required className="mt-1 w-full p-2 border border-slate-300 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Password</label>
                            <input type="password" name="password" onChange={handleChange} required className="mt-1 w-full p-2 border border-slate-300 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
                            <input type="password" name="confirmPassword" onChange={handleChange} required className="mt-1 w-full p-2 border border-slate-300 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">I am a...</label>
                            <select name="role" value={formData.role} onChange={handleChange} className="mt-1 w-full p-2 border border-slate-300 rounded-md bg-white">
                                <option value={Role.CLIENT}>Client (looking for a tradie)</option>
                                <option value={Role.TRADIE}>Tradie (offering a service)</option>
                            </select>
                        </div>

                        {formData.role === Role.TRADIE && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Profession</label>
                                <select name="profession" value={formData.profession} onChange={handleChange} required className="mt-1 w-full p-2 border border-slate-300 rounded-md bg-white">
                                    <option value="" disabled>Select your trade</option>
                                    {tradieProfessions.map(prof => (
                                        <option key={prof} value={prof}>{prof}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                        
                        <div>
                            <button type="submit" disabled={isLoading} className="w-full mt-2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-75">
                                {isLoading ? <Spinner size="sm" /> : 'Sign up'}
                            </button>
                        </div>
                    </form>
                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-600">
                            Already have an account?{' '}
                            <button onClick={onSwitchToLogin} className="font-medium text-blue-600 hover:text-blue-500">
                                Sign in
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;