@echo off
echo Generando iconos para la extension...
echo.

REM Verificar si ImageMagick está instalado
where magick >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Usando ImageMagick para generar icones...
    magick convert icons\icon.svg -resize 16x16 icons\icon16.png
    magick convert icons\icon.svg -resize 48x48 icons\icon48.png
    magick convert icons\icon.svg -resize 128x128 icons\icon128.png
    echo.
    echo Iconos generados exitosamente!
) else (
    echo ImageMagick no esta instalado.
    echo.
    echo Opciones para generar los iconos:
    echo 1. Abre generate-icons.html en tu navegador (recomendado)
    echo 2. Instala ImageMagick desde https://imagemagick.org/
    echo 3. Usa Node.js con: npm install canvas ^&^& node generate-icons.js
    echo.
    echo Abriendo generate-icons.html en tu navegador...
    start generate-icons.html
)

pause