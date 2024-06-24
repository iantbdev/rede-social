import React, { useState, useContext , useEffect} from 'react';
import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import axios from "axios";

const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser, logout } = useContext(AuthContext);
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8800/api/auth/logout");
      logout();
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleSearch = async (e) => {
    const searchTerm = e.target.value;
    try {
      const response = await axios.get(`http://localhost:8800/api/users/findByName?name=${searchTerm}`);
      console.log(response.data);
      setSearchResults(response.data);
      setShowDropdown(true);
    } catch (err) {
      console.error("Search failed", err);
      setShowDropdown(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest("#searchInput") && !event.target.closest(".dropdown-content")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>E C H O </span>
        </Link>

        <Link to="/" className="homeIcon">
          <HomeOutlinedIcon />
        </Link>

        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )}
        <GridViewOutlinedIcon />
        <div className="searchContainer">
          <div className="search">
            <SearchOutlinedIcon />
            <input
            type="text"
            id="searchInput"
            onKeyDown={handleKeyDown}
            onChange={handleSearch}
          />
          </div>
        </div>
        <div className={`results ${showDropdown ? 'show-dropdown' : ''}`}>
            <ul className="dropdown-content"> 
              {searchResults.map((result, index) => (
                <li key={index} className="dropdown-item">
                <Link to={`/profile/${result.id}`} key={index} className="dropdown-item">
                  <img src={result.profilePic || "https://cdn-icons-png.flaticon.com/256/5987/5987811.png"} alt="Icon" style={{ width: '24px', height: '24px' }} className="dropdown-profile-pic" />
                  <span>{result.username}</span>
                </Link>
                </li>
              ))}
            </ul>  
        </div>
      </div>
      <div className="right"> 
        <PersonOutlinedIcon />
        <EmailOutlinedIcon />
        <NotificationsOutlinedIcon />
        <div className="user">
          <img src={currentUser.profilePic} alt="" />
        </div>
        <LogoutOutlinedIcon
          onClick={handleLogout}
          style={{ cursor: "pointer" }}
        ></LogoutOutlinedIcon>
      </div>
    </div>
  );
};

export default Navbar;
