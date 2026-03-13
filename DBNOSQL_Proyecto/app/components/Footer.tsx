'use client';
import * as React from 'react';
import Typography from '@mui/material/Typography';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Image from 'next/image';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2C2C2C 60%, #3d1f00 100%)',
        borderTop: '2px solid #F28C28',
        color: 'white',
        px: { xs: 3, md: 6 },
        py: 4,
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1px 1fr 1px 1fr' },
          gap: 3,
          alignItems: 'start',
          maxWidth: 1100,
          mx: 'auto',
        }}
      >
        {/* Columna 1 — Marca */}
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Image src="/logo-pizzas-mibuen.png" alt="Logo" width={42} height={42} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#F28C28', letterSpacing: 0.5 }}>
              Pizzas Mi Buen
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ color: '#aaa', lineHeight: 1.7 }}>
            El sabor auténtico de México en cada rebanada. Calidad, frescura y tradición desde 2010.
          </Typography>
        </Stack>

        <Divider orientation="vertical" flexItem sx={{ borderColor: '#444', display: { xs: 'none', md: 'block' } }} />

        {/* Columna 2 — Contacto */}
        <Stack spacing={1.2}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#F28C28', mb: 0.5 }}>
            Contacto
          </Typography>
          {[
            { icon: <LocationOnIcon fontSize="small" />, text: 'Av. Reforma 123, CDMX' },
            { icon: <PhoneIcon fontSize="small" />, text: '(55) 1234 5678' },
            { icon: <EmailIcon fontSize="small" />, text: 'contacto@pizzasmibuen.com' },
            { icon: <LanguageIcon fontSize="small" />, text: 'www.pizzasmibuen.com' },
          ].map(({ icon, text }) => (
            <Stack key={text} direction="row" spacing={1} alignItems="center">
              <Box sx={{ color: '#F28C28', display: 'flex' }}>{icon}</Box>
              <Typography variant="body2" sx={{ color: '#ccc' }}>{text}</Typography>
            </Stack>
          ))}
        </Stack>

        <Divider orientation="vertical" flexItem sx={{ borderColor: '#444', display: { xs: 'none', md: 'block' } }} />

        {/* Columna 3 — Proyecto */}
        <Stack spacing={1.2}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#F28C28', mb: 0.5 }}>
            Dashboard Analytics
          </Typography>
          <Typography variant="body2" sx={{ color: '#ccc', lineHeight: 1.7 }}>
            Plataforma de análisis de ventas con inteligencia artificial y modelos de predicción en tiempo real.
          </Typography>
          <Typography variant="body2" sx={{ color: '#888', mt: 1 }}>
            Desarrollado por <Box component="span" sx={{ color: '#F28C28', fontWeight: 700 }}>DATAtouille</Box>
          </Typography>
          <Typography variant="caption" sx={{ color: '#555' }}>
            © 2025 — Todos los derechos reservados
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}
