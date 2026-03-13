'use client';

import * as React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  Stack,
  Divider,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TimerIcon from '@mui/icons-material/Timer';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import dynamic from 'next/dynamic';

const MapWithNoSSR = dynamic(
  () => import('../../components/MapComponent'),
  { ssr: false, loading: () => <CircularProgress /> }
);

interface Sucursal {
  mall: string;
  lat: number;
  lon: number;
}

interface BranchStats {
  total_ordenes: number;
  revenue_total: number;
  t_prep_promedio: number;
  pizza_mas_vendida: string;
}

function StatRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1.5}>
      <Box sx={{ color: '#F28C28', display: 'flex', alignItems: 'center' }}>{icon}</Box>
      <Box>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ lineHeight: 1.2 }}>
          {label}
        </Typography>
        <Typography fontWeight={700} fontSize="0.95rem">
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}

export default function BranchPage() {
  const [branches, setBranches] = React.useState<Sucursal[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedMall, setSelectedMall] = React.useState<string | null>(null);
  const [stats, setStats] = React.useState<BranchStats | null>(null);
  const [loadingStats, setLoadingStats] = React.useState(false);

  React.useEffect(() => {
    fetch('/api/branches')
      .then((res) => res.json())
      .then((data) => {
        setBranches(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching branch data:', err);
        setLoading(false);
      });
  }, []);

  const handleSelectBranch = React.useCallback(async (mall: string) => {
    setSelectedMall(mall);
    setStats(null);
    setLoadingStats(true);
    try {
      const res = await fetch(`/api/branches/stats?mall=${encodeURIComponent(mall)}`);
      const data = await res.json();
      setStats(data);
    } catch {
      // ignore
    } finally {
      setLoadingStats(false);
    }
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (branches.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)', p: 4 }}>
        <Typography>No hay sucursales para mostrar.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: 'calc(100vh - 64px)', width: '100%', position: 'relative', overflow: 'hidden' }}>
      <MapWithNoSSR branches={branches} onSelectBranch={handleSelectBranch} />

      {/* Panel flotante de stats */}
      {selectedMall && (
        <Paper
          elevation={6}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 1000,
            width: 280,
            borderRadius: 3,
            overflow: 'hidden',
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              px: 2,
              py: 1.5,
              background: 'linear-gradient(135deg, #F28C28 0%, #e07a1a 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <StorefrontIcon sx={{ color: '#fff', fontSize: 20 }} />
              <Typography fontWeight={700} color="#fff" fontSize="0.9rem" noWrap sx={{ maxWidth: 190 }}>
                {selectedMall}
              </Typography>
            </Stack>
            <IconButton size="small" onClick={() => setSelectedMall(null)} sx={{ color: '#fff', p: 0.5 }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Body */}
          <Box sx={{ p: 2.5 }}>
            {loadingStats ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <CircularProgress size={28} sx={{ color: '#F28C28' }} />
              </Box>
            ) : stats ? (
              <Stack spacing={2}>
                <StatRow
                  icon={<ReceiptLongIcon fontSize="small" />}
                  label="Ordenes totales"
                  value={stats.total_ordenes.toLocaleString()}
                />
                <Divider />
                <StatRow
                  icon={<AttachMoneyIcon fontSize="small" />}
                  label="Ingresos totales"
                  value={`$${stats.revenue_total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                />
                <Divider />
                <StatRow
                  icon={<TimerIcon fontSize="small" />}
                  label="Tiempo prom. de preparacion"
                  value={`${stats.t_prep_promedio} min`}
                />
                <Divider />
                <StatRow
                  icon={<LocalPizzaIcon fontSize="small" />}
                  label="Pizza mas vendida"
                  value={stats.pizza_mas_vendida}
                />
              </Stack>
            ) : (
              <Typography color="text.secondary" fontSize="0.85rem">No se pudieron cargar los datos.</Typography>
            )}
          </Box>
        </Paper>
      )}
    </Box>
  );
}
