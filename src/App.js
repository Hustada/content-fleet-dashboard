/**
 * App.js - Main Application Component
 * 
 * This is the root component of the application that handles:
 * 1. Global state management (sidebar state, current view)
 * 2. Theme provider setup
 * 3. Layout structure (header, sidebar, main content)
 * 4. View routing and animations
 */

import { useState } from 'react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SideControlPanel from './components/SideControlPanel';
import MainPanel from './components/MainPanel';
import AgentLogs from './components/AgentLogs';
import Chat from './components/Chat';
import MissionControl from './components/MissionControl';
import { MissionProvider } from './contexts/MissionContext';
import theme from './theme';

/**
 * Main application component
 */
function App() {
  // Global state for sidebar visibility and current view
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState('bridge');

  /**
   * Toggle sidebar visibility
   */
  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  /**
   * Handle navigation between different views
   * @param {string} view - The new view to navigate to
   */
  const handleViewChange = (view) => {
    console.log('Changing view to:', view);
    setCurrentView(view);
  };

  /**
   * Render the appropriate component based on current view
   * @returns {JSX.Element} The component to render for the current view
   */
  const renderView = () => {
    console.log('Current view:', currentView);
    switch(currentView) {
      case 'bridge':
      default:
        return <MainPanel onMissionClick={() => handleViewChange('missions')} />;
      case 'missions':
        return <MissionControl />;
      case 'logs':
        return <AgentLogs />;
      case 'chat':
        return <Chat />;
      case 'analytics':
      case 'crew':
      case 'settings':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h2>{currentView.charAt(0).toUpperCase() + currentView.slice(1)}</h2>
            <p>This view is under development...</p>
          </motion.div>
        );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <MissionProvider>
        <motion.div
          style={{
            display: 'flex',
            minHeight: '100vh'
          }}
        >
          <CssBaseline />
          {/* Main application header */}
          <Header open={sidebarOpen} onMenuClick={handleDrawerToggle} />
          
          {/* Navigation sidebar */}
          <Sidebar 
            open={sidebarOpen} 
            onClose={handleDrawerToggle}
            currentView={currentView}
            onViewChange={handleViewChange}
          />
          
          {/* Side control panel (visible when sidebar is closed) */}
          <AnimatePresence>
            {!sidebarOpen && <SideControlPanel />}
          </AnimatePresence>
          
          {/* Main content area with view transitions */}
          <motion.div
            style={{
              flexGrow: 1,
              height: '100vh',
              overflow: 'auto',
              paddingTop: theme.spacing(8),
              backgroundColor: theme.palette.background.default,
              position: 'relative'
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                style={{ 
                  height: '100%',
                  position: 'absolute',
                  width: '100%',
                  top: 0,
                  left: 0
                }}
              >
                {renderView()}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </MissionProvider>
    </ThemeProvider>
  );
}

export default App;
