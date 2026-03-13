'use client';

import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { CircularProgress, Box, Typography } from '@mui/material';

interface PizzaLealData {
  pizza_name: string;
  proporcion_lealtad: number;
}

const cleanName = (name: string) =>
  name
    .replace(/\b(The|Pizza)\b/gi, '')
    .replace('Barbecued', 'BBQ')
    .trim();

export default function TopPizzasLealesChart() {
  const [data, setData] = React.useState<PizzaLealData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = React.useState(0);

  React.useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      setChartWidth(entries[0].contentRect.width);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    fetch('/api/top-leales')
      .then((res) => res.json())
      .then((json) => { setData(json.slice(0, 5)); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const dataset = data.map((pizza) => ({
    name: cleanName(pizza.pizza_name),
    lealtad: pizza.proporcion_lealtad,
  }));

  return (
    <Box ref={containerRef} sx={{ width: '100%' }}>
      <Typography variant="h6" sx={{ mb: 1, textAlign: 'center' }}>
        Top 5 Pizzas con Mayor Proporción de Clientes Leales
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : data.length === 0 ? (
        <Typography>No hay datos de lealtad disponibles.</Typography>
      ) : chartWidth > 0 ? (
        <BarChart
          width={chartWidth}
          height={360}
          dataset={dataset}
          barLabel={(item) => `${((item.value ?? 0) * 100).toFixed(1)}%`}
          yAxis={[{ scaleType: 'band', dataKey: 'name', width: 170, tickLabelStyle: { fontSize: 12 } }]}
          series={[{
            dataKey: 'lealtad',
            label: 'Proporción Leal',
            color: '#FFC067',
            valueFormatter: (v: number) => `${(v * 100).toFixed(1)}%`,
          }]}
          layout="horizontal"
          xAxis={[{
            label: 'Proporción de Lealtad',
            tickFormat: (v: number) => `${(v * 100).toFixed(0)}%`,
          }]}
          margin={{ left: 170, right: 30, top: 10, bottom: 60 }}
          sx={{
            '& svg': { overflow: 'visible' },
            '& .MuiBarElement-root': { strokeWidth: 0 },
            '& text.MuiChartsBarLabel-root': { fontSize: '11px', fill: '#fff !important', fontWeight: 600, filter: 'drop-shadow(1px 0 0 #000) drop-shadow(-1px 0 0 #000) drop-shadow(0 1px 0 #000) drop-shadow(0 -1px 0 #000)' },
          }}
        />
      ) : null}
    </Box>
  );
}
