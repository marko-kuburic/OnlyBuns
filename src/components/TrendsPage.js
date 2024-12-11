import React, { useEffect, useState } from "react";
import "./TrendsPage.css";

function TrendsPage() {
    const [trendsData, setTrendsData] = useState({
        totalPosts: 0,
        monthlyPosts: 0,
        topWeeklyPosts: [],
        topAllTimePosts: [],
        topLikers: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrends = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/trends/statistics");
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                const data = await response.json();
                setTrendsData(data);
            } catch (error) {
                console.error("Error fetching trends:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrends();
    }, []);

    if (loading) {
        return <div className="trends-loading">Loading...</div>;
    }

    return (
        <div className="trends-container">
            <h1 className="trends-title">Network Trends</h1>

            <div className="trends-section">
                <h2>Total Posts</h2>
                <p>{trendsData.totalPosts}</p>
            </div>

            <div className="trends-section">
                <h2>Posts in Last 30 Days</h2>
                <p>{trendsData.monthlyPosts}</p>
            </div>

            <div className="trends-section">
                <h2>Top 5 Weekly Posts</h2>
                {trendsData.topWeeklyPosts.length > 0 ? (
                    <ul>
                        {trendsData.topWeeklyPosts.map((post) => (
                            <li key={post.postId}>
                                <p>{post.content}</p>
                                <p>Likes: {post.likesCount}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No posts available for the last 7 days.</p>
                )}
            </div>

            <div className="trends-section">
                <h2>Top 10 Posts of All Time</h2>
                {trendsData.topAllTimePosts.length > 0 ? (
                    <ul>
                        {trendsData.topAllTimePosts.map((post) => (
                            <li key={post.postId}>
                                <p>{post.content}</p>
                                <p>Likes: {post.likesCount}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No popular posts yet.</p>
                )}
            </div>

            <div className="trends-section">
                <h2>Top 10 Likers This Week</h2>
                {trendsData.topLikers.length > 0 ? (
                    <ul>
                        {trendsData.topLikers.map((user) => (
                            <li key={user.userId}>
                                <p>{user.username}</p>
                                <p>Likes Given: {user.likesGiven}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No users found for this week.</p>
                )}
            </div>
        </div>
    );
}

export default TrendsPage;
