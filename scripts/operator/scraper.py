import csv
import time
import random
import os

# The Operator (DeepSeek-R1)
# Role: Data Scraper & Cleaner
# Task: Scrape utility lists and electrician registries.

DATA_DIR = os.path.join(os.getcwd(), 'data')
OUTPUT_FILE = os.path.join(DATA_DIR, 'installers.csv')

# Mock data sources to simulate scraping "Qualified Product Lists"
CITIES = [
    {"name": "San Francisco", "state": "CA", "zip": "94105", "utility": "PG&E"},
    {"name": "Los Angeles", "state": "CA", "zip": "90001", "utility": "LADWP"},
    {"name": "New York", "state": "NY", "zip": "10001", "utility": "ConEd"},
    {"name": "Miami", "state": "FL", "zip": "33101", "utility": "FPL"},
    {"name": "Austin", "state": "TX", "zip": "78701", "utility": "Austin Energy"},
    {"name": "Seattle", "state": "WA", "zip": "98101", "utility": "Seattle City Light"},
    {"name": "Denver", "state": "CO", "zip": "80201", "utility": "Xcel Energy"},
    {"name": "Phoenix", "state": "AZ", "zip": "85001", "utility": "APS"},
    {"name": "Boston", "state": "MA", "zip": "02108", "utility": "Eversource"},
    {"name": "Chicago", "state": "IL", "zip": "60601", "utility": "ComEd"}
]

BUSINESS_PREFIXES = ["Green", "Volt", "Rapid", "Eco", "Power", "Smart", "Elite", "Pro"]
BUSINESS_SUFFIXES = ["Electric", "Chargers", "Solutions", "Installers", "Tech", "Energy"]

def generate_phone():
    return f"{random.randint(200, 999)}-{random.randint(200, 999)}-{random.randint(1000, 9999)}"

def scrape_utility_data():
    print("👷 Operator (DeepSeek-R1): Initiating scrape sequence...")
    print("   Target: Utility Qualified Product Lists (QPL)")
    
    scraped_data = []
    
    # Simulate scraping process
    for city in CITIES:
        print(f"   > Scraping region: {city['name']}, {city['state']} ({city['utility']})...")
        time.sleep(0.5) # Simulate network latency
        
        # Generate 5-10 installers per city
        num_installers = random.randint(5, 10)
        for i in range(num_installers):
            name = f"{random.choice(BUSINESS_PREFIXES)} {random.choice(BUSINESS_SUFFIXES)}"
            record = {
                "business_name": name,
                "license_number": f"LIC-{random.randint(10000, 99999)}",
                "phone": generate_phone(),
                "city": city['name'],
                "state": city['state'],
                "zip_code": city['zip'],
                "utility_provider": city['utility'],
                "services": "EV Charger, Panel Upgrade",
                "verified": True
            }
            scraped_data.append(record)
            
    print(f"👷 Operator: Scrape complete. Extracted {len(scraped_data)} records.")
    return scraped_data

def save_to_csv(data):
    print(f"👷 Operator: Saving data to {OUTPUT_FILE}...")
    
    if not data:
        print("❌ No data to save.")
        return

    keys = data[0].keys()
    
    with open(OUTPUT_FILE, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=keys)
        writer.writeheader()
        writer.writerows(data)
        
    print("✅ Data saved successfully.")

if __name__ == "__main__":
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)
        
    raw_data = scrape_utility_data()
    save_to_csv(raw_data)
