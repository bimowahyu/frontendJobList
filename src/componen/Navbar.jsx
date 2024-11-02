import React, { useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { reset, LogOut } from '../fitur/AuthSlice';
import { IoPerson, IoPricetag, IoHome, IoLogOut } from "react-icons/io5";
import './navside.css';

export const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [isActive, setIsActive] = useState(false); // Untuk mengatur burger menu di tampilan mobile

    const logout = () => {
        dispatch(LogOut());
        dispatch(reset());
        navigate("/");
    };

    const toggleSidebar = () => {
        setIsActive(!isActive);
    };

    return (
        <nav className="navbar is-fixed-top has-shadow" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <NavLink to="/dashboard" className="navbar-item">
                    <strong>My App</strong>
                </NavLink>
                <button
                    onClick={toggleSidebar}
                    className={`navbar-burger burger ${isActive ? 'is-active' : ''}`}
                    aria-label="menu"
                    aria-expanded="false"
                >
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </button>
            </div>
            
            {/* Overlay untuk Sidebar */}
            <div className={`overlay ${isActive ? 'is-active' : ''}`} onClick={toggleSidebar}></div>
              
            {/* Sidebar yang akan muncul di tampilan mobile */}
            <div className={`sidebar-mobile ${isActive ? 'is-active' : ''}`}>
                <aside className="menu p-3 has-shadow sidebar">
                    <p className="menu-label">General</p>
                    <ul className="menu-list">
                    {user && user.role === "admin" &&(
    <li>
      <NavLink to="/dashboardadmin" className="is-flex align-items-center">
        <IoHome className="icon" /> Dashboard Admin
      </NavLink>
    </li>
)}
       {user && user.role === "user" &&(
    <li>
      <NavLink to="/dashboard" className="is-flex align-items-center">
        <IoHome className="icon" /> Dashboard User
      </NavLink>
    </li>
)}
                        <li>
                            <NavLink to="/job" className="is-flex align-items-center">
                                <IoPricetag className="icon" /> Job List
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
            </div>
        </nav>
    );
};
