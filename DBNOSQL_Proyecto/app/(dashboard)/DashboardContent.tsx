'use client';

import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import dynamic from 'next/dynamic';
const KpiCards = dynamic(() => import('./KpiCards'), { ssr: false });
const HourChart = dynamic(() => import('./HourChart'), { ssr: false });
const DayChart = dynamic(() => import('./DayChart'), { ssr: false });
const SeasonChart = dynamic(() => import('./SeasonChart'), { ssr: false });
const WeeklyHeatmap = dynamic(() => import('./WeeklyHeatmap'), { ssr: false });
const SalesForecastChart = dynamic(() => import('./SalesForecastChart'), { ssr: false });
const TopPizzasChart = dynamic(() => import('./TopPizzasChart'), { ssr: false });
const PizzaEvaluationChart = dynamic(() => import('./PizzaEvaluationChart'), { ssr: false });
const TopIngredientesChart = dynamic(() => import('./TopIngredientesChart'), { ssr: false });
const TopPizzasLealesChart = dynamic(() => import('./TopPizzasLealesChart'), { ssr: false });
const TiempoPreparacionChart = dynamic(() => import('./TiempoPreparacionChart'), { ssr: false });
const PizzaSizeViolinChart = dynamic(() => import('./PizzaSizeViolinChart'), { ssr: false });
const TopIngredientesPrepChart = dynamic(() => import('./TopIngredientesPrepChart'), { ssr: false });
const HistogramaPreparacionChart = dynamic(() => import('./HistogramaPreparacionChart'), { ssr: false });
const IngredientesFunnelChart = dynamic(() => import('./IngredientesFunnelChart'), { ssr: false });
const RecomendadorIngredientes = dynamic(() => import('./RecomendadorIngredientes'), { ssr: false });


export default function DashboardContent() {
  const [page, setPage] = React.useState(0);
  const totalPages = 3;

  const handleNext = () => setPage((prev) => prev + 1);
  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 0));

  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        component="main"
        sx={(theme) => ({
          flexGrow: 1,
          backgroundColor: theme.vars
            ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
            : alpha(theme.palette.background.default, 1),
          overflow: 'auto',
        })}
      >
        <Stack
          spacing={2}
          sx={{
            alignItems: 'center',
            mx: 3,
            pb: 5,
            mt: { xs: 8, md: 0 },
          }}
        >
          <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>


            <Grid container spacing={2} columns={12} sx={{ mb: 2 }}>
              {page === 0 && (
                <Box sx={{ flexGrow: 1 }}>
                  {/* ✅ KPI Cards */}
                  <KpiCards />

                  {/* 🟦 Serie de tiempo (full width) */}
                  <Grid container spacing={2} sx={{ mt: 3 }}>
                    <Grid size={12}>
                      <SalesForecastChart />
                    </Grid>
                  </Grid>

                  {/* 🟨 Hora, Día y Temporada en disposición 2 arriba + 1 abajo */}
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid size={4}>
                      <HourChart />
                    </Grid>
                    <Grid size={4}>
                      <DayChart />
                    </Grid>
                    <Grid size={4}>
                      <SeasonChart />
                    </Grid>
                  </Grid>

                  {/* 🟧 Heatmap (full width abajo) */}
                  <Grid container spacing={2} sx={{ mt: 4 }}>
                    <Grid size={12 }>
                      <WeeklyHeatmap />
                    </Grid>
                  </Grid>
                </Box>

              )}

              {page === 1 && (
                <Box sx={{ flexGrow: 1 }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2, mt: 2 }}>
                      <TopPizzasChart />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2, mt: 2 }}>
                      <PizzaEvaluationChart />
                    </Grid>
                    <Grid size={{ xs: 12 }} sx={{ mb: 2, mt: 3 }}>
                      <TopIngredientesChart />
                    </Grid>
                    <Grid size={{ xs: 12 }} sx={{ mb: 2, mt: 1 }}>
                      <TopPizzasLealesChart />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {page === 2 && (
                <Box sx={{ flexGrow: 1 }}>

                  {/* ── Sección 1: Preparación ── */}
                  <Box sx={{ mb: 3, mt: 1 }}>
                    <Typography variant="h5" fontWeight={700}>
                      Analisis de Preparacion
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Tiempos de cocina, distribucion por tamano y rendimiento de ingredientes por operario.
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TiempoPreparacionChart />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <PizzaSizeViolinChart />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TopIngredientesPrepChart />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <HistogramaPreparacionChart />
                    </Grid>
                  </Grid>

                  {/* ── Separador ── */}
                  <Divider sx={{ my: 5 }} />

                  {/* ── Sección 2: Ingredientes ── */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" fontWeight={700}>
                      Inteligencia de Ingredientes
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Popularidad y combinaciones estrategicas basadas en patrones de compra reales.
                    </Typography>
                  </Box>
                  <Grid container spacing={3}>
                    <Grid size={12}>
                      <IngredientesFunnelChart />
                    </Grid>
                    <Grid size={12}>
                      <RecomendadorIngredientes />
                    </Grid>
                  </Grid>

                </Box>
              )}
            </Grid>

            {/* 🔸 Controles de navegación */}
            <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
              <Button variant="outlined" onClick={handlePrev} disabled={page === 0}>
                Anterior
              </Button>
              <Typography>Página {page + 1} de {totalPages}</Typography>
              <Button variant="outlined" onClick={handleNext} disabled={page >= totalPages - 1}>
                Siguiente
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
