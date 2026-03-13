'use client';

import * as React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts';

interface PizzaData {
  pizza_name: string;
  pizzasTotal: number;
}

const cleanName = (name: string) =>
  name
    .replace(/\b(The|Pizza)\b/gi, '')
    .replace('Barbecued', 'BBQ')
    .trim();

export default function TopPizzasChart() {
  const [data, setData] = React.useState<PizzaData[]>([]);
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
    fetch('/api/top-pizzas')
      .then((res) => res.json())
      .then((json) => { setData(json.slice(0, 5)); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const dataset = data.map((pizza) => ({
    name: cleanName(pizza.pizza_name),
    ventas: pizza.pizzasTotal,
  }));

  return (
    <Box ref={containerRef} sx={{ width: '100%' }}>
      <Typography variant="h6" sx={{ mb: 1, textAlign: 'center' }}>
        Top 5 Pizzas Más Vendidas
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : data.length === 0 ? (
        <Typography>No hay datos de pizzas disponibles.</Typography>
      ) : chartWidth > 0 ? (
        <BarChart
          width={chartWidth}
          height={360}
          dataset={dataset}
          barLabel="value"
          xAxis={[{
            scaleType: 'band',
            dataKey: 'name',
            height: 80,
            tickLabelStyle: {
              angle: -30,
              textAnchor: 'end',
              fontSize: 12,
              dominantBaseline: 'auto',
            },
          }]}
          yAxis={[{ label: 'Ventas' }]}
          series={[{ dataKey: 'ventas', label: 'Total Vendidas', color: '#FFC067' }]}
          margin={{ left: 60, right: 20, top: 20, bottom: 10 }}
          sx={{
            '& svg': { overflow: 'visible' },
            '& .MuiBarElement-root': { strokeWidth: 0 },
            '& text.MuiChartsBarLabel-root': { fontSize: '13px', fill: '#fff !important', fontWeight: 600, filter: 'drop-shadow(1px 0 0 #000) drop-shadow(-1px 0 0 #000) drop-shadow(0 1px 0 #000) drop-shadow(0 -1px 0 #000)' },
          }}
        />
      ) : null}
    </Box>
  );
}
