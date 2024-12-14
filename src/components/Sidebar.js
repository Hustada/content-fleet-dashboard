import { Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Box, Typography, useTheme } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ChatIcon from '@mui/icons-material/Chat';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import { motion } from 'framer-motion';
import StatusIndicator from './StatusIndicator';
import SoundEffects from '../utils/soundEffects';

const DRAWER_WIDTH = 240;

const menuItems = [
  { 
    text: 'Bridge',
    icon: <DashboardIcon />,
    status: 'online',
    view: 'bridge',
    description: 'Command & Control Center'
  },
  { 
    text: 'Mission Control',
    icon: <AssignmentIcon />,
    status: 'online',
    view: 'missions',
    description: 'Mission Management & Timeline'
  },
  { 
    text: 'Agent Logs',
    icon: <AssignmentIcon />,
    status: 'online',
    view: 'logs',
    description: 'Content Creation History'
  },
  { 
    text: 'Chat',
    icon: <ChatIcon />,
    status: 'online',
    view: 'chat',
    description: 'Agent Communication Console'
  },
  { 
    text: 'Analytics',
    icon: <AnalyticsIcon />,
    status: 'standby',
    view: 'analytics',
    description: 'Content Performance Metrics'
  },
  { 
    text: 'Crew',
    icon: <PeopleIcon />,
    status: 'online',
    view: 'crew',
    description: 'Agent Management'
  },
  { 
    text: 'Settings',
    icon: <SettingsIcon />,
    status: 'online',
    view: 'settings',
    description: 'System Configuration'
  },
];

const MotionListItem = motion(ListItem);

function Sidebar({ open, onClose, currentView, onViewChange }) {
  const theme = useTheme();

  const handleViewChange = (view) => {
    SoundEffects.click();
    onViewChange(view);
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: 'background.paper',
          borderRight: 1,
          borderColor: 'divider',
          backgroundImage: `linear-gradient(180deg, ${theme.palette.background.paper}, rgba(19, 47, 76, 0.4))`,
        },
      }}
    >
      <Box 
        sx={{ 
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <StatusIndicator status="online" size={12} />
          <Typography 
            variant="h6" 
            color="primary" 
            sx={{ fontWeight: 'bold' }}
            component={motion.div}
            animate={{
              opacity: [1, 0.8, 1],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            Content Fleet
          </Typography>
        </Box>

        {/* Scanning line effect */}
        <Box
          component={motion.div}
          animate={{
            y: ['0%', '100%'],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '20%',
            background: `linear-gradient(180deg, ${theme.palette.primary.main}20, transparent)`,
            pointerEvents: 'none',
          }}
        />
      </Box>

      <List>
        {menuItems.map((item, index) => (
          <MotionListItem 
            key={item.text}
            disablePadding
            initial={false}
            animate={{ 
              x: 0,
              transition: { delay: index * 0.1 }
            }}
          >
            <ListItemButton
              onClick={() => handleViewChange(item.view)}
              sx={{
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: currentView === item.view ? 'rgba(79, 195, 247, 0.08)' : 'transparent',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '1px',
                  background: `linear-gradient(90deg, transparent, ${theme.palette.divider}, transparent)`,
                }
              }}
            >
              <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  sx: { 
                    color: currentView === item.view ? 'primary.main' : 'text.primary'
                  }
                }}
              />
              <Box 
                component={motion.div}
                initial={false}
                animate={{
                  opacity: currentView === item.view ? 1 : [0.5, 1, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 }}
              >
                <StatusIndicator status={item.status} size={8} />
              </Box>

              {/* Description tooltip */}
              <Box
                sx={{
                  position: 'absolute',
                  left: '100%',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  ml: 2,
                  p: 1,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  boxShadow: 4,
                  visibility: 'hidden',
                  opacity: 0,
                  transition: 'all 0.2s',
                  zIndex: 1000,
                  '& Typography': {
                    whiteSpace: 'nowrap',
                  },
                  '.MuiListItemButton-root:hover &': {
                    visibility: 'visible',
                    opacity: 1,
                  }
                }}
              >
                <Typography variant="caption">
                  {item.description}
                </Typography>
              </Box>
            </ListItemButton>
          </MotionListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default Sidebar;
