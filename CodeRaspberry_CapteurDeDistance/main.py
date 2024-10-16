from machine import Pin
import time
import network
import urequests

trig = None
echo = None
led_rouge = None
led_verte = None

def init_HC_SR04():
    global trig, echo
    trig = Pin(17, Pin.OUT)
    echo = Pin(16, Pin.IN, Pin.PULL_DOWN)

def init_leds():
    global led_rouge, led_verte
    led_rouge = Pin(18, Pin.OUT)
    led_verte = Pin(19, Pin.OUT)

def init_connection_Wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    ssid = 'Proximus-Home-102833'
    password = 'ys4w2h7nk3ufn9ke'
    wlan.connect(ssid, password)

    while not wlan.isconnected():
        print("Connexion en cours...")
        time.sleep(1)

    print("Connecté !")
    r = urequests.get("http://date.jsontest.com")
    print("Réponse du serveur:", r.json())

def init():
    init_leds()
    init_connection_Wifi()
    init_HC_SR04()

def main_loop():
    global trig, echo, led_rouge, led_verte

    trig.value(0)
    time.sleep(0.1)
    trig.value(1)
    time.sleep_us(10)  
    trig.value(0)

    
    debut_impulsion = time.ticks_us()
    while echo.value() == 0:
        if time.ticks_diff(time.ticks_us(), debut_impulsion) > 10000:  
            return

    debut_impulsion = time.ticks_us()
    while echo.value() == 1:
        if time.ticks_diff(time.ticks_us(), debut_impulsion) > 10000:  
            print("Erreur : réponse trop longue du capteur")
            return

    fin_impulsion = time.ticks_us()

    
    duree_impulsion = fin_impulsion - debut_impulsion
    distance = duree_impulsion * 17165 / 1000000
    distance = round(distance, 0)
    print('Distance:', "{:.0f}".format(distance), 'cm')

    
    if distance > 20:
        led_rouge.value(1)
        led_verte.value(0)
    else:
        led_rouge.value(0)
        led_verte.value(1)


init()


while True:
    main_loop()
    time.sleep(1)
