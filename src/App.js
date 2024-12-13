import { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SideControlPanel from './components/SideControlPanel';
import MissionControl from './components/MissionControl';
import AgentLogs from './components/AgentLogs';
import Chat from './components/Chat';
import { MissionProvider } from './contexts/MissionContext';
import theme from './theme';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState('bridge');

  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleViewChange = (view) => {
    console.log('Changing view to:', view);
    setCurrentView(view);
  };

  const renderView = () => {
    console.log('Current view:', currentView);
    switch(currentView) {
      case 'bridge':
      default:
        return <MissionControl />;
      case 'logs':
        return <AgentLogs />;
      case 'chat':
        return <Chat />;
      case 'analytics':
      case 'crew':
      case 'settings':
        return (
          <Box sx={{ p: 3 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2>{currentView.charAt(0).toUpperCase() + currentView.slice(1)}</h2>
              <p>This view is under development...</p>
            </motion.div>
          </Box>
        );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <MissionProvider>
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          <CssBaseline />
          <Header open={sidebarOpen} onMenuClick={handleDrawerToggle} />
          <Sidebar 
            open={sidebarOpen} 
            onClose={handleDrawerToggle}
            currentView={currentView}
            onViewChange={handleViewChange}
          />
          <AnimatePresence>
            {!sidebarOpen && <SideControlPanel />}
          </AnimatePresence>
          <Box
            component={motion.div}
            layout
            sx={{
              flexGrow: 1,
              height: '100vh',
              overflow: 'auto',
              pt: 8,
              backgroundColor: theme.palette.background.default,
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                style={{ height: '100%' }}
              >
                {renderView()}
              </motion.div>
            </AnimatePresence>
          </Box>
        </Box>
      </MissionProvider>
    </ThemeProvider>
  );
}

export default App;
