import { Box, Typography, IconButton, Paper, Grid } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import StatusIndicator from './StatusIndicator';
import SystemMetrics from './SystemMetrics';
import SoundEffects from '../utils/soundEffects';
import AgentRadarChart from './AgentRadarChart';
import ActivityStream from './ActivityStream';

const AgentModal = ({ agent, status, onClose, open }) => {
  if (!open) return null;

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50
    }
  };

  const handleClose = () => {
    SoundEffects.click();
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={overlayVariants}
        data-testid="modal-overlay"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1300,
          backdropFilter: 'blur(8px)',
        }}
        onClick={handleClose}
      >
        <motion.div
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '90%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto',
          }}
        >
          <Paper
            elevation={24}
            sx={{
              p: 3,
              background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1), rgba(25, 118, 210, 0.05))',
              backdropFilter: 'blur(16px)',
              border: '1px solid',
              borderColor: 'divider',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" sx={{ flexGrow: 1 }}>
                {agent?.name || agent || 'Unknown Agent'}
              </Typography>
              <StatusIndicator status={status} size={24} />
              <IconButton 
                onClick={handleClose}
                sx={{ ml: 2 }}
                color="primary"
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Content */}
            <Box sx={{ display: 'grid', gap: 3 }}>
              {/* Status Section */}
              <Box>
                <Typography variant="h6" gutterBottom>Current Status</Typography>
                <Typography 
                  variant="body1"
                  component={motion.div}
                  animate={{
                    opacity: [1, 0.7, 1],
                    transition: { duration: 2, repeat: Infinity }
                  }}
                >
                  {status === 'online' ? 'Active and operational' : 
                   status === 'standby' ? 'Standing by for orders' : 
                   'Currently offline'}
                </Typography>
              </Box>

              {/* Capabilities Section */}
              <Box>
                <Typography variant="h6" gutterBottom>Agent Capabilities</Typography>
                <AgentRadarChart status={status} />
              </Box>

              {/* Activity Stream */}
              <Box>
                <Typography variant="h6" gutterBottom>Live Activity</Typography>
                <ActivityStream status={status} />
              </Box>

              {/* Metrics Section */}
              <Box>
                <Typography variant="h6" gutterBottom>Performance Metrics</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <SystemMetrics title="Neural Processing" color="primary.main" />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <SystemMetrics title="Response Time" color="success.main" />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <SystemMetrics title="Efficiency Rating" color="warning.main" />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <SystemMetrics title="Resource Usage" color="error.main" />
                  </Grid>
                </Grid>
              </Box>

              {/* Recent Activity */}
              <Box>
                <Typography variant="h6" gutterBottom>Recent Activity</Typography>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'background.paper', 
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider'
                }}>
                  <motion.div
                    animate={{
                      opacity: [1, 0.7, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Latest activities will be displayed here...
                    </Typography>
                  </motion.div>
                </Box>
              </Box>
            </Box>
          </Paper>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AgentModal;
