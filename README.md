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

## Cómo usarlo localmente

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
