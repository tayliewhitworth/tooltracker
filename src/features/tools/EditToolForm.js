import { useState, useEffect, useRef } from "react";
import { useUpdateToolMutation, useDeleteToolMutation } from "./toolsApiSlice";
import { useNavigate } from "react-router-dom";
import { FaSave, FaTrash } from "react-icons/fa";

import fileToBase64 from "../fileToBase64";

const EditToolForm = ({ tool }) => {
  const [updateTool, { isLoading, isSuccess, isError, error }] =
    useUpdateToolMutation();

  const [
    deleteTool,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteToolMutation();

  const navigate = useNavigate();

  const [toolname, setToolname] = useState(tool.toolname);
  const [toolimage, setToolimage] = useState(tool.toolimage);
  const [toolimageBase64, setToolimageBase64] = useState(tool.toolimage);
  const [checkedOut, setCheckedOut] = useState(tool.checkedOut);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setToolname("");
      setToolimage("");
      setToolimageBase64("");
      navigate("/dash/tools");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onToolnameChanged = (e) => setToolname(e.target.value);
  const onToolimageChanged = async (e) => {
    const file = e.target.files[0];
    const imagePath = URL.createObjectURL(file);
    setToolimage(imagePath);
    const base64 = await fileToBase64(file);
    setToolimageBase64(base64);
  };

  useEffect(() => {
    if (toolimage && fileInputRef) {
      fileInputRef.current.value = "";
    }
  }, [toolimage]);

  const onCheckedOutChanged = () => setCheckedOut((prev) => !prev);

  const canSave = [toolname, toolimageBase64].every(Boolean) && !isLoading;

  const onSaveToolClicked = async (e) => {
    if (canSave) {
      await updateTool({
        id: tool.id,
        toolname,
        toolimage: toolimageBase64,
        checkedOut,
      });
    }
  };

  const onDeleteToolClicked = async () => {
    await deleteTool({ id: tool.id });
  };

  const errClass = isError || isDelError ? "errmsg" : "offscreen";
  const validToolnameClass = !toolname ? "form_input--incomplete" : "";
  const validToolimageClass = !toolimageBase64 ? "form_input--incomplete" : "";

  const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form_title-row">
          <h2>Edit Tool</h2>
          <div className="form_action-btns">
            <button
              className="icon-btn"
              title="Save"
              disabled={!canSave}
              onClick={onSaveToolClicked}
            >
              <FaSave />
            </button>
            <button
              className="icon-btn"
              title="Delete"
              onClick={onDeleteToolClicked}
            >
              <FaTrash />
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
          <img
            className="form_input--image"
            src={toolimage}
            alt="file upload"
          />
        )}

        <label
          className="form_label form_checkbox-container"
          htmlFor="tool-checkedOut"
        >
          Tool Checked Out:
          <input
            className="form_checkbox"
            id="tool-checkedOut"
            name="tool-checkedOut"
            type="checkbox"
            checked={checkedOut}
            onChange={onCheckedOutChanged}
          />
        </label>
      </form>
    </>
  );

  return content;
};

export default EditToolForm;
