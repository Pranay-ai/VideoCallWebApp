export default function UserBlock({ userPreferences, username }) {
    return (
        <div className="user-block">
            <div className="user-content">
                {userPreferences.video ?
                    <div className="user-video"></div> :
                    <div className="user-video-off">
                        <h1>{username[0]}</h1> 
                    </div>
                }
            </div>
            <div className="user-name">{username}</div>
        </div>
    );
}
