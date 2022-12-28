import Avatar from "../../../SharedComponents/Avatar";

const ConvCard = ({conv}) => {

    return (
        <>
            <div className={`flex bg-chess-dark rounded-lg gap-2 p-2 ${conv.last_message_unread ? 'bg-red-500' : 'hover:bg-chess-hover'}`}>
                <Avatar width={12} attribute={'avatar'} />
                <div>
                    <p className='font-bold'>{conv.you_talk_to}</p>
                    <p className='line-clamp-1'>{conv.last_message || "No messages yet"}</p>
                </div>
            </div>
        </>
    )
}



export default ConvCard;