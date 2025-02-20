import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import PT from "prop-types";
import ArticleForm from "./ArticleForm";

export default function Articles({ articles, deleteArticle, currentArticle, updateCurrentArticle }) {
  

  useEffect(() => {
    console.log(articles);
  }, []);

  if (!localStorage.getItem("token")) {
    return <Navigate to="/" />;
  }

  const handleEditClick = (article) => {
    updateCurrentArticle(article.article_id);
  
    
  };

  const handleCancelEdit = () => {
    updateCurrentArticle(null);
    
  };


  return (
    <div className="articles">
      <h2>Articles</h2>
      {articles.length === 0 ? ('')
       : (
        articles.map((art) => (
          <div className="article" key={art.article_id}>
            <div>
              <h3>{art.title}</h3>
              <p>{art.text}</p>
              <p>Topic: {art.topic}</p>
            </div>
            <div>
              <button
                disabled={currentArticle}
                onClick={() => handleEditClick(art)}
              >
                Edit
              </button>
              <button onClick={() => deleteArticle(art.article_id)}>
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

Articles.propTypes = {
  articles: PT.array.isRequired,
  deleteArticle: PT.func.isRequired,
};

// 🔥 No touchy: Articles expects the following props exactly:
Articles.propTypes = {
  articles: PT.arrayOf(
    PT.shape({
      // the array can be empty
      article_id: PT.number.isRequired,
      title: PT.string.isRequired,
      text: PT.string.isRequired,
      topic: PT.string.isRequired,
    })
  ).isRequired,
  getArticles: PT.func.isRequired,
  deleteArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticleId: PT.number, // can be undefined or null
};
