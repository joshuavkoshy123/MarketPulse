import React, { useState, useEffect } from 'react';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../config/config';
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import './ProfileStyles.css';

const Profile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('***********'); // Set default password display
  const [articles, setArticles] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeSection, setActiveSection] = useState('articles');
  const navigate = useNavigate();

  // Fetch user info on initial render
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
    }

    // waits to confirm that the user is logged in
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setCurrentUser(currentUser);

      if (currentUser) {
        // get the document from the "users" collection for the currently logged in user
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
   
        if (userSnap.exists()) {
          // store the favorites from the user document
          const userData = userSnap.data();
          setFirstName(userData.firstName || '');
          setLastName(userData.lastName || '');
          setEmail(userData.email || '');
          
          const favorites = userData.favorites || [];
   
          const fetchedArticles = [];
          const fetchedStocks = [];
   
          // add favorites to stock array and article array based on their type
          favorites.forEach((item) => {
            if (item.type === "article") {
              fetchedArticles.push({ data: item });
            } else if (item.type === "stock") {
              fetchedStocks.push({ data: item });
            }
          });
   
          // pass articles and stocks to useState functions to assign the global articles and stocks arrays
          setArticles(fetchedArticles);
          setStocks(fetchedStocks);
        }
      }
    });
    
    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, []);

  function removeArticleFromFavorites(articleData) {
    if (!currentUser) return;
  
    // Remove from Firestore
    const userRef = doc(db, "users", currentUser.uid);
    updateDoc(userRef, {
      favorites: arrayRemove(articleData)
    });
  
    // Remove from state
    const updatedArticles = articles.filter((article) => {
      return article.data.url !== articleData.url;
    });
  
    setArticles(updatedArticles);
  }

  function removeStockFromFavorites(stockData) {
    if (!currentUser) return;
  
    // Remove from Firestore
    const userRef = doc(db, "users", currentUser.uid);
    updateDoc(userRef, {
      favorites: arrayRemove(stockData)
    });
  
    // Remove from state
    const updatedStocks = stocks.filter((stock) => {
      return stock.data.ticker !== stockData.ticker;
    });
  
    setStocks(updatedStocks);
  }


  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('userInfo');
      navigate('/login');
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };


  // display profile page elements
  return (
    <div className="profile-wrapper">
      <div className="profile-header-container">
        <h1 className="profile-title">Profile</h1>
        <div className="profile-actions">
          <button className="profile-btn logout-btn" onClick={handleLogout}>Log out</button>
        </div>
      </div>
      
      <hr className="profile-divider" />
      
      {/* Information Section */}
      <div className="section-header">
        <h2>Information</h2>
      </div>
      
      <div className="profile-info">
        <div className="info-row">
          <div className="info-label">First Name</div>
          <div className="info-value">{firstName}</div>
        </div>
        <div className="info-row">
          <div className="info-label">Last Name</div>
          <div className="info-value">{lastName}</div>
        </div>
        <div className="info-row">
          <div className="info-label">Email address</div>
          <div className="info-value">{email}</div>
        </div>
        <div className="info-row">
          <div className="info-label">Password</div>
          <div className="info-value">{password}</div>
        </div>
      </div>
      
      {/* Saved Section */}
      <div className="section-header">
        <h2>Saved</h2>
      </div>
      
      <div className="section-tabs">
        <div 
          className={`tab ${activeSection === 'articles' ? 'active' : ''}`} 
          onClick={() => setActiveSection('articles')}
        >
          Articles
        </div>
        <div className="tab-divider">|</div>
        <div 
          className={`tab ${activeSection === 'stocks' ? 'active' : ''}`}
          onClick={() => setActiveSection('stocks')}
        >
          Stocks
        </div>
      </div>
      
      {/* Articles Section */}
      {activeSection === 'articles' && (
        <div className="content-list">
          {articles.length > 0 ? (
            articles.map((article, index) => (
              article.data.urlToImage && (
                <div key={index} className="article-item">
                  <div className="article-content">
                    <h3 className="article-title">{article.data.title || "Turning Vision Into Reality: Developing a CIO Strategy"}</h3>
                    <div className="article-meta">
                      {article.data.source || 'Forbes'} | {new Date(article.data.publishedAt || '2025-04-02').toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    className="remove-favorite-btn"
                    onClick={() => removeArticleFromFavorites(article.data)}
                  >
                    Remove From Favorites
                  </button>
                </div>
              )
            ))
          ) : (
            <div className="empty-state">
              <p>No articles found.</p>
            </div>
          )}
        </div>
      )}
      
      {/* Stocks Section */}
      {activeSection === 'stocks' && (
        <div className="content-list">
          {stocks.length > 0 ? (
            stocks.map(({ data }, index) => (
              <div key={index} className="stock-item">
                <div className="stock-content">
                  <div className="stock-symbol">{data.ticker || 'AA'}</div>
                  <div className="stock-data">
                    <span className="stock-change">$-3.51 (-11.38%)</span> <span className="stock-price">$27.33</span>
                  </div>
                </div>
                <button
                  className="remove-favorite-btn"
                  onClick={() => removeStockFromFavorites(data)}
                >
                  Remove From Favorites
                </button>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No stocks found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
