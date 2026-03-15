'use client';
import * as React from 'react';
import {
  Box, Card, Stack, TextField, Button,
  Typography, Alert, CircularProgress,
} from '@mui/material';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import signIn from './actions';

export default function SignIn() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    const result = await signIn({ id: 'credentials', name: 'Credentials' }, formData, callbackUrl);
    if (result?.error) {
      setError('Credenciales invalidas. Verifica tu correo y contrasena.');
      setLoading(false);
    }
  }

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      color: 'rgba(255,255,255,0.9)',
      '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
      '&:hover fieldset': { borderColor: 'rgba(201,106,0,0.5)' },
      '&.Mui-focused fieldset': { borderColor: '#c96a00' },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.45)' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#f28c28' },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 55%, #1c1208 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Card
        sx={{
          width: 460,
          p: 5,
          background: '#1e1e1e',
          border: '1px solid rgba(201,106,0,0.2)',
          borderRadius: 3,
          boxShadow: '0 8px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,106,0,0.08)',
        }}
      >
        <Stack spacing={3} alignItems="center">

          <Box
            sx={{
              width: 110,
              height: 110,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2c2c2c, #1a1a1a)',
              border: '2px solid rgba(201,106,0,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 24px rgba(242,140,40,0.25)',
            }}
          >
            <Image
              src="/logo-pizzas-mibuen.png"
              width={84}
              height={84}
              alt="Pizzas Mi Buen"
              style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 6px rgba(242,140,40,0.4))' }}
            />
          </Box>

          <Stack spacing={0.4} alignItems="center">
            <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '1.6rem', letterSpacing: '0.01em', lineHeight: 1.1 }}>
              Pizzas Mi Buen
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
              Analytics Dashboard
            </Typography>
          </Stack>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Stack spacing={2.5}>
              {error && (
                <Alert
                  severity="error"
                  sx={{
                    background: 'rgba(211,47,47,0.15)',
                    color: '#ff8a80',
                    border: '1px solid rgba(211,47,47,0.3)',
                    borderRadius: 1,
                    '& .MuiAlert-icon': { color: '#ff8a80' },
                  }}
                >
                  {error}
                </Alert>
              )}

              <TextField
                label="Correo"
                type="email"
                required
                fullWidth
                size="small"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={inputSx}
              />

              <TextField
                label="Contrasena"
                type="password"
                required
                fullWidth
                size="small"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={inputSx}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 0.5,
                  py: 1.2,
                  background: 'linear-gradient(90deg, #c96a00 0%, #f28c28 100%)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  letterSpacing: '0.03em',
                  boxShadow: '0 4px 16px rgba(201,106,0,0.35)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #a85500 0%, #d97820 100%)',
                    boxShadow: '0 4px 20px rgba(201,106,0,0.5)',
                  },
                  '&.Mui-disabled': { opacity: 0.6 },
                }}
              >
                {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Iniciar sesión'}
              </Button>
            </Stack>
          </Box>

        </Stack>
      </Card>
    </Box>
  );
}
