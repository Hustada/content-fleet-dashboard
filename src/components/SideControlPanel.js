import { Box, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import StatusIndicator from './StatusIndicator';
import { useEffect, useState } from 'react';

function SideControlPanel() {
  const theme = useTheme();
  const [metrics, setMetrics] = useState({
    power: Math.random() * 100,
    frequency: Math.random() * 100,
    amplitude: Math.random() * 100
  });

  // Simulate changing metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        power: Math.random() * 100,
        frequency: Math.random() * 100,
        amplitude: Math.random() * 100
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const Knob = ({ value, label, color = theme.palette.primary.main }) => (
    <Box sx={{ textAlign: 'center', mb: 2 }}>
      <Box
        component={motion.div}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        sx={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          border: '2px solid',
          borderColor: color,
          position: 'relative',
          margin: '0 auto',
          cursor: 'pointer',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '40%',
            height: 2,
            backgroundColor: color,
            transformOrigin: '0 50%',
            transform: `translate(-50%, -50%) rotate(${value * 3.6}deg)`,
          }
        }}
      />
      <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'text.secondary' }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ color }}>
        {Math.round(value)}%
      </Typography>
    </Box>
  );

  const Gauge = ({ value, label, color = theme.palette.primary.main }) => (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ 
        height: 8, 
        bgcolor: 'background.paper',
        borderRadius: 1,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider'
      }}>
        <Box
          component={motion.div}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          sx={{
            height: '100%',
            background: `linear-gradient(90deg, ${color}50, ${color})`,
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{label}</Typography>
        <Typography variant="caption" sx={{ color }}>{Math.round(value)}%</Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        position: 'fixed',
        left: 0,
        top: 64, // Below header
        bottom: 0,
        width: 80,
        backgroundColor: 'background.paper',
        borderRight: '1px solid',
        borderColor: 'divider',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundImage: `linear-gradient(180deg, ${theme.palette.background.paper}, rgba(19, 47, 76, 0.4))`,
      }}
    >
      {/* Status Indicator */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <StatusIndicator status="online" size={16} />
        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
          LCARS
        </Typography>
      </Box>

      {/* Control Knobs */}
      <Knob value={metrics.power} label="POWER" color={theme.palette.primary.main} />
      <Knob value={metrics.frequency} label="FREQ" color={theme.palette.warning.main} />
      <Knob value={metrics.amplitude} label="AMP" color={theme.palette.success.main} />

      {/* Scanning line effect */}
      <Box
        component={motion.div}
        animate={{
          y: ['0%', '100%'],
          opacity: [0.5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '20%',
          background: `linear-gradient(180deg, ${theme.palette.primary.main}20, transparent)`,
          pointerEvents: 'none',
        }}
      />

      {/* System Gauges */}
      <Box sx={{ mt: 'auto', width: '100%' }}>
        <Gauge value={metrics.power} label="SYS" color={theme.palette.info.main} />
        <Gauge value={metrics.frequency} label="NET" color={theme.palette.error.main} />
        <Gauge value={metrics.amplitude} label="CPU" color={theme.palette.success.main} />
      </Box>
    </Box>
  );
}

export default SideControlPanel;
