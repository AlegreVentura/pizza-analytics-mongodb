'use client';
import * as React from 'react';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { usePathname, useParams } from 'next/navigation';
import { PageContainer } from '@toolpad/core/PageContainer';
import Footer from '../components/Footer';
import SidebarFooterAccount, { ToolbarAccountOverride } from './SidebarFooterAccount';
import { Box, Stack, Typography } from '@mui/material';

function CustomAppTitle() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        px: 3,
        height: '100%',
        background: 'linear-gradient(105deg, #1a1a1a 0%, #2C2C2C 55%, #c96a00 100%)',
        borderTopRightRadius: 14,
        borderBottomRightRadius: 14,
        boxShadow: '2px 0 12px rgba(242,140,40,0.15)',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Box sx={{ width: 52, height: 52 }}>
          <img
            src="/logo-pizzas-mibuen.png"
            alt="Pizzas Mi Buen Logo"
            style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(242,140,40,0.6))' }}
          />
        </Box>
        <Stack spacing={0.3}>
          <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '0.01em', lineHeight: 1.1 }}>
            Pizzas Mi Buen
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', lineHeight: 1 }}>
            Analytics Dashboard
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}


export default function Layout(props: { children: React.ReactNode }) {

  

  const pathname = usePathname();
  const params = useParams();
  const [employeeId] = params.segments ?? [];

  const title = React.useMemo(() => {
    if (pathname === '/employees/new') {
      return 'Nuevo empleado';
    }
    if (employeeId && pathname.includes('/edit')) {
      return `Empleado ${employeeId} - Editar`;
    }
    if (employeeId) {
      return `Empleado ${employeeId}`;
    }
    return undefined;
  }, [employeeId, pathname]);

  return (
    <DashboardLayout
      slots={{
        appTitle: CustomAppTitle,
        toolbarAccount: ToolbarAccountOverride,
        sidebarFooter: SidebarFooterAccount,
      }}
    >
      <PageContainer title={title}>
        {props.children}
       
      </PageContainer>
      <Footer/>
    </DashboardLayout>
  );
}
