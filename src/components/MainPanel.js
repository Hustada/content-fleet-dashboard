import { Box, Grid, Paper, Typography, useTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ParticleBackground from './ParticleBackground';
import StatusIndicator from './StatusIndicator';
import SystemMetrics from './SystemMetrics';
import ExpandablePanel from './ExpandablePanel';
import SoundEffects from '../utils/soundEffects';
import AgentModal from './AgentModal';
import { useState, useContext } from 'react';
import { MissionContext } from '../contexts/MissionContext';

const MotionPaper = motion(Box);

function MainPanel({ onMissionClick }) {
  const theme = useTheme();
  const [selectedAgent, setSelectedAgent] = useState(null);
  const { missions } = useContext(MissionContext);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const scanlineVariants = {
    animate: {
      y: ["0%", "100%"],
      opacity: [0.5, 0],
      transition: {
        y: {
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        },
        opacity: {
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }
      }
    }
  };

  // Simulated system status data
  const getRandomStatus = () => {
    const statuses = ['online', 'standby', 'offline'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const systemStatuses = {
    'Research': {
      name: 'Research',
      status: getRandomStatus(),
      role: 'Content Research Specialist',
      metrics: {
        accuracy: '95%',
        speed: '87%',
        efficiency: '92%'
      }
    },
    'Engagement': {
      name: 'Engagement',
      status: getRandomStatus(),
      role: 'User Interaction Expert',
      metrics: {
        response: '98%',
        satisfaction: '91%',
        engagement: '89%'
      }
    },
    'Content': {
      name: 'Content',
      status: getRandomStatus(),
      role: 'Content Generation Lead',
      metrics: {
        quality: '94%',
        creativity: '96%',
        consistency: '93%'
      }
    },
    'Operations': {
      name: 'Operations',
      status: getRandomStatus(),
      role: 'System Operations Manager',
      metrics: {
        uptime: '99.9%',
        performance: '95%',
        reliability: '97%'
      }
    },
    'Intelligence': {
      name: 'Intelligence',
      status: getRandomStatus(),
      role: 'Data Analysis Specialist',
      metrics: {
        accuracy: '96%',
        insights: '92%',
        predictions: '89%'
      }
    },
    'Engineering': {
      name: 'Engineering',
      status: getRandomStatus(),
      role: 'Technical Operations Lead',
      metrics: {
        optimization: '93%',
        innovation: '91%',
        reliability: '95%'
      }
    }
  };

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      data-testid="main-panel"
      sx={{ flexGrow: 1, p: 3, position: 'relative' }}
      onMouseEnter={() => SoundEffects.scan()}
    >
      <ParticleBackground />
      
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        mb: 4,
        '&::after': {
          content: '""',
          flex: 1,
          height: '2px',
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, transparent)`
        }
      }}>
        <Typography variant="h4">Bridge Overview</Typography>
        <StatusIndicator status="online" size={24} />
      </Box>
      
      <Grid container spacing={3}>
        {/* First Officer Panel */}
        <Grid item xs={12} md={6}>
          <ExpandablePanel
            title="First Officer Status"
            headerContent={<StatusIndicator status="online" size={20} />}
            defaultExpanded
          >
            <Box sx={{ mb: 3 }}>
              <Typography 
                component={motion.div}
                animate={{ 
                  opacity: [1, 0.7, 1],
                  transition: { duration: 4, repeat: Infinity }
                }}
                variant="body1"
              >
                Ready to assist, Captain. Awaiting your orders.
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <SystemMetrics title="Neural Processing" color="primary.main" />
              </Grid>
              <Grid item xs={12}>
                <SystemMetrics title="Response Time" color="success.main" />
              </Grid>
            </Grid>
          </ExpandablePanel>
        </Grid>

        {/* Active Missions Panel */}
        <Grid item xs={12} md={6}>
          <ExpandablePanel
            title="Active Missions"
            headerContent={<StatusIndicator status="standby" size={20} />}
            color="warning.main"
            onClick={onMissionClick}
            sx={{ cursor: 'pointer' }}
          >
            <Typography variant="body1" gutterBottom>
              {missions.length === 0 ? (
                'No active missions. Ready to engage.'
              ) : (
                `${missions.length} active mission${missions.length === 1 ? '' : 's'}. Click to view details.`
              )}
            </Typography>

            <SystemMetrics title="Mission Capacity" color="warning.main" />
          </ExpandablePanel>
        </Grid>

        {/* Crew Status Panel */}
        <Grid item xs={12}>
          <ExpandablePanel
            title="Crew Status"
            defaultExpanded
          >
            <Grid container spacing={2} sx={{ width: '100%', margin: 0 }}>
              {Object.entries(systemStatuses).map(([key, agent], index) => (
                <Grid item xs={12} sm={6} md={4} key={key}>
                  <MotionPaper
                    variants={itemVariants}
                    sx={{ 
                      p: 2, 
                      backgroundColor: 'background.default',
                      position: 'relative',
                      overflow: 'hidden',
                      border: '1px solid',
                      borderColor: 'divider',
                      height: '100%',
                      cursor: 'pointer'
                    }}
                    whileHover={{ 
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
                    onMouseEnter={() => SoundEffects.hover()}
                    onClick={() => {
                      SoundEffects.click();
                      setSelectedAgent(agent);
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="h6" color="primary">
                        {agent.name}
                      </Typography>
                      <StatusIndicator status={agent.status} />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {agent.role}
                    </Typography>
                    <Grid container spacing={1}>
                      {Object.entries(agent.metrics).map(([metric, value]) => (
                        <Grid item xs={4} key={metric}>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {metric}
                          </Typography>
                          <Typography variant="body2" color="primary">
                            {value}
                          </Typography>
                        </Grid>
                      ))}
                    </Grid>

                    {/* Scanning effect */}
                    <Box
                      component={motion.div}
                      variants={scanlineVariants}
                      animate="animate"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '20%',
                        background: `linear-gradient(180deg, ${theme.palette.primary.main}10, transparent)`,
                        pointerEvents: 'none',
                      }}
                    />
                  </MotionPaper>
                </Grid>
              ))}
            </Grid>
          </ExpandablePanel>
        </Grid>
      </Grid>

      <AgentModal
        open={selectedAgent !== null}
        onClose={() => setSelectedAgent(null)}
        agent={selectedAgent}
        status={selectedAgent?.status}
      />
    </Box>
  );
}

export default MainPanel;
