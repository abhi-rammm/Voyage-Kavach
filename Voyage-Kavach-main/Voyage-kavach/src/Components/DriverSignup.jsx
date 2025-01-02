import React, { useState } from "react";
import { auth, db } from "./Capstone";
import {createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    city: "",
    vehicletype: "",
    password: "",
    termsAgreed: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const navigate = useNavigate();

  // Handle input change for signup form
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle input change for login form
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (Object.values(formData).some((field) => !field)) {
      setErrors({ general: "All fields are required." });
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.username,
        formData.password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "drivers", user.uid), {
        fullName: formData.fullName,
        city: formData.city,
        vehicletype: formData.vehicletype,
      });

      // Store driver's name in local storage
      localStorage.setItem("driverName", formData.fullName);
      alert("User registered successfully");
      navigate("/driverui");
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginData.email,
        loginData.password
      );
      const user = userCredential.user;

      // Fetch driver details from Firestore
      const userDoc = await getDoc(doc(db, "drivers", user.uid));
      const driverData = userDoc.data();

      // Store the driver name in local storage
      localStorage.setItem("driverName", driverData.fullName);
      alert("Login successful!");
      navigate("/driverui");
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: "70px" }}>
      <form onSubmit={handleSubmit} className="text-light">
        <div className="form-row" style={{ paddingTop: "70px" }}>
          <div className="col-md-4 mb-3">
            <label htmlFor="validationServer01">Full Name</label>
            <input
              type="text"
              className={`form-control ${errors.fullName ? "is-invalid" : "is-valid"}`}
              id="validationServer01"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
            />
            {errors.fullName && (
              <div className="invalid-feedback">{errors.fullName}</div>
            )}
          </div>

          <div className="col-md-4 mb-3">
            <label htmlFor="validationServerUsername">Username</label>
            <input
              type="text"
              className={`form-control ${errors.username ? "is-invalid" : "is-valid"}`}
              id="validationServerUsername"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
            />
            {errors.username && (
              <div className="invalid-feedback">{errors.username}</div>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="col-md-6 mb-3">
            <label htmlFor="validationServer03">City</label>
            <input
              type="text"
              className={`form-control ${errors.city ? "is-invalid" : ""}`}
              id="validationServer03"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
            />
            {errors.city && <div className="invalid-feedback">{errors.city}</div>}
          </div>

          <div className="col-md-3 mb-3">
            <label htmlFor="validationServer04">Vehicle Type</label>
            <input
              type="text"
              className={`form-control ${errors.vehicletype ? "is-invalid" : ""}`}
              id="validationServer04"
              name="vehicletype"
              value={formData.vehicletype}
              onChange={handleChange}
              placeholder="Vehicle Type"
            />
            {errors.vehicletype && (
              <div className="invalid-feedback">{errors.vehicletype}</div>
            )}
          </div>

          <div className="col-md-3 mb-3">
            <label htmlFor="validationServer05">Password</label>
            <input
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              id="validationServer05"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>
        </div>

        <div className="form-group">
          <input
            type="checkbox"
            className={`form-check-input ${errors.termsAgreed ? "is-invalid" : ""}`}
            name="termsAgreed"
            id="invalidCheck3"
            checked={formData.termsAgreed}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="invalidCheck3">
            Agree to terms and conditions
          </label>
          {errors.termsAgreed && (
            <div className="invalid-feedback">{errors.termsAgreed}</div>
          )}
        </div>

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>

        <button
          type="button"
          className="btn btn-link"
          onClick={() => setShowLoginModal(true)}
        >
          Already Registered? Login here
        </button>
      </form>

      {showLoginModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Login</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowLoginModal(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleLoginSubmit}>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      placeholder="Enter email"
                    />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      placeholder="Password"
                    />
                  </div>
                  {loginError && <div className="text-danger">{loginError}</div>}
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loginLoading}
                  >
                    {loginLoading ? "Logging in..." : "Login"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
