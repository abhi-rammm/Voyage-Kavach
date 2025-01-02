"use client";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { setDoc, doc, onSnapshot, Timestamp, deleteDoc } from "firebase/firestore";
import { db, auth } from "../Capstone";
import { useJsApiLoader } from "@react-google-maps/api";
import Map from "../Map";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import axios from "axios";

const libraries = ["places"];

export default function Ride() {
  document.body.style = "background: black; margin: 0; height: 100vh;";

  const { id } = useParams();
  const navigate = useNavigate();

  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [sourceAddress, setSourceAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [fare, setFare] = useState(null);
  const [ride, setRide] = useState(null);
  const [error, setError] = useState(null);
  
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAiKZRmhPT_UfxFX--D1EbUeceGZuq3IXo",
    libraries,
  });

  const getLatLong = (place, setLocation, setAddress) => {
    if (!place || !place.value) return;
    const service = new window.google.maps.places.PlacesService(document.createElement("div"));
    service.getDetails({ placeId: place.value.place_id }, (result, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const location = result.geometry.location;
        setLocation({ lat: location.lat(), lng: location.lng() });
        setAddress(result.formatted_address);
      } else {
        console.error("Error fetching place details:", status);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", {
        source_lat: source.lat,
        source_lng: source.lng,
        dest_lat: destination.lat,
        dest_lng: destination.lng,
        date: "2024-10-25",
        hour: 20,
      });
      const fetchedFare = response.data.fare;
      setFare(fetchedFare);
      setError(null);
      console.log("Fare fetched:", fetchedFare); // Debugging line

      // Save the fetched fare in Firestore
      if (auth.currentUser) {
        await setDoc(doc(db, "rides", auth.currentUser.uid), {
          fare: fetchedFare,  // Save fare here
        }, { merge: true });  // Merge to avoid overwriting existing data
      }

    } catch (error) {
      console.error("Error fetching fare:", error);
      setError("Failed to fetch fare. Please try again.");
    }
  };

  const saveRideDetails = async (user) => {
    try {
      const expiryTime = Timestamp.fromMillis(Date.now() + 5 * 60 * 1000);
      await setDoc(doc(db, "rides", user.uid), {
        source: sourceAddress,
        destination: destinationAddress,
        fare,
        expiry: expiryTime,
        status: "Pending",
      });
      alert("Ride details saved successfully!");
    } catch (error) {
      console.error("Error saving ride details:", error);
    }
  };

  const deleteExpiredRide = async (rideRef) => {
    try {
      await deleteDoc(rideRef);
      console.log("Expired ride deleted successfully.");
    } catch (error) {
      console.error("Error deleting expired ride:", error);
    }
  };

  const setupRideListener = (user) => {
    const rideRef = doc(db, "rides", user.uid);
    return onSnapshot(
      rideRef,
      async (docSnapshot) => {
        if (docSnapshot.exists()) {
          const rideData = docSnapshot.data();
          const now = Timestamp.now();

          if (rideData.expiry.toMillis() < now.toMillis()) {
            console.log("Ride expired. Deleting...");
            await deleteExpiredRide(rideRef);
          } else {
            setRide(rideData);

            // Use fare from rideData instead of local fare state
            if (rideData.status === "Accepted" && rideData.fare !== null) {
              alert("Your ride has been accepted! Redirecting to payment...");
              navigate(`/checkoutform/${user.uid}/${rideData.fare}`); // Use fare from rideData
            } else if (rideData.status === "Accepted") {
              alert("Your ride has been accepted, but fare is not set yet.");
            }
          }
        } else {
          setError("No active ride found.");
        }
      },
      (error) => {
        console.error("Error fetching ride status:", error);
        setError("Failed to load ride details.");
      }
    );
  };

  useEffect(() => {
    let unsubscribe;
    const handleAuthChange = (user) => {
      if (unsubscribe) unsubscribe();
      if (user) {
        unsubscribe = setupRideListener(user);
      } else {
        setRide(null);
      }
    };
    const unsubscribeAuth = auth.onAuthStateChanged(handleAuthChange);
    return () => {
      if (unsubscribe) unsubscribe();
      unsubscribeAuth();
    };
  }, [navigate]);

  useEffect(() => {
    if (fare !== null) {
      const rideDetails = {
        Source: sourceAddress,
        Destination: destinationAddress,
        Fare: fare,
      };
      localStorage.setItem("rideDetails", JSON.stringify(rideDetails));
    }
  }, [fare]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="container-fluid p-0">
      <div className="row w-100 m-0" style={{ height: "100vh" }}>
        <div className="col-md-6 d-flex flex-column justify-content-center p-5">
          <h1 className="text-white">Go कधीही कुठेही with Voyage Kavach</h1>
          <p className="text-white">
            Book your taxi ride now and enjoy a seamless experience!
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="pickup" style={{ color: "white" }}>Pickup Location</label>
              <GooglePlacesAutocomplete
                selectProps={{
                  value: sourceAddress ? { label: sourceAddress, value: sourceAddress } : null,
                  onChange: (place) => getLatLong(place, setSource, setSourceAddress),
                  placeholder: "Enter Pickup Location",
                  isClearable: true,
                }}
              />
            </div>

            <div className="form-group mt-3">
              <label htmlFor="destination" style={{ color: "white" }}>Destination</label>
              <GooglePlacesAutocomplete
                selectProps={{
                  value: destinationAddress ? { label: destinationAddress, value: destinationAddress } : null,
                  onChange: (place) => getLatLong(place, setDestination, setDestinationAddress),
                  placeholder: "Enter Destination",
                  isClearable: true,
                }}
              />
            </div>

            {fare === null ? (
              <button type="submit" className="btn btn-primary mt-4">Get Prices</button>
            ) : (
              <button
                className="btn btn-success mt-4"
                onClick={() => auth.currentUser && saveRideDetails(auth.currentUser)}
              >
                Book Ride
              </button>
            )}

            {error && <div className="alert alert-danger mt-3">{error}</div>}
            {fare !== null && (
              <div className="alert alert-success mt-3">
                Estimated Fare: ${fare}
              </div>
            )}
          </form>
        </div>

        <div className="col-md-6 p-0">
          <div style={{ height: "100%", width: "100%" }}>
            <Map
              source={source}
              destination={destination}
              sourceAddress={sourceAddress}
              destinationAddress={destinationAddress}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
