'use client';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useState } from 'react';

export default function SeasonChart() {
  const [options, setOptions] = useState<any>(null);

  useEffect(() => {
    fetch('/api/temporadas')
      .then((res) => res.json())
      .then((rows: { year: number; quarter: number; totalVentas: number }[]) => {
        const categories = rows.map((r) => `Q${r.quarter} ${r.year}`);
        const values = rows.map((r) => r.totalVentas);

        setOptions({
          chart: {
            type: 'column',
            backgroundColor: 'transparent',
            style: { fontFamily: 'Arial' }
          },
          title: {
            text: 'Estacionalidad',
            style: {
              fontFamily: 'Arial Black',
              fontSize: '18px',
              color: '#e0e0e0'
            }
          },
          xAxis: {
            categories,
            labels: {
              style: {
                fontSize: '13px',
                fontFamily: 'Arial',
                color: '#e0e0e0'
              }
            }
          },
          yAxis: {
            title: {
              text: 'Total de ventas',
              style: { fontFamily: 'Arial', color: '#e0e0e0' }
            },
            labels: {
              formatter: function (this: Highcharts.AxisLabelsFormatterContextObject) {
                return `$${((this.value as number) / 1000).toFixed(0)}k`;
              },
              style: { fontFamily: 'Arial', color: '#e0e0e0' }
            }
          },
          tooltip: {
            valuePrefix: '$',
            valueDecimals: 2,
            style: { fontFamily: 'Arial' }
          },
          legend: {
            enabled: true,
            itemStyle: {
              fontFamily: 'Arial',
              fontWeight: 'bold',
              color: '#e0e0e0'
            }
          },
          series: [
            {
              name: 'Ventas',
              data: values,
              color: '#2196F3'
            }
          ],
          credits: { enabled: false }
        });
      });
  }, []);

  if (!options) return <p style={{ fontFamily: 'Arial' }}>Cargando gráfico de temporadas...</p>;
  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
