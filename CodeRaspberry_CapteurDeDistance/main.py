from machine import Pin
import time
import network
import json
import urequests
from umqtt.simple import MQTTClient

#Paramètres MQTT 
mqtt_host = "192.168.129.32"  # Remplace par l'IP du broker local
mqtt_publish_topic = "smartpaws/niveau"  # Topic sur lequel publier les données
mqtt_client_id = "pico_w_mqtt_client"  # Un identifiant unique pour le client MQTT

# Initialisation du capteur et des LEDs
trig = Pin(17, Pin.OUT)
echo = Pin(16, Pin.IN, Pin.PULL_DOWN)
led_rouge = Pin(18, Pin.OUT)
led_verte = Pin(19, Pin.OUT)


# Variables pour les distances de référence
distance_max_cm = 50  
distance_min_cm = 3   

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
     )

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
            time.sleep(1)

    fin_impulsion = time.ticks_us()

    
    duree_impulsion = fin_impulsion - debut_impulsion
    distance = duree_impulsion * 17165 / 1000000
    return distance

def calculer_pourcentage(distance, distance_max_cm, distance_min_cm):
    if distance >= distance_max_cm:
        return 0
    elif distance <= distance_min_cm:
        return 100
    else:
        pourcentage = ((distance_max_cm - distance) / (distance_max_cm - distance_min_cm)) * 100
        return round(pourcentage, 0)

def publier_distance(client) : 
     while True :
          distance = mesurer_distance()
          pourcentage = calculer_pourcentage(distance, distance_max_cm, distance_min_cm)
          print(f'Publication du niveau de stock: {pourcentage}%') 

          #Préparer les données en json => ça servira plus tard 
          data = {
            "croquettes": pourcentage,
            "eau": 0
          }
          json_data = json.dumps(data)
          print(json_data)
          client.publish(mqtt_publish_topic, str(json_data))
          if pourcentage < 20:
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










