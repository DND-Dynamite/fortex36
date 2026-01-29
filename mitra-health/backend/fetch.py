import paho.mqtt.client as mqtt
from paho.mqtt.client import CallbackAPIVersion
import json

# --- CALLBACKS ---
def on_connect(client, userdata, flags, reason_code, properties):
    print(f"Connected with result code: {reason_code}")
    # Subscribing in on_connect() means if we lose the connection and
    # reconnect, the subscriptions are renewed.
    # The '#' is a wildcard: it listens to ALL patients.
    client.subscribe("health/monitor/#")

def on_message(client, userdata, msg):
    # This function runs every time a new message is received
    try:
        data = json.loads(msg.payload.decode())
        print(f"🔔 NEW DATA from {data['patient_id']}:")
        print(f"   ❤️ HR: {data['vitals']['heart_rate']} | 🌡️ Temp: {data['vitals']['temp']}")
        
        # LOGIC: Check for emergencies
        if data['status'] == "Danger":
            print("🚨 ALERT: Emergency status detected for this patient!")
            
    except Exception as e:
        print(f"Error parsing data: {e}")

# --- MAIN ---
if __name__ == "__main__":
    client = mqtt.Client(CallbackAPIVersion.VERSION2)
    client.on_connect = on_connect
    client.on_message = on_message

    client.connect("broker.hivemq.com", 1883, 60)

    # loop_forever blocks the script so it stays alive to listen for messages
    client.loop_forever()

