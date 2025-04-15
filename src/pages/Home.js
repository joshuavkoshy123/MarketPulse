import { useEffect, useState, useRef } from "react";
import './styles.css';
import { doc, setDoc, arrayUnion } from "firebase/firestore";
import React from "react";
import { auth, db } from "../config/config";

function Home() {
    const API_KEY = "86f36900809b4d6cb68317eed0bca8bb";
    const url = "https://newsapi.org/v2/everything?q=";
    const [articles, setArticles] = useState([]);
    const [activeCategory, setActiveCategory] = useState("latest");
    const searchInput = useRef(null);

    // Fetch news data
    async function fetchData(query) {
        try {
            const res = await fetch(
                `${url}${query}&language=en&domains=wsj.com,bloomberg.com,cnbc.com,ft.com,forbes.com&sortBy=publishedAt&apiKey=${API_KEY}`
            );
            const data = await res.json();
            console.log(query);
            console.log(data.articles);
            setArticles(data.articles || []);
            
            // Update active category
            setActiveCategory(query.toLowerCase());
        } catch (error) {
            console.error("Error fetching data:", error);
            setArticles([]);
        }
    }

    const addToFavorites = async (url, urlToImage, title, source, publishedAt, description) => {
        try {
            const user = auth.currentUser;

            if (!user) {
                throw new Error("User not authenticated.");
            }

            const articleData = {
                url: url,
                urlToImage: urlToImage,
                title: title,
                source: source,
                publishedAt: publishedAt,
                description: description,
                type: "article"
            };

            const userDoc = doc(db, 'users', user.uid);

            await setDoc(userDoc, {
                favorites: arrayUnion(articleData)
            }, { merge: true });
        }
        catch (error) {
            console.error("There has been an error: ", error);
        }
    }

    // Initial data fetch
    useEffect(() => {
        fetchData("latest");
    }, []);

    return (
        <div className="home-container">
            <div className="header-layout">
                <div className="categories-left">
                    <div 
                        className={`category ${activeCategory === "latest" ? "active" : ""}`}
                        onClick={() => fetchData("latest")}
                    >
                        latest
                    </div>
                    <div 
                        className={`category ${activeCategory === "stocks" ? "active" : ""}`}
                        onClick={() => fetchData("stocks")}
                    >
                        stocks
                    </div>
                </div>
                
                <h1 className="page-title">Home</h1>
                
                <div className="categories-right">
                    <div 
                        className={`category ${activeCategory === "economy" ? "active" : ""}`}
                        onClick={() => fetchData("economy")}
                    >
                        economy
                    </div>
                    <div 
                        className={`category ${activeCategory === "real estate" ? "active" : ""}`}
                        onClick={() => fetchData("real estate")}
                    >
                        real estate
                    </div>
                </div>
            </div>
            
            <div className="search-container">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    fetchData(searchInput.current.value);
                }}>
                    <input ref={searchInput} type="text" placeholder="Search..." className="search-input" />
                </form>
            </div>
            
            <div className="divider"></div>
            
            {/* Article Grid */}
            <div className="article-grid">
                {articles.length > 0 ? (
                    articles.map((article, index) => (
                        article.urlToImage && (
                            <div key={index} className="article-card">
                                <a href={article.url} target="_blank" rel="noopener noreferrer">
                                    <div className="article-image">
                                        <img src={article.urlToImage} alt={article.title} loading="lazy" />
                                    </div>
                                    <div className="article-content">
                                        <h3 className="article-title">{article.title}</h3>
                                        <div className="article-meta">
                                            <span className="article-source">{article.source.name}</span>
                                            <span className="meta-divider">|</span>
                                            <span className="article-date">{new Date(article.publishedAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="article-description">{article.description}</p>
                                    <div className="article-actions">
                                        <a href={article.url} className="read-more" target="_blank" rel="noopener noreferrer">
                                            Read More
                                        </a>
                                        <button 
                                            className="favorite-button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                addToFavorites(
                                                    article.url, 
                                                    article.urlToImage, 
                                                    article.title, 
                                                    article.source.name, 
                                                    article.publishedAt, 
                                                    article.description
                                                );
                                            }}
                                        >
                                            Add To Favorites
                                        </button>
                                    </div>
                                    </div>
                                </a>
                            </div>
                        )
                    ))
                ) : (
                    <div className="no-articles">
                        <p>No articles found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;