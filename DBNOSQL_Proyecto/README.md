# DBNOSQL_Proyecto — Aplicación Web

Dashboard de analytics construido con Next.js 15 y MongoDB Atlas. Expone 20+ endpoints REST que alimentan gráficas interactivas, un mapa de sucursales, pronóstico de ventas y un recomendador de ingredientes.

---

## Instalación

### 1. Instalar dependencias

```bash
cd DBNOSQL_Proyecto
npm install
```

### 2. Variables de entorno

```bash
cp .env.example .env.local
```

| Variable | Descripción |
|----------|-------------|
| `MONGODB_URI` | Connection string de MongoDB Atlas (ver `.env.example`) |
| `AUTH_SECRET` | Secret para firmar sesiones — generar con `npx auth secret` |
| `AUTH_USERS` | Array JSON de usuarios con hash bcrypt |

Generar hash de password:
```bash
node -e "const b=require('bcryptjs'); b.hash('tupassword',10).then(console.log)"
```

> El ETL debe ejecutarse antes del primer arranque. Ver [ETL/README.md](../ETL/README.md).

### 3. Iniciar servidor de desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) e iniciar sesión con las credenciales configuradas en `AUTH_USERS`.

---

## Endpoints API

Todos los endpoints requieren sesión activa. Respuestas con códigos HTTP estándar.

| Endpoint | Descripción |
|----------|-------------|
| `GET /api/kpis` | Ingreso anual, promedio diario, unidades vendidas, precio promedio |
| `GET /api/ventas-hora` | Ventas por hora — filtros: `startDate`, `endDate`, `mall` |
| `GET /api/ventas-dia` | Promedio de ventas por día de la semana |
| `GET /api/temporadas` | Revenue trimestral |
| `GET /api/top-pizzas` | Top 10 pizzas por volumen |
| `GET /api/evaluacion-pizzas` | Matriz estratégica para todas las pizzas |
| `GET /api/top-leales` | Ratio lealtad: clientes frecuentes vs. todos |
| `GET /api/ingredientes/list` | Catálogo completo de ingredientes |
| `GET /api/ingredientes/recomendaciones?ingrediente=<name>` | Top 5 combinaciones de ingredientes (market basket) |
| `GET /api/ingredientes-top` | Top 10 ingredientes por gramos semanales |
| `GET /api/ingredientes-funnel` | Ingredientes por contribución total a revenue |
| `GET /api/prep-times` | Tiempo de preparación por tamaño de pizza |
| `GET /api/histograma-prep` | Histograma de tiempo de preparación |
| `GET /api/preparacion-por-categoria` | Mediana de tiempo de preparación por categoría |
| `GET /api/top-ingredientes-preparacion` | Ingredientes ordenados por tiempo de preparación |
| `GET /api/branches` | Ubicaciones de sucursales (lat/lon) |
| `GET /api/branches/stats?mall=<name>` | Revenue, órdenes y pizza top por sucursal |
| `GET /api/orders` | Últimas 500 órdenes |
| `GET /api/pizzas` | Catálogo de pizzas (id, tamaño, categoría, ingredientes) |
| `GET /api/sales/forecast` | Pronóstico de 60 días (Prophet) |
| `GET /api/data/rawdata` | Datos crudos paginados — params: `limit`, `page` |

---

## Modelo de datos

La colección principal (`pizzaDB.menu`) almacena un documento por línea de orden:

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

Índices creados automáticamente al iniciar la aplicación:

| Índice | Tipo |
|--------|------|
| `order_date` | Ascendente |
| `pizza_name` | Ascendente |
| `mall` | Ascendente |
| `mall + order_date` | Compuesto |
| `pizza_category` | Ascendente |
| `customer_id` | Ascendente |
