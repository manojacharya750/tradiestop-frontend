import React, { useRef } from 'react';
import { PencilSquareIcon } from './icons';

const ProfileUploader: React.FC<{currentImage: string, onImageUpload: (base64: string) => void}> = ({ currentImage, onImageUpload }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onImageUpload(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="relative w-32 h-32" onClick={handleUploadClick} role="button" aria-label="Upload profile picture">
            <img src={currentImage} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md" />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 flex items-center justify-center rounded-full transition-opacity cursor-pointer">
                <PencilSquareIcon className="h-8 w-8 text-white opacity-0 hover:opacity-100" />
            </div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg, image/gif"
            />
        </div>
    );
};

export default ProfileUploader;