# Iconos de la Extensión

Los iconos de la extensión deben estar en formato PNG en tres tamaños:
- icon16.png (16x16 píxeles)
- icon48.png (48x48 píxeles)
- icon128.png (128x128 píxeles)

## Cómo Generar los Iconos

### Opción 1: Usar el Generador HTML (Recomendado)

1. Abre el archivo `generate-icons.html` en tu navegador
2. Haz clic en "Generar y Descargar Iconos"
3. Los iconos se descargarán automáticamente a tu carpeta de Descargas
4. Mueve los archivos descargados a esta carpeta (`icons/`)

### Opción 2: Usar el Script PowerShell

1. Ejecuta `powershell -ExecutionPolicy Bypass -File generate-icons.ps1`
2. Sigue las instrucciones que aparecen

### Opción 3: Usar el Script Node.js

1. Instala Node.js si no lo tienes
2. Ejecuta `npm install canvas`
3. Ejecuta `node generate-icons.js`

### Opción 4: Usar ImageMagick

1. Instala ImageMagick desde https://imagemagick.org/
2. Ejecuta `generate-icons.bat` (Windows) o usa el comando directamente:
   ```
   magick convert icon.svg -resize 16x16 icon16.png
   magick convert icon.svg -resize 48x48 icon48.png
   magick convert icon.svg -resize 128x128 icon128.png
   ```

### Opción 5: Manualmente

1. Abre `icon.svg` en un editor de imágenes (GIMP, Photoshop, etc.)
2. Exporta en los tres tamaños requeridos (16, 48, 128)
3. Guarda como PNG en esta carpeta

## Verificación

Después de generar los iconos, deberías tener estos archivos en esta carpeta:
- icon16.png
- icon48.png
- icon128.png

Sin estos archivos, la extensión no se cargará correctamente en Edge.