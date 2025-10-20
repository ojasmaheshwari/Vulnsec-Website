
import { useContext, useEffect, useState } from "react";
import useLoggedIn from "./useLoggedIn";
import { SERVER_URL } from "../api_endpoints";
import UserContext from "../contexts/userContext";

const useWriteupOwner = (uuid) => {
    const [isOwner, setIsOwner] = useState(false);
    const { loggedIn } = useLoggedIn();
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (!loggedIn) { setIsOwner(false); return; };

        fetch(`${SERVER_URL}/writeups/${uuid}`)
            .then(res => {
                if (res.status === 200) {
                    return res.json();
                } else {
                    setIsOwner(false);
                }
            })
            .then(res => {
                setIsOwner(res.data.authorId._id === user.id);
            })
            .catch(err => {
                console.error(err);
            })
    }, [loggedIn]);

    return { isOwner };
}

export default useWriteupOwner;