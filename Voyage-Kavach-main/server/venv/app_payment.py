import stripe
from flask import Flask, jsonify, request
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5173"],
        "methods": ["GET", "POST"],
        "allow_headers": ["Content-Type"]
    }
})

# It's better to use environment variables for sensitive keys
STRIPE_SECRET_KEY = "sk_test_51QD426JopCk0lO78hZqsFTf2pUw6edvb3qHHgXOZZWVGzZmPvJF7aIFtRLnRB00WFYufXknumMOPcfavRRQ6DCOK004B78bl0J"
stripe.api_key = STRIPE_SECRET_KEY

@app.route("/create-payment-intent", methods=["POST"])
def create_payment_intent():
    try:
        data = request.get_json()
        amount = data.get("amount")

        if not amount:
            return jsonify({"error": "Amount is required"}), 400

        # Ensure amount is an integer and at least 50 cents (Stripe minimum)
        amount = int(amount)
        if amount < 50:
            return jsonify({"error": "Amount must be at least 50 cents"}), 400

        # Create payment intent with additional metadata
        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency="usd",
            automatic_payment_methods={
                "enabled": True
            },
            metadata={
                "integration_check": "accept_a_payment",
            }
        )

        return jsonify({
            "clientSecret": intent.client_secret,
            "publishableKey": "pk_test_51QD426JopCk0lO787vmuB1ge3i5P5rlx0ah3uDXdJTvVBDchGr6V8rtiOZSmLLbca9V8RVMpuXDRzrxAnii24RvW00ZNLZq9zn"
        })

    except stripe.error.StripeError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        print(f"Error creating payment intent: {str(e)}")
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route("/webhook", methods=["POST"])
def webhook_received():
    webhook_secret = "your_webhook_secret"
    request_data = request.data.decode("utf-8")
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload=request_data,
            sig_header=sig_header,
            secret=webhook_secret
        )
        # Handle the event
        if event.type == "payment_intent.succeeded":
            payment_intent = event.data.object
            print(f"Payment succeeded for amount: {payment_intent.amount}")
        return jsonify({"status": "success"})

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(port=5001, debug=True)