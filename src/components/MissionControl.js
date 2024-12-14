import { useState } from 'react';
import { Box, Grid, Paper, Typography, useTheme, Button, Dialog, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { useMission } from '../contexts/MissionContext';
import StatusIndicator from './StatusIndicator';
import SystemMetrics from './SystemMetrics';
import SoundEffects from '../utils/soundEffects';
import ParticleBackground from './ParticleBackground';

const MissionControl = () => {
  const theme = useTheme();
  const { missions, createMission, updateMission } = useMission();
  const [selectedMission, setSelectedMission] = useState(null);
  const [isNewMissionDialogOpen, setNewMissionDialogOpen] = useState(false);
  const [newMissionTitle, setNewMissionTitle] = useState('');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const handleCreateMission = () => {
    const mission = createMission({
      title: newMissionTitle,
      priority: 'medium'
    });
    setNewMissionTitle('');
    setNewMissionDialogOpen(false);
    SoundEffects.success();
  };

  const MissionCard = ({ mission }) => (
    <Paper
      component={motion.div}
      whileHover={{ scale: 1.02 }}
      data-testid={`mission-card-${mission.id}`}
      onClick={() => setSelectedMission(mission)}
      style={{
        padding: theme.spacing(2),
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, rgba(19, 47, 76, 0.4) 100%)`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">{mission.title}</Typography>
        <Box data-testid={`priority-indicator-${mission.priority}`} sx={{ 
          width: 12, 
          height: 12, 
          borderRadius: '50%',
          bgcolor: mission.priority === 'high' ? 'error.main' : mission.priority === 'medium' ? 'warning.main' : 'success.main'
        }} />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">Progress</Typography>
        <Box 
          data-testid={`mission-progress-${mission.id}`}
          aria-valuenow={mission.progress}
          sx={{ 
            width: '100%',
            height: 4,
            bgcolor: 'background.paper',
            borderRadius: 1,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              width: `${mission.progress}%`,
              height: '100%',
              bgcolor: 'primary.main',
              position: 'absolute',
              transition: 'width 0.5s ease-in-out'
            }}
          />
          <Typography variant="caption" sx={{ ml: 1 }}>{mission.progress}%</Typography>
        </Box>
      </Box>

      <Box data-testid={`mission-agents-${mission.id}`} sx={{ display: 'flex', gap: 1 }}>
        {mission.agents.map((agent, index) => (
          <Box
            key={agent}
            data-testid="agent-avatar"
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: 'primary.dark',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography variant="caption">{agent.charAt(0).toUpperCase()}</Typography>
          </Box>
        ))}
      </Box>

      <FormControl sx={{ mt: 2, minWidth: 120 }} size="small">
        <Select
          value={mission.status}
          data-testid={`mission-status-select-${mission.id}`}
          onChange={(e) => {
            e.stopPropagation();
            updateMission(mission.id, { status: e.target.value });
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="in-progress">In Progress</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </Select>
      </FormControl>
    </Paper>
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ 
        flexGrow: 1, 
        padding: theme.spacing(3), 
        position: 'relative' 
      }}
    >
      <ParticleBackground />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Mission Control</Typography>
        <Button variant="contained" onClick={() => setNewMissionDialogOpen(true)}>
          New Mission
        </Button>
      </Box>

      <Box data-testid="mission-timeline" sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>Mission Timeline</Typography>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={missions}>
            <XAxis dataKey="timeline.start" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="progress" stroke={theme.palette.primary.main} />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      <Grid container spacing={3}>
        {missions.map((mission) => (
          <Grid item xs={12} md={6} key={mission.id}>
            <MissionCard mission={mission} />
          </Grid>
        ))}
      </Grid>

      <AnimatePresence>
        {selectedMission && (
          <Dialog 
            open={Boolean(selectedMission)} 
            onClose={() => setSelectedMission(null)}
            maxWidth="md"
            fullWidth
            TransitionComponent={motion.div}
            TransitionProps={{
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -20 }
            }}
          >
            <Box data-testid="mission-details-panel" sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>{selectedMission.title}</Typography>
              <Grid container spacing={2}>
                {selectedMission.tasks.map((task) => (
                  <Grid item xs={12} key={task.id}>
                    <Paper sx={{ p: 2 }}>
                      <Typography>{task.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Status: {task.status}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Dialog>
        )}

        <Dialog 
          open={isNewMissionDialogOpen} 
          onClose={() => setNewMissionDialogOpen(false)}
          data-testid="new-mission-dialog"
          TransitionComponent={motion.div}
          TransitionProps={{
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 }
          }}
        >
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Create New Mission</Typography>
            <TextField
              fullWidth
              label="Mission Title"
              value={newMissionTitle}
              onChange={(e) => setNewMissionTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button 
              variant="contained" 
              onClick={handleCreateMission}
              disabled={!newMissionTitle.trim()}
            >
              Create Mission
            </Button>
          </Box>
        </Dialog>
      </AnimatePresence>
    </motion.div>
  );
};

export default MissionControl;
