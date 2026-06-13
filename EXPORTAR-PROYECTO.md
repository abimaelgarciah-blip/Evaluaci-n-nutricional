# Documento de exportación — Evaluación Corporal y Nutricional (Generador de PDF)

Este documento describe **todo** el proyecto para poder reconstruirlo, migrarlo o
integrarlo en otro proyecto **tal cual está**. Es autocontenido: con esta guía y
los archivos del repositorio, el sitio funciona sin instalar nada.

---

## 1. Qué es

Sitio web que arma el PDF de **"Evaluación Corporal y Nutricional"** de cada
paciente a partir de una **plantilla de 53 páginas**, imprimiendo únicamente las
secciones, hojas de dieta y anexos que ese paciente necesita.

- **100% en el navegador**: no hay backend ni base de datos.
- **Privado**: ningún archivo (plantilla ni PDFs del paciente) se sube a internet.
- **Sin build ni dependencias instalables**: HTML + CSS + JavaScript puro.

---

## 2. Stack técnico

| Pieza | Detalle |
|-------|---------|
| Lenguajes | HTML5, CSS3, JavaScript (vanilla, sin frameworks) |
| Ensamblado de PDF | [pdf-lib](https://pdf-lib.js.org/) **1.17.1** (CDN) |
| Miniaturas / vistas previas | [pdf.js](https://mozilla.github.io/pdf.js/) **3.11.174** (CDN) |
| Persistencia | `localStorage` del navegador (nombres y rangos editados) |
| Hosting recomendado | GitHub Pages (Deploy from branch, carpeta `/ (root)`) |
| Único requisito de red | Cargar las 2 librerías desde CDN |

CDNs usados en `index.html`:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
```

---

## 3. Estructura del proyecto

```
index.html              Interfaz principal (3 pasos + columna de resumen + modal preview)
css/styles.css          Estilos (399 líneas)
js/config.js            Datos del documento: dietas, secciones y anexos (nombres + páginas)
js/app.js               Toda la lógica (858 líneas)
dietas/                 Hojas de dieta por kcal (PDF). Una por nivel calórico
plantilla/plantilla.pdf Plantilla base de 53 páginas
README.md               Documentación de uso para el usuario final
EXPORTAR-PROYECTO.md    Este documento
```

### Activos binarios que deben copiarse
- `plantilla/plantilla.pdf` — **imprescindible**, es la base de todo.
- `dietas/*.pdf` — 21 hojas de dieta: `1100.pdf`, `1200.pdf`, … `3000.pdf` y `3200.pdf`.
  - **Nota:** la serie va de 100 en 100 entre 1100 y 3000, luego salta a 3200
    (falta `dietas/3100.pdf`). El sitio detecta solo qué archivos existen.

---

## 4. Modelo de datos (`js/config.js`)

Objeto `CONFIG_PREDETERMINADA` con tres bloques:

### 4.1 Dietas
```js
dieta: {
  carpeta: 'dietas/',
  kcalMin: 1100,
  kcalMax: 3200,
  paso: 100,
  despuesDe: 'portada-plan',              // punto de inserción
  nombre: { x: 360, y: 657.7, tamano: 12 } // dónde se imprime el nombre del paciente
}                                          // (coords PDF en puntos, origen abajo-izq, carta)
```
El sitio recorre de `kcalMin` a `kcalMax` en pasos de `paso` y muestra solo las
hojas cuyo archivo existe en `dietas/`. Para añadir una dieta nueva basta subir
`dietas/<kcal>.pdf` — **sin tocar código**.

### 4.2 Secciones (orden de impresión del documento)
Cada sección: `id`, `nombre`, `paginas`, y opcional `slotExterno` (permite
insertar PDFs externos justo después).

| id | Nombre | Páginas | Slot externo |
|----|--------|---------|--------------|
| `portada-principal` | Portada principal — Análisis de Composición Corporal | 1 | — |
| `portada-revision` | Portada — Revisión Corporal y Nutricional | 2 | `ext-revision` |
| `portada-plan` | Portada — Plan de Alimentación | 3 | `ext-plan` |
| `portada-equivalentes` | Portada — Lista de Equivalentes | 4 | — |
| `contenido-equivalentes` | Lista de Equivalentes (contenido) | 5-6 | — |
| `portada-anexos` | Portada — Anexos | 7 | — |
| `recomendaciones` | Recomendaciones generales | 8 | — |

> La hoja de dieta se inserta tras `portada-plan` (página 3); los PDFs externos
> del plan se insertan antes de la Lista de Equivalentes.

### 4.3 Anexos (págs. 9–53, uno por página — 45 en total)
| Pág | Nombre | Pág | Nombre |
|-----|--------|-----|--------|
| 9  | Alimentos con Colesterol | 31 | El Estrés |
| 10 | Alimentos con Hierro | 32 | Antioxidantes (1 de 2) |
| 11 | Alimentos con Zinc | 33 | Antioxidantes (2 de 2) |
| 12 | Alimentos con Magnesio | 34 | Parasitosis |
| 13 | Alimentos con Purinas | 35 | Reflujo en el Adulto |
| 14 | Alimentos con Ácido Fólico | 36 | Alimentos con Fibra |
| 15 | Alimentos con Calcio | 37 | Dieta Renal |
| 16 | Alimentos con Sodio | 38 | Hidratación — Bebidas Isotónicas |
| 17 | Alimentos con Potasio | 39 | Insuficiencia Renal (1 de 2) |
| 18 | Vitamina B12 | 40 | Insuficiencia Renal (2 de 2) |
| 19 | Vitamina C | 41 | Hipertensión |
| 20 | Alimentos con Omega 3 | 42 | Comer Fuera de Casa |
| 21 | Alimentos con Fósforo | 43 | Hepatitis |
| 22 | Vitamina D | 44 | Alimentos Bajos en Grasas |
| 23 | Ácidos Grasos Saturados | 45 | Dislipidemias |
| 24 | Azúcar y Grasa (1 de 2) | 46 | Diarrea |
| 25 | Azúcar y Grasa (2 de 2) | 47 | Hipertrigliceridemia |
| 26 | Diabetes — Alimentos prohibidos | 48 | Hemorroides |
| 27 | Colitis y Úlceras | 49 | Cálculos Renales (Litiasis) |
| 28 | Acidez Gástrica | 50 | Alimentos con Tiramina — Migraña (1 de 2) |
| 29 | Estreñimiento | 51 | Alimentos con Tiramina — Migraña (2 de 2) |
| 30 | Esteatosis | 52 | Gluten en los Alimentos (1 de 2) |
|    |  | 53 | Gluten en los Alimentos (2 de 2) |

---

## 5. Funcionalidad (flujo de uso)

1. **Plantilla**: se carga automáticamente desde `plantilla/plantilla.pdf` (vía
   `fetch`); si se sirve por `file://` se carga a mano con "Reemplazar plantilla…".
2. **Secciones**: se marcan las que se imprimirán (todas activas por defecto).
3. **Hoja de dieta por kcal**: se elige el nivel calórico; la hoja se inserta tras
   la portada del plan con el nombre del paciente impreso sobre la línea NOMBRE.
   Botón de *Vista previa* para verla antes.
4. **PDFs externos**: se insertan en los puntos `ext-revision` y `ext-plan`
   (varios archivos, reordenables, eliminables).
5. **Anexos**: selección por **nombre** (buscador) o por **rango de páginas**
   (`9, 12-14, 26`), con miniatura y vista previa a página completa.
6. **Documento final**: columna de resumen con el orden y total de páginas;
   botones **Descargar** e **Imprimir**.
   - Nombre del archivo: `Evaluacion_<Nombre>_<fecha>.pdf`.
7. **Personalización**:
   - Doble clic para renombrar secciones/anexos o ajustar rangos de página.
   - Modo **Avanzado**: añadir páginas sueltas de la plantilla al final.
   - Reemplazar plantilla / Restablecer configuración a los valores originales.
   - Los cambios se guardan en `localStorage`.

---

## 6. Lógica principal (`js/app.js`, 858 líneas)

Funciones clave (todo dentro de un IIFE):

| Función | Rol |
|---------|-----|
| `clonar`, `guardarEstado`, `cargarEstado` | Estado + persistencia en localStorage |
| `parsearPaginas(texto, max)` | Convierte `"9, 12-14"` en lista de páginas |
| `cargarPlantillaInicial`, `usarPlantilla` | Carga/reemplazo de la plantilla |
| `detectarDietas`, `obtenerDietaBytes`, `nombreEnDieta`, `abrirPreviewDieta` | Manejo de hojas de dieta |
| `renderizarPanelDieta` | Panel verde de selección de kcal |
| `pedirMiniatura`, `procesarColaMiniaturas`, `abrirPreview` | Miniaturas y modal (pdf.js) |
| `hacerEditable` | Doble clic para renombrar/editar |
| `renderizarSecciones`, `renderizarSlotExterno`, `renderizarAnexos`, `renderizarResumen` | Render de la UI |
| `actualizarContadorAnexos`, `escaparHtml`, `escapar` | Utilidades de UI |
| `construirOrden` | Calcula el orden final de páginas del documento |
| `generarPdf` | Ensambla el PDF final con pdf-lib |
| `nombreArchivoSalida`, `descargarBlob`, `imprimirBytes` | Salida (descarga/impresión) |
| `conMensaje`, `conectarEventos` | Feedback y wiring de eventos |

---

## 7. Cómo correrlo

Por seguridad, los navegadores no permiten leer la plantilla con `fetch` desde
`file://`, así que conviene levantar un servidor estático local:

```bash
# con Python
python3 -m http.server 8000

# o con Node
npx http-server -p 8000
```
Abrir <http://localhost:8000>. (Si se abre `index.html` directo funciona igual,
pero pide cargar la plantilla con "Reemplazar plantilla…").

### Publicar en GitHub Pages
1. **Settings → Pages**.
2. *Build and deployment* → **Deploy from a branch**.
3. Rama principal + carpeta **`/ (root)`** → Guardar.
4. Queda en `https://<usuario>.github.io/<repositorio>/`.

---

## 8. Checklist para exportar a otro proyecto

- [ ] Copiar `index.html`, `css/styles.css`, `js/config.js`, `js/app.js`.
- [ ] Copiar la carpeta `plantilla/` (con `plantilla.pdf`) — **imprescindible**.
- [ ] Copiar la carpeta `dietas/` completa (los 21 PDF).
- [ ] Mantener internet para los 2 CDN (o autoalojar `pdf-lib` y `pdf.js`).
- [ ] Servir por HTTP (no `file://`) para la carga automática de la plantilla.
- [ ] (Opcional) Ajustar `js/config.js` si la plantilla nueva cambia páginas o
      nombres, o las coordenadas del nombre en la hoja de dieta.

El proyecto es totalmente **autocontenido y portable**: copiando esos elementos a
cualquier servidor estático o repositorio nuevo, funciona sin instalar nada.
