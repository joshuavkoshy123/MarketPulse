import { useEffect, useState, useRef } from "react";
import './styles.css';
import { doc, setDoc, arrayUnion } from "firebase/firestore";
import React from "react";
import { auth, db } from "../config/config";

function Home() {
    const API_KEY = "86f36900809b4d6cb68317eed0bca8bb";
    const url = "https://newsapi.org/v2/everything?q=";
    const [articles, setArticles] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);
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
            //setError("Failed to add stock to favorites");
        }
    }

    // Initial data fetch
    useEffect(() => {
        fetchData("all");
    }, []);

    return (
        <div>
            <header>
                {/* Desktop Navigation + Search */}
                <nav className="desktop">
                    {/* Desktop Search */}
                    <form className="desktopSearch" onSubmit={(e) => {
                        e.preventDefault();
                        fetchData(searchInput.current.value);
                    }}>
                        <input ref={searchInput} type="text" placeholder="Search news..." />
                        <button className="searchButton" type="submit"><i className="fa-solid fa-search"></i></button>
                    </form>
                    {/* Desktop Navigation */}
                    <ul className="desktopNav">
                        <li onClick={() => fetchData("Latest")}>Latest</li>
                        <li onClick={() => fetchData("Stocks")}>Stocks</li>
                        <li onClick={() => fetchData("Economy")}>Economy</li>
                        <li onClick={() => fetchData("Real Estate")}>Real Estate</li>
                    </ul>
                </nav>

                {/* Mobile Menu Button
                <div className="menuBtn" onClick={() => setMenuOpen(!menuOpen)}>
                    <i className="fa-solid fa-bars"></i>
                </div>

                {/* Mobile Menu 
                <div className={`mobile ${menuOpen ? "open" : ""}`}>
                    <nav>
                        <ul>
                            <li onClick={() => fetchData("Latest")}>Latest</li>
                            <li onClick={() => fetchData("Stocks")}>Stocks</li>
                            <li onClick={() => fetchData("Economy")}>Economy</li>
                            <li onClick={() => fetchData("Real Estate")}>Real Estate</li>
                        </ul>
                    </nav>

                    {/* Mobile Search 
                    <div className="inputSearch">
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            fetchData(searchInput.current.value);
                        }}>
                            <input ref={searchInput} type="text" placeholder="Type to search..." />
                            <span><i className="fa-solid fa-search"></i></span>
                        </form>
                    </div>
                </div> */}
            </header>

            {/* Main News Content */}
            <main>
                {articles.length > 0 ? (
                    articles.map((article, index) => (
                        article.urlToImage && (
                            <div key={index} className="card">
                                <a href={article.url}>
                                    <img src={article.urlToImage} alt="News" loading="lazy" />
                                    <h4>{article.title}</h4>
                                    <div className="publishbyDate">
                                        <p>{article.source.name}</p>
                                        <span>•</span>
                                        <p>{new Date(article.publishedAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="desc">{article.description}</div>
                                </a>
                                <button onClick={() => addToFavorites(article.url, article.urlToImage, article.title, article.source.name, article.publishedAt, article.description)}>Add To Favorites</button>
                            </div>
                        )
                    ))
                ) : (
                    <p>No articles found.</p>
                )}
            </main>
        </div>
    );
}

export default Home;