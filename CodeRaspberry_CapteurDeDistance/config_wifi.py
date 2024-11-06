import network # type: ignore
import socket
import json
import time
from machine import Pin,reset # type: ignore
import urequests

CONFIG_FILE = "wifi_config.json"

def load_wifi_config():
    try:
        with open(CONFIG_FILE, "r") as f:
            return json.load(f)
    except OSError:
        return None

def save_wifi_config(ssid, password):
    with open(CONFIG_FILE, "w") as f:
        json.dump({"ssid": ssid, "password": password}, f)

def start_access_point():
    ssid = "Smartpaws" 
    password = "pico1234"  # Modifier le mot de passe pour plus de sécurité

    ap = network.WLAN(network.AP_IF)
    ap.config(essid=ssid, password=password)
    ap.active(True)
    print(f"Point d'accès démarré : SSID={ssid}, mot de passe={password}")
    return ap

def start_captive_portal():
    addr = socket.getaddrinfo('0.0.0.0', 80)[0][-1]
    s = socket.socket()
    s.bind(addr)
    s.listen(1)
    print('Portail captif démarré sur', addr)
    return s

def handle_client_connection(s):
    while True:
        cl, addr = s.accept()
        print('Client connecté depuis', addr)
        request = cl.recv(1024)
        request_str = request.decode()
        
        if "/connect" in request_str:  # Si l'utilisateur a soumis le formulaire
            try:
                _, params = request_str.split("?")
                params = params.split(" ")[0]
                param_dict = {p.split("=")[0]: p.split("=")[1] for p in params.split("&")}
                ssid = param_dict.get("ssid")
                password = param_dict.get("password")
                
                if ssid and password:
                    save_wifi_config(ssid, password)
                    response = "HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=utf-8\r\n\r\n<h1>Configuration enregistrée! Redémarrage...</h1>"
                    cl.send(response)
                    cl.close()
                    s.close()  # Fermeture du socket serveur
                    time.sleep(2)
                    reset()  # Redémarre pour appliquer la configuration
                    return
            except Exception as e:
                print(f"Erreur de traitement du formulaire: {e}")

        else:  # Afficher le formulaire de connexion
            response = """HTTP/1.1 200 OK\r\nContent-Type: text/html;charset=utf-8\r\n\r\n
            <html><body><h1>Configuration Wi-Fi</h1>
            <form action="/connect">
              <label>SSID:</label><input name="ssid"><br>
              <label>Mot de passe:</label><input name="password" type="password"><br>
              <input type="submit" value="Se connecter">
            </form>
            </body></html>"""
            cl.send(response)
            cl.close()

def connection_Wifi(wifi_ssid,wifi_password):
    global wlan 
    try : 
        wlan = network.WLAN(network.STA_IF)
        wlan.active(True)
        wlan.connect(wifi_ssid, wifi_password)

        while not wlan.isconnected():
            print("Connexion en cours...")
            time.sleep(1)

    except Exception as e : 
        print(f"Erreur lors de la connexion Wifi: {e}")
        verifier_connexion_wifi(wifi_ssid,wifi_password)
    
    return wlan.isconnected()


def verifier_connexion_wifi(wifi_ssid,wifi_password):
    if not wlan.isconnected():
        print("Wi-Fi déconnecté, tentative de reconnexion...")
        wlan.connect(wifi_ssid,wifi_password)
        while not wlan.isconnected():
            print("Reconnexion Wi-Fi en cours...")
            time.sleep(1)
        print("Reconnecté au Wi-Fi")


def wifi_setup():
    config = load_wifi_config()
    if config:
        ssid = config.get("ssid")
        password = config.get("password")
        if connection_Wifi(ssid, password):
            print("Connecté au Wi-Fi")
            return True
        else:
            print("Échec de la connexion Wi-Fi, redémarrage en mode AP...")
    
    ap = start_access_point()
    s = start_captive_portal()
    handle_client_connection(s)

wifi_setup()

