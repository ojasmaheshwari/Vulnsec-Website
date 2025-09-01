import { useEffect, useState } from "react";
import { SERVER_URL } from "../api_endpoints";

const createNestedComments = (comments) => {
    // Nesting level is 1 only (replies to comments)
    // Comments with replyingTo = null are top-level comments
    // Comments with replyingTo = comment._id are replies to that comment
    
    // Then, create a map of original commentId with its replies
    const commentMap = {};
    comments.forEach(c => {
        if (c.replyingTo) {
            if (!commentMap[c.replyingTo]) {
                commentMap[c.replyingTo] = [];
            }
            commentMap[c.replyingTo].push(c);
        }
    });
    
    // For each entry in commentMap, add a 'replies' field to the original comment
    comments.forEach(c => {
        if (commentMap[c._id]) {
            c.replies = commentMap[c._id];
        } else {
            c.replies = [];
        }
    });

    // Finally, filter out comments to only include top-level comments
    return comments.filter(c => !c.replyingTo);
}

const useWriteUpComments = (writeupUuid) => {
    if (!writeupUuid) {
        console.error("UUID not provided in useWriteUpComments hook");
        return { comments: [], loading: false, error: "UUID not provided" };
    }

    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load comments
    useEffect(() => {
        fetch(`${SERVER_URL}/writeups/${writeupUuid}/comments`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to load comments");
                }
                return response.json();
            })
            .then((data) => {
                // Sort comments by creation date (newest first)
                data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                /*
                Comments structure:
                {
                    "_id": "64b8f5e2c9e77c001f8e4b1a",
                    "writeupId": "some-writeup-uuid",
                    "authorId": "user-uuid",
                    "content": "This is a comment",
                    "replyingTo": null,
                    "createdAt": "2024-07-20T12:34:56.789Z",
                    "author": {
                        "username": "user123",
                        "profilePictureLink": "https://example.com/profile.jpg"
                    },

                    replies: []
                }
                */
                
                setComments(createNestedComments(data));
            })
            .catch((error) => {
                console.error("Error loading comments:", error);
                setError(error);
            })
            .finally(() => setLoading(false));
    }, []);

    return { comments, loading, error };
}

export default useWriteUpComments;