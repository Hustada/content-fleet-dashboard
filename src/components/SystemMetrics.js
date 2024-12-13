import { useEffect, useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import SoundEffects from '../utils/soundEffects';

function SystemMetrics({ title, color = 'primary.main' }) {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [expanded, setExpanded] = useState(false);

  // Generate random data points
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newPoint = {
          value: Math.random() * 100,
          timestamp: new Date().getTime(),
        };
        const newData = [...prev, newPoint].slice(-20); // Keep last 20 points
        return newData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleExpand = () => {
    setExpanded(!expanded);
    SoundEffects.click();
  };

  return (
    <Box
      component={motion.div}
      layout
      onClick={handleExpand}
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 1,
        p: 2,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          borderColor: color,
        },
      }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      onMouseEnter={() => SoundEffects.hover()}
    >
      <Typography
        variant="subtitle2"
        color="text.secondary"
        sx={{ mb: 1 }}
      >
        {title}
      </Typography>

      <AnimatePresence>
        <Box
          component={motion.div}
          initial={{ height: 100 }}
          animate={{ height: expanded ? 200 : 100 }}
          transition={{ duration: 0.3 }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.palette[color.split('.')[0]][color.split('.')[1]]} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={theme.palette[color.split('.')[0]][color.split('.')[1]]} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <YAxis hide domain={[0, 100]} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={theme.palette[color.split('.')[0]][color.split('.')[1]]}
                fillOpacity={1}
                fill={`url(#gradient-${title})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </AnimatePresence>

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
          ease: 'linear',
        }}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${theme.palette[color.split('.')[0]][color.split('.')[1]]}, transparent)`,
        }}
      />

      {/* Latest value display */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Typography
          variant="caption"
          component={motion.div}
          animate={{
            opacity: [1, 0.7, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          sx={{ color }}
        >
          {data[data.length - 1]?.value.toFixed(1)}%
        </Typography>
        <Box
          component={motion.div}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 1, repeat: Infinity }}
          sx={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            bgcolor: color,
          }}
        />
      </Box>
    </Box>
  );
}

export default SystemMetrics;
