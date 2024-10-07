# Simulation MicroPython dans Wokwi pour VS Code

Vous pouvez simuler ce schéma éléctronique dans VS Code si vous éxécutez les étapes suivantes 

## Prérequis

1. Installez l'extension [Wokwi pour VS Code](https://marketplace.visualstudio.com/items?itemName=Wokwi.wokwi-vscode).
2. Installez l'outil [mpremote](https://docs.micropython.org/en/latest/reference/mpremote.html), par exemple : `pip install mpremote`.

## Utilisation

1. Clonez ce projet et ouvrez-le dans VS Code.
2. Depuis la palette de commandes, sélectionnez "Wokwi : Start Simulator". Vous devrez peut-être activer votre licence en premier.
3. Pendant que le simulateur est en cours d'exécution, ouvrez une invite de commande et tapez :

   ```python
   python -m mpremote connect port:rfc2217://localhost:4000 run main.py
