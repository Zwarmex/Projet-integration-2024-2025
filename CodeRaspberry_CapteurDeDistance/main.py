from machine import Pin # type: ignore
import machine # type: ignore
import time
import network # type: ignore
import json
import urequests
from umqtt.simple import MQTTClient # type: ignore
import tls # type: ignore
from hx711 import hx711 # type: ignore
import ujson # type: ignore
import config_wifi


# Paramètres MQTT 
mqtt_client_id = "chicagolil_raspberrypi_picow"  # Un identifiant unique pour le client MQTT
mqtt_publish_topic = "smartpaws/niveau"  # Topic sur lequel publier les données
mqtt_command_topic = "smartpaws/commandes"  # Topic pour recevoir les commandes


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





def charger_config():
    try:
        with open("config.json") as f:
            config = ujson.load(f)
            
    except Exception as e:
        print(f"Erreur de chargement du fichier de configuration: {e}")
        config = {}
    config.setdefault("seuil_croquettes", 50)  # En grammes
    config.setdefault("seuil_eau", 100)  # En millilitres
    config.setdefault("quantite_croquettes", 30)  # Quantité par défaut
    config.setdefault("quantite_eau", 100)  # Quantité par défaut
    return config





def connection_mqtt(mqtt_host,mqtt_user,mqtt_password):
    try:
        context = tls.SSLContext(tls.PROTOCOL_TLS_CLIENT)
        context.verify_mode = tls.CERT_NONE
        client = MQTTClient(
        client_id=mqtt_client_id ,
        server=mqtt_host,
        port=0,
        user= mqtt_user ,
        password=mqtt_password ,
        keepalive=7200,
        ssl=context
        )
        client.set_callback(on_message)  # Associe la fonction de callback
        client.connect()
        client.subscribe(mqtt_command_topic)  # S'abonner au topic de commande
        print("Connecté au broker MQTT")
        return client

    except Exception as e: 
        print(f"Erreur lors de la connexion MQTT: {e}")
        verifier_connexion_mqtt()

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


def moyenne_mesure_distance():
    mesures = []
    for _ in range(nb_mesures):
        mesure = mesurer_distance()
        if mesure:
            mesures.append(mesure)
    return sum(mesures) / len(mesures) if mesures else None


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
    return total / nb_mesures

def mesurer_poids():
    total = 0
    for _ in range(nb_mesures):
        total += hx.get_value()
    valeur_moyenne = total / nb_mesures
    poids = (valeur_moyenne - zero) / conversion  # Conversion en grammes
    return poids if poids else None



def mesurer_gamelle_croquettes():
    """Placeholder pour mesurer le poids des croquettes dans la gamelle."""
    print("Mesure de la gamelle de croquettes")
    # Utiliser un capteur HX711 dédié
    return 101
    pass

def mesurer_gamelle_eau():
    """Placeholder pour mesurer le poids de l'eau dans la gamelle."""
    print("Mesure de la gamelle d'eau")
    # Utiliser un capteur HX711 dédié
    return 101
    pass

def activer_moteur_croquettes(duree):
    """Active le moteur pour distribuer des croquettes."""
    # Utiliser le GPIO dédié pour une durée donnée
    if not mesure_en_cours:
        print("Détection de l'activation du moteur")
        publier_donnees(client)
        verifier_connexion_mqtt()
    pass

def activer_pompe_eau(duree):
    """Active la pompe pour distribuer de l'eau."""
    # Utiliser le GPIO dédié pour une durée donnée
    if not mesure_en_cours:
        print("Détection de l'activation du moteur")
        publier_donnees(client)
        verifier_connexion_mqtt()
    pass


def verifier_seuils_et_distribuer():
    """Vérifie les niveaux et déclenche la distribution si nécessaire."""
    print("Vérification des seuils")
    niveau_croquettes = mesurer_gamelle_croquettes()
    niveau_eau = mesurer_gamelle_eau()

    if niveau_croquettes < config["seuil_croquettes"]:
        print("Niveau de croquettes insuffisant, distribution en cours...")
        activer_moteur_croquettes(config["quantite_croquettes"])
        notifier_activation(client, "croquettes",config["quantite_croquettes"], "automatique")

    if niveau_eau < config["seuil_eau"]:
        print("Niveau d'eau insuffisant, distribution en cours...")
        activer_pompe_eau(config["quantite_eau"])
        notifier_activation(client, "eau",config["quantite_eau"], "automatique")


def notifier_activation(client, type_distributeur, quantite, declencheur):
    """Publie une notification MQTT pour signaler l'activation d'un moteur ou d'une pompe."""
    topic = f"smartpaws/historique"  # Construire le topic dynamiquement
    message = {
        "type": type_distributeur,
        "quantite": quantite,
        "declencheur" :  declencheur
    }
    try:
        client.publish(topic, json.dumps(message))
        print(f"Notification envoyée sur {topic} : {message}")
    except Exception as e:
        print(f"Erreur lors de la publication de l'activation : {e}")

def publier_donnees(client) : 
    global mesure_en_cours
    mesure_en_cours = True  # Indiquer qu'une mesure est en cours
    
    
    distance = moyenne_mesure_distance()
    if distance is None:
        print("Erreur de mesure de distance, utilisation d'une valeur par défaut")
        distance = distance_max_cm  # Valeur par défaut
    pourcentage_croquettes = calculer_pourcentage_croquettes(distance, distance_max_cm, distance_min_cm)


    poids_eau = mesurer_poids()
    if poids_eau is None:
        print("Erreur de mesure de poids, utilisation d'une valeur par défaut")
        poids_eau = poids_min_g  # Valeur par défaut

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
    global config 
    global mesure_en_cours
    if topic == mqtt_command_topic.encode() :
        command = msg.decode()

        if command == "mesurer_stock" and not mesure_en_cours:
            print("Commande reçue pour mesurer le niveau")
            publier_donnees(client)
            verifier_connexion_mqtt()

        elif command == "distribuer_croquettes":
            print("Commande reçue : distribuer croquettes")
            activer_moteur_croquettes(config["quantite_croquettes"])
            notifier_activation(client, "croquettes",config["quantite_croquettes"], "manuel")


        # Commande pour distribuer de l'eau
        elif command == "distribuer_eau":
            print("Commande reçue : distribuer eau")
            activer_pompe_eau(config["quantite_eau"])
            notifier_activation(client, "eau",config["quantite_eau"], "manuel")

        elif command.startswith("update_params"):
            try:
                # Exemple de message : update_params{"quantite_croquettes": 50, "quantite_eau": 200}
                params = json.loads(command[len("update_params"):])  # Extrait le JSON après le préfixe
                config["quantite_croquettes"] = params.get("quantite_croquettes", config["quantite_croquettes"])
                config["quantite_eau"] = params.get("quantite_eau", config["quantite_eau"])
                print(f"Paramètres mis à jour : {config}")
            except Exception as e:
                print(f"Erreur dans l'analyse des paramètres : {e}")





# FONCTIONS DE VERIFICATIONS pour augmenter la résilience aux pannes

def verifier_connexion_mqtt():
    try:
        client.ping()  # Vérifie la connexion MQTT
    except OSError:
        print("Connexion MQTT perdue, tentative de reconnexion...")
        client.connect()


def redemarrer_systeme():
    print("Redémarrage du système en raison d'une panne critique...")
    machine.reset()




def main():
    global config
    
    wifi_connected = config_wifi.wifi_setup()

    if wifi_connected :

        config = charger_config()

        # Vérifier si la configuration a été chargée avec succès
        if config:
            mqtt_host = config.get("mqtt_host")
            mqtt_user = config.get("mqtt_user")
            mqtt_password = config.get("mqtt_password")
        else:
            print("Impossible de charger la configuration.")
        

        # Étalonnage du capteur de poids
        global zero
        zero = etalonnage_zero(nb_mesures)
        

        # Connexion MQTT et publication des données
        global client
        client = connection_mqtt(mqtt_host, mqtt_user, mqtt_password)
        try:
            
            while True:
                client.check_msg()  # Vérifie les messages MQTT en attente
                verifier_seuils_et_distribuer()
                time.sleep(3)

        except KeyboardInterrupt:
            client.disconnect()

    else:
        print("Échec de la connexion Wi-Fi. Redémarrage requis.")


main()

