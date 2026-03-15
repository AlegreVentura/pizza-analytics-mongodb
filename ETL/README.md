# ETL — Pipeline de datos

Pipeline en Python que toma el dataset original de Kaggle, lo enriquece con datos sintéticos de CDMX, simula suciedad controlada, lo limpia y lo carga en MongoDB Atlas. Al final entrena un modelo Prophet y guarda el pronóstico directamente en la base de datos.

---

## Requisitos

```bash
pip install pandas numpy prophet pymongo openpyxl jupyter
```

---

## Orden de ejecución

Ejecutar los cuatro notebooks en orden desde esta carpeta:

```bash
jupyter notebook
```

| # | Notebook | Qué hace |
|---|----------|----------|
| 1 | `1_Unir_bases.ipynb` | Enriquece el CSV de Kaggle con geolocalización sintética de 20 sucursales en CDMX, IDs de cliente y pesos de ingredientes |
| 2 | `2_Simular_datos_sucios.ipynb` | Inyecta ruido controlado (duplicados, NaN, errores de formato) para simular datos reales sucios |
| 3 | `3_Limpia_datos.ipynb` | Limpia el dataset y carga ~50,000 documentos en `pizzaDB.menu` |
| 4 | `4_Forecast_Prophet.ipynb` | Entrena pronóstico de 60 días y guarda resultados en `pizzaDB.forecasts` |

---

## Fuente de datos

Dataset original: [Pizza Sales — Kaggle](https://www.kaggle.com/datasets/mysarahmadbhat/pizza-place-sales) — 48,620 órdenes de una pizzería (2015).

Los notebooks 1 y 2 generan datos sintéticos derivados de ese dataset. Los archivos CSV y JSON del ETL no se incluyen en el repositorio porque son reproducibles ejecutando los notebooks — subir archivos de 50,000+ registros no tiene sentido en Git.

---

## Variable de entorno requerida

Antes de ejecutar los notebooks 3 y 4, configurar `MONGODB_URI` dentro de cada uno con el connection string de MongoDB Atlas. Ver [DBNOSQL_Proyecto/README.md](../DBNOSQL_Proyecto/README.md) para instrucciones de configuración.
