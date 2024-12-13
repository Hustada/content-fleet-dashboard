import { Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

const AgentRadarChart = ({ status = 'online' }) => {
  const theme = useTheme();

  // These will eventually be real content metrics
  const data = [
    { metric: 'Content Creation', value: Math.random() * 100 },
    { metric: 'Research', value: Math.random() * 100 },
    { metric: 'Engagement', value: Math.random() * 100 },
    { metric: 'Analysis', value: Math.random() * 100 },
    { metric: 'Optimization', value: Math.random() * 100 },
  ];

  const getStatusColor = () => {
    switch(status) {
      case 'online': return theme.palette.success.main;
      case 'standby': return theme.palette.warning.main;
      default: return theme.palette.error.main;
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: 300,
        '& .recharts-polar-grid-concentric-circle': {
          stroke: `${theme.palette.primary.main}33`,
        },
        '& .recharts-polar-grid-concentric-polygon': {
          stroke: `${theme.palette.primary.main}33`,
        },
      }}
    >
      <ResponsiveContainer>
        <RadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <PolarGrid />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
          />
          <Radar
            name="Agent Capabilities"
            dataKey="value"
            stroke={getStatusColor()}
            fill={getStatusColor()}
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* Scanning effect */}
      <Box
        component={motion.div}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear"
        }}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100%',
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${getStatusColor()}, transparent)`,
          transformOrigin: 'left',
        }}
      />

      {/* Pulse effect */}
      <Box
        component={motion.div}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          border: `1px solid ${getStatusColor()}`,
          transform: 'translate(-50%, -50%)',
        }}
      />
    </Box>
  );
};

export default AgentRadarChart;
