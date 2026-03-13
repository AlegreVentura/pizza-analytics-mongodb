'use client';

import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { CircularProgress, Box, Typography } from '@mui/material';

interface IngredienteData {
  ingrediente: string;
  promedio_semanal_gramos: number;
}

export default function TopIngredientesChart() {
  const [data, setData] = React.useState<IngredienteData[]>([]);
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
    fetch('/api/ingredientes-top')
      .then((res) => res.json())
      .then((json) => { setData(json.slice(0, 5)); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const dataset = data.map((item) => ({
    ingrediente: item.ingrediente,
    gramos: item.promedio_semanal_gramos,
  }));

  return (
    <Box ref={containerRef} sx={{ width: '100%' }}>
      <Typography variant="h6" sx={{ mb: 1, textAlign: 'center' }}>
        Top 5 Ingredientes Más Usados
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : data.length === 0 ? (
        <Typography>No hay datos de ingredientes.</Typography>
      ) : chartWidth > 0 ? (
        <BarChart
          width={chartWidth}
          height={360}
          dataset={dataset}
          barLabel={(item) => {
            const v = item.value ?? 0;
            return v >= 1000 ? `${(v / 1000).toFixed(1)}k g` : `${Math.round(v)} g`;
          }}
          yAxis={[{ scaleType: 'band', dataKey: 'ingrediente', width: 170, tickLabelStyle: { fontSize: 12 } }]}
          series={[{
            dataKey: 'gramos',
            label: 'Promedio semanal (g)',
            color: '#FFC067',
            valueFormatter: (v: number) => `${Math.round(v).toLocaleString()} g`,
          }]}
          layout="horizontal"
          xAxis={[{ label: 'Gramos', tickMinStep: 1 }]}
          margin={{ left: 170, right: 30, top: 10, bottom: 60 }}
          sx={{
            '& svg': { overflow: 'visible' },
            '& .MuiBarElement-root': { strokeWidth: 0 },
            '& text.MuiChartsBarLabel-root': { fontSize: '12px', fill: '#fff !important', fontWeight: 700, filter: 'drop-shadow(1px 0 0 #000) drop-shadow(-1px 0 0 #000) drop-shadow(0 1px 0 #000) drop-shadow(0 -1px 0 #000)' },
          }}
        />
      ) : null}
    </Box>
  );
}
