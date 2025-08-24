
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

        fetch(`${SERVER_URL}/isOwner?writeupUuid=${uuid}&ownerUuid=${user.uuid}`)
            .then(res => {
                if (res.status === 200) {
                    setIsOwner(true);
                } else {
                    setIsOwner(false);
                }
            })
            .catch(err => {
                console.error(err);
            })
    }, [loggedIn]);

    return { isOwner };
}

export default useWriteupOwner;