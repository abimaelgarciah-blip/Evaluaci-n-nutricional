# Evaluación Corporal y Nutricional — Generador de PDF

Sitio web para armar el documento de **Evaluación Corporal y Nutricional** de cada
paciente a partir de la plantilla, imprimiendo solo las partes que el paciente
necesita.

Todo funciona **en el navegador**: ningún archivo se sube a internet, los PDF de
los pacientes nunca salen de tu computadora.

## ¿Qué puedes hacer?

1. **Elegir las secciones** del documento (todas vienen marcadas por defecto):
   - Portada principal — Análisis de Composición Corporal (pág. 1)
   - Portada — Revisión Corporal y Nutricional (pág. 2)
   - Portada — Plan de Alimentación (pág. 3)
   - Portada — Lista de Equivalentes (pág. 4)
   - Lista de Equivalentes, contenido (págs. 5–6)
   - Portada — Anexos (pág. 7)
   - Recomendaciones generales (pág. 8)

2. **Elegir la hoja de dieta por kcal** (panel verde bajo la portada del Plan
   de Alimentación):
   - Selecciona las calorías (1100, 1200, 1300… kcal) y la hoja —con sus
     porciones ya marcadas— se inserta automáticamente después de la portada
     del plan (página 3).
   - Escribe el nombre que se imprimirá sobre la línea **NOMBRE** de la hoja;
     si lo dejas vacío se usa el nombre del paciente del encabezado.
   - El botón *Vista previa* muestra la hoja tal como saldrá, con el nombre puesto.
   - **Para agregar más dietas** (hasta 3200 kcal): sube el archivo a la
     carpeta `dietas/` del repositorio con el número de kcal como nombre
     (`dietas/1600.pdf`, `dietas/1700.pdf`…). El sitio las detecta solo, sin
     tocar código.

3. **Insertar PDFs externos** en los puntos donde lo necesitas:
   - Después de la portada de *Revisión Corporal y Nutricional* (uno o varios).
   - Después de la portada del *Plan de Alimentación* (antes de la Lista de
     Equivalentes).
   - Puedes agregar varios archivos por punto, reordenarlos o quitarlos.
   - **Membrete de fondo** (solo en el punto de *Revisión Corporal y
     Nutricional*): puedes elegir una imagen PNG/JPG que se inserta como fondo
     en cada página de los PDF externos de ese punto (útil para subir un PDF en
     blanco y que salga con el membrete). La imagen se recuerda en tu navegador.

4. **Seleccionar los anexos** (págs. 9–53) que requiere el paciente:
   - **Por nombre**: escribe en el buscador (ej. "hierro", "diabetes").
   - **Por número de página**: escribe por ejemplo `9, 12-14, 26` y pulsa
     *Seleccionar*.
   - Cada anexo muestra una miniatura; haz clic en ella para ver la página
     completa antes de decidir.

5. **Generar el PDF final**: descárgalo o ábrelo directo para imprimir. Si
   escribes el nombre del paciente, se usa en el nombre del archivo
   (`Evaluacion_Nombre_2026-06-12.pdf`).
   - El PDF se **comprime automáticamente** para que pese menos: cada página
     se rasteriza a imagen JPEG (~150 DPI, nivel equilibrado). Esto reduce
     bastante el tamaño sin pérdida visible al imprimir. El nivel se puede
     ajustar en `js/app.js` (constante `COMPRESION`).

### Otros detalles útiles

- **Renombrar**: doble clic sobre el nombre de cualquier sección o anexo para
  cambiarlo. Doble clic sobre el rango de páginas (`pág. 5-6`) de una sección
  para ajustarlo. Los cambios quedan guardados en tu navegador.
- **Avanzado → Páginas adicionales**: agrega al final cualquier página suelta
  de la plantilla (ej. `5, 23-25`).
- **Reemplazar plantilla**: si la plantilla cambia en el futuro, cárgala con el
  botón correspondiente; los rangos de página se pueden reajustar desde la
  interfaz, o de forma permanente editando `js/config.js`.
- **Restablecer configuración**: vuelve a los nombres y rangos originales.

## Cómo publicarlo (GitHub Pages)

1. En GitHub, abre **Settings → Pages**.
2. En *Build and deployment*, elige **Deploy from a branch**.
3. Selecciona la rama principal y la carpeta `/ (root)`. Guarda.
4. En un par de minutos el sitio quedará disponible en
   `https://<tu-usuario>.github.io/<nombre-del-repositorio>/`.

## Cómo usarlo localmente (prueba rápida)

Por seguridad, los navegadores no permiten leer la plantilla con `fetch` desde
`file://`, así que conviene levantar un servidor local:

```bash
# con Python
python3 -m http.server 8000

# o con Node
npx http-server -p 8000
```

y abrir <http://localhost:8000>. (Si abres `index.html` directamente, el sitio
funciona igual pero te pedirá cargar la plantilla con el botón
*Reemplazar plantilla…*.)

Esto sirve para probar, pero el servidor se apaga en cuanto cierras la
terminal. Para dejarlo funcionando de forma permanente en un equipo propio
(consultorio, oficina), sigue la guía de abajo.

## Migrar a un servidor propio (uso permanente)

El sitio es **100% estático**: no hay base de datos ni backend, así que
"migrarlo" consiste solo en copiar la carpeta del proyecto a un equipo y
servirla con cualquier servidor web. No hace falta instalar Python, Node ni
nada especial en el servidor final —eso solo es un atajo para probar en tu
propia máquina.

### 1. Copiar los archivos

Clona o copia el repositorio completo (incluyendo `plantilla/`, `dietas/`,
`css/`, `js/`) al equipo/servidor que vas a usar, por ejemplo en
`/var/www/evaluacion-nutricional` (Linux) o `C:\sitios\evaluacion-nutricional`
(Windows).

### 2. Servirlo con un servidor web real

Cualquiera de estas opciones funciona; usa la que ya tengas disponible.

**Linux con Nginx** (recomendado para dejarlo corriendo siempre):

```nginx
server {
    listen 80;
    server_name evaluacion.local;  # o la IP del equipo
    root /var/www/evaluacion-nutricional;
    index index.html;
}
```

```bash
sudo cp evaluacion.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/evaluacion.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

**Linux con Apache**: coloca los archivos en `/var/www/html/` (o un
`VirtualHost` apuntando a la carpeta) y asegúrate de que el módulo
`mod_dir` esté activo para que sirva `index.html` por defecto.

**Windows con IIS**: en el *Administrador de IIS*, agrega un nuevo sitio
apuntando a la carpeta del proyecto, con `index.html` como documento
predeterminado.

**Sin instalar nada (servicio ligero, cualquier SO)**: usa `http-server`
de Node como servicio persistente en vez de ejecutarlo a mano:

```bash
npm install -g http-server
# Linux (systemd) — crea /etc/systemd/system/evaluacion-nutricional.service:
#   [Unit]
#   Description=Evaluación Nutricional
#   After=network.target
#   [Service]
#   ExecStart=/usr/bin/http-server /var/www/evaluacion-nutricional -p 8000
#   Restart=always
#   [Install]
#   WantedBy=multi-user.target
sudo systemctl enable --now evaluacion-nutricional
```

En Windows puedes lograr lo mismo registrando el comando como servicio con
[NSSM](https://nssm.cc/), o dejando corriendo `http-server` con el Programador
de tareas al iniciar sesión.

### 3. Acceso desde otros equipos de la red local

Si el servidor debe verse desde otras computadoras del consultorio/oficina
(no solo desde la máquina donde corre):

- Asegúrate de que el servidor escuche en `0.0.0.0` (Nginx/Apache/IIS lo
  hacen por defecto; con `http-server` usa `-a 0.0.0.0`).
- Abre el puerto correspondiente (80, 8000, etc.) en el firewall del equipo.
- En las otras computadoras, entra a `http://<IP-del-servidor>:<puerto>`
  (por ejemplo `http://192.168.1.50:8000`). Puedes fijar esa IP como
  reservada en el router para que no cambie.
- Opcional: si tienes un dominio o DNS interno, apúntalo a esa IP para usar
  un nombre en vez de la IP (`http://evaluacion.local`).

### 4. HTTPS (opcional)

No es obligatorio en una red local cerrada, pero si quieres cifrar la
conexión puedes generar un certificado autofirmado, o usar
[Caddy](https://caddyserver.com/) en vez de Nginx (emite HTTPS local
automáticamente con `caddy file-server`).

### 5. Modo totalmente sin internet (opcional)

El sitio guarda todo en el navegador del usuario, pero **sigue cargando
tres librerías desde un CDN público** (`pdf-lib`, `pdf.js` y su *worker*),
declaradas en `index.html` y `js/app.js`. Si el servidor va a operar en una
red sin salida a internet, descarga esos tres archivos y sírvelos de forma
local:

1. Descarga:
   - `https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js`
   - `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js`
   - `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`
2. Guárdalos en una carpeta nueva, por ejemplo `vendor/`.
3. En `index.html`, cambia las dos etiquetas `<script src="https://cdnjs...">`
   por rutas locales (`vendor/pdf-lib.min.js`, `vendor/pdf.min.js`).
4. En `js/app.js`, cambia la línea de `workerSrc` por la ruta local
   (`vendor/pdf.worker.min.js`).

Si el equipo sí tiene internet (aunque sea limitado), no es necesario hacer
esto: las librerías se cachean en el navegador tras la primera carga.

### Nota sobre la contraseña de acceso

El candado de `js/auth.js` es solo una barrera básica (compara el hash de la
contraseña en el propio navegador) para evitar el uso casual; no es
seguridad real, ya que el sitio es estático y su código es visible para
cualquiera con acceso al servidor. Si necesitas control de acceso serio
(usuarios, permisos, HTTPS obligatorio), eso debe resolverse a nivel del
servidor web (autenticación básica de Nginx/Apache/IIS, VPN, red interna,
etc.), no con este candado.

## Estructura del proyecto

```
index.html              Interfaz principal
css/styles.css          Estilos
js/config.js            Mapa de secciones y anexos (nombres + páginas)
js/app.js               Lógica: selección, miniaturas y generación del PDF
dietas/                 Hojas de dieta por kcal (1100.pdf, 1200.pdf, …)
plantilla/plantilla.pdf Plantilla base (53 páginas)
```

Librerías (cargadas desde CDN, requieren internet en el navegador):
[pdf-lib](https://pdf-lib.js.org/) para armar el PDF final y
[pdf.js](https://mozilla.github.io/pdf.js/) para las miniaturas y vistas previas.
