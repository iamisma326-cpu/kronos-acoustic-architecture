# KRONOS — Arquitectura Acústica & Diseño Espacial

Landing page editorial e inmersiva para **KRONOS**, un estudio ficticio de arquitectura acústica de vanguardia con sedes en Zúrich, Tokio y Madrid. El proyecto combina composición tipográfica de alto contraste con animaciones fluidas al hacer scroll.

## Características principales

- **GSAP + ScrollTrigger**: Animación de entrada en el Hero, revelado progresivo de secciones, barra de progreso superior y efectos parallax en imágenes.
- **Sección horizontal fijada (Pin)**: Galería de obras monumentales con desplazamiento horizontal sincronizado al scroll en escritorio y adaptable a vertical en dispositivos móviles.
- **Lenis Smooth Scroll**: Desplazamiento suave de inercia sincronizado con el ticker de GSAP.
- **SplitType**: Animación carácter por carácter en titulares y revelado palabra por palabra en el manifiesto.
- **Contadores animados**: Métricas acústicas que incrementan dinámicamente al entrar en el viewport.
- **Microinteracciones**: Botones con efecto magnético al cursor y cursor personalizado.
- **Accesibilidad**: Soporte completo para `prefers-reduced-motion: reduce`, desactivando desplazamientos forzados y animaciones intensivas.

## Estructura de archivos

```text
.
├── index.html       # Estructura semántica HTML5
├── styles.css       # Diseño editorial oscuro, variables CSS y responsive
├── js/
│   └── main.js      # Lógica de GSAP, ScrollTrigger, Lenis y SplitType
└── README.md        # Documentación del proyecto
```

## Cómo visualizar el proyecto localmente

No requiere instalación de dependencias ni compilación (todas las librerías se cargan mediante CDN con versión fija).

1. Clona o descarga este repositorio.
2. Abre el archivo `index.html` directamente en tu navegador web o utiliza una extensión como **Live Server** en VS Code:
   ```bash
   npx serve .
   ```