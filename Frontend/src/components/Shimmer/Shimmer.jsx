import React from "react";
import "./shimmer.css";

const Shimmer = () => {
    return (
        <div className="feed-container">
            {[1, 2].map((item) => (
                <div className="shimmer-card" key={item}>
                    <div className="shimmer-header">
                        <div className="shimmer-avatar shimmer"></div>

                        <div className="shimmer-user">
                            <div className="shimmer-line short shimmer"></div>
                            <div className="shimmer-line smaller shimmer"></div>
                        </div>
                    </div>

                    <div className="shimmer-image shimmer"></div>

                    <div className="shimmer-content">
                        <div className="shimmer-line shimmer"></div>
                        <div className="shimmer-line shimmer"></div>
                        <div className="shimmer-line short shimmer"></div>
                    </div>

                </div>
            ))}
        </div>
    );
};

export default Shimmer;