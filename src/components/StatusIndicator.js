import { Box } from '@mui/material';
import { motion } from 'framer-motion';

function StatusIndicator({ status = 'online', size = 40 }) {
  const colors = {
    online: '#4CAF50',
    standby: '#FFC107',
    offline: '#F44336',
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.7, 0.3, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const glowVariants = {
    animate: {
      boxShadow: [
        `0 0 ${size/4}px ${colors[status]}`,
        `0 0 ${size/2}px ${colors[status]}`,
        `0 0 ${size/4}px ${colors[status]}`
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <Box sx={{ position: 'relative', width: size, height: size }}>
      <Box
        component={motion.div}
        variants={pulseVariants}
        animate="animate"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          backgroundColor: colors[status],
          opacity: 0.3
        }}
      />
      <Box
        component={motion.div}
        variants={glowVariants}
        animate="animate"
        sx={{
          position: 'absolute',
          top: '25%',
          left: '25%',
          width: '50%',
          height: '50%',
          borderRadius: '50%',
          backgroundColor: colors[status],
        }}
      />
    </Box>
  );
}

export default StatusIndicator;
