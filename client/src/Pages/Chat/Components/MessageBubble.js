import { useSelector } from 'react-redux';
import Avatar from '../../../SharedComponents/Avatar';

const MessageBubble = ({message, picture}) => {

    const currentUser = useSelector((state) => state.user.user);
    const date = new Date(message.created_at);

    return (
        <>
            <div className={`chat ${message.sender_id === currentUser.id ?"chat-end": "chat-start"}`}>
                {
                    message.sender_id === currentUser.id
                    ?
                        null
                    :
                        <Avatar imageAttribute={'rounded-full w-12'} attribute={'chat-image avatar ml-1'} imagePath={picture}/>
                    }
                <div className="chat-header">
                    <time className="text-xs opacity-50">{date.getHours()}:{date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}</time>
                </div>
                <div className={`chat-bubble  ${message.sender_id === currentUser.id ? "bg-bot-logo" : "bg-chess-placeholder"} break-words`}>{message.message}</div>
            </div>
        </>
    )
}

export default MessageBubble;