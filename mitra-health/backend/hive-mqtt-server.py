import paho.mqtt.client as mqtt
from paho.mqtt.client import CallbackAPIVersion
import json
import time
import random
import ssl  # Required for TLS

# --- CONFIGURATION ---
# Replace with your actual HiveMQ Cloud Cluster URL
BROKER = "a3ab313b7ab54aa6a40ddf6a320d2405.s1.eu.hivemq.cloud" 
PORT = 8883
USER = "amalladi2"
PASSWORD = "@10tatorS"
NUM_PATIENTS = 5

# --- CALLBACKS ---
def on_connect(client, userdata, flags, reason_code, properties):
    if reason_code == 0:
        print(f"✅ Patient {userdata} connected to HiveMQ Cloud.")
    else:
        print(f"❌ Connection failed for {userdata} (Code: {reason_code})")

# --- DEVICE CLASS ---
class VirtualPatient:
    def __init__(self, patient_id):
        self.patient_id = patient_id
        
        # 1. Initialize with VERSION2
        self.client = mqtt.Client(CallbackAPIVersion.VERSION2, client_id=patient_id)
        self.client.user_data_set(patient_id)
        
        # 2. Set Credentials
        self.client.username_pw_set(USER, PASSWORD)
        
        # 3. CONFIGURE TLS (Essential for HiveMQ Cloud)
        # This uses the default system certificates to verify the HiveMQ server
        self.client.tls_set(tls_version=ssl.PROTOCOL_TLSv1_2)
        
        self.client.on_connect = on_connect
        
        # 4. Connect to Secure Port 8883
        print(f"Connecting {patient_id}...")
        self.client.connect(BROKER, PORT, 60)
        self.client.loop_start()

    def generate_vitals(self):
        hr = random.randint(65, 95)
        spo2 = random.randint(94, 99)
        temp = round(random.uniform(36.2, 37.4), 1)
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
        # Topic structure based on your hospital modules
        topic = f"hospital/monitoring/{self.patient_id}/vitals"
        
        # QoS 1 ensures the message is delivered at least once to the cloud
        self.client.publish(topic, json.dumps(data), qos=1)
        print(f"📤 Sent data to HiveMQ Cloud for {self.patient_id}")

# --- MAIN EXECUTION ---
if __name__ == "__main__":
    print(f"🚀 Starting HiveMQ Cloud simulation for {NUM_PATIENTS} patients...")
    
    try:
        patients = [VirtualPatient(f"Patient_{i:02d}") for i in range(1, NUM_PATIENTS + 1)]

        while True:
            for p in patients:
                p.publish_update()
            time.sleep(5) 
            
    except KeyboardInterrupt:
        print("\n🛑 Stopping simulation...")
        # Clean shutdown
    except Exception as e:
        print(f"⚠️ Error: {e}")