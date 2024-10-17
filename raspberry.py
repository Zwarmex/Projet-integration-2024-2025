from machine import Pin, PWM
from hx711 import hx711  # Importation de la classe hx711 en minuscules
import time  # Import de la bibliothèque time pour les pauses

reward_cooldown = 8 #hours
time_step = 10 #secondes
food_vol = 5 #L
food_hight = 50 #cm
meal_size = 10
meal_cooldown = 6 #hours

water_trig = machine.Pin(2, machine.Pin.OUT)
water_echo = machine.Pin(3, machine.Pin.IN)

# renvoie le volume d'eau en L
def food_level():
    # initialisation
    water_trig.low()
    time.sleep_us(1)
    water_trig.high()
    time.sleep_us(5)
    water_trig.low()

    while water_echo.value() == 0:
        time.sleep_us(1)
    start = time.ticks_us()

    while water_echo.value() > 0:
        time.sleep_us(1)
    stop = time.ticks_us()

    duration = time.ticks_diff(stop, start)
    vol = food_vol * (1 - duration * 340/(20000*food_hight))
    if vol < 0:
        return None
    return vol


# Initialisation du capteur hx711 sans "with"
hx = hx711(Pin(6), Pin(5))

# Configuration du capteur
hx.set_power(hx711.power.pwr_up)
hx.wait_settle(hx711.rate.rate_10)

# Initialisation boutton
but_reward = Pin(28, machine.Pin.IN, machine.Pin.PULL_UP)

# Initialisation moteurs
pwm_food = PWM(Pin(17, Pin.OUT))
pwm_food.freq(50)
pwm_food.duty_ns(0)
pwm_reward = PWM(Pin(16, Pin.OUT))
pwm_reward.freq(50)
pwm_reward.duty_ns(0)

last_reward = time.time() - reward_cooldown*60*60
last_meal = time.time()
while True:
    net = hx.get_value()  # Obtenir la valeur brute du capteur
    print("capteur eau :", net * 2.38, "ml")  # Afficher la mesure brute et la valeur convertie
    if net * 2.38 < 500:
        print("Attention ! Réservoir d'eau presque vide")
    
    food = food_level()
    if food is not None:
        print("capteur nourriture :", food, "l")
    
    if time.time() - last_meal >= meal_cooldown*60*60:
        print("[Donne repas]")
        for i in range(meal_size):
            pwm_food.duty_ns(2000000) # todo: moteur (quel modèle?)
            time.sleep(1)
            pwm_food.duty_ns(1500000)
            time.sleep(1)
        pwm_food.duty_ns(0)
        last_meal = time.time()
    
    if but_reward.value() == 0 and time.time() - last_reward >= reward_cooldown*60*60:
        print("[Donne friandise]") # todo
        for i in range(1): #ou plus?
            pwm_reward.duty_ns(2000000) # todo: moteur (quel modèle?)
            time.sleep(1)
            pwm_food.duty_ns(1500000)
            time.sleep(1)
        pwm_reward.duty_ns(0)
        last_reward = time.time()

    time.sleep(time_step)  # Pause avant la prochaine itération
