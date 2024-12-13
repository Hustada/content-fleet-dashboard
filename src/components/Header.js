import { AppBar, IconButton, Toolbar, Typography, Avatar, Box, Badge, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import { motion } from 'framer-motion';
import StatusIndicator from './StatusIndicator';
import SoundEffects from '../utils/soundEffects';

const MotionIconButton = motion(IconButton);

function Header({ open, onMenuClick }) {
  const theme = useTheme();

  const handleMenuClick = () => {
    SoundEffects.click();
    onMenuClick();
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        backgroundColor: 'background.paper', 
        borderBottom: 1, 
        borderColor: 'divider',
        backgroundImage: `linear-gradient(to right, ${theme.palette.background.paper}, rgba(19, 47, 76, 0.4))`,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <MotionIconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleMenuClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </MotionIconButton>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <StatusIndicator status="online" size={12} />
          <Typography 
            component={motion.div}
            animate={{
              opacity: [1, 0.8, 1],
              transition: { duration: 4, repeat: Infinity }
            }}
            variant="h6"
          >
            Content Fleet
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* System Status Display */}
        <Box 
          sx={{ 
            mr: 4, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5,
            px: 2,
            py: 0.5,
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
            background: 'rgba(79, 195, 247, 0.1)',
          }}
        >
          <Typography 
            variant="caption" 
            color="primary"
            component={motion.div}
            animate={{
              opacity: [1, 0.7, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            LCARS STATUS
          </Typography>
          <Box 
            component={motion.div}
            animate={{
              width: ['60px', '100px', '80px'],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            sx={{ 
              height: '2px', 
              background: theme.palette.primary.main,
              opacity: 0.7,
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <MotionIconButton 
            color="inherit"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => SoundEffects.click()}
          >
            <Badge 
              color="error" 
              variant="dot"
              component={motion.div}
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <NotificationsIcon />
            </Badge>
          </MotionIconButton>

          <MotionIconButton 
            color="inherit"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => SoundEffects.click()}
          >
            <SettingsIcon />
          </MotionIconButton>

          <Avatar
            component={motion.div}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => SoundEffects.click()}
            sx={{ 
              cursor: 'pointer',
              bgcolor: theme.palette.primary.main,
              border: '2px solid',
              borderColor: 'primary.light'
            }}
          >
            C
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
