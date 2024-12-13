import { useState } from 'react';
import { Box, Grid, Paper, Typography, useTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ChatIcon from '@mui/icons-material/Chat';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import StatusIndicator from './StatusIndicator';
import ExpandablePanel from './ExpandablePanel';
import SystemMetrics from './SystemMetrics';
import SoundEffects from '../utils/soundEffects';
import ParticleBackground from './ParticleBackground';
import AgentModal from './AgentModal';

const MissionControl = () => {
  const theme = useTheme();
  const [selectedAgent, setSelectedAgent] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Simulated data - will be real content metrics later
  const contentMetrics = {
    published: Math.floor(Math.random() * 100) + 50,
    inProgress: Math.floor(Math.random() * 30) + 10,
    engagement: Math.floor(Math.random() * 1000) + 500,
    optimization: Math.floor(Math.random() * 100),
  };

  const generateTimeData = () => {
    return Array.from({ length: 24 }, (_, i) => ({
      time: i,
      content: Math.floor(Math.random() * 100),
      engagement: Math.floor(Math.random() * 100),
      optimization: Math.floor(Math.random() * 100),
    }));
  };

  const timeData = generateTimeData();

  // Simulated system status data
  const getRandomStatus = () => {
    const statuses = ['online', 'standby', 'offline'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const systemStatuses = {
    'Research': getRandomStatus(),
    'Engagement': getRandomStatus(),
    'Content': getRandomStatus(),
    'Operations': getRandomStatus(),
    'Intelligence': getRandomStatus(),
    'Engineering': getRandomStatus()
  };

  const MetricCard = ({ title, value, status, color }) => (
    <Paper
      component={motion.div}
      whileHover={{ scale: 1.02 }}
      sx={{
        p: 2,
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, rgba(19, 47, 76, 0.4) 100%)`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" color="text.secondary">{title}</Typography>
        <StatusIndicator status={status} size={12} sx={{ ml: 1 }} />
      </Box>
      
      <Typography variant="h3" component={motion.h3}
        animate={{
          opacity: [1, 0.8, 1],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {value}
      </Typography>

      <ResponsiveContainer width="100%" height={60}>
        <AreaChart data={timeData.slice(-12)}>
          <Area
            type="monotone"
            dataKey={color.split('.')[0]}
            stroke={theme.palette[color.split('.')[0]][color.split('.')[1]]}
            fill={theme.palette[color.split('.')[0]][color.split('.')[1]]}
            fillOpacity={0.1}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Scanning line */}
      <Box
        component={motion.div}
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '50%',
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${theme.palette[color.split('.')[0]][color.split('.')[1]]}, transparent)`,
        }}
      />
    </Paper>
  );

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
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
          >
            <Typography variant="body1" gutterBottom>
              No active missions. Ready to engage.
            </Typography>

            <SystemMetrics title="Mission Capacity" color="warning.main" />
          </ExpandablePanel>
        </Grid>

        {/* Main Metrics */}
        <Grid item xs={12}>
          <ExpandablePanel
            title="Content Fleet Status"
            defaultExpanded
          >
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard
                  title="Published Content"
                  value={contentMetrics.published}
                  status="online"
                  color="success.main"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard
                  title="In Progress"
                  value={contentMetrics.inProgress}
                  status="standby"
                  color="warning.main"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard
                  title="Engagement"
                  value={contentMetrics.engagement}
                  status="online"
                  color="info.main"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard
                  title="Optimization Score"
                  value={`${contentMetrics.optimization}%`}
                  status="online"
                  color="primary.main"
                />
              </Grid>
            </Grid>
          </ExpandablePanel>
        </Grid>

        {/* Crew Status Panel */}
        <Grid item xs={12}>
          <ExpandablePanel
            title="Crew Status"
            defaultExpanded
          >
            <Grid container spacing={2}>
              {Object.entries(systemStatuses).map(([officer, status], index) => (
                <Grid item xs={12} sm={6} md={4} key={officer}>
                  <Paper
                    component={motion.div}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      SoundEffects.click();
                      setSelectedAgent({
                        name: `${officer} Officer`,
                        status: status,
                        role: officer,
                        metrics: {
                          efficiency: Math.floor(Math.random() * 100),
                          accuracy: Math.floor(Math.random() * 100),
                          speed: Math.floor(Math.random() * 100),
                          quality: Math.floor(Math.random() * 100),
                          engagement: Math.floor(Math.random() * 100),
                        }
                      });
                    }}
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
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle1">{officer} Officer</Typography>
                      <StatusIndicator status={status} size={16} />
                    </Box>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      component={motion.div}
                      animate={{
                        opacity: [0.7, 1, 0.7],
                        transition: { duration: 2, repeat: Infinity, delay: index * 0.2 }
                      }}
                    >
                      {status === 'online' ? 'Active' : status === 'standby' ? 'Standing by' : 'Offline'}
                    </Typography>

                    <SystemMetrics 
                      title="Performance" 
                      color={status === 'online' ? 'success.main' : status === 'standby' ? 'warning.main' : 'error.main'} 
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </ExpandablePanel>
        </Grid>

        {/* Performance Chart */}
        <Grid item xs={12}>
          <ExpandablePanel
            title="Performance Overview"
            defaultExpanded
          >
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer>
                <LineChart data={timeData}>
                  <XAxis
                    dataKey="time"
                    stroke={theme.palette.text.secondary}
                    tick={{ fill: theme.palette.text.secondary }}
                  />
                  <YAxis
                    stroke={theme.palette.text.secondary}
                    tick={{ fill: theme.palette.text.secondary }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="content"
                    name="Content Production"
                    stroke={theme.palette.primary.main}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="engagement"
                    name="Engagement"
                    stroke={theme.palette.success.main}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="optimization"
                    name="Optimization"
                    stroke={theme.palette.warning.main}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </ExpandablePanel>
        </Grid>
      </Grid>
      {selectedAgent && (
        <AgentModal
          open={Boolean(selectedAgent)}
          onClose={() => setSelectedAgent(null)}
          agent={selectedAgent}
        />
      )}
    </Box>
  );
};

export default MissionControl;
