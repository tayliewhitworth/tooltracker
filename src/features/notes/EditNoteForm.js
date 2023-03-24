import { useState, useEffect, useRef } from "react";
import { useUpdateNoteMutation, useDeleteNoteMutation } from "./notesApiSlice";
import { useNavigate } from "react-router-dom";
import { FaSave, FaTrash } from "react-icons/fa";

import useAuth from '../../hooks/useAuth'

import fileToBase64 from "../fileToBase64";

const EditNoteForm = ({ note, users, tools }) => {
  const { isManager, isAdmin } = useAuth();

  const [updateNote, { isLoading, isSuccess, isError, error }] =
    useUpdateNoteMutation();
  const [
    deleteNote,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteNoteMutation();

  const navigate = useNavigate();

  const [title, setTitle] = useState(note.title);
  const [image, setImage] = useState(note.image);
  const [imageBase64, setImageBase64] = useState(note.image);
  const [text, setText] = useState(note.text);
  const [checkedOut, setCheckedOut] = useState(note.checkedOut);
  const [userId, setUserId] = useState(note.user);
  const [toolId, setToolId] = useState(note.tool);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setTitle("");
      setImage("");
      setImageBase64("");
      setText("");
      setUserId("");
      setToolId("");
      navigate("/dash/notes");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onImageChanged = async (e) => {
    const file = e.target.files[0];
    const imagePath = URL.createObjectURL(file);
    setImage(imagePath);
    const base64 = await fileToBase64(file);
    setImageBase64(base64);
  };
  const onTextChanged = (e) => setText(e.target.value);
  const onCheckedOutChanged = (e) => setCheckedOut((prev) => !prev);
  const onUserIdChanged = (e) => setUserId(e.target.value);
  const onToolIdChanged = (e) => setToolId(e.target.value);

  console.log(checkedOut);

  useEffect(() => {
    if (image && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [image]);

  const canSave =
    [title, imageBase64, text, userId, toolId].every(Boolean) && !isLoading;

  const onSaveNoteClicked = async (e) => {
    if (canSave) {
      await updateNote({
        id: note.id,
        user: userId,
        title,
        image: imageBase64,
        text,
        checkedOut,
        tool: toolId,
      });
    }
  };

  const onDeleteNoteClicked = async () => {
    await deleteNote({ id: note.id });
  };

  const created = new Date(note.createdAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  const updated = new Date(note.updatedAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

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

  const errClass = isError || isDelError ? "errmsg" : "offscreen";
  const validTitleClass = !title ? "form_input--incomplete" : "";
  const validImageClass = !imageBase64 ? "form_input--incomplete" : "";
  const validTextClass = !text ? "form_input--incomplete" : "";

  const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

  let deletButton;
  if (isManager || isAdmin) {
    deletButton = (
      <button
        className="icon-btn"
        title="Delete"
        onClick={onDeleteNoteClicked}
      >
        <FaTrash />
      </button>
    )
  }

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form_title-row">
          <h2>Edit Note</h2>
          <div className="form_action-btns">
            <button
              className="icon-btn"
              title="Save"
              onClick={onSaveNoteClicked}
              disabled={!canSave}
            >
              <FaSave />
            </button>
            {/* <button
              className="icon-btn"
              title="Delete"
              onClick={onDeleteNoteClicked}
            >
              <FaTrash />
            </button> */}
            {deletButton}
          </div>
        </div>
        <label className="form_label" htmlFor="note-title">
          Title:
        </label>
        <input
          className={`form_input ${validTitleClass}`}
          id="note-title"
          name="title"
          type="text"
          autoComplete="off"
          value={title}
          onChange={onTitleChanged}
        />

        <label className="form_label" htmlFor="note-image">
          Image:
        </label>
        <input
          className={`form_input ${validImageClass}`}
          id="note-image"
          name="image"
          type="file"
          capture="user"
          accept="image/*"
          ref={fileInputRef}
          onChange={onImageChanged}
        />
        {imageBase64 && (
          <img className="form_input--image" src={image} alt="Uploaded file" />
        )}

        <label className="form_label" htmlFor="note-text">
          Text:
        </label>
        <textarea
          className={`form_input form_input--text ${validTextClass}`}
          id="note-text"
          name="text"
          value={text}
          onChange={onTextChanged}
        />
        <div className="form_row">
          <div className="form_divider">
            <label
              className="form_label form_checkbox-container"
              htmlFor="note-username"
            >
              ASSIGNED TO:
            </label>
            <select
              id="note-username"
              name="username"
              className="form_select"
              value={userId}
              onChange={onUserIdChanged}
            >
              {userOptions}
            </select>

            <label
              className="form_label form_checkbox-container"
              htmlFor="note-checkedOut"
            >
              TOOL CHECKED OUT:
              <input
                className="form_checkbox"
                id="note-checkedOut"
                name="checkedOut"
                type="checkbox"
                checked={checkedOut}
                onChange={onCheckedOutChanged}
              />
            </label>

            <label
              className="form_label form_checkbox-container"
              htmlFor="note-toolname"
            >
              Tool:
            </label>
            <select
              id="note-toolname"
              name="toolname"
              className="form_select"
              value={toolId}
              onChange={onToolIdChanged}
            >
              {toolOptions}
            </select>
          </div>
          <div className="form_divider">
            <p className="form_created">
              Created:
              <br />
              {created}
            </p>
            <p className="form_updated">
              Updated:
              <br />
              {updated}
            </p>
          </div>
        </div>
      </form>
    </>
  );

  return content;
};

export default EditNoteForm;
