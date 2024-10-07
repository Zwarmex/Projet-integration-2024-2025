from machine import Pin
import time

trig = Pin(17, Pin.OUT)
echo = Pin(16, Pin.IN, Pin.PULL_DOWN)

led_rouge = Pin(18, Pin.OUT) 
led_verte = Pin(19, Pin.OUT) 

while True:
     trig.value(0)
     time.sleep(0.1)
     trig.value(1)
     time.sleep_us(2)
     trig.value(0)

     while echo.value()==0:
          debut_impulsion = time.ticks_us()
     while echo.value()==1:
          fin_impulsion = time.ticks_us()

     duree_impulsion = fin_impulsion - debut_impulsion
     distance = duree_impulsion * 17165 / 1000000
     distance = round(distance, 0)
     print ('Distance:',"{:.0f}".format(distance),'cm')

     if distance > 20:
        led_rouge.value(1)    
        led_verte.value(0)  
     else:
        led_rouge.value(0)    
        led_verte.value(1)  
     time.sleep(1)