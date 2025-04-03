import { useEffect, useState, useRef } from "react";
import './styles.css';

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
                        <button type="submit"><i className="fa-solid fa-search"></i></button>
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