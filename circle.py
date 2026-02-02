import pyautogui
import time
import math

# Configurações da tela e círculo
screen_width, screen_height = pyautogui.size()
center_x = screen_width // 2
center_y = screen_height // 2
radius = 100  # Raio do círculo

# Tempo total para completar o círculo (em segundos)
circle_duration = 180  # 3 minutos
steps = 360  # Dividimos o círculo em 360 pontos (1 grau por passo)
delay_per_step = circle_duration / steps  # Tempo entre cada passo

# Loop infinito
angle = 0
while True:
    # Converte o ângulo para radianos
    rad = math.radians(angle)

    # Calcula a nova posição
    x = center_x + int(radius * math.cos(rad))
    y = center_y + int(radius * math.sin(rad))

    # Move o mouse
    pyautogui.moveTo(x, y)

    # Aguarda o tempo necessário para manter o ritmo
    time.sleep(delay_per_step)

    # Incrementa o ângulo
    angle = (angle + 1) % 360  # Volta a 0 após 359°
