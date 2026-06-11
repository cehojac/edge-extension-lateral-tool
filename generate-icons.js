// Script para generar iconos PNG usando Node.js
// Requiere: npm install canvas

const fs = require('fs');
const path = require('path');

try {
    const { createCanvas } = require('canvas');
    
    const sizes = [16, 48, 128];
    const outputDir = path.join(__dirname, 'icons');
    
    // Crear directorio si no existe
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    function drawIcon(size) {
        const canvas = createCanvas(size, size);
        const ctx = canvas.getContext('2d');
        
        // Fondo
        ctx.fillStyle = '#0078d4';
        ctx.fillRect(0, 0, size, size);
        
        // Configurar estilo de línea
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
        
        return canvas;
    }
    
    console.log('Generando iconos...');
    
    sizes.forEach(size => {
        const canvas = drawIcon(size);
        const buffer = canvas.toBuffer('image/png');
        const filename = path.join(outputDir, `icon${size}.png`);
        fs.writeFileSync(filename, buffer);
        console.log(`✓ Generado: icon${size}.png`);
    });
    
    console.log('\n¡Iconos generados exitosamente!');
    
} catch (error) {
    console.error('Error:', error.message);
    console.log('\nPara usar este script, necesitas instalar el paquete "canvas":');
    console.log('npm install canvas');
    console.log('\nAlternativamente, abre generate-icons.html en tu navegador para generar los iconos manualmente.');
}