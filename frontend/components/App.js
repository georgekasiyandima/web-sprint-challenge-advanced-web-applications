import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

const initialFormValues = { title: '', text: '', topic: '' };

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [currentArticle, setCurrentArticle] = useState(null)
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate();
  const redirectToLogin = () => {
    navigate('/');
  };
  const redirectToArticles = () => {
    navigate('/articles');
  }

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    localStorage.removeItem('token');
    setMessage('Goodbye!');
    redirectToLogin();
  }

  const login = ({ username, password }) => {
    
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    setMessage('');
    setSpinnerOn(true);

    fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
      localStorage.setItem('token', data.token);
      setMessage(data.message);
      setSpinnerOn(false);
      getArticles();
      redirectToArticles();
    })
    .catch(error => {
      setMessage('An error occurred while logging in.');
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
    setMessage('');
    setSpinnerOn(true);

    fetch(articlesUrl, {
      headers: {
        Authorization: `${localStorage.getItem('token')}`,
      },
    })
    .then(response => {
      if (response.status === 401) {
        setMessage('Token has expired. Please log in again.');
        redirectToLogin();
      }else {
        return response.json();
      }
    })
    .then(data => {
      console.log(data);
      setArticles(data.articles);
      setMessage(data.message);
      setSpinnerOn(false);
    })
    .catch(error => {
      setMessage('An error occurred while fetching articles.');
      setSpinnerOn(false)
      console.error(error);
    })
  }

  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    setMessage('');
   
    setSpinnerOn(true);

    fetch(articlesUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${localStorage.getItem('token')}`,

      },
      body: JSON.stringify(article),
    })
    .then(response => response.json())
    .then(data => {
      setArticles(prevArticles => [...prevArticles, data.article]);
      setCurrentArticle(data.article);
      setMessage(data.message);
      setSpinnerOn(false);
      setCurrentArticle(null);
      
    })
    .catch(error => {
      setMessage('An error occurred while posting the article.');
      setSpinnerOn(false);
      console.error(error);
    });
  };

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!
    setMessage('');
    setSpinnerOn(true);

    fetch(`${articlesUrl}/${article_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(article),
    })
    .then(response => response.json())
    .then(data => {
      setArticles(prevArticles => prevArticles.map(prevArticle => prevArticle.id === article_id ? data : prevArticle)
      );
      setMessage('Article updated successfully.');
      setSpinnerOn(false);
    })
    .catch(error => {
      setMessage('An error occurred while updating the article.');
      setSpinnerOn(false);
      console.error(error);
    })
  }

  const deleteArticle = article_id => {
    // ✨ implement
    setMessage('');
    setSpinnerOn(true);

    fetch(`${articlesUrl}/${article_id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `${localStorage.getItem('token')}`,
      },
    })
    .then(response => {
      if (response.status === 204) {
        setArticles(prevArticles => prevArticles.filter(prevArticle => prevArticle.id !== article_id)
        );
        setMessage('Article deleted successfully.');
      } else if (response.status === 401) {
        setMessage('Token has expired. Please log in again.');
        redirectToLogin();
      } else {
        throw new Error('Failed to delete article.');
      }
    })
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner spinnerOn= {spinnerOn} />
      <Message message= {message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm currentArticle={currentArticle} onSubmitArticle={postArticle} updateArticle={updateArticle} />
              <Articles articles={articles} deleteArticle={deleteArticle} />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
