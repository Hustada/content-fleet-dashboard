/**
 * MissionPreview.js - Compact Mission Display Component
 * 
 * This component displays a preview card for a mission, showing:
 * - Title and priority
 * - Progress and timeline
 * - Agent assignments
 * - Quick actions
 */

import { Box, Paper, Typography, LinearProgress, Chip, IconButton, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import { Person, Schedule, Visibility, Edit } from '@mui/icons-material';
import { format, formatDistanceToNow } from 'date-fns';

/**
 * Calculate the time remaining until a deadline
 * @param {string} deadline - ISO date string of the deadline
 * @returns {string} Formatted time remaining
 */
const getTimeRemaining = (deadline) => {
  if (!deadline) return 'No deadline set';
  const date = new Date(deadline);
  return formatDistanceToNow(date, { addSuffix: true });
};

/**
 * Get the appropriate color for priority level
 * @param {string} priority - Priority level (high, medium, low)
 * @returns {string} Material-UI color name
 */
const getPriorityColor = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    case 'low':
      return 'success';
    default:
      return 'default';
  }
};

/**
 * MissionPreview Component
 * @param {Object} props - Component props
 * @param {Object} props.mission - Mission data object
 * @param {Function} props.onViewDetails - Handler for view details action
 * @param {Function} props.onUpdateStatus - Handler for update status action
 */
function MissionPreview({ mission, onViewDetails, onUpdateStatus }) {
  const {
    title,
    priority,
    progress = 0,
    agents = [],
    timeline = {},
    status
  } = mission;

  return (
    <Paper
      component={motion.div}
      whileHover={{ scale: 1.02 }}
      sx={{
        p: 2,
        mb: 2,
        background: (theme) => 
          `linear-gradient(135deg, ${theme.palette.background.paper} 0%, rgba(19, 47, 76, 0.4) 100%)`,
      }}
    >
      {/* Header with title and priority */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
        <Chip 
          size="small"
          label={priority}
          color={getPriorityColor(priority)}
          sx={{ textTransform: 'capitalize' }}
        />
      </Box>

      {/* Progress bar */}
      <Box sx={{ my: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            Progress
          </Typography>
          <Typography variant="caption" color="primary">
            {progress}%
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ height: 6, borderRadius: 1 }}
        />
      </Box>

      {/* Mission details */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Person fontSize="small" color="action" />
          <Typography variant="caption">
            {agents.length} agent{agents.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Schedule fontSize="small" color="action" />
          <Typography variant="caption">
            {getTimeRemaining(timeline.estimated_completion)}
          </Typography>
        </Box>
      </Box>

      {/* Action buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Tooltip title="View Details">
          <IconButton 
            size="small" 
            onClick={onViewDetails}
            data-testid="view-details-button"
          >
            <Visibility fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Update Status">
          <IconButton 
            size="small" 
            onClick={onUpdateStatus}
            data-testid="update-status-button"
          >
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );
}

export default MissionPreview;
