from flask import Flask, request, jsonify
import xgboost as xgb
import pandas as pd
from math import radians, sin, cos, sqrt, atan2
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the trained model
model = xgb.XGBRegressor()
model.load_model("fare_prediction_model.json")

# Haversine formula to calculate the distance between two coordinates (in kilometers)
def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Radius of Earth in kilometers
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    try:
        # Extract input values
        source_lat = data.get('source_lat')
        source_lng = data.get('source_lng')
        dest_lat = data.get('dest_lat')
        dest_lng = data.get('dest_lng')
        date = data.get('date')  # Format: YYYY-MM-DD
        hour = data.get('hour')

        # Validate input coordinates
        if None in [source_lat, source_lng, dest_lat, dest_lng]:
            return jsonify({"error": "Invalid input coordinates"}), 400

        # Calculate trip distance using Haversine formula
        trip_distance = haversine(source_lat, source_lng, dest_lat, dest_lng)

        # Validate trip distance to prevent absurd values (e.g., international trips)
        if trip_distance > 100:  # Set a cap for local trips (e.g., 100 km)
            return jsonify({"error": "Trip distance too large for a taxi ride"}), 400

        # Apply realistic multiplier based on trip distance
        if trip_distance > 7:
            base_amount = trip_distance * 2.3  # Lower multiplier for longer trips
        else:
            base_amount = trip_distance * 7  # Higher multiplier for shorter trips

        # Parse the date
        date_obj = pd.to_datetime(date)
        year, month, day = date_obj.year, date_obj.month, date_obj.day
        day_of_week = date_obj.dayofweek  # Monday=0, Sunday=6

        # Define additional charges
        mta_tax = 0.50
        improvement_surcharge = 0.30
        tolls_amount = 2.33  # Example tolls
        tip_amount = 1.00  # Example tip amount

        # Calculate the total amount
        total_amount = base_amount + mta_tax + improvement_surcharge + tolls_amount + tip_amount

        # Create a DataFrame with the required features
        features = pd.DataFrame([{
            "VendorID": 2,
            "passenger_count": 1,
            "trip_distance": trip_distance,
            "pickup_longitude": source_lng,
            "pickup_latitude": source_lat,
            "RateCodeID": 1,
            "store_and_fwd_flag": 0,
            "dropoff_longitude": dest_lng,
            "dropoff_latitude": dest_lat,
            "payment_type": 1,
            "extra": 0.0,
            "mta_tax": mta_tax,
            "tip_amount": tip_amount,
            "tolls_amount": tolls_amount,
            "improvement_surcharge": improvement_surcharge,
            "total_amount": total_amount,
            "Year": year,
            "Month": month,
            "Date": day,
            "Day of Week": day_of_week,
            "Hour": hour
        }])

        # Make the prediction using the model
        prediction = model.predict(features)[0]

        # Return the result with fare, trip distance, and total amount
        return jsonify({
            "fare": round(float(prediction), 2),
            "trip_distance_km": round(trip_distance, 2),
            "total_amount": round(total_amount, 2)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(port=5000, debug=True)
