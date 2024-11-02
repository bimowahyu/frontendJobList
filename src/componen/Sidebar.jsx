import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoPerson, IoPricetag, IoHome, IoLogOut } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, reset } from "../fitur/AuthSlice";
import './navside.css'

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const logout = () => {
    dispatch(LogOut());
    dispatch(reset());
    navigate("/");
  };

  return (
    <aside className="menu p-3 has-shadow sidebar">
  <p className="menu-label">General</p>
  <ul className="menu-list">
  {user && user.role === "admin" &&(
    <>
    <li>
      <NavLink to="/dashboardadmin" className="is-flex align-items-center">
        <IoHome className="icon" /> Dashboard Admin
      </NavLink>
    </li>
     <li>
     <NavLink to="/job" className="is-flex align-items-center">
       <IoPricetag className="icon" /> Export Job 
     </NavLink>
   </li>
   </>
)}
       {user && user.role === "user" &&(
    <li>
      <NavLink to="/dashboard" className="is-flex align-items-center">
        <IoHome className="icon" /> Dashboard User
      </NavLink>
    </li>
)}

    <li>
      <NavLink to="/data" className="is-flex align-items-center">
        <IoPricetag className="icon" /> Data
      </NavLink>
    </li>
  </ul>
  {user && user.role === "admin" && (
    <div>
      <p className="menu-label">Admin</p>
      <ul className="menu-list">
        <li>
          <NavLink to="/users" className="is-flex align-items-center">
            <IoPerson className="icon" /> Users
          </NavLink>
        </li>

      </ul>
    </div>
  )}
  <p className="menu-label">Settings</p>
  <ul className="menu-list">
    <li>
      <button onClick={logout} className="button is-white is-flex align-items-center">
        <IoLogOut className="icon" /> Logout
      </button>
    </li>
  </ul>
</aside>

  );
};

export default Sidebar;
