import '../App.css';
import './styles.css';


import { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { signOut } from 'firebase/auth';
import { auth, db } from '../config/config';
import { doc, getDoc, getFirestore, collection, onSnapshot, updateDoc, arrayRemove } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import StockRow from '../components/StockRow.js';
import StockChart from '../components/StockChart.js';
import { onAuthStateChanged } from "firebase/auth";


function Profile() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [articles, setArticles] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [saved, setSaved] = useState(false);
  const [saveArticleButtonText, setArticleSaveButtonText] = useState("Remove from Favorites");
  const [saveArticleButtonStyle, setArticleSaveButtonStyle] = useState({
    backgroundColor: "red",
    color: "white",
    padding: "10px",
  });
  const [currentUser, setCurrentUser] = useState(null);


  const navigate = useNavigate();

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

  // Fetch user info on initial render (from localStorage or API)
  // Runs anytime data changes
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (user) {
      setUserInfo(user);
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
    }


  // waits to confirm that the user is logged in
  onAuthStateChanged(auth, async (currentUser) => {
    // checks if user is logged in

    setCurrentUser(currentUser);

    if (currentUser) {
      // get the document from the "users" collection for the currently logged in user
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
 
      // check if document exists for the user
      if (userSnap.exists()) {
        // store the favorites from the user document
        const userData = userSnap.data();
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
 
        console.log("Articles:", fetchedArticles);
        console.log("Stocks:", fetchedStocks);
      } else {
        // no favorites for the current user
        console.log("No user data found.");
      }
    } else {
      // user is not logged in
      console.log("User not logged in.");
    }
  });
}, []);


  // Handle form submission
  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
    } else {
      // Update profile logic (you can send this to the server or update locally)
      const updatedUser = { firstName, lastName, email, password };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      setUserInfo(updatedUser);
      alert("Profile Updated Successfully!");
    }
  };


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
    <div className="profileScreen">
      <h2>Information</h2>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="firstName" className="mb-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled
          />
        </Form.Group>


        <Form.Group controlId="lastName" className="mb-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled
          />
        </Form.Group>


        <Form.Group controlId="Email" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="Email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled
          />
        </Form.Group>
      </Form>


      <Button variant="danger" onClick={handleLogout} className="mt-3">
        Logout
      </Button>
      <h2>Saved</h2>
      <h3>Stocks</h3>
      <div className="saved-stocks-list">
        <ul className="list-group list-group-flush">
          {stocks?.map(({ data }) => (
          <div key={data.ticker}>
            <StockRow ticker={data.ticker} name={data.name} />
            <button
              className="favorites-btn"
              onClick={(e) => {
                e.stopPropagation();
                removeStockFromFavorites(data);
              }}
            >
              Remove From Favorites
            </button>
          </div>))}
        </ul>
      </div>
      <h3>Articles</h3>
      <div className="article-grid">
        {articles.length > 0 ? (
          articles.map((article, index) => (
            article.data.urlToImage && (
              <div key={index} className="article-card">
                  <div className="article-image">
                    <a href={article.data.url} target="_blank" rel="noopener noreferrer">
                      <img src={article.data.urlToImage} alt={article.data.title} loading="lazy" />
                    </a>
                  </div>
                  <div className="article-content">
                  <a href={article.data.url} target="_blank" rel="noopener noreferrer">
                    <h3 className="article-title">{article.data.title}</h3>
                  </a>
                  <div className="article-meta">
                    <span className="article-source">{article.data.source}</span>
                    <span className="meta-divider">|</span>
                    <span className="article-date">{new Date(article.data.publishedAt).toLocaleDateString()}</span>
                  </div>
                    <p className="article-description">{article.data.description}</p>
                  <div className="article-actions">
                    <a href={article.data.url} className="read-more" target="_blank" rel="noopener noreferrer">
                      Read More
                    </a>
                    <button
                      className="favorite-button"
                      style={{ backgroundColor: "red", color: "white", padding: "10px" }}
                      onClick={() => removeArticleFromFavorites(article.data)}
                      >
                        Remove From Favorites
                    </button>
                  </div>
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


export default Profile;



