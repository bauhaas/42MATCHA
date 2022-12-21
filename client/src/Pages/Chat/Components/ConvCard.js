import { useState } from 'react';


const ConvCard = ({conv}) => {


    return (
        <>
            <div className='flex bg-chess-dark hover:bg-chess-hover rounded-lg gap-2 p-2'>
                <div className="avatar">
                    <div className="w-12 rounded-full">
                        <img src="https://placeimg.com/192/192/people" />
                    </div>
                </div>
                <div>
                    <p className='font-bold'>{conv}</p>
                    <p className='line-clamp-1'>This is the last message I sent you lol, it needs to be a long one</p>
                </div>
            </div>
        </>
    )
}

export default ConvCard;