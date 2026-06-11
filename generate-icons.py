#!/usr/bin/env python3
"""
Generador de iconos PNG para la extensión
Requiere: pip install Pillow
"""

try:
    from PIL import Image, ImageDraw
    import os

    def create_icon(size):
        # Crear imagen con fondo azul
        img = Image.new('RGB', (size, size), color='#0078d4')
        draw = ImageDraw.Draw(img)
        
        # Configurar línea
        line_width = max(2, size // 16)
        white = '#ffffff'
        
        # Barra lateral vertical
        margin = size * 0.3
        draw.line([(margin, size * 0.2), (margin, size * 0.8)], fill=white, width=line_width)
        
        # Líneas horizontales (herramientas)
        tool_y = [0.3, 0.5, 0.7]
        for y in tool_y:
            draw.line([(size * 0.4, size * y), (size * 0.8, size * y)], fill=white, width=line_width)
        
        # Círculo pequeño (engranaje)
        circle_radius = size * 0.08
        circle_x = size * 0.15
        circle_y = size * 0.85
        draw.ellipse([
            circle_x - circle_radius, 
            circle_y - circle_radius,
            circle_x + circle_radius, 
            circle_y + circle_radius
        ], outline=white, width=line_width)
        
        return img

    def main():
        sizes = [16, 48, 128]
        icons_dir = 'icons'
        
        # Crear directorio si no existe
        if not os.path.exists(icons_dir):
            os.makedirs(icons_dir)
        
        print("Generando iconos...")
        
        for size in sizes:
            img = create_icon(size)
            filename = os.path.join(icons_dir, f'icon{size}.png')
            img.save(filename, 'PNG')
            print(f"Creado: {filename}")
        
        print("\nIconos generados exitosamente!")
        print("Ahora puedes cargar la extension en Edge.")

    if __name__ == '__main__':
        main()

except ImportError:
    print("Error: No se encontró la librería Pillow.")
    print("\nPara instalar:")
    print("  pip install Pillow")
    print("\nO usa el archivo create-simple-icons.html en tu navegador.")
except Exception as e:
    print(f"Error: {e}")
    print("\nAlternativa: Abre create-simple-icons.html en tu navegador.")