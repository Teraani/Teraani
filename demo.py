import pyautogui
import time  # Para adicionar pausas entre as repetições, se necessário

# Loop infinito
while True:
    pyautogui.keyDown('alt')
    pyautogui.press(['tab'])
    pyautogui.keyUp('alt')
    pyautogui.write('teste')
    time.sleep(60)  # Pausa de 1 segundo entre as repetições (opcional)
