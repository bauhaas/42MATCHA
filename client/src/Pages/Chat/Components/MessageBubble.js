import { useSelector } from 'react-redux';
import Avatar from '../../../SharedComponents/Avatar';

const MessageBubble = ({message}) => {

    const currentUser = useSelector((state) => state.user.user);
    const date = new Date(message.created_at);


    return (
        <>
            <div className={`chat ${message.sender_id === currentUser.id ?"chat-end": "chat-start"}`}>
                <Avatar width={10} attribute={'chat-image avatar m-1'}/>
                <div className="chat-header">
                    <time className="text-xs opacity-50">{date.getHours()}:{date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}</time>
                </div>
                <div className="chat-bubble bg-chess-placeholder">{message.message}</div>
            </div>
        </>
    )
}

export default MessageBubble;