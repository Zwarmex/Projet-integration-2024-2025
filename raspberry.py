from machine import Pin, PWM
from hx711 import hx711  # Importation de la classe hx711 en minuscules
import time  # Import de la bibliothèque time pour les pauses
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

#Paramètres nourissage
max_rewards = 5 #par jour
time_step = 10 #secondes
food_vol = 5 #L
food_hight = 50 #cm
meal_size = 10
meal_cooldown = 6 #hours

trig = machine.Pin(2, Pin.OUT)
echo = machine.Pin(3, Pin.IN, Pin.PULL_DOWN)

# Initialisation du capteur hx711 sans "with"
hx = hx711(Pin(6), Pin(5))

# Configuration du capteur et des LEDs
hx.set_power(hx711.power.pwr_up)
hx.wait_settle(hx711.rate.rate_10)
led_rouge = Pin(10, Pin.OUT)
led_verte = Pin(11, Pin.OUT)

# Initialisation boutton
but_reward = Pin(28, machine.Pin.IN, machine.Pin.PULL_UP)

# Initialisation moteurs
pwm_food = PWM(Pin(17, Pin.OUT))
pwm_food.freq(50)
pwm_food.duty_ns(0)
pwm_reward = PWM(Pin(16, Pin.OUT))
pwm_reward.freq(50)
pwm_reward.duty_ns(0)

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

    # last_reward = time.time() - reward_cooldown*60*60
    rewards_day = 0
    last_time = time.time()
    last_meal = time.time()
    while True:
        if time.time()//(60*60*24) != last_time//(60*60*24): # nouveau jour
            rewards_day = 0
            last_time = time.time()
        
        net = hx.get_value()  # Obtenir la valeur brute du capteur
        print("capteur eau :", net * 2.38, "ml")  # Afficher la mesure brute et la valeur convertie
        if net * 2.38 < 500:
            print("Attention ! Réservoir d'eau presque vide")
        
        if time.time() - last_meal >= meal_cooldown*60*60:
            print("[Donne repas]")
            for i in range(meal_size):
                pwm_food.duty_ns(2000000) # todo: moteur (quel modèle?)
                time.sleep(1)
                pwm_food.duty_ns(1500000)
                time.sleep(1)
            pwm_food.duty_ns(0)
            last_meal = time.time()
        
        if but_reward.value() == 0 and rewards_day < max_rewards:
            print("[Donne friandise]") # todo
            for i in range(1): #ou plus?
                pwm_reward.duty_ns(2000000) # todo: moteur (quel modèle?)
                time.sleep(1)
                pwm_food.duty_ns(1500000)
                time.sleep(1)
            pwm_reward.duty_ns(0)
            rewards_day += 1

        time.sleep(time_step)  # Pause avant la prochaine itération

    main()
