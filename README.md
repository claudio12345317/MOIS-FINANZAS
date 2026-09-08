# Mis Finanzas

App de finanzas personales en un solo archivo (`index.html`). Corre en el navegador, sin instalar nada, y se sincroniza sola entre tu teléfono y tu computadora usando Firebase (gratis).

## Antes de usarla: conectar tu propio Firebase (10 minutos, una sola vez)

La app necesita su propia base de datos para guardar tus movimientos. Se crea gratis en un proyecto de Firebase tuyo.

### 1. Crear el proyecto
1. Andá a [console.firebase.google.com](https://console.firebase.google.com) con tu cuenta de Google.
2. "Agregar proyecto" → ponele un nombre (ej. `mis-finanzas`) → seguí los pasos por defecto (podés desactivar Google Analytics, no hace falta).

### 2. Activar el login por email
1. En el menú izquierdo: **Compilación → Authentication** → "Comenzar".
2. Pestaña **Sign-in method** → elegí **Correo electrónico/contraseña** → activarlo → Guardar.

### 3. Crear la base de datos
1. En el menú izquierdo: **Compilación → Firestore Database** → "Crear base de datos".
2. Elegí una ubicación (cualquiera cercana, ej. `us-east1`) → modo **producción** → Habilitar.
3. Andá a la pestaña **Reglas** y reemplazá todo el contenido por el de [`firestore.rules`](firestore.rules) de esta carpeta → Publicar.
   - Esto asegura que solo vos (con tu sesión iniciada) podés leer o escribir tus propios datos.

### 4. Registrar la app web y copiar la configuración
1. En el ícono ⚙ (arriba a la izquierda) → **Configuración del proyecto**.
2. Bajá hasta "Tus apps" → ícono **</>** (Web) → ponele un nombre (ej. `web`) → Registrar app.
3. Te va a mostrar un bloque `firebaseConfig = { apiKey: ..., authDomain: ..., ... }`. Copiá esos valores.

### 5. Pegar la configuración en el archivo
Abrí [`index.html`](index.html), buscá esta sección cerca del principio del `<script>` (después de todos los `<style>`):

```js
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};
```

Reemplazá cada valor por el que copiaste en el paso anterior. Guardá el archivo.

## Publicarla para usarla desde el teléfono y la computadora

Para que sincronice, tiene que abrirse siempre desde la misma dirección web (no como archivo suelto). Como pediste que quede en un repositorio de GitHub aparte:

1. Creá un repositorio nuevo y vacío en GitHub (ej. `mis-finanzas-app`), sin README ni licencia.
2. Subí esta carpeta:
   ```bash
   cd "Mis-Finanzas-App"
   git init
   git add .
   git commit -m "Version inicial de Mis Finanzas con sincronizacion Firebase"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/mis-finanzas-app.git
   git push -u origin main
   ```
3. Activá GitHub Pages: en el repo → **Settings → Pages** → "Source": rama `main`, carpeta `/ (root)` → Guardar.
4. En un minuto te da una URL tipo `https://tu_usuario.github.io/mis-finanzas-app/`. Esa es la dirección que abrís **siempre igual** desde el teléfono y la computadora.
5. En Firebase console → Authentication → pestaña **Settings → Authorized domains** → agregá `tu_usuario.github.io` (GitHub Pages ya suele venir habilitado por defecto para `*.github.io`, pero confirmalo ahí).

### Primer uso
1. Abrí la URL de GitHub Pages.
2. Tocá "Crear cuenta nueva", poné tu email y una contraseña (mínimo 6 caracteres). Quedás con tus datos vacíos (con 4 movimientos de ejemplo para que veas cómo se ve).
3. En el otro dispositivo, abrí la misma URL y esta vez usá "Ingresar" con el mismo email y contraseña. Vas a ver los mismos datos, y a partir de ahí lo que cargues en un dispositivo aparece también en el otro (con la app abierta, se actualiza sola; si estaba cerrada, se actualiza al abrirla).

## Qué cambió respecto a la versión original

- **Antes**: los datos se guardaban con `window.storage`, una función que solo existe dentro de Claude — al abrir el archivo suelto en un navegador normal, nada se guardaba y cada intento de guardar mostraba un error.
- **Ahora**: los datos se guardan en Firestore (Firebase), asociados a tu cuenta (email + contraseña), y se sincronizan automáticamente entre todos los dispositivos donde inicies sesión con esa cuenta.
- Se agregó un botón **"Importar copia (.json)"** junto al de exportar, para restaurar un backup.
- Se corrigió que el texto y las categorías cargadas por vos se insertaran sin escapar en la página (riesgo de romper el diseño si pegabas texto con `<` o `>`).
- Al quitar una categoría de egreso, ahora también se borra su presupuesto asociado (antes quedaba "huérfano").
- Los selectores de mes ahora también incluyen cualquier mes con movimientos cargados, no solo los últimos 12.

## Dónde se guardan los datos

En Firestore, en el documento `finanzas/{tu-id-de-usuario}`, protegido por las reglas de `firestore.rules` para que solo tu cuenta pueda leerlo o escribirlo. El botón "Exportar copia (.json)" sigue estando disponible como respaldo manual adicional.
