const { onDocumentUpdated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
admin.initializeApp();

// Cloud Function to send ride status updates
exports.sendRideStatusUpdate = onDocumentUpdated(
  { document: "rides/{rideId}" }, // Path to listen for changes in rides
  async (event) => {
    const before = event.data.before.data();
    const after = event.data.after.data();

    // Check if the ride status has changed
    if (before.status !== after.status) {
      // Check if userToken is available
      if (!after.userToken) {
        console.error("No user token available for ride:", event.params.rideId);
        return; // Exit if there's no token to send the notification
      }

      // Construct the notification message
      const message = {
        notification: {
          title: "Ride Status Update",
          body: `Your ride status has changed to: ${after.status}`,
        },
        token: after.userToken, // Ensure userToken is correctly passed
      };

      try {
        // Send the notification
        const response = await admin.messaging().send(message);
        console.log("Successfully sent message:", response);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  }
);
