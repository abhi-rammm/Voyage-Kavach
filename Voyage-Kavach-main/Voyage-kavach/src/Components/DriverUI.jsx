"use client";
import React, { useEffect, useState, useCallback } from "react";
import { collection, onSnapshot, doc, updateDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./Capstone";
import { useNavigate } from "react-router-dom";

export default function DriverUI() {
  const [driverName, setDriverName] = useState(() => localStorage.getItem("driverName") || "");
  const [pendingRides, setPendingRides] = useState([]);
  const [acceptedRides, setAcceptedRides] = useState([]);
  const navigate = useNavigate();

  // Real-time listener for rides collection
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "rides"), (snapshot) => {
      const updatedRides = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPendingRides(updatedRides.filter((ride) => ride.status === "Pending"));
      setAcceptedRides(updatedRides.filter((ride) => ride.status === "Accepted"));
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Function to update ride status and notify the user
  const updateRideStatus = useCallback(async (id, status) => {
    try {
      const rideRef = doc(db, "rides", id);
      await updateDoc(rideRef, { status });

      if (status === "Accepted") {
        console.log(`Ride ${id} accepted.`);
        const rideDoc = await getDoc(rideRef);
        const rideData = rideDoc.data();

        // Notify the user if ride contains user ID
        if (rideData?.userId) {
          alertUser(rideData.userId); // Call the function to notify user
        }
      }
    } catch (error) {
      console.error("Error updating ride status:", error);
    }
  }, []);

  // Notify the user and redirect to payment
  const alertUser = (userId) => {
    // Simulate sending an alert by updating localStorage (or integrate real notification logic)
    localStorage.setItem(`ride-notification-${userId}`, "Ride Accepted");
    alert("Ride accepted! Redirecting user to payment page...");
    navigate("/payment"); // Redirect to payment page
  };

  // Handle accept and reject ride actions
  const handleAccept = async (id) => await updateRideStatus(id, "Accepted");
  const handleReject = async (id) => await updateRideStatus(id, "Rejected");

  // Driver sign-out
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      alert("Driver signed out successfully.");
      localStorage.removeItem("driverName");
      navigate("/drive");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div
      className="container-fluid d-flex flex-column align-items-center"
      style={{ paddingTop: "70px", minHeight: "100vh", backgroundColor: "#000", color: "white" }}
    >
      <h1 className="text-light">Hi, {driverName}!</h1>

      <button
        className="btn btn-danger mt-3"
        onClick={handleSignOut}
        style={{ alignSelf: "flex-end", marginRight: "10px" }}
      >
        Sign Out
      </button>

      <div className="mt-4" style={{ maxWidth: "600px", width: "100%" }}>
        <h2 className="text-light">Pending Ride Requests</h2>
        {pendingRides.length === 0 ? (
          <p className="text-light">No pending ride requests at the moment.</p>
        ) : (
          <ul className="list-group mt-3">
            {pendingRides.map((ride) => (
              <li
                key={ride.id}
                className="list-group-item d-flex justify-content-between align-items-center"
                style={{
                  color: "black",
                  backgroundColor: "#E5E4E2",
                  marginBottom: "15px",
                  border: "2px solid black",
                }}
              >
                <div>
                  <strong>Pickup:</strong> {ride.source} <br />
                  <strong>Dropoff:</strong> {ride.destination} <br />
                  <strong>Fare:</strong> ${ride.fare.toFixed(2)} <br />
                  <strong>Status:</strong> {ride.status}
                </div>
                <div className="d-flex flex-column gap-2" style={{ marginLeft: "10px" }}>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleAccept(ride.id)}
                    style={{ color: "white" }}
                    aria-label="Accept Ride"
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleReject(ride.id)}
                    style={{ color: "white" }}
                    aria-label="Reject Ride"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <h2 className="text-light mt-5">Accepted Rides</h2>
        {acceptedRides.length === 0 ? (
          <p className="text-light">No accepted rides at the moment.</p>
        ) : (
          <ul className="list-group mt-3">
            {acceptedRides.map((ride) => (
              <li
                key={ride.id}
                className="list-group-item"
                style={{
                  color: "black",
                  backgroundColor: "#C8E6C9",
                  marginBottom: "15px",
                  border: "2px solid black",
                }}
              >
                <div>
                  <strong>Pickup:</strong> {ride.source} <br />
                  <strong>Dropoff:</strong> {ride.destination} <br />
                  <strong>Fare:</strong> ${ride.fare.toFixed(2)} <br />
                  <strong>Status:</strong> {ride.status}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
