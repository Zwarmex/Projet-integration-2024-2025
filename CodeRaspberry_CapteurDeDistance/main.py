from machine import Pin
import time
import network
import json
import urequests
from umqtt.simple import MQTTClient
import tls
from hx711 import hx711

# Paramètres MQTT 
mqtt_host = "93f56c185fe04dd3b91a255ab6dfc566.s1.eu.hivemq.cloud"  # brokerMqtt dans le cloud
mqtt_client_id = "chicagolil_raspberrypi_picow"  # Un identifiant unique pour le client MQTT
mqtt_publish_topic = "smartpaws/niveau"  # Topic sur lequel publier les données
mqtt_command_topic = "smartpaws/mesure_stock"  # Topic pour recevoir les commandes


# Paramètres du capteur de poids
conversion = 200  # Coefficient pour convertir en grammes
nb_mesures = 5  # Nombre de mesures pour calculer la moyenne
hx = hx711(Pin(28), Pin(27))  # Connexions HX711 : CLK à GP28, DAT à GP27
hx.set_power(hx711.power.pwr_up)
hx.set_gain(hx711.gain.gain_128)
zero = None  # Cette variable sera définie après l'étalonnage

# Initialisation du capteur et des LEDs
trig = Pin(17, Pin.OUT)
echo = Pin(16, Pin.IN, Pin.PULL_DOWN)
led_rouge = Pin(18, Pin.OUT)
led_verte = Pin(19, Pin.OUT)


# Ajout du moteur (utilisé ici comme un simple détecteur d’activation)
moteur = False  # GPIO pour détecter l'activation du moteur

# Variables pour les distances de référence
distance_max_cm = 50  
distance_min_cm = 3   

# Variables pour les poids de référence
poids_max_g = 500  
poids_min_g = 0


# Ajouter une variable globale pour contrôler les mesures
mesure_en_cours = False


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
    context = tls.SSLContext(tls.PROTOCOL_TLS_CLIENT)
    context.verify_mode = tls.CERT_NONE
    client = MQTTClient(
    client_id=mqtt_client_id ,
    server=mqtt_host,
    port=0,
    user=b"Chicagolil",
    password=b"Test1234",
    keepalive=7200,
    ssl=context
    )
    client.set_callback(on_message)  # Associe la fonction de callback
    client.connect()
    client.subscribe(mqtt_command_topic)  # S'abonner au topic de commande
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

def calculer_pourcentage_croquettes(distance, distance_max_cm, distance_min_cm):
    if distance >= distance_max_cm:
        return 0
    elif distance <= distance_min_cm:
        return 100
    else:
        pourcentage = ((distance_max_cm - distance) / (distance_max_cm - distance_min_cm)) * 100
        return round(pourcentage, 0)


def calculer_pourcentage_eau(poids, poids_max_g, poids_min_g):
    if poids <= poids_min_g:
        return 0
    elif poids >= poids_max_g:
        return 100
    else:
        pourcentage = ((poids - poids_min_g) / (poids_max_g - poids_min_g)) * 100
        return round(pourcentage, 0)

def etalonnage_zero(nb_mesures):
    total = 0
    for _ in range(nb_mesures):
        total += hx.get_value()
        time.sleep(0.05)
    return total / nb_mesures

def mesurer_poids():
    total = 0
    for _ in range(nb_mesures):
        total += hx.get_value()
        time.sleep(0.05)
    valeur_moyenne = total / nb_mesures
    poids = (valeur_moyenne - zero) / conversion  # Conversion en grammes
    return round(poids, 0)


def publier_donnees(client) : 
    global mesure_en_cours
    mesure_en_cours = True  # Indiquer qu'une mesure est en cours
    
    distance = mesurer_distance()
    pourcentage_croquettes = calculer_pourcentage_croquettes(distance, distance_max_cm, distance_min_cm)
    poids_eau = mesurer_poids()
    pourcentage_eau = calculer_pourcentage_eau(poids_eau, poids_max_g, poids_min_g)
    
    # Préparer les données JSON
    data = {
        "croquettes": pourcentage_croquettes,
        "eau": pourcentage_eau
    }
    json_data = json.dumps(data)
    print("Publication des données:", json_data)
    client.publish(mqtt_publish_topic, json_data)
    
    # Mise à jour des LEDs en fonction du niveau
    if pourcentage_croquettes < 20:
        led_rouge.value(1)
        led_verte.value(0)
    else:
        led_rouge.value(0)
        led_verte.value(1)

    mesure_en_cours = False  # Réinitialiser l'état une fois la mesure terminée

# Fonction de callback pour traiter les messages reçus
def on_message(topic, msg):
    global mesure_en_cours
    if topic == mqtt_command_topic.encode() and msg.decode() == "mesurer_stock" and not mesure_en_cours:
        print("Commande reçue pour mesurer le niveau")
        publier_donnees(client)  # Appeler la fonction de publication des données

def main():
    # Connexion Wi-Fi
    connection_Wifi('Proximus-Home-102833', 'ys4w2h7nk3ufn9ke')

    # Étalonnage du capteur de poids
    global zero
    zero = etalonnage_zero(nb_mesures)
    print(f"Étalonnage terminé, zéro = {zero}")

    # Connexion MQTT et publication des données
    global client
    client = connection_mqtt()
    try:
        while True:
            client.check_msg()  # Vérifie les messages MQTT en attente
            # Déclenche la publication si le moteur s'active
            if moteur and not mesure_en_cours:
                print("Détection de l'activation du moteur")
                publier_donnees(client)
            time.sleep(1)
    except KeyboardInterrupt:
        client.disconnect()



main()
