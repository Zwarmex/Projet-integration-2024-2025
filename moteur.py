from machine import Pin
import utime

DELAY = 2 # 200 milliseconds (0.2 secondes)
LED_PIN = 0

# Define step pad pins
step_pads = [27, 26, 18, 22]
sequence = [3, 6, 12, 9]

# Initialize LED
led = Pin(LED_PIN, Pin.OUT)
led.value(0)  # Initial state is off

# Initialize step pads
step_pad_pins = [Pin(pad, Pin.OUT) for pad in step_pads]

# Main loop
on = False
while True:
    for i in range(4):
        s = sequence[i]
        for b in range(4):
            mask = 1 << b
            step_pad_pins[b].value(1 if (mask & s) > 0 else 0)
        print(i)
        utime.sleep_ms(DELAY)

    # Toggle the LED
    on = not on
    led.value(on)
