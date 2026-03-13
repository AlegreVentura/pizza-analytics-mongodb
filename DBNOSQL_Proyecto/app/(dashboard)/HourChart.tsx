'use client';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';
import React, { useEffect, useState } from 'react';

if (typeof Highcharts === 'object') {
  HighchartsMore(Highcharts);
}

type HourRow = { hour: number; totalVentas: number; totalPizzas: number };
type ApiResponse = { data: HourRow[]; malls: string[]; totalVentas: number };

export default function RadialChart() {
  const [options, setOptions] = useState<any>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [totalVentas, setTotalVentas] = useState<number>(0);
  const [mall, setMall] = useState<string>('all');
  const [mallsDisponibles, setMallsDisponibles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      setError('La fecha de fin no puede ser anterior a la de inicio.');
      setOptions(null);
      return;
    } else {
      setError(null);
    }

    const params = new URLSearchParams({ startDate, endDate, mall });

    fetch(`/api/ventas-hora?${params}`)
      .then((res) => res.json())
      .then((json: ApiResponse) => {
        const rows = json.data ?? [];
        const malls = json.malls ?? [];

        setTotalVentas(json.totalVentas ?? 0);
        if (malls.length > 0) setMallsDisponibles(malls);

        // Fill all 24 hours (missing hours = 0)
        const horas = Array(24).fill(0);
        const cantidades = Array(24).fill(0);
        rows.forEach((r) => {
          horas[r.hour] = r.totalVentas;
          cantidades[r.hour] = r.totalPizzas;
        });

        setOptions({
          chart: {
            polar: true,
            type: 'column',
            backgroundColor: 'transparent',
            animation: true,
            style: { fontFamily: 'Arial' },
          },
          title: { text: '' },
          xAxis: {
            categories: Array.from({ length: 24 }, (_, i) => `${i}:00`),
            tickmarkPlacement: 'on',
            lineWidth: 1,
            labels: {
              style: { fontSize: '14px', color: '#000000', fontFamily: 'Arial Black' },
            },
          },
          yAxis: {
            gridLineInterpolation: 'polygon',
            min: 0,
            labels: { enabled: false },
            title: { text: null },
          },
          tooltip: {
            shared: true,
            formatter: function (this: Highcharts.TooltipFormatterContextObject): string {
              const idx: number = (this.points?.[0]?.point as any).index ?? 0;
              const hora: string | number = this.x ?? '';
              const venta: string =
                this.points
                  ?.find((p: Highcharts.TooltipFormatterContextObject) => p.series.name === 'Ventas por hora')
                  ?.y?.toFixed(2) ?? '0';
              const cantidad: number = cantidades[idx];
              return `<b>${hora}</b><br/>Ventas: $${venta}<br/>Pizzas: ${cantidad}`;
            },
          },
          legend: {
            enabled: true,
            itemStyle: { fontFamily: 'Arial Black', fontSize: '13px' },
          },
          series: [
            {
              name: 'Ventas por hora',
              data: horas,
              pointPlacement: 'on',
              color: '#F57C00',
              zIndex: 1,
            },
            {
              name: 'Pizzas por hora',
              data: cantidades,
              pointPlacement: 'on',
              color: '#0277BD',
              zIndex: 0,
              pointPadding: 0.2,
            },
          ],
          credits: { enabled: false },
        });
      });
  }, [startDate, endDate, mall]);

  const inputStyle: React.CSSProperties = {
    padding: '7px 10px',
    borderRadius: '8px',
    border: '1px solid #444',
    backgroundColor: '#1e1e2e',
    color: '#e0e0e0',
    fontSize: '0.875rem',
    outline: 'none',
    width: '100%',
  };

  const labelStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    color: '#aaa',
    fontSize: '0.78rem',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
  };

  return (
    <div style={{ fontFamily: 'inherit', maxWidth: 820, margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.2rem', color: '#e0e0e0' }}>
        Ventas por Hora
      </h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem', alignItems: 'flex-end' }}>
        <label style={labelStyle}>
          Inicio
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={inputStyle} />
        </label>
        <label style={labelStyle}>
          Fin
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={inputStyle} />
        </label>
        {mallsDisponibles.length > 0 && (
          <label style={labelStyle}>
            Sucursal
            <select value={mall} onChange={(e) => setMall(e.target.value)} style={inputStyle}>
              <option value="all">Todas</option>
              {mallsDisponibles.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </label>
        )}
        {totalVentas > 0 && (
          <div style={{ marginLeft: 'auto', fontSize: '1.1rem', fontWeight: 700, color: '#F28C28' }}>
            Total: ${totalVentas.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </div>
        )}
      </div>

      {error && (
        <p style={{ color: '#ef5350', fontWeight: 600, marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>
      )}

      {options ? (
        <HighchartsReact highcharts={Highcharts} options={options} />
      ) : !error ? (
        <p style={{ color: '#666', fontSize: '0.9rem' }}>Selecciona un rango de fechas para ver el grafico.</p>
      ) : null}
    </div>
  );
}
