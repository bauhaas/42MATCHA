
const Avatar = ({ width, attribute}) => {

    return (
        <div className={attribute}>
            <div className={`w-${width} rounded-full`}>
                <img src="https://randomuser.me/api/portraits/men/51.jpg" alt="avatar"/>
            </div>
        </div>
    );
};

export default Avatar;