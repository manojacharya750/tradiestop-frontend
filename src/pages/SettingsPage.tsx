import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import { useToast } from '../hooks/useToast';
import { CompanyDetails, Role } from '../types';
import Spinner from '../components/Spinner';
import ProfileUploader from '../components/ProfileUploader';
import { Cog6ToothIcon, ShieldCheckIcon, UserCircleIcon } from '../components/icons';

const SettingsPage: React.FC = () => {
    const { currentUser, updateCurrentUser } = useAuth();
    const { data, updateUserProfile, updateCompanyDetails } = useData();
    const { addToast } = useToast();
    
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingCompany, setIsSavingCompany] = useState(false);

    const [name, setName] = useState(currentUser?.name || '');
    const [imageUrl, setImageUrl] = useState(currentUser?.imageUrl || '');
    const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(null);

    useEffect(() => {
        if (currentUser?.role === Role.TRADIE) {
            const tradieProfile = data.tradies.find(t => t.id === currentUser?.id);
            if (tradieProfile) {
                setCompanyDetails(tradieProfile.companyDetails);
            }
        }
    }, [data.tradies, currentUser]);

    const handleProfileImageUpload = (base64Image: string) => {
        setImageUrl(base64Image);
    }

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;
        setIsSavingProfile(true);
        try {
            const updatedUser = await updateUserProfile({ name, imageUrl });
            if(updatedUser) {
                updateCurrentUser(updatedUser); // Update auth context
                addToast('Profile updated successfully!', 'success');
            }
        } catch (err) {
            addToast('Failed to update profile.', 'error');
        } finally {
            setIsSavingProfile(false);
        }
    };
    
    const handleCompanyDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!companyDetails) return;
        setCompanyDetails({ ...companyDetails, [e.target.name]: e.target.value });
    };

    const handleCompanySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!companyDetails) return;
        setIsSavingCompany(true);
        try {
            await updateCompanyDetails(companyDetails);
            addToast('Company details updated successfully!', 'success');
        } catch (err) {
            addToast('Failed to update details.', 'error');
        } finally {
            setIsSavingCompany(false);
        }
    };
    
    if (!currentUser) {
        return <div className="flex justify-center pt-16"><Spinner size="lg"/></div>;
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
                <p className="text-slate-500 mt-1">Manage your account and profile information.</p>
            </div>

            <form onSubmit={handleProfileSubmit} className="bg-white p-8 rounded-lg shadow-sm space-y-6">
                <div className="flex items-center gap-3">
                    <UserCircleIcon className="h-6 w-6 text-slate-500" />
                    <h2 className="text-xl font-semibold text-slate-800">Profile Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Profile Picture</label>
                        <ProfileUploader currentImage={imageUrl} onImageUpload={handleProfileImageUpload}/>
                    </div>
                    <div className="md:col-span-2 space-y-6">
                         <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
                            <input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="userId" className="block text-sm font-medium text-slate-700">User ID</label>
                            <input type="text" name="userId" id="userId" value={currentUser.id} disabled className="mt-1 block w-full border-slate-300 rounded-md shadow-sm bg-slate-100 sm:text-sm" />
                        </div>
                    </div>
                </div>
                
                <div className="pt-5 flex justify-end">
                    <button type="submit" disabled={isSavingProfile} className="flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                        {isSavingProfile ? <Spinner size="sm" className="mr-2"/> : <UserCircleIcon className="h-5 w-5 mr-2" />}
                        {isSavingProfile ? 'Saving...' : 'Save Profile'}
                    </button>
                </div>
            </form>

            {currentUser.role === Role.TRADIE && companyDetails && (
                <form onSubmit={handleCompanySubmit} className="bg-white p-8 rounded-lg shadow-sm space-y-6">
                    <div className="flex items-center gap-3">
                         <ShieldCheckIcon className="h-6 w-6 text-slate-500" />
                         <h2 className="text-xl font-semibold text-slate-800">Company Details</h2>
                    </div>
                    <p className="text-sm text-slate-500 -mt-4">This information appears on your invoices.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="companyName" className="block text-sm font-medium text-slate-700">Company Name</label>
                            <input type="text" name="name" id="companyName" value={companyDetails.name} onChange={handleCompanyDetailsChange} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Contact Email</label>
                            <input type="email" name="email" id="email" value={companyDetails.email} onChange={handleCompanyDetailsChange} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm sm:text-sm" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-slate-700">Address</label>
                        <input type="text" name="address" id="address" value={companyDetails.address} onChange={handleCompanyDetailsChange} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm sm:text-sm" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Phone Number</label>
                            <input type="tel" name="phone" id="phone" value={companyDetails.phone} onChange={handleCompanyDetailsChange} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm sm:text-sm" />
                        </div>
                         <div>
                            <label htmlFor="taxId" className="block text-sm font-medium text-slate-700">Tax ID (e.g., ABN)</label>
                            <input type="text" name="taxId" id="taxId" value={companyDetails.taxId} onChange={handleCompanyDetailsChange} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm sm:text-sm" />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="logoUrl" className="block text-sm font-medium text-slate-700">Company Logo URL</label>
                        <input type="text" name="logoUrl" id="logoUrl" value={companyDetails.logoUrl} onChange={handleCompanyDetailsChange} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm sm:text-sm" />
                    </div>
                    <div className="pt-5 flex justify-end">
                        <button type="submit" disabled={isSavingCompany} className="flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
                            {isSavingCompany ? <Spinner size="sm" className="mr-2"/> : <Cog6ToothIcon className="h-5 w-5 mr-2" />}
                            {isSavingCompany ? 'Saving...' : 'Save Company Details'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default SettingsPage;