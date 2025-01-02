import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "./Capstone";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { X } from "lucide-react";
import { UserContext } from "../App";

export default function Navbar() {
  const { currentUser, setCurrentUser, isDriver, setIsDriver } = useContext(UserContext);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const navigate = useNavigate();

  const handleClose = () => setShowLoginModal(false);
  const handleShow = () => setShowLoginModal(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      const user = auth.currentUser;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setIsDriver(false); // Normal user login
        setCurrentUser(user);
      } else {
        const driverDoc = await getDoc(doc(db, "drivers", user.uid));
        if (driverDoc.exists()) {
          setIsDriver(true); // Driver login
          setCurrentUser(null); // No name for drivers in navbar
        }
      }

      alert("Login Successful");
      handleClose();
      navigate(isDriver ? "/drive" : "/ride");
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setCurrentUser(null);
      setIsDriver(false);
      navigate("/ride");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg fixed-top navbar-dark bg-dark">
        <Link
          className="navbar-brand"
          to="/"
          style={{ fontFamily: "'Dancing Script', cursive", fontSize: "28px" }}
        >
          VoyageKavach
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item active">
              <Link className="nav-link" to="/ride">Ride</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/drive">Drive</Link>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownMenuLink"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                About
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <Link className="dropdown-item" to="/about">About Us</Link>
                <Link className="dropdown-item" to="/blog">Blog</Link>
                <Link className="dropdown-item" to="/careers">Careers</Link>
              </div>
            </li>
          </ul>
        </div>

        <div className="d-flex justify-content-end">
          {currentUser && !isDriver ? (
            <>
              <span className="navbar-text text-white me-3">
                Welcome, {currentUser.email}
              </span>
              <button className="btn btn-light" onClick={handleSignOut}>Sign Out</button>
            </>
          ) : (
            <>
              <button type="button" className="btn btn-primary" onClick={handleShow}>Login</button>
              <Link to="/signup" className="btn btn-light ms-2">Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      {showLoginModal && (
        <>
          <div className="modal-backdrop" style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(255, 255, 255, 0.7)", zIndex: 1 }}></div>
          <div className="modal fade show" style={{ display: "block", borderRadius: "25px" }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{ borderRadius: "25px" }}>
                <div className="modal-header">
                  <h5 className="modal-title">Login</h5>
                  <button type="button" className="close" onClick={handleClose}>
                    <X />
                  </button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" className="form-control" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Password</label>
                      <input type="password" className="form-control" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
                      <button type="submit" className="btn btn-primary">Login</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
