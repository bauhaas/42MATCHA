
const Avatar = ({ imageAttribute, attribute}) => {

    return (
        <div className={attribute}>
            <div className={imageAttribute}>
                <img src="https://randomuser.me/api/portraits/men/51.jpg" alt="avatar"/>
            </div>
        </div>
    );
};

export default Avatar;