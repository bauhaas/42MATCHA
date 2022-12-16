import React from 'react';
import { useEffect, useState, useRef } from 'react';

const PictureForm = () => {
    const fileInputRef = useRef(null);
    const [imageUrl, setImageUrl] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const fileReader = new FileReader();
            fileReader.onload = (event) => {
                setImageUrl(event.target.result);
            };
            fileReader.readAsDataURL(file);
        }
    };

    return (
        <>
            <input
                type="file"
                className="file-input"
                ref={fileInputRef}
                onChange={handleFileChange}
            />
            {imageUrl && (
                <img src={imageUrl} alt="Selected file" className="mt-4" />
            )}
        </>
    );
};

export default PictureForm;