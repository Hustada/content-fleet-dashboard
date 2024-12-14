/**
 * MainPanel.js - Bridge Command Center Component
 * 
 * This component serves as the main command and control center, featuring:
 * 1. First Officer Status - AI assistant status and capabilities
 * 2. Active Missions Panel - Overview of ongoing missions
 * 3. Crew Status - System component health and metrics
 * 4. Interactive elements and animations for engagement
 */

import React, { useState, useContext } from 'react';
import { Grid, Paper, Typography, useTheme, Box } from '@mui/material';
import { motion } from 'framer-motion';
import ParticleBackground from './ParticleBackground';
import StatusIndicator from './StatusIndicator';
import SystemMetrics from './SystemMetrics';
import ExpandablePanel from './ExpandablePanel';
import SoundEffects from '../utils/soundEffects';
import AgentModal from './AgentModal';
import MissionPreview from './MissionPreview';
import { MissionContext } from '../contexts/MissionContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

/**
 * MainPanel Component - The Bridge View
 * @param {Object} props - Component props
 * @param {Function} props.onMissionClick - Handler for navigating to Mission Control
 */
function MainPanel({ onMissionClick }) {
  // Theme and state management
  const theme = useTheme();
  const [selectedAgent, setSelectedAgent] = useState(null);
  const { missions } = useContext(MissionContext);

  // Animation variants for individual items
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

  // Animation for scanline effect
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

  /**
   * Generate a random status for simulation
   * @returns {string} Random status: 'online', 'standby', or 'offline'
   */
  const getRandomStatus = () => {
    const statuses = ['online', 'standby', 'offline'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  // Simulated system statuses for crew members
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        height: '100vh',
        overflow: 'auto',
        position: 'relative',
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        padding: theme.spacing(3)
      }}
    >
      {/* Animated background */}
      <ParticleBackground />
      
      {/* Bridge header with status line */}
      <Grid container sx={{ 
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
      </Grid>
      
      {/* Main content grid */}
      <Grid container spacing={3}>
        {/* First Officer Status Panel */}
        <Grid item xs={12} md={6}>
          <ExpandablePanel
            title="First Officer Status"
            headerContent={<StatusIndicator status="online" size={20} />}
            defaultExpanded
          >
            <Grid sx={{ mb: 3 }}>
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
            </Grid>

            {/* System metrics display */}
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
            headerContent={<StatusIndicator status={missions.length > 0 ? "online" : "standby"} size={20} />}
            color="warning.main"
            defaultExpanded
          >
            <Grid sx={{ mb: 2 }}>
              <Typography variant="body1" gutterBottom>
                {missions.length === 0 ? (
                  'No active missions. Ready to engage.'
                ) : (
                  `${missions.length} active mission${missions.length === 1 ? '' : 's'}.`
                )}
              </Typography>
            </Grid>

            {missions.map(mission => (
              <MissionPreview
                key={mission.id}
                mission={mission}
                onViewDetails={() => onMissionClick()}
                onUpdateStatus={() => onMissionClick()}
              />
            ))}

            {missions.length > 0 && (
              <Grid sx={{ mt: 2 }}>
                <SystemMetrics title="Mission Capacity" color="warning.main" />
              </Grid>
            )}
          </ExpandablePanel>
        </Grid>

        {/* Crew Status Panel */}
        <Grid item xs={12}>
          <ExpandablePanel
            title="Crew Status"
            headerContent={
              <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                {Object.values(systemStatuses).filter(agent => agent.status === 'online').length} Active
              </Typography>
            }
            defaultExpanded
          >
            {/* System status cards grid */}
            <Grid container spacing={3}>
              {Object.entries(systemStatuses).map(([key, agent], index) => (
                <Grid item xs={12} sm={6} md={4} key={key}>
                  <Paper
                    component={motion.div}
                    elevation={3}
                    sx={{
                      position: 'relative',
                      overflow: 'hidden',
                      height: '100%',
                      bgcolor: theme.palette.background.paper,
                      borderRadius: 2,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease-in-out',
                      border: `1px solid ${theme.palette.divider}`,
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[8],
                        '& .metrics': {
                          opacity: 1,
                          transform: 'translateY(0)'
                        }
                      }
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      SoundEffects.click();
                      setSelectedAgent(agent);
                    }}
                  >
                    {/* Card Header */}
                    <Box sx={{ p: 2, pb: 1 }}>
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item xs>
                          <Typography variant="h6" color="primary" sx={{ 
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}>
                            {agent.name}
                            <StatusIndicator status={agent.status} size={16} />
                          </Typography>
                        </Grid>
                      </Grid>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {agent.role}
                      </Typography>
                    </Box>

                    {/* Metrics Grid */}
                    <Box 
                      className="metrics"
                      sx={{ 
                        p: 2,
                        pt: 0,
                        opacity: 0.9,
                        transform: 'translateY(4px)',
                        transition: 'all 0.3s ease-in-out'
                      }}
                    >
                      <Grid container spacing={1}>
                        {Object.entries(agent.metrics).map(([metric, value]) => (
                          <Grid item xs={4} key={metric}>
                            <Box sx={{
                              p: 1,
                              borderRadius: 1,
                              bgcolor: theme.palette.background.default,
                              textAlign: 'center'
                            }}>
                              <Typography 
                                variant="caption" 
                                color="text.secondary" 
                                sx={{ 
                                  display: 'block',
                                  textTransform: 'capitalize',
                                  mb: 0.5
                                }}
                              >
                                {metric}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                color="primary"
                                sx={{ fontWeight: 600 }}
                              >
                                {value}
                              </Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>

                    {/* Scanline Effect */}
                    <motion.div
                      variants={scanlineVariants}
                      animate="animate"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '20%',
                        background: `linear-gradient(180deg, ${theme.palette.primary.main}15, transparent)`,
                        pointerEvents: 'none',
                        opacity: 0.3
                      }}
                    />
                  </Paper>
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
    </motion.div>
  );
}

export default MainPanel;
