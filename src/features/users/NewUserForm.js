import React, { useState, useEffect } from "react";
import { useAddNewUsersMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../../config/roles";
import { FaSave } from "react-icons/fa";


const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const NewUserForm = () => {
  const [addNewUser, { isLoading, isSuccess, isError, error }] =
    useAddNewUsersMutation();

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [roles, setRoles] = useState(["Employee"]);

  // check validation of username and password
  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);

  // check isSuccess is successful and empty all the states to create new user
  useEffect(() => {
    if (isSuccess) {
      setUsername("");
      setPassword("");
      setRoles([]);
      navigate("/dash/users");
    }
  }, [isSuccess, navigate]);

  // handlers for onChange events
  const onUsernameChanged = (e) => setUsername(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);

  // selecting more than one role from options
  const onRolesChanged = (e) => {
    const values = Array.from(
      e.target.selectedOptions, //HTML collection
      (option) => option.value
    );
    setRoles(values);
  };

  // can save form if all values are true and will change isLoading to false
  const canSave =
    [roles.length, validUsername, validPassword].every(Boolean) && !isLoading;

  // handle saved button clicked
  const onSaveUserClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewUser({ username, password, roles });
    }
  };

  // options for selecting roles
  const options = Object.values(ROLES).map((role) => {
    return (
      <option key={role} value={role}>
        {role}
      </option>
    );
  });

  // classes that will be applies based on boolean value
  const errClass = isError ? "errmsg" : "offscreen";
  const validUserClass = !validUsername ? "form_input--incomplete" : "";
  const validPwdClass = !validPassword ? "form_input--incomplete" : "";
  const validRolesClass = !Boolean(roles.length)
    ? "form_input--incomplete"
    : "";


  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className="form" onSubmit={onSaveUserClicked}>
        <div className="form_title-row">
          <h2>New User</h2>
          <div className="form_action-btns">
            <button className="icon-btn" title="Save" disabled={!canSave}>
              <FaSave />
            </button>
          </div>
        </div>
        <label className="form_label" htmlFor="username">
          Username: [3-20 letters]
        </label>
        <input 
          className={`form_input ${validUserClass}`}
          id="username"
          name="username"
          type="text"
          autoComplete="off"
          value={username}
          onChange={onUsernameChanged}
        />
        <label className="form_label" htmlFor="password">
          Password: [4-12 chars incl. !@#$%]
        </label>
        <input 
          className={`form_input ${validPwdClass}`}
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={onPasswordChanged}
        />
        <label className="form_label" htmlFor="roles">
          ASSIGNED ROLES:
        </label>
        <select
          id="roles"
          name="roles"
          className={`form_select ${validRolesClass}`}
          multiple={true}
          size="3"
          value={roles}
          onChange={onRolesChanged}
        >
          {options}
        </select>
      </form>
    </>
  )

  

  return content
};

export default NewUserForm;
