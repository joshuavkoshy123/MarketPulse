import { useEffect, useState, useRef } from "react";
import './styles.css';
import { doc, setDoc, arrayUnion, onSnapshot } from "firebase/firestore";
import { auth, db } from "../config/config";
import { onAuthStateChanged } from "firebase/auth";
import { fetchArticles } from "../resources/articles";

function Home() {
    const [articles, setArticles] = useState([]);
    const [activeCategory, setActiveCategory] = useState("latest");
    const [favorites, setFavorites] = useState([]);
    const searchInput = useRef(null);

    // fetch articles
    const loadArticles = async (query) => {
        const fetchedArticles = await fetchArticles(query);
        setArticles(fetchedArticles);
        setActiveCategory(query.toLowerCase());
    };

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
        loadArticles("latest");

        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                const userDoc = doc(db, 'users', user.uid);
        
                const unsubscribeSnapshot = onSnapshot(userDoc, (docSnapshot) => {
                const data = docSnapshot.data();
                if (data && data.favorites) {
                    setFavorites(data.favorites);
                    console.log("Favorites updated:", data.favorites);
                }
                });
        
                // Clean up the Firestore listener when auth state or component changes
                return () => unsubscribeSnapshot();
            }
        });
  
        // Clean up the auth state listener
        return () => unsubscribeAuth();
    }, []);

    // Check if article is contained in favorites
    const isFavorite = (title) => {
        return favorites.some(article => article.title === title);
    };

    return (
        <div className="home-container">
            <div className="header-layout">
                <div className="categories-left">
                    <div 
                        className={`category ${activeCategory === "latest" ? "active" : ""}`}
                        onClick={() => loadArticles("latest")}
                    >
                        latest
                    </div>
                    <div 
                        className={`category ${activeCategory === "stocks" ? "active" : ""}`}
                        onClick={() => loadArticles("stocks")}
                    >
                        stocks
                    </div>
                </div>
                
                <h1 className="page-title">Home</h1>
                
                <div className="categories-right">
                    <div 
                        className={`category ${activeCategory === "economy" ? "active" : ""}`}
                        onClick={() => loadArticles("economy")}
                    >
                        economy
                    </div>
                    <div 
                        className={`category ${activeCategory === "real estate" ? "active" : ""}`}
                        onClick={() => loadArticles("real estate")}
                    >
                        real estate
                    </div>
                </div>
            </div>
            
            <div className="search-container">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    loadArticles(searchInput.current.value);
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
                                    </div>
                                </a>
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
                                            {isFavorite(article.title) ? 'Added To Favorites' : 'Add To Favorites'}
                                        </button>
                                    </div>
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