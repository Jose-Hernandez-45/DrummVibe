from selenium import webdriver
from selenium.webdriver.edge.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Cambia esta ruta por la ubicación donde descargaste msedgedriver.exe
service = Service(r"C:/edgedriver_win64/msedgedriver.exe")

driver = webdriver.Edge(service=service)

try:
    # Primero ir a la página principal
    driver.get("https://drummvibe2-0.onrender.com")
    print("Título de la página principal:", driver.title)

    # Luego navegar a /templates/login
    driver.get("https://drummvibe2-0.onrender.com/templates/login.html")
    print("Título de la página login:", driver.title)

    wait = WebDriverWait(driver, 10)

    # Esperar y obtener el campo usuario
    usuario_input = wait.until(EC.presence_of_element_located((By.NAME, "usuario")))
    usuario_input.send_keys("Jose M")

    # Obtener campo contraseña
    contrasena_input = driver.find_element(By.NAME, "contrasena")
    contrasena_input.send_keys("EVQR4545")

    # Encontrar y hacer clic en el botón submit
    boton_submit = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
    boton_submit.click()

    # Esperar mensaje de login exitoso (ajusta el selector según tu página)
    mensaje = wait.until(EC.presence_of_element_located((By.ID, "mensaje-login-exitoso")))
    print("Mensaje:", mensaje.text)

except Exception as e:
    print("Error durante la prueba:", e)

finally:
    driver.quit()
