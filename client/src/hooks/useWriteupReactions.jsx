import { useState, useEffect, useCallback } from "react";
import { SERVER_URL } from "../api_endpoints";

const useWriteupReactions = (uuid) => {
    const [reactions, setReactions] = useState({ likes: 0, dislikes: 0 });
    const [loading, setLoading] = useState(true);

    const fetchReactions = useCallback(async () => {
        try {
            const res = await fetch(`${SERVER_URL}/writeups/${uuid}/reactions`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            setReactions({
                likes: data.data.likes || 0,
                dislikes: data.data.dislikes || 0
            });
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [uuid]);

    useEffect(() => {
        fetchReactions()
    }, [fetchReactions])

    return { likes: reactions.likes, dislikes: reactions.dislikes, loading, refresh: fetchReactions };
}

export default useWriteupReactions;