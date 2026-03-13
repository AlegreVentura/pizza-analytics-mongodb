<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=timeGradient&customColorList=12,20,30&height=220&section=header&text=Datatouille%20Dashboard&fontSize=52&fontAlignY=38&fontColor=ffffff&desc=Pizza%20Analytics%20%C2%B7%20MongoDB%20%C2%B7%20Next.js%2015&descAlignY=58&descSize=20&animation=fadeIn" />
</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=20&duration=2800&pause=800&color=A78BFA&center=true&vCenter=true&width=660&lines=Dashboard+de+analytics+para+cadena+de+pizzer%C3%ADas;50%2C000%2B+%C3%B3rdenes+%C2%B7+20+sucursales+en+CDMX;Next.js+15+%2B+MongoDB+Atlas+%2B+Prophet+Forecast" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white"/>
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white"/>
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/Material_UI_v7-007FFF?style=for-the-badge&logo=mui&logoColor=white"/>
  <img src="https://img.shields.io/badge/Jupyter-F37626?style=for-the-badge&logo=jupyter&logoColor=white"/>
  <img src="https://img.shields.io/badge/Plotly-3F4F75?style=for-the-badge&logo=plotly&logoColor=white"/>
</p>

---

## Resultados clave

| Métrica | Valor |
|---------|-------|
| Documentos en MongoDB | 50,454 |
| Sucursales mapeadas (CDMX) | 20 |
| Endpoints REST | 20+ |
| Dias de pronostico (Prophet) | 60 |
| Dataset original (Kaggle, 2015) | 48,620 ordenes |
| Charts y visualizaciones | 15+ |

---

## Estructura del proyecto

| Ruta | Descripcion |
|------|-------------|
| `DBNOSQL_Proyecto/app/(dashboard)/` | Paginas del dashboard y componentes de charts |
| `DBNOSQL_Proyecto/app/api/` | 20+ endpoints REST con validacion Zod |
| `DBNOSQL_Proyecto/lib/` | Conexion MongoDB (singleton + indices) y rate limiter |
| `DBNOSQL_Proyecto/theme/` | Tema Material UI personalizado |
| `DBNOSQL_Proyecto/public/` | Assets estaticos (logos) |
| `ETL/` | Pipeline Python: enriquecimiento, limpieza y carga |

---

## Documentacion

- [Setup y configuracion](#setup)
- [Pipeline ETL — orden de ejecucion](#4-run-the-etl-pipeline-required-before-first-launch)
- [API Overview — todos los endpoints](#api-overview)
- [Modelo de datos MongoDB](#data-model)

---

## Features

- **KPI cards** — ingreso anual, promedio diario, unidades vendidas, precio promedio
- **Series de tiempo** — ventas por hora, dia de la semana, trimestre
- **Heatmap semanal** — revenue por hora x dia de la semana (Plotly)
- **Matriz de evaluacion** — clasificacion estrategica 4 cuadrantes (Estrella / Mantener / Promocionar / Descontinuar)
- **Analisis de lealtad** — preferencia de pizza: clientes leales vs. general
- **Market basket recommender** — co-ocurrencia de ingredientes estilo Apriori
- **Pronostico 60 dias** — modelo Prophet almacenado en MongoDB
- **Mapa de sucursales** — Leaflet con 20 ubicaciones en CDMX y stats por sucursal
- **Tabla de ordenes** — DataGrid paginado con filtros y ordenamiento
- **CRUD de empleados** — panel en memoria con Toolpad Core

---

## Setup

### 1. Clonar el repositorio

```bash
git clone https://github.com/AlegreVentura/pizza-analytics-mongodb.git
cd DBNOSQL_Proyecto
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env.local
```

| Variable | Descripcion |
|----------|-------------|
| `MONGODB_URI` | Connection string de MongoDB Atlas |
| `AUTH_SECRET` | Secret aleatorio — generar con `npx auth secret` |
| `AUTH_USERS` | Array JSON de `{ email, password (bcrypt hash), name }` |

Para generar un hash bcrypt:
```bash
node -e "const b=require('bcryptjs'); b.hash('tupassword',10).then(console.log)"
```

### 4. Run the ETL pipeline (required before first launch)

El dashboard requiere datos en MongoDB. Ejecutar los cuatro notebooks en orden desde la carpeta `ETL/`:

```bash
cd ../ETL
pip install pandas numpy prophet pymongo openpyxl jupyter
jupyter notebook
```

| Notebook | Que hace |
|----------|----------|
| `1_Unir_bases.ipynb` | Enriquece el CSV de Kaggle con geolocalizacion sintetica, IDs de cliente y pesos de ingredientes |
| `2_Simular_datos_sucios.ipynb` | Inyecta ruido controlado (duplicados, NaN) para simular datos reales sucios |
| `3_Limpia_datos.ipynb` | Limpia el dataset y carga ~50,000 documentos en `pizzaDB.menu` |
| `4_Forecast_Prophet.ipynb` | Entrena pronostico de 60 dias y guarda resultados en `pizzaDB.forecasts` |

> Asegurarse de que `MONGODB_URI` este configurado dentro de cada notebook que escribe a MongoDB.

> **Nota sobre los datos:** los archivos CSV, JSON y XLSX de la carpeta `ETL/` no se incluyen en el repositorio porque son reproducibles ejecutando los notebooks en orden. Subir datasets de ~50,000 registros a Git no es buena practica — el historial de versiones no esta disenado para archivos binarios o de datos grandes. Si necesitas el dataset original, descargalo desde [Kaggle — Pizza Sales Dataset](https://www.kaggle.com/datasets/mysarahmadbhat/pizza-place-sales) y coloca el archivo en `ETL/` antes de ejecutar el notebook 1.

### 5. Iniciar el servidor de desarrollo

```bash
cd ../DBNOSQL_Proyecto
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) e iniciar sesion con las credenciales configuradas en `AUTH_USERS`.

---

## API Overview

Todos los endpoints requieren sesion activa. Las respuestas usan codigos HTTP estandar.

| Endpoint | Descripcion |
|----------|-------------|
| `GET /api/kpis` | Ingreso anual, promedio diario, unidades vendidas, precio promedio |
| `GET /api/ventas-hora` | Ventas por hora (filtros: `startDate`, `endDate`, `mall`) |
| `GET /api/ventas-dia` | Promedio de ventas por dia de la semana |
| `GET /api/temporadas` | Revenue trimestral |
| `GET /api/top-pizzas` | Top 10 pizzas por volumen |
| `GET /api/evaluacion-pizzas` | Matriz estrategica para todas las pizzas |
| `GET /api/top-leales` | Ratio de lealtad: clientes leales vs. todos |
| `GET /api/ingredientes/list` | Catalogo completo de ingredientes |
| `GET /api/ingredientes/recomendaciones?ingrediente=<name>` | Top-5 combinaciones de ingredientes (market basket) |
| `GET /api/ingredientes-top` | Top 10 ingredientes por gramos semanales |
| `GET /api/ingredientes-funnel` | Ingredientes por contribucion total a revenue |
| `GET /api/prep-times` | Datos de tiempo de preparacion por tamano de pizza |
| `GET /api/histograma-prep` | Datos para histograma de tiempo de preparacion |
| `GET /api/preparacion-por-categoria` | Mediana de tiempo de preparacion por categoria |
| `GET /api/top-ingredientes-preparacion` | Ingredientes ordenados por tiempo de preparacion asociado |
| `GET /api/branches` | Ubicaciones de sucursales (lat/lon) |
| `GET /api/branches/stats?mall=<name>` | Revenue, ordenes y pizza mas vendida por sucursal |
| `GET /api/orders` | Ultimas 500 ordenes |
| `GET /api/pizzas` | Catalogo de pizzas (id, tamano, categoria, ingredientes) |
| `GET /api/sales/forecast` | Pronostico de 60 dias (Prophet) |
| `GET /api/data/rawdata` | Datos crudos paginados (params: `limit`, `page`) |

---

## Data Model

La coleccion principal (`pizzaDB.menu`) almacena un documento por linea de orden:

```json
{
  "order_details_id": 1,
  "order_id": 1,
  "pizza_id": "bbq_ckn_s",
  "quantity": 1,
  "order_date": "2015-01-01",
  "order_time": "11:38:36",
  "unit_price": 12.75,
  "total_price": 12.75,
  "pizza_size": "S",
  "pizza_category": "Chicken",
  "pizza_ingredients": { "Barbecued Chicken": "85g", "Red Peppers": "30g" },
  "pizza_name": "The Barbecue Chicken Pizza",
  "customer_id": 4821,
  "mall": "Centro Santa Fe",
  "lat": 19.3615,
  "lon": -99.2763,
  "t_prep": 24.3,
  "completed": true
}
```

Indices creados automaticamente al iniciar:

| Indice | Tipo |
|--------|------|
| `order_date` | Ascendente |
| `pizza_name` | Ascendente |
| `mall` | Ascendente |
| `mall + order_date` | Compuesto |
| `pizza_category` | Ascendente |
| `customer_id` | Ascendente |

---

## Autor

<p align="center">
  <a href="https://github.com/AlegreVentura">
    <img src="https://github-readme-stats.vercel.app/api?username=AlegreVentura&show_icons=true&theme=tokyonight&hide_border=true&include_all_commits=true" height="150"/>
    <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=AlegreVentura&layout=compact&theme=tokyonight&hide_border=true" height="150"/>
  </a>
</p>

<p align="center">
  Proyecto academico — <em>Bases de Datos No SQL</em>, Primavera 2025
</p>

---

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=timeGradient&customColorList=12,20,30&height=120&section=footer" />
</p>
