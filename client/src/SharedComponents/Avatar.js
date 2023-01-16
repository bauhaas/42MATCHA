
const Avatar = ({ imageAttribute, attribute, imagePath, from}) => {

    return (
        <div className={attribute}>
            <div className={imageAttribute}>
                <img src={`http://localhost:3001/${imagePath}`} alt="avatar"/>
            </div>
        </div>
    );
};

export default Avatar;