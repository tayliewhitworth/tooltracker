import React, { useState, useEffect, useRef } from "react";
import { useAddNewToolMutation } from "./toolsApiSlice";
import { useNavigate } from "react-router-dom";
import { FaSave } from "react-icons/fa";
import fileToBase64 from "../fileToBase64";


const NewToolForm = () => {
  const [addNewTool, { isLoading, isSuccess, isError, error }] =
    useAddNewToolMutation();

  const navigate = useNavigate();

  const [toolname, setToolname] = useState("");
  const [toolimage, setToolimage] = useState("");
  const [toolimageBase64, setToolimageBase64] = useState("");

  useEffect(() => {
    if (isSuccess) {
      setToolname("");
      setToolimage("");
      setToolimageBase64("");
      navigate("/dash/tools");
    }
  }, [isSuccess, navigate]);

  const onToolnameChanged = (e) => setToolname(e.target.value);
  const onToolimageChanged = async (e) => {
    const file = e.target.files[0];
    const imagePath = URL.createObjectURL(file);
    setToolimage(imagePath);
    const base64 = await fileToBase64(file);
    setToolimageBase64(base64);
  };

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (toolimage && fileInputRef) {
      fileInputRef.current.value = "";
    }
  }, [toolimage]);

  const canSave = [toolname, toolimageBase64].every(Boolean) && !isLoading;

  const onSaveToolClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewTool({ toolname, toolimage: toolimageBase64 });
    }
  };

  const errClass = isError ? "errmsg" : "offscreen";
  const validToolnameClass = !toolname ? "form_input--incomplete" : "";
  const validToolimageClass = !toolimageBase64 ? "form_input--incomplete" : "";

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className="form" onSubmit={onSaveToolClicked}>
        <div className="form_title-row">
          <h2>New Tool</h2>
          <div className="form_action-btns">
            <button className="icon-btn" title="Save" disabled={!canSave}>
              <FaSave />
            </button>
          </div>
        </div>
        <label className="form_label" htmlFor="toolname">
          Tool Name:
        </label>
        <input
          className={`form_input ${validToolnameClass}`}
          id="toolname"
          name="toolname"
          type="text"
          autoComplete="off"
          value={toolname}
          onChange={onToolnameChanged}
        />

        <label className="form_label" htmlFor="toolimage">
          Image:
        </label>
        <input
          className={`form_input ${validToolimageClass}`}
          id="toolimage"
          name="toolimage"
          type="file"
          capture="user"
          accept="image/*"
          ref={fileInputRef}
          onChange={onToolimageChanged}
        />
        {toolimageBase64 && (
          <img className="form_input--image" src={toolimageBase64} alt="" />
        )}
      </form>
    </>
  );

  return content;
};

export default NewToolForm;
