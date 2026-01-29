import paho.mqtt.client as mqtt
from paho.mqtt.client import CallbackAPIVersion
import json
import time
import random

# --- CONFIGURATION ---
BROKER = "broker.hivemq.com"  # Public test broker
PORT = 1883
NUM_PATIENTS = 5

# --- CALLBACKS ---
def on_connect(client, userdata, flags, reason_code, properties):
    """New signature for paho-mqtt v2.x"""
    if reason_code == 0:
        print(f"✅ Client {userdata} connected successfully.")
    else:
        print(f"❌ Connection failed for {userdata} with code: {reason_code}")

# --- DEVICE CLASS ---
class VirtualPatient:
    def __init__(self, patient_id):
        self.patient_id = patient_id
        # ✅ FIX: Explicitly set VERSION2 for paho-mqtt 2.x
        self.client = mqtt.Client(CallbackAPIVersion.VERSION2, client_id=patient_id)
        
        # We pass patient_id as 'userdata' so we can identify it in callbacks
        self.client.user_data_set(patient_id)
        self.client.on_connect = on_connect
        
        # Connect and start background loop
        self.client.connect(BROKER, PORT, 60)
        self.client.loop_start()

    def generate_vitals(self):
        """Creates realistic health data for simulation."""
        hr = random.randint(65, 95)
        spo2 = random.randint(94, 99)
        temp = round(random.uniform(36.2, 37.4), 1)
        
        # Simulate a random emergency for testing (1% chance)
        emergency = True if (hr > 110 or spo2 < 92) else False

        return {
            "patient_id": self.patient_id,
            "vitals": {
                "heart_rate": hr,
                "spo2": spo2,
                "temp": temp
            },
            "status": "Danger" if emergency else "Healthy",
            "timestamp": time.time()
        }

    def publish_update(self):
        data = self.generate_vitals()
        topic = f"health/monitor/{self.patient_id}/vitals"
        self.client.publish(topic, json.dumps(data))
        print(f"📤 Sent data for {self.patient_id}")

# --- MAIN EXECUTION ---
if __name__ == "__main__":
    print(f"🚀 Starting simulation for {NUM_PATIENTS} patients...")
    
    # Create the fleet
    patients = [VirtualPatient(f"Patient_{i:02d}") for i in range(1, NUM_PATIENTS + 1)]

    try:
        while True:
            for p in patients:
                p.publish_update()
            time.sleep(5)  # Update every 5 seconds
    except KeyboardInterrupt:
        print("\n🛑 Stopping simulation...")
        for p in patients:
            p.client.loop_stop()
            p.client.disconnect()