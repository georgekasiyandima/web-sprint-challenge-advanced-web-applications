import React, { useEffect, useState } from 'react';
import PT from 'prop-types';

const initialFormValues = { title: '', text: '', topic: '' };

export default function ArticleForm({ currentArticle, onSubmitArticle, onCancelEdit,updateArticle }) {
  const [values, setValues] = useState(initialFormValues);

  useEffect(() => {
    if (currentArticle) {
      setValues({
        title: currentArticle.title,
        text: currentArticle.text,
        topic: currentArticle.topic,
      });
    } else {
      setValues(initialFormValues);
    }
  }, [currentArticle]);

  const onChange = (evt) => {
    const { id, value } = evt.target;
    setValues({ ...values, [id]: value });
  };

  const onSubmit = (evt) => {
    console.log(currentArticle);
    evt.preventDefault();
    if (currentArticle) {
      updateArticle({article_id: currentArticle.article_id, article:values})
    }else {
      onSubmitArticle(values);
    }
    console.log(values);
    setValues(initialFormValues);
  };

  const isDisabled = () => {
    return Object.values(values).some((value) => value === '');
  };

  return (
    <form id="form" onSubmit={onSubmit}>
      <h2>{currentArticle ? 'Edit Article' : 'Create Article'}</h2>
      <input maxLength={50} onChange={onChange} value={values.title} placeholder="Enter title" id="title" />
      <textarea maxLength={200} onChange={onChange} value={values.text} placeholder="Enter text" id="text" />
      <select onChange={onChange} id="topic" value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
        <button disabled={isDisabled()} id="submitArticle" type="submit">
          Submit
        </button>
        <button onClick={onCancelEdit}>Cancel edit</button>
      </div>
    </form>
  );
}

ArticleForm.propTypes = {
  currentArticle: PT.shape({
    title: PT.string,
    text: PT.string,
    topic: PT.string,
  }),
  onSubmitArticle: PT.func.isRequired,
  onCancelEdit: PT.func.isRequired,
};

// 🔥 No touchy: LoginForm expects the following props exactly:
ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({ // can be null or undefined, meaning "create" mode (as opposed to "update")
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })
}
