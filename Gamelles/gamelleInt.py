from machine import Pin
from hx711 import *
import time

# À modifier pour chaque cellule de charge:
zero1 = -624500 # soustraire cette valeur pour ajuster le zéro
zero2 = -249000 # soustraire cette valeur pour ajuster le zéro
conversion = 190.0 # diviser par cette valeur pour convertir en grammes


def mesure1():
    hx1 = hx711(Pin(14), Pin(15))  # clock broche GP14, data broche GP15
    hx1.set_power(hx711.power.pwr_up)
    hx1.set_gain(hx711.gain.gain_128) # valeurs possibles 128, 64 ou 32.
    valeur =  hx1.get_value() # on prend la mesure
    valeur = (valeur - zero1) / conversion  # conversion en grammes   
    print('masse: ' , round(valeur), 'g')  # affichage 
    
def mesure2():
    hx2 = hx711(Pin(1), Pin(0))  
    hx2.set_power(hx711.power.pwr_up)
    hx2.set_gain(hx711.gain.gain_128) 
    valeur =  hx2.get_value() 
    valeur = (valeur - zero2) / conversion    
    print('masse: ' , round(valeur), 'g')  
while True:
    mesure1()
    mesure2()
    time.sleep(0.1)