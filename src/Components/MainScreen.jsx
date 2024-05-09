import { useSelector } from "react-redux"
import UserBlock from "./UserBlock";
export default function MainScreen({}) {
    const userKey = useSelector((state) => state.meet.userKey);
    const participants = useSelector((state) => state.meet.participants);


    return (
        <div>
            <div className="participant-container">
                {Object.keys(participants).filter((prt)=> prt!==userKey).map((participant) => (
                    <UserBlock key={participant} userPreferences={participants[participant].preferences} username={participants[participant].userName} />
                ))}
            </div>
        </div>
    )
}