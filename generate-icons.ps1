# Script para generar iconos PNG desde SVG
# Requiere: PowerShell con System.Drawing

$svgPath = "icons\icon.svg"
$outputDir = "icons"

# Verificar si el archivo SVG existe
if (-not (Test-Path $svgPath)) {
    Write-Host "Error: No se encuentra el archivo $svgPath" -ForegroundColor Red
    exit 1
}

# Crear directorio de salida si no existe
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

Write-Host "Generando iconos..." -ForegroundColor Green

# Usar una biblioteca externa para convertir SVG a PNG
# Para simplificar, usaremos un método alternativo con HTML Canvas

$htmlContent = @"
<!DOCTYPE html>
<html>
<head>
    <title>Generar Iconos</title>
</head>
<body>
    <canvas id="canvas16" width="16" height="16"></canvas>
    <canvas id="canvas48" width="48" height="48"></canvas>
    <canvas id="canvas128" width="128" height="128"></canvas>
    <script>
        function drawIcon(canvas, size) {
            const ctx = canvas.getContext('2d');
            
            // Fondo
            ctx.fillStyle = '#0078d4';
            ctx.fillRect(0, 0, size, size);
            
            // Dibujar icono de barra lateral
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = size / 16;
            ctx.lineCap = 'round';
            
            // Barra lateral
            ctx.beginPath();
            ctx.moveTo(size * 0.3, size * 0.2);
            ctx.lineTo(size * 0.3, size * 0.8);
            ctx.stroke();
            
            // Herramientas
            const toolY = [0.3, 0.5, 0.7];
            toolY.forEach(y => {
                ctx.beginPath();
                ctx.moveTo(size * 0.4, size * y);
                ctx.lineTo(size * 0.8, size * y);
                ctx.stroke();
            });
            
            // Icono de engranaje pequeño
            ctx.beginPath();
            ctx.arc(size * 0.15, size * 0.85, size * 0.08, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        function downloadCanvas(canvas, filename) {
            const link = document.createElement('a');
            link.download = filename;
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
        
        // Generar todos los iconos
        window.onload = function() {
            drawIcon(document.getElementById('canvas16'), 16);
            drawIcon(document.getElementById('canvas48'), 48);
            drawIcon(document.getElementById('canvas128'), 128);
            
            downloadCanvas(document.getElementById('canvas16'), 'icon16.png');
            downloadCanvas(document.getElementById('canvas48'), 'icon48.png');
            downloadCanvas(document.getElementById('canvas128'), 'icon128.png');
        };
    </script>
</body>
</html>
"@

$htmlPath = "temp-generate-icons.html"
$htmlContent | Out-File -FilePath $htmlPath -Encoding UTF8

Write-Host "Abriendo $htmlPath en tu navegador..." -ForegroundColor Yellow
Write-Host "Por favor, espera a que se descarguen los iconos y luego muévelos a la carpeta 'icons'" -ForegroundColor Yellow

Start-Process $htmlPath

Write-Host ""
Write-Host "Instrucciones:" -ForegroundColor Cyan
Write-Host "1. Los iconos se descargarán automáticamente a tu carpeta de Descargas"
Write-Host "2. Mueve icon16.png, icon48.png e icon128.png a la carpeta 'icons'"
Write-Host "3. Elimina el archivo temp-generate-icons.html cuando termines"