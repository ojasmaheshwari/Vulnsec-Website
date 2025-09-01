import { toast, ToastContainer } from "react-toastify";
import { CLIENT_URL, SERVER_URL } from "../api_endpoints";
import { useEffect, useState } from "react";
import useWriteUpComments from "../hooks/useWriteUpComments";
import { Link } from "react-router-dom";
import { FaThumbsUp, FaThumbsDown, FaReply } from "react-icons/fa";
import { defaultProfilePic } from "./Profile";

export function Comment({ comment, handleLike, handleDislike, handleReply, handleReplySubmit, type }) {
    return (
        <li key={comment._id} className="mb-4" id={type === "reply" ? `reply-${comment._id}` : `comment-${comment._id}`}>
            <div className="flex items-center mb-1">
                <img
                    src={comment.author.profilePictureLink || defaultProfilePic}
                    alt={`${comment.author.username}'s profile`}
                    className="w-8 h-8 rounded-full object-cover border border-gray-300"
                />
                <Link to={`/users/${comment.author.username}`} className="ml-2 font-medium hover:underline">{comment.author.username}</Link>
                <span className="ml-2 text-sm text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
            </div>
            {/* If the content contains @username, make it a link to user's profile */}
            {comment.content.includes('@') ? (
                <p className="text-gray-800">
                    {comment.content.split(' ').map((word, idx) => {
                        if (word.startsWith('@')) {
                            const username = word.slice(1);
                            return (
                                <Link key={idx} to={`/users/${username}`} className="text-blue-500 hover:underline">
                                    {word}{' '}
                                </Link>
                            );
                        }
                        return word + ' ';
                    })}
                </p>
            ) : (
                <p className="text-gray-800">{comment.content}</p>
            )}
            <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center">
                    <button className="flex items-center text-sm text-gray-600 hover:text-gray-800" onClick={() => handleLike(comment._id)}>
                        <FaThumbsUp className="text-slate-700 mr-1" />
                        <span className="mr-4">{comment.likes || 0}</span>
                    </button>
                    <button className="flex items-center text-sm text-gray-600 hover:text-gray-800" onClick={() => handleDislike(comment._id)}>
                        <FaThumbsDown className="text-slate-700 mr-1" />
                        <span>{comment.dislikes || 0}</span>
                    </button>
                </div>
                <div>
                    <button className="ml-4 flex items-center text-sm text-gray-600 hover:text-gray-800" onClick={() => handleReply(comment._id)}>
                        <FaReply className="text-slate-500 mr-1" />
                        <span>Reply</span>
                    </button>
                </div>
            </div>
            <div className="mt-2 mb-2 p-4 shadow-md rounded-lg hidden" id={`reply-box-${comment._id}`}>
                <h3>Replying to <b>@{comment.author.username}</b></h3>

                <textarea
                    placeholder="Write your reply..."
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 resize-none"
                    rows={2}
                />
                <button
                    className="mt-2 bg-blue-500 text-white font-medium py-1 px-3 rounded-lg hover:bg-blue-600 transition-colors"
                    onClick={() => handleReplySubmit(comment._id)}
                >
                    Submit
                </button>

            </div>

            {/* Render replies if any */}
            {comment.replies && comment.replies.length > 0 && (
                <ul className="mt-4 ml-8 border-l-2 border-gray-300 pl-4">
                    {comment.replies.map((reply) => (
                        <Comment
                            key={reply._id}
                            comment={reply}
                            handleLike={handleLike}
                            handleDislike={handleDislike}
                            handleReply={handleReply}
                            handleReplySubmit={handleReplySubmit}
                            type="reply"
                        />
                    ))}
                </ul>
            )}
        </li>
    );
}

export function AllComments({ comments, loading, error }) {
    if (loading) return <p>Loading comments...</p>;
    if (error) return <p className="text-red-500">Error loading comments: {error.message}</p>;
    if (comments.length === 0) return <p className="my-4">No comments yet. Be the first to comment!</p>;

    function handleLike(commentId) {
        // Implement like functionality here
        fetch(`${SERVER_URL}/comments/${commentId}/like`, {
            method: "POST",
            credentials: "include",
        })
            .then((response) => {
                if (!response.ok) {
                    if (response.status === 401) {
                        toast.error("You must be logged in to like a comment");
                    } else if (response.status === 403) {
                        toast.error("You do not have permission to like this comment");
                    } else if (response.status === 400) {
                        toast.info("You have already liked this comment");
                    } else {
                        toast.error("An unexpected error occurred");
                    }
                    throw new Error("Failed to like comment");
                }
                return response.json();
            })
            .then((data) => {
                toast.success("Comment liked successfully");
                console.log("Comment liked:", data);
            })
            .catch((error) => {
                console.error("Error liking comment:", error);
            });
    }

    function handleDislike(commentId) {
        // Implement dislike functionality here
        console.log("Disliked comment:", commentId);
        fetch(`${SERVER_URL}/comments/${commentId}/dislike`, {
            method: "POST",
            credentials: "include",
        })
            .then((response) => {
                if (!response.ok) {
                    if (response.status === 401) {
                        toast.error("You must be logged in to dislike a comment");
                    } else if (response.status === 403) {
                        toast.error("You do not have permission to dislike this comment");
                    } else if (response.status === 400) {
                        toast.info("You have already liked this comment");
                    } else {
                        toast.error("An error occurred while disliking the comment");
                    }
                    throw new Error("Failed to dislike comment");
                }
                return response.json();
            })
            .then((data) => {
                toast.success("Comment disliked successfully");
                console.log("Comment disliked:", data);
            })
            .catch((error) => {
                console.error("Error disliking comment:", error);
            });
    }

    function handleReply(commentId) {
        // Implement reply functionality here
        console.log("Reply to comment:", commentId);

        const replyBox = document.getElementById(`reply-box-${commentId}`);
        if (!replyBox) return;

        // Toggle visibility
        if (replyBox.classList.contains("hidden")) {
            replyBox.classList.remove("hidden");
            replyBox.scrollIntoView({ behavior: "smooth", block: "center" });
            replyBox.querySelector("textarea").focus();
        } else {
            replyBox.classList.add("hidden");
        }
    }

    function handleReplySubmit(commentId) {
        // Implement reply submission functionality here
        console.log("Submitted reply to comment:", commentId);

        const replyBox = document.getElementById(`reply-box-${commentId}`);
        if (!replyBox) return;

        const textarea = replyBox.querySelector("textarea");
        const replyContent = textarea.value.trim();
        if (replyContent === "") {
            toast.error("Reply cannot be empty");
            return;
        }

        // Clear textarea and hide reply box
        textarea.value = "";
        replyBox.classList.add("hidden");

        // Get writeupUuid from URL
        const pathParts = window.location.pathname.split("/");
        const writeupUuid = pathParts[pathParts.length - 1];

        fetch(`${SERVER_URL}/writeups/${writeupUuid}/comments/`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: replyContent, replyingTo: commentId }),
        })
            .then((response) => {
                if (!response.ok) {
                    if (response.status === 401) {
                        toast.error("You must be logged in to post a reply");
                    } else if (response.status === 403) {
                        toast.error("You do not have permission to post a reply");
                    } else {
                        toast.error("An error occurred while posting your reply");
                    }
                    throw new Error("Failed to post reply");
                }
                return response.json();
            })
            .then((data) => {
                toast.success("Reply posted successfully");
                console.log("Reply posted:", data);
            })
            .catch((error) => {
                console.error("Error posting reply:", error);
            });
    }

    return (
        <div className="max-w-md p-4 bg-white rounded-2xl shadow-md mt-6">
            <h2 className="text-xl font-semibold mb-3">Comments</h2>
            <ul>
                {comments.map((comment) => (
                    <Comment
                        key={comment._id}
                        comment={comment}
                        handleLike={handleLike}
                        handleDislike={handleDislike}
                        handleReply={handleReply}
                        handleReplySubmit={handleReplySubmit}
                        type="comment"
                    />
                ))}
            </ul>
        </div>
    );
}

export default function CommentSection({ writeupUuid }) {
    const [comment, setComment] = useState("");

    // Load comments
    const { comments, loading, error } = useWriteUpComments(writeupUuid);

    const handleSend = () => {
        if (comment.trim() === "") return;
        setComment(""); // clear textarea

        fetch(`${SERVER_URL}/writeups/${writeupUuid}/comments`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: comment }),
        })
            .then((response) => {
                if (!response.ok) {
                    if (response.status === 401) {
                        toast.error("You must be logged in to post a comment");
                    } else if (response.status === 403) {
                        toast.error("You do not have permission to post a comment");
                    } else {
                        toast.error("An error occurred while posting your comment");
                    }
                    throw new Error("Failed to post comment");
                }
                return response.json();
            })
            .then((data) => {
                toast.success("Comment posted successfully");
                console.log("Comment posted:", data);
            })
            .catch((error) => {
                console.error("Error posting comment:", error);
            });
    };

    return (
        <>
            <div className="max-w-md p-4 bg-white rounded-2xl shadow-md my-8">
                <h2 className="text-xl font-semibold mb-3">Leave a Comment</h2>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your comment..."
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 resize-none"
                    rows={4}
                />
                <button
                    onClick={handleSend}
                    className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Send
                </button>

                <ToastContainer
                    position="bottom-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </div>

            <AllComments comments={comments} loading={loading} error={error} />
        </>

    );
}
