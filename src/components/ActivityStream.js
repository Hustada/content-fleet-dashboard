import { Box, Typography, useTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const ActivityStream = ({ status = 'online' }) => {
  const theme = useTheme();

  // These will eventually be real content activities
  const activities = [
    { type: 'content', message: 'Article optimization in progress' },
    { type: 'research', message: 'Analyzing market trends' },
    { type: 'engagement', message: 'Monitoring social metrics' },
    { type: 'system', message: 'Running content audit' },
    { type: 'alert', message: 'New content opportunities detected' },
  ];

  const getTypeColor = (type) => {
    switch(type) {
      case 'content': return theme.palette.primary.main;
      case 'research': return theme.palette.success.main;
      case 'engagement': return theme.palette.warning.main;
      case 'system': return theme.palette.info.main;
      case 'alert': return theme.palette.error.main;
      default: return theme.palette.text.primary;
    }
  };

  return (
    <Box sx={{ position: 'relative', p: 2 }}>
      <AnimatePresence mode="popLayout">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.message}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 20, opacity: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 2,
                p: 1,
                borderRadius: 1,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Activity indicator */}
              <Box
                component={motion.div}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: getTypeColor(activity.type),
                }}
              />

              <Typography
                variant="body2"
                sx={{ color: getTypeColor(activity.type) }}
                component={motion.div}
                animate={{
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{ duration: 4, repeat: Infinity, delay: index * 0.1 }}
              >
                {activity.message}
              </Typography>

              {/* Scanning line */}
              <Box
                component={motion.div}
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.1,
                }}
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '50%',
                  height: '1px',
                  background: `linear-gradient(90deg, transparent, ${getTypeColor(activity.type)}, transparent)`,
                }}
              />
            </Box>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Background grid effect */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          opacity: 0.1,
          background: `
            linear-gradient(90deg, ${theme.palette.primary.main} 1px, transparent 1px),
            linear-gradient(0deg, ${theme.palette.primary.main} 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      />
    </Box>
  );
};

export default ActivityStream;
