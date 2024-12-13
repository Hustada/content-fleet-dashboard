import { useState } from 'react';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SoundEffects from '../utils/soundEffects';

function ExpandablePanel({ 
  title, 
  children, 
  defaultExpanded = false,
  headerContent,
  color = 'primary.main'
}) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    setExpanded(!expanded);
    SoundEffects.click();
  };

  return (
    <Box
      component={motion.div}
      layout
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 1,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          cursor: 'pointer',
          position: 'relative',
          '&:hover': {
            bgcolor: 'rgba(79, 195, 247, 0.08)',
          },
        }}
        onClick={handleToggle}
        onMouseEnter={() => SoundEffects.hover()}
      >
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>

        {headerContent}

        <IconButton
          component={motion.div}
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          size="small"
          onClick={handleToggle}
          sx={{ color }}
        >
          <ExpandMoreIcon />
        </IconButton>

        {/* Animated border */}
        <Box
          component={motion.div}
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${theme.palette[color.split('.')[0]][color.split('.')[1]]}, transparent)`,
          }}
        />
      </Box>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ p: 2, pt: 0 }}>
              {children}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scanning line */}
      <Box
        component={motion.div}
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
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
    </Box>
  );
}

export default ExpandablePanel;
