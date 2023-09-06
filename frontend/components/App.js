import React, { useState } from "react";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import Articles from "./Articles";
import LoginForm from "./LoginForm";
import Message from "./Message";
import ArticleForm from "./ArticleForm";
import Spinner from "./Spinner";
import axios from "axios";

const articlesUrl = "http://localhost:9000/api/articles";
const loginUrl = "http://localhost:9000/api/login";

const initialFormValues = { title: "", text: "", topic: "" };

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState("");
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState();
  const [currentArticle, setCurrentArticle] = useState(null);
  const [spinnerOn, setSpinnerOn] = useState(false);

  // ✨ Research `useNavigate` in React Router v.6
  const updateCurrentArticle = (article_id) => {
      setCurrentArticleId(article_id);
      const article = articles.filter(a => a.article_id == article_id)
      setCurrentArticle(article[0])
  }

  const navigate = useNavigate();
  const redirectToLogin = () => {
    navigate("/");
  };
  const redirectToArticles = () => {
    navigate("/articles");
  };

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    localStorage.removeItem("token");
    setMessage("Goodbye!");
    redirectToLogin();
  };

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    setMessage("");
    setSpinnerOn(true);

    fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem("token", data.token);
        setMessage(data.message);
        setSpinnerOn(false);
        getArticles();
        redirectToArticles();
      })
      .catch((error) => {
        setMessage("An error occurred while logging in.");
        setSpinnerOn(false);
        console.error(error);
      });
  };

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    setMessage("");
    setSpinnerOn(true);

    fetch(articlesUrl, {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.status === 401) {
          setMessage("Token has expired. Please log in again.");
          redirectToLogin();
        } else {
          return response.json();
        }
      })
      .then((data) => {
        setArticles(data.articles);
        setMessage(data.message);
        setSpinnerOn(false);
      })
      .catch((error) => {
        setMessage("An error occurred while fetching articles.");
        setSpinnerOn(false);
        console.error(error);
      });
  };

  const postArticle = (article) => {
    setMessage("");
    setSpinnerOn(true);

    fetch(articlesUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(article),
    })
      .then((response) => {
        if (response.status === 401) {
          setMessage("Token has expired. Please log in again.");
          redirectToLogin();
        } else if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to post article.");
        }
      })
      .then((data) => {
        setArticles((prevArticles) => [...prevArticles, data.article]);
        setCurrentArticle(null);
        setMessage(data.message);
        setSpinnerOn(false);
      })
      .catch((error) => {
        setMessage("An error occurred while posting the article.");
        setSpinnerOn(false);
        console.error(error);
      });
  };

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!
    setMessage("");
    setSpinnerOn(true);

      axios
       .put(`${articlesUrl}/${article_id}`, article, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${localStorage.getItem("token")}`,
        },
       })
       .then((response) => {
        if (response.status === 401) {
          setMessage("Token has expired. Please log in again.");
          redirectToLogin();
        } else if (response.status === 200) {
          const data = response.data;
          console.log(data.article);
          console.log(articles);
          setArticles((prevArticle) => 
            prevArticle.map((prevArticle) =>
               prevArticle.article_id === article_id ? data.article : prevArticle
               )
               );
               setCurrentArticle(null);
               setMessage(data.message);
               setSpinnerOn(false);
        } 
       })
       .catch((error) => {
         setMessage('');
         setSpinnerOn(false);
         console.error(error);
       });
  };

  const deleteArticle = (article_id) => {
    setMessage("");
    setSpinnerOn(true);

    fetch(`${articlesUrl}/${article_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          // If the response status is in the range 200-299
          return response.json(); // Parse the response body as JSON
        } else if (response.status === 401) {
          setMessage("Token has expired. Please log in again.");
          redirectToLogin();
        } else {
          throw new Error("Failed to delete article.");
        }
      })
      .then((data) => {
        console.log(data); // Access the response data
        setArticles((prevArticles) =>
          prevArticles.filter(
            (prevArticle) => prevArticle.article_id !== article_id
          )
        );
        setMessage(data.message); // Use the response data
        setSpinnerOn(false);
      })
      .catch((error) => {
        console.error(error);
        // Handle the error, display an error message, etc.
      });
  };

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner spinnerOn={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>
        Logout from app
      </button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
        {" "}
        {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">
            Login
          </NavLink>
          <NavLink id="articlesScreen" to="/articles">
            Articles
          </NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route
            path="articles"
            element={
              <>
                <ArticleForm
                  currentArticle={currentArticle}
                  onSubmitArticle={postArticle}
                  updateArticle={updateArticle}
                />
                <Articles
                  articles={articles}
                  deleteArticle={deleteArticle}
                  updateCurrentArticle={updateCurrentArticle}
                  currentArticle={currentArticle}
                />
              </>
            }
          />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  );
}
