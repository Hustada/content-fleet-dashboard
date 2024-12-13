import { useState } from 'react';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, Collapse } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import StatusIndicator from './StatusIndicator';
import SoundEffects from '../utils/soundEffects';

// Simulated log data
const logData = [
  {
    id: 1,
    timestamp: '2024-12-13 14:30:00',
    agent: 'Agent Smith',
    task: 'Content Research',
    status: 'completed',
    details: 'Analyzed 50 articles on AI trends',
    metrics: {
      accuracy: '95%',
      timeSpent: '45 minutes',
      resourcesUsed: ['Google Scholar', 'arXiv', 'Tech Blogs']
    }
  },
  {
    id: 2,
    timestamp: '2024-12-13 14:15:00',
    agent: 'Agent Johnson',
    task: 'Blog Post Generation',
    status: 'in-progress',
    details: 'Writing article on "Future of AI"',
    metrics: {
      completion: '60%',
      wordCount: '800/1500',
      citations: 12
    }
  },
  {
    id: 3,
    timestamp: '2024-12-13 14:00:00',
    agent: 'Agent Brown',
    task: 'SEO Optimization',
    status: 'pending',
    details: 'Awaiting content review',
    metrics: {
      keywords: 15,
      readabilityScore: '85/100',
      targetAudience: 'Tech professionals'
    }
  }
];

// Row component with expandable details
function LogRow({ log }) {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    SoundEffects.click();
    setOpen(!open);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'success';
      case 'in-progress': return 'primary';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  return (
    <>
      <TableRow
        component={motion.tr}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        sx={{ '&:hover': { bgcolor: 'rgba(79, 195, 247, 0.08)' } }}
      >
        <TableCell>
          <IconButton size="small" onClick={handleToggle}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{log.timestamp}</TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StatusIndicator status={log.status === 'completed' ? 'online' : 'standby'} size={8} />
            {log.agent}
          </Box>
        </TableCell>
        <TableCell>{log.task}</TableCell>
        <TableCell>
          <Chip 
            label={log.status}
            color={getStatusColor(log.status)}
            size="small"
            sx={{ textTransform: 'capitalize' }}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2, bgcolor: 'background.paper', borderRadius: 1, p: 2 }}>
              <Typography variant="h6" gutterBottom component="div">
                Details
              </Typography>
              <Typography variant="body2" gutterBottom>
                {log.details}
              </Typography>
              <Typography variant="h6" gutterBottom component="div" sx={{ mt: 2 }}>
                Metrics
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {Object.entries(log.metrics).map(([key, value]) => (
                  <Paper
                    key={key}
                    component={motion.div}
                    whileHover={{ scale: 1.05 }}
                    sx={{ p: 1, bgcolor: 'background.paper' }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                    </Typography>
                    <Typography variant="body2">
                      {Array.isArray(value) ? value.join(', ') : value}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

function AgentLogs() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography 
        variant="h4" 
        gutterBottom
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Agent Logs
      </Typography>
      
      <TableContainer 
        component={Paper}
        sx={{ 
          mt: 3,
          bgcolor: 'background.paper',
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width={50} />
              <TableCell>Timestamp</TableCell>
              <TableCell>Agent</TableCell>
              <TableCell>Task</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <AnimatePresence>
              {logData.map((log) => (
                <LogRow key={log.id} log={log} />
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default AgentLogs;
