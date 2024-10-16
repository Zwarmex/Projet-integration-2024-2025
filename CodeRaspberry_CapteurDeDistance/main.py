from machine import Pin
import time
import network
import json
import urequests
from umqtt.simple import MQTTClient

#Paramètres MQTT 
mqtt_host = "io.adafruit.com"
mqtt_username = "Chicagolil"  
mqtt_password = "aio_KHfj89mLVtSCJAox4tAeKComTblc"  
mqtt_publish_topic = "Chicagolil/feeds/mes-donnees"  
mqtt_client_id = "jdoismettreuntrucaupifdoncbonvoilajsprquecestassez"

# Initialisation du capteur et des LEDs
trig = Pin(17, Pin.OUT)
echo = Pin(16, Pin.IN, Pin.PULL_DOWN)
led_rouge = Pin(18, Pin.OUT)
led_verte = Pin(19, Pin.OUT)

def connection_Wifi(ssid,password):
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(ssid, password)

    while not wlan.isconnected():
        print("Connexion en cours...")
        time.sleep(1)

    print("Connecté !")
    r = urequests.get("http://date.jsontest.com")
    print("Réponse du serveur:", r.json())

def connection_mqtt():
     client = MQTTClient(
          client_id=mqtt_client_id,
          server=mqtt_host,
          user=mqtt_username,
          password=mqtt_password)

     client.connect()
     print("Connecté au broker MQTT")
     return client

def mesurer_distance():

    trig.value(0)
    time.sleep(0.1)
    trig.value(1)
    time.sleep_us(10)  
    trig.value(0)

    
    debut_impulsion = time.ticks_us()
    while echo.value() == 0:
        if time.ticks_diff(time.ticks_us(), debut_impulsion) > 30000:  
            return

    debut_impulsion = time.ticks_us()
    while echo.value() == 1:
        if time.ticks_diff(time.ticks_us(), debut_impulsion) > 30000:  
            print("Erreur : réponse trop longue du capteur")
            return

    fin_impulsion = time.ticks_us()

    
    duree_impulsion = fin_impulsion - debut_impulsion
    distance = duree_impulsion * 17165 / 1000000
    distance = round(distance, 0)
    return distance


def publier_distance(client) : 
     while True :
          distance = mesurer_distance()  
          print('Publication de la Distance:', "{:.0f}".format(distance), 'cm')   
          client.publish(mqtt_publish_topic, str(distance))

          #Préparer les données en json => ça servira plus tard 
          data = {
            "distance": distance,
            "timestamp": time.time()
          }
          json_data = json.dumps(data)
          print(json_data)
          if distance > 20:
               led_rouge.value(1)
               led_verte.value(0)
          else:
               led_rouge.value(0)
               led_verte.value(1)

          time.sleep(1)



def main():
     connection_Wifi('Proximus-Home-102833','ys4w2h7nk3ufn9ke')
     client = connection_mqtt()
     publier_distance(client)



main()









