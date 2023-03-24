import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAddNewNoteMutation } from "./notesApiSlice";
import { FaSave } from "react-icons/fa";

import fileToBase64 from "../fileToBase64";

const NewNoteForm = ({ users, tools }) => {
  const [addNewNote, { isLoading, isSuccess, isError, error }] =
    useAddNewNoteMutation();

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [text, setText] = useState("");
  const [userId, setUserId] = useState(users[0].id); //possible delete [0] if when connected to backend it doesn't work
  const [toolId, setToolId] = useState(tools[0].id); //possible delete [0] if when connected to backend it doesn't work

  useEffect(() => {
    if (isSuccess) {
      setTitle("");
      setText("");
      setImage("");
      setImageBase64("");
      setUserId("");
      setToolId("");
      navigate("/dash/notes");
    }
  }, [isSuccess, navigate]);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onImageChanged = async (e) => {
    const file = e.target.files[0];
    const imagePath = URL.createObjectURL(file);
    setImage(imagePath);
    const base64 = await fileToBase64(file);
    setImageBase64(base64);
  }; // the value will be the string of the path of the image - use capture='user' to access camera
  const onTextChanged = (e) => setText(e.target.value);
  const onUserIdChanged = (e) => setUserId(e.target.value);
  const onToolIdChanged = (e) => setToolId(e.target.value);

  useEffect(() => {
    if (image && fileInputRef) {
      fileInputRef.current.value = "";
    }
  }, [image]);

  const canSave =
    [title, imageBase64, text, userId, toolId].every(Boolean) && !isLoading;

  const onSaveNoteClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewNote({ user: userId, title, image: imageBase64, text, tool: toolId });
    }
  };

  const userOptions = users.map((user) => {
    return (
      <option key={user.id} value={user.id}>
        {user.username}
      </option>
    );
  });

  const toolOptions = tools.map((tool) => {
    return (
      <option key={tool.id} value={tool.id}>
        {tool.toolname}
      </option>
    );
  });

  const errClass = isError ? "errmsg" : "offscreen";
  const validTitleClass = !title ? "form_input--incomplete" : "";
  const validImageClass = !imageBase64 ? "form_input--incomplete" : "";
  const validTextClass = !text ? "form_input--incomplete" : "";

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className="form" onSubmit={onSaveNoteClicked}>
        <div className="form_title-row">
          <h2>New Note</h2>
          <div className="form_action-btns">
            <button className="icon-btn" title="Save" disabled={!canSave}>
              <FaSave />
            </button>
          </div>
        </div>
        <label className="form_label" htmlFor="title">
          Title:
        </label>
        <input
          className={`form_input ${validTitleClass}`}
          id="title"
          name="title"
          type="text"
          autoComplete="off"
          value={title}
          onChange={onTitleChanged}
        />

        <label className="form_label" htmlFor="image">
          Image:
        </label>
        <input
          className={`form_input ${validImageClass}`}
          id="image"
          name="image"
          type="file"
          capture="user"
          accept="image/*"
          ref={fileInputRef}
          onChange={onImageChanged}
        />

        {imageBase64 && (<img className="form_input--image" src={imageBase64} alt="tool" />)}

        <label className="form_label" htmlFor="text">
          Text:
        </label>
        <textarea
          className={`form_input form_input--text ${validTextClass}`}
          id="text"
          name="text"
          value={text}
          onChange={onTextChanged}
        />

        <label
          className="form_label form_checkbox-container"
          htmlFor="username"
        >
          ASSIGNED TO:
        </label>
        <select
          id="username"
          name="username"
          className="form_select"
          value={userId}
          onChange={onUserIdChanged}
        >
          {userOptions}
        </select>

        <label
          className="form_label form_checkbox-container"
          htmlFor="toolname"
        >
          Tool:
        </label>
        <select
          id="toolname"
          name="toolname"
          className="form_select"
          value={toolId}
          onChange={onToolIdChanged}
        >
          {toolOptions}
        </select>
      </form>
    </>
  );

  return content;
};

export default NewNoteForm;
