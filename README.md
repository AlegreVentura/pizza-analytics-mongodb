<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,30&height=210&section=header&text=Datatouille%20Dashboard&fontSize=42&fontColor=fff&animation=fadeIn&fontAlignY=40&desc=Bases%20de%20Datos%20No%20SQL%20%7C%20Analytics%20de%20Pizzer%C3%ADas%20con%20MongoDB%20%2B%20Next.js%2015&descAlignY=62&descSize=16" width="100%"/>

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=19&pause=1000&color=A78BFA&center=true&vCenter=true&random=false&width=720&lines=50%2C454+documentos+en+MongoDB+Atlas;20+sucursales+en+CDMX+%C2%B7+48%2C620+%C3%B3rdenes+originales;Pronostico+60+dias+con+Prophet+almacenado+en+MongoDB;Market+basket+%2B+lealtad+%2B+matriz+estrategica)](https://git.io/typing-svg)

<br/>

![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Material UI](https://img.shields.io/badge/Material_UI_v7-007FFF?style=for-the-badge&logo=mui&logoColor=white)
![Jupyter](https://img.shields.io/badge/Jupyter-F37626?style=for-the-badge&logo=jupyter&logoColor=white)
![Plotly](https://img.shields.io/badge/Plotly-3F4F75?style=for-the-badge&logo=plotly&logoColor=white)

</div>

---

## Demo

https://github.com/user-attachments/assets/c8ad49da-96a9-40c9-80c8-17be7a592298

---

## Impacto

Centralicé el análisis de **50,454 documentos** de una cadena de pizzerías en un único dashboard interactivo, según **48,620 órdenes históricas** de 2015 que revelaron patrones de consumo, productos de bajo rendimiento y combinaciones frecuentes de ingredientes

Para ello, construí un pipeline ETL en Python sobre el dataset Pizza Place Sales (Kaggle, 2015) enriquecido con geolocalización sintética de **20 sucursales en CDMX**, con pronóstico de demanda a **60 días** con Prophet, todo almacenado en MongoDB Atlas y servido mediante **20+ endpoints REST** en Next.js 15.

---

## Características principales

<div align="center">

| Métrica | Valor |
|---------|-------|
| Documentos en MongoDB | **50,454** |
| Sucursales mapeadas (CDMX) | **20** |
| Endpoints REST | **20+** |
| Días de pronóstico (Prophet) | **60** |
| Dataset original (Kaggle, 2015) | **48,620** órdenes |
| Gráficas y visualizaciones | **15+** |

</div>

---

## Estructura

```
pizza-analytics-mongodb/
├── DBNOSQL_Proyecto/   ← Aplicación web Next.js 15 + 20 endpoints REST
└── ETL/                ← Pipeline Python: limpieza, enriquecimiento y carga
```

---

## Documentación

- [DBNOSQL_Proyecto/README.md](DBNOSQL_Proyecto/README.md) — Instalación, variables de entorno, endpoints API y modelo de datos
- [ETL/README.md](ETL/README.md) — Pipeline ETL, orden de ejecución de notebooks y fuente de datos

---

## Funcionalidades

| | |
|---|---|
| **Tarjetas KPI** | Ingreso anual, promedio diario, unidades vendidas y precio promedio en tiempo real |
| **Series de tiempo** | Ventas por hora, día de la semana y trimestre con filtros por sucursal y fecha |
| **Mapa de calor semanal** | Ingresos por hora x día de la semana — visualización interactiva con Plotly |
| **Matriz de evaluación** | Clasificación estratégica en 4 cuadrantes: Estrella / Mantener / Promocionar / Descontinuar |
| **Análisis de lealtad** | Comparativa de preferencia de pizza entre clientes leales y público general |
| **Recomendador de ingredientes** | Co-ocurrencia de ingredientes tipo Apriori — top 5 combinaciones por ingrediente |
| **Pronóstico 60 días** | Modelo Prophet entrenado sobre datos históricos, almacenado y servido desde MongoDB |
| **Mapa de sucursales** | Leaflet con 20 ubicaciones en CDMX, estadísticas de ingresos y pizza top por sucursal |
| **Tabla de órdenes** | DataGrid paginado con filtros múltiples y ordenamiento por columna |
| **Gestión de empleados** | Panel CRUD en memoria con Toolpad Core |

---

## Autores

**Roberto Jhoshua Alegre Ventura** — Autor principal · Bases de Datos No SQL · Primavera 2025

*Con contribuciones de: Emil Sanchez · Bruno Fonseca · Melisa Arano · Israel Jimenez*

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,30&height=100&section=footer" width="100%"/>
