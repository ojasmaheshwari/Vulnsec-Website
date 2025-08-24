
import { useState, useContext, useEffect } from "react";
import UserContext from "../contexts/userContext";
import UserLoadingContext from "../contexts/userLoadingContext";

const useLoggedIn = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const { user } = useContext(UserContext);
    const { userLoading } = useContext(UserLoadingContext);

    useEffect(() => {
        if (userLoading) return;

        if (user) setLoggedIn(true);
    }, [userLoading]);

    return { loggedIn };
}

export default useLoggedIn;