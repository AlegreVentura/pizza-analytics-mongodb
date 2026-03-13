'use client';

import * as React from 'react';
import {
  Box,
  TextField,
  CircularProgress,
  Typography,
  Chip,
  Paper,
  Stack,
  Divider,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import SearchIcon from '@mui/icons-material/Search';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

interface Recomendacion {
  id: number;
  combinacion: string;
  promedio_ventas: number;
  support: string;
}


export default function RecomendadorIngredientes() {
  const [ingredientes, setIngredientes] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [loadingResults, setLoadingResults] = React.useState(false);
  const [ingrediente, setIngrediente] = React.useState<string | null>(null);
  const [resultados, setResultados] = React.useState<Recomendacion[]>([]);

  React.useEffect(() => {
    fetch('/api/ingredientes/list')
      .then((res) => res.json())
      .then(setIngredientes)
      .finally(() => setLoading(false));
  }, []);

  const handleSeleccion = async (ing: string | null) => {
    setIngrediente(ing);
    setResultados([]);
    if (!ing) return;

    setLoadingResults(true);
    try {
      const res = await fetch(`/api/ingredientes/recomendaciones?ingrediente=${encodeURIComponent(ing)}`);
      if (!res.ok) return;
      const data = await res.json();
      if (!Array.isArray(data)) return;

      setResultados(
        data.map((item: any, i: number) => ({
          id: i + 1,
          combinacion: item.itemset.join(' + '),
          promedio_ventas: parseFloat(item.promedio.toFixed(2)),
          support: `${(item.support * 100).toFixed(1)}%`,
        }))
      );
    } catch (err) {
      console.error('Error al obtener recomendaciones:', err);
    } finally {
      setLoadingResults(false);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Selector */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(242,140,40,0.06) 0%, rgba(255,255,255,0.02) 100%)',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
          <SearchIcon sx={{ color: '#F28C28', fontSize: 22 }} />
          <Typography variant="subtitle1" fontWeight={700}>
            Selecciona un ingrediente para ver combinaciones frecuentes
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          Basado en analisis de asociacion (market basket), se muestran los trios de ingredientes
          que mas frecuentemente aparecen juntos en pedidos reales.
        </Typography>
        {loading ? (
          <CircularProgress size={28} />
        ) : (
          <Autocomplete
            options={ingredientes}
            sx={{ maxWidth: 420 }}
            onChange={(_, value) => handleSeleccion(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Ingrediente base"
                placeholder="Ej: Garlic, Mozzarella..."
                size="small"
              />
            )}
          />
        )}
      </Paper>

      {/* Estado de carga */}
      {loadingResults && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress sx={{ color: '#F28C28' }} />
        </Box>
      )}

      {/* Sin resultados tras busqueda */}
      {!loadingResults && ingrediente && resultados.length === 0 && (
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center', border: '1px dashed', borderColor: 'divider', borderRadius: 3 }}>
          <Typography color="text.secondary">
            No se encontraron combinaciones frecuentes para <strong>{ingrediente}</strong>.
          </Typography>
        </Paper>
      )}

      {/* Estado inicial */}
      {!loadingResults && !ingrediente && (
        <Paper elevation={0} sx={{ p: 5, textAlign: 'center', border: '1px dashed', borderColor: 'divider', borderRadius: 3 }}>
          <TipsAndUpdatesIcon sx={{ fontSize: 44, color: '#F28C28', mb: 1.5 }} />
          <Typography variant="body1" color="text.secondary">
            Elige un ingrediente arriba para descubrir con cuales otros se vende mas frecuentemente.
          </Typography>
        </Paper>
      )}

      {/* Resultados */}
      {!loadingResults && resultados.length > 0 && (
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
              Top {resultados.length} combinaciones para
            </Typography>
            <Chip label={ingrediente} size="small" sx={{ bgcolor: '#F28C28', color: '#fff', fontWeight: 700 }} />
          </Stack>
          {resultados.map((r) => (
            <Paper
              key={r.id}
              elevation={0}
              sx={{
                px: 3,
                py: 2.5,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2,
                transition: 'border-color 0.2s',
                '&:hover': { borderColor: '#F28C28' },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
                <Chip label={`#${r.id}`} size="small" variant="outlined" sx={{ fontWeight: 700, minWidth: 36 }} />
                <Typography fontWeight={600} fontSize="0.95rem">
                  {r.combinacion}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={3} alignItems="center">
                <Divider orientation="vertical" flexItem />
                <Box textAlign="center">
                  <Typography variant="caption" color="text.secondary" display="block">Frecuencia</Typography>
                  <Typography fontWeight={700} color="#F28C28">{r.support}</Typography>
                </Box>
                <Box textAlign="center" sx={{ minWidth: 80 }}>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ whiteSpace: 'nowrap' }}>Venta prom.</Typography>
                  <Typography fontWeight={700}>${r.promedio_ventas.toFixed(2)}</Typography>
                </Box>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
}
