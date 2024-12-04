import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography,
  useTheme
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Metrics {
  cpu_percent: number;
  memory: {
    total: number;
    available: number;
    percent: number;
  };
  disk: {
    total: number;
    used: number;
    free: number;
    percent: number;
  };
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [cpuHistory, setCpuHistory] = useState<number[]>([]);
  const [timeLabels, setTimeLabels] = useState<string[]>([]);
  const theme = useTheme();

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/metrics');
    
    ws.onmessage = (event) => {
      const newMetrics = JSON.parse(event.data);
      setMetrics(newMetrics);
      
      // Update CPU history
      setCpuHistory(prev => {
        const newHistory = [...prev, newMetrics.cpu_percent];
        return newHistory.slice(-20); // Keep last 20 points
      });
      
      // Update time labels
      setTimeLabels(prev => {
        const time = new Date().toLocaleTimeString();
        const newLabels = [...prev, time];
        return newLabels.slice(-20); // Keep last 20 points
      });
    };

    return () => {
      ws.close();
    };
  }, []);

  const cpuChartData = {
    labels: timeLabels,
    datasets: [
      {
        label: 'CPU Usage %',
        data: cpuHistory,
        fill: false,
        borderColor: theme.palette.primary.main,
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'CPU Usage Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* CPU Usage Chart */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 400,
            }}
          >
            <Line data={cpuChartData} options={chartOptions} />
          </Paper>
        </Grid>

        {/* Memory Usage */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Memory Usage
            </Typography>
            <Typography component="p" variant="h4">
              {metrics?.memory.percent}%
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              {metrics ? `${Math.round((metrics.memory.available / 1024 / 1024 / 1024) * 100) / 100} GB available` : 'Loading...'}
            </Typography>
          </Paper>
        </Grid>

        {/* Disk Usage */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Disk Usage
            </Typography>
            <Typography component="p" variant="h4">
              {metrics?.disk.percent}%
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              {metrics ? `${Math.round((metrics.disk.free / 1024 / 1024 / 1024) * 100) / 100} GB free` : 'Loading...'}
            </Typography>
          </Paper>
        </Grid>

        {/* Current CPU Usage */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Current CPU Usage
            </Typography>
            <Typography component="p" variant="h4">
              {metrics?.cpu_percent}%
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              Updated in real-time
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
