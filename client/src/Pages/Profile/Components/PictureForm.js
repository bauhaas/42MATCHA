import React from 'react';
import { useEffect, useState, useRef } from 'react';

const PictureForm = () => {
    const fileInputRef = useRef(null);
    const [imageUrls, setImageUrls] = useState([]);

    const handleFileChange = (event) => {
        const files = event.target.files;

        if (files.length > 0) {
            const newImageUrls = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const fileReader = new FileReader();
                fileReader.onload = (event) => {
                    newImageUrls.push(event.target.result);
                    if (newImageUrls.length === files.length) {
                        setImageUrls([...imageUrls, ...newImageUrls]);
                    }
                };
                fileReader.readAsDataURL(file);
            }
        }
    };

    const deleteImage = (event, imageUrl) => {
        event.preventDefault();
        setImageUrls(imageUrls.filter((url) => url !== imageUrl));
    };

    console.log(imageUrls);

    return (
        <>
            <div className='flex flex-col items-center'>
                <p className='mt-4 font-bold text-2xl'>Upload up to 5 photos</p>
                <p className='text-sm'>The first one will be your profile picture</p>
                <input
                    type="file"
                    className="file-input file-input-sm w-full max-w-xs m-auto mt-2"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                />
                {
                    <div className="carousel max-h-96 mt-4 mx-4 rounded-lg">
                        {imageUrls.map((imageUrl, index) => (
                            <div id={index} className="carousel-item relative w-full">
                                <img src={imageUrl} className="mx-auto object-center object-contain" alt="randomshit" />
                                <div className={`absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2 ${imageUrls.length <= 1 ? 'hidden':null}`}>
                                    <a href={'#' + (index - 1)} className="btn btn-circle">❮</a>
                                    <a href={'#' + (index + 1)} className="btn btn-circle">❯</a>
                                </div>
                                <button onClick={(event) => deleteImage(event, imageUrl)} className="btn btn-circle btn-xs absolute right-0 m-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}

                    </div>
                }
                <p>{imageUrls.length}/5</p>
            </div>
        </>
    );
};

export default PictureForm;