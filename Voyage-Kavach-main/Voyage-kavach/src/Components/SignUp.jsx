import React, { useState, useContext } from "react";
import { auth, db } from "./Capstone";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { UserContext } from "../App"; // Adjust the path accordingly
import { useNavigate } from "react-router-dom"; // For navigation

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    city: "",
    state: "",
    password: "",
    termsAgreed: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useContext(UserContext); // Access user state
  const navigate = useNavigate(); // Use navigate to redirect

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate fields
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.termsAgreed)
      newErrors.termsAgreed = "You must agree to the terms";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.username,
          formData.password
        );
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          city: formData.city,
          state: formData.state,
          termsAgreed: formData.termsAgreed,
        });

        setCurrentUser(user); // Update the user state
        alert("User registered and data saved in Firestore");
        navigate("/drive"); // Redirect after successful signup
      } catch (error) {
        alert(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container" style={{ paddingTop: "70px" }}>
      <form onSubmit={handleSubmit} className="text-light">
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter your first name"
            className="form-control"
          />
          {errors.firstName && <small className="text-danger">{errors.firstName}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter your last name"
            className="form-control"
          />
          {errors.lastName && <small className="text-danger">{errors.lastName}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="username">Username (Email)</label>
          <input
            type="email"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your email"
            className="form-control"
          />
          {errors.username && <small className="text-danger">{errors.username}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter your city"
            className="form-control"
          />
          {errors.city && <small className="text-danger">{errors.city}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="state">State</label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="Enter your state"
            className="form-control"
          />
          {errors.state && <small className="text-danger">{errors.state}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="form-control"
          />
          {errors.password && <small className="text-danger">{errors.password}</small>}
        </div>

        <div className="form-group form-check">
          <input
            type="checkbox"
            id="termsAgreed"
            name="termsAgreed"
            checked={formData.termsAgreed}
            onChange={handleChange}
            className="form-check-input"
          />
          <label htmlFor="termsAgreed" className="form-check-label">
            I agree to the terms and conditions
          </label>
          {errors.termsAgreed && <small className="text-danger">{errors.termsAgreed}</small>}
        </div>

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit form"}
        </button>
      </form>
    </div>
  );
}
