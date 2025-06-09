# Green Design Assistant MVP

Este proyecto es un MVP para generar propuestas de infraestructura verde a partir de descripciones en lenguaje natural. Incluye un backend en Express que utiliza la API de OpenAI y un frontend en React con visualización 3D.

## Requisitos
- Node.js 18+
- Una clave de API de OpenAI en la variable `OPENAI_API_KEY`

## Instalación

```bash
# Instalar dependencias de todo el proyecto
npm install
cd backend && npm install
cd ../frontend && npm install
```

## Ejecución en desarrollo

1. Construye el frontend:
   ```bash
   cd frontend
   npm run build
   ```
2. Inicia el servidor Express:
   ```bash
   cd ../backend
   OPENAI_API_KEY=tu_clave npm start
   ```
3. Abre `http://localhost:3000` en el navegador.

## Uso

Describe tu idea en el cuadro de texto y presiona **Enviar**. El sistema devolverá una propuesta resumida, una vista 3D simplificada y un botón para exportar los datos en JSON.
