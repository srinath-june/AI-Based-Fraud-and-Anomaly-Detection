import random
import uuid
from datetime import datetime, timedelta
import pandas as pd
from typing import List, Dict, Any

NAMES = [
    "Sarah Jenkins", "Michael Chang", "Emily Rodriguez", "David Kim", "Jessica Taylor",
    "James Wilson", "Amanda Martinez", "Robert Chen", "Sophia Patel", "Daniel Cooper",
    "Olivia Brown", "Alexander Scott", "Emma Johnson", "Lucas Miller", "Isabella Davis",
    "Benjamin White", "Charlotte Hall", "Ethan Clark", "Mia Lewis", "Mason Adams"
]

MERCHANTS = {
    "Retail": ["Amazon.com", "Target", "Walmart", "Costco", "Best Buy", "Home Depot"],
    "Electronics": ["Apple Store", "Micro Center", "B&H Photo", "Newegg", "Samsung Direct"],
    "Travel": ["Delta Airlines", "Marriott Hotels", "Airbnb", "Expedia", "Uber Rides"],
    "Dining": ["Starbucks", "Chipotle", "DoorDash", "Cheesecake Factory", "McDonald's"],
    "Groceries": ["Whole Foods", "Trader Joe's", "Kroger", "Safeway", "ALDI"],
    "Gambling": ["BetMGM Casino", "DraftKings", "Golden Nugget Online", "Bovada"],
    "Crypto": ["Binance Exchange", "Coinbase Pro", "Kraken Pay", "OKX Global"],
    "Luxury Goods": ["Rolex Boutique", "Louis Vuitton", "Gucci New York", "Tiffany & Co."],
    "Entertainment": ["Netflix", "Spotify", "Steam Games", "AMC Theatres", "PlayStation Network"],
    "Digital Goods": ["Digital Gift Cards", "Cloud Hosting Services", "VPN Unlimited", "Domain Registrar"]
}

CITIES = [
    ("USA", "New York", 0.0),
    ("USA", "San Francisco", 4100.0),
    ("USA", "Chicago", 1150.0),
    ("USA", "Austin", 2400.0),
    ("USA", "Seattle", 3900.0),
    ("UK", "London", 5500.0),
    ("Nigeria", "Lagos", 8500.0),
    ("Russia", "Moscow", 7500.0),
    ("Singapore", "Singapore", 15300.0),
    ("Brazil", "Sao Paulo", 7600.0),
]

DEVICES = ["Mobile", "Desktop", "Tablet", "ATM", "POS Terminal"]
CHANNELS = ["Online", "In-Store", "Wire Transfer", "ATM", "Mobile App"]

def generate_synthetic_transactions(count: int = 600, fraud_ratio: float = 0.09) -> List[Dict[str, Any]]:
    """Generate realistic financial transactions with injected fraud patterns."""
    transactions = []
    base_time = datetime.utcnow() - timedelta(days=14)

    for i in range(count):
        is_fraud = random.random() < fraud_ratio
        account_idx = random.randint(0, len(NAMES) - 1)
        customer_name = NAMES[account_idx]
        account_id = f"ACC-{1000 + account_idx}"

        # Baseline customer profile
        avg_past_amount = round(random.uniform(35.0, 150.0), 2)
        home_country, home_city = "USA", "New York"

        # Timestamp distributed over last 14 days
        random_seconds = random.randint(0, 14 * 24 * 3600)
        txn_time = base_time + timedelta(seconds=random_seconds)

        if not is_fraud:
            # NORMAL TRANSACTION
            category = random.choices(
                ["Groceries", "Dining", "Retail", "Entertainment", "Travel"],
                weights=[30, 25, 25, 10, 10]
            )[0]
            merchant = random.choice(MERCHANTS[category])
            amount = round(random.lognormvariate(np_mean:=np_log(avg_past_amount), 0.45), 2)
            amount = max(3.50, min(amount, avg_past_amount * 2.8))

            country, city, dist = home_country, home_city, round(random.uniform(0.5, 22.0), 1)
            is_foreign = False
            device = random.choice(["Mobile", "Desktop", "POS Terminal"])
            channel = "In-Store" if device == "POS Terminal" else random.choice(["Online", "Mobile App"])
            card_present = (channel == "In-Store")
            velocity = random.choices([1, 2, 3, 4], weights=[60, 25, 10, 5])[0]
        else:
            # FRAUD TRANSACTION
            fraud_type = random.choice([
                "sudden_high_ticket",
                "velocity_spree",
                "cross_border_geo_anomaly",
                "crypto_gambling_bustout",
                "night_wire_fraud"
            ])

            if fraud_type == "sudden_high_ticket":
                category = random.choice(["Luxury Goods", "Electronics"])
                merchant = random.choice(MERCHANTS[category])
                amount = round(random.uniform(2200.0, 9500.0), 2)
                country, city, dist = home_country, home_city, round(random.uniform(2.0, 60.0), 1)
                is_foreign = False
                device = "Desktop"
                channel = "Online"
                card_present = False
                velocity = random.randint(2, 5)

            elif fraud_type == "velocity_spree":
                category = random.choice(["Digital Goods", "Retail", "Electronics"])
                merchant = random.choice(MERCHANTS[category])
                amount = round(random.uniform(180.0, 650.0), 2)
                country, city, dist = home_country, home_city, round(random.uniform(5.0, 80.0), 1)
                is_foreign = False
                device = "Mobile"
                channel = "Online"
                card_present = False
                velocity = random.randint(7, 14)

            elif fraud_type == "cross_border_geo_anomaly":
                category = random.choice(["Retail", "Travel", "Electronics"])
                merchant = random.choice(MERCHANTS[category])
                amount = round(random.uniform(450.0, 3200.0), 2)
                foreign_dest = random.choice(CITIES[5:]) # International destinations
                country, city, dist = foreign_dest[0], foreign_dest[1], foreign_dest[2]
                is_foreign = True
                device = random.choice(["Desktop", "Mobile"])
                channel = "Online"
                card_present = False
                velocity = random.randint(3, 8)

            elif fraud_type == "crypto_gambling_bustout":
                category = random.choice(["Crypto", "Gambling"])
                merchant = random.choice(MERCHANTS[category])
                amount = round(random.uniform(1500.0, 7500.0), 2)
                country, city, dist = home_country, home_city, round(random.uniform(10.0, 500.0), 1)
                is_foreign = random.choice([True, False])
                device = "Desktop"
                channel = "Online"
                card_present = False
                velocity = random.randint(4, 9)

            else: # night_wire_fraud
                category = "Retail"
                merchant = "International Clearing Wire"
                amount = round(random.uniform(4000.0, 15000.0), 2)
                country, city, dist = "Russia", "Moscow", 7500.0
                is_foreign = True
                device = "Desktop"
                channel = "Wire Transfer"
                card_present = False
                velocity = 2
                # force night hour
                txn_time = txn_time.replace(hour=random.choice([1, 2, 3, 4]))

        hour = txn_time.hour
        is_weekend = (txn_time.weekday() >= 5)
        ratio = round(amount / max(avg_past_amount, 1.0), 2)

        transactions.append({
            "id": f"TXN-{uuid.uuid4().hex[:10].upper()}",
            "timestamp": txn_time,
            "account_id": account_id,
            "customer_name": customer_name,
            "amount": amount,
            "currency": "USD",
            "merchant": merchant,
            "merchant_category": category,
            "location_country": country,
            "location_city": city,
            "device_type": device,
            "ip_address": f"{random.randint(11, 210)}.{random.randint(10, 255)}.{random.randint(1, 255)}.{random.randint(1, 254)}",
            "channel": channel,
            "card_present": card_present,
            "distance_from_home_km": dist,
            "velocity_24h": velocity,
            "avg_amount_past_30d": avg_past_amount,
            "amount_ratio_to_avg": ratio,
            "hour_of_day": hour,
            "day_of_week": txn_time.weekday(),
            "is_weekend": is_weekend,
            "is_foreign": is_foreign,
            "ground_truth_fraud": is_fraud,
        })

    # Sort chronologically
    transactions.sort(key=lambda x: x["timestamp"], reverse=True)
    return transactions

def np_log(val: float) -> float:
    import math
    return math.log(max(val, 1.0))
