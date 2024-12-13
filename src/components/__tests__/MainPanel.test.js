import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MainPanel from '../MainPanel';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material';

// Mock framer-motion
jest.mock('framer-motion', () => {
  const mockComponent = ({ children, ...props }) => {
    const { whileHover, whileTap, animate, initial, exit, ...rest } = props;
    return <div {...rest}>{children}</div>;
  };

  const motion = (Component) => mockComponent;
  motion.div = mockComponent;
  motion.nav = mockComponent;
  motion.button = mockComponent;
  motion.svg = mockComponent;

  return {
    motion,
    AnimatePresence: ({ children }) => <>{children}</>
  };
});

// Mock the child components
jest.mock('../ParticleBackground', () => () => <div data-testid="particle-background" />);
jest.mock('../StatusIndicator', () => ({ status }) => <div data-testid="status-indicator">{status}</div>);
jest.mock('../SystemMetrics', () => ({ title }) => <div data-testid="system-metrics">{title}</div>);
jest.mock('../ExpandablePanel', () => ({ children, title }) => (
  <div data-testid="expandable-panel" title={title}>
    {children}
  </div>
));

// Mock the AgentModal component
jest.mock('../AgentModal', () => {
  const AgentModal = ({ agent, onClose, open }) => {
    if (!open) return null;
    return (
      <div data-testid="agent-modal">
        <div data-testid="agent-name">{agent?.name || 'Unknown'}</div>
        <div data-testid="agent-role">{agent?.role || 'Content Research Specialist'}</div>
        <button onClick={onClose} data-testid="close-button">Close</button>
      </div>
    );
  };
  return AgentModal;
});

// Mock the SoundEffects utility
jest.mock('../../utils/SoundEffects', () => ({
  scan: jest.fn(),
  hover: jest.fn(),
  click: jest.fn(),
}));

const theme = createTheme();

const renderWithTheme = (component) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('MainPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the main components', async () => {
    renderWithTheme(<MainPanel />);
    
    await waitFor(() => {
      expect(screen.getByText('Bridge Overview')).toBeInTheDocument();
      expect(screen.getByTestId('particle-background')).toBeInTheDocument();
      expect(screen.getAllByTestId('expandable-panel')).toHaveLength(3);
    });
  });

  it('renders the First Officer panel', async () => {
    renderWithTheme(<MainPanel />);
    
    await waitFor(() => {
      const panels = screen.getAllByTestId('expandable-panel');
      const firstOfficerPanel = panels.find(panel => panel.getAttribute('title') === 'First Officer Status');
      expect(firstOfficerPanel).toBeInTheDocument();
      expect(screen.getByText('Ready to assist, Captain. Awaiting your orders.')).toBeInTheDocument();
      expect(screen.getByText('Neural Processing')).toBeInTheDocument();
      expect(screen.getByText('Response Time')).toBeInTheDocument();
    });
  });

  it('renders the Active Missions panel', async () => {
    renderWithTheme(<MainPanel />);
    
    await waitFor(() => {
      const panels = screen.getAllByTestId('expandable-panel');
      const missionsPanel = panels.find(panel => panel.getAttribute('title') === 'Active Missions');
      expect(missionsPanel).toBeInTheDocument();
      expect(screen.getByText('No active missions. Ready to engage.')).toBeInTheDocument();
      expect(screen.getByText('Mission Capacity')).toBeInTheDocument();
    });
  });

  it('renders the Crew Status panel with agents', async () => {
    renderWithTheme(<MainPanel />);
    
    await waitFor(() => {
      const panels = screen.getAllByTestId('expandable-panel');
      const crewPanel = panels.find(panel => panel.getAttribute('title') === 'Crew Status');
      expect(crewPanel).toBeInTheDocument();
      expect(screen.getByText('Research')).toBeInTheDocument();
      expect(screen.getByText('Engagement')).toBeInTheDocument();
      expect(screen.getByText('Content Research Specialist')).toBeInTheDocument();
      expect(screen.getByText('User Interaction Expert')).toBeInTheDocument();
    });
  });

  it('opens AgentModal when clicking an agent', async () => {
    renderWithTheme(<MainPanel />);
    
    await waitFor(() => {
      const researchAgent = screen.getByText('Research');
      expect(researchAgent).toBeInTheDocument();
      fireEvent.click(researchAgent);
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('agent-modal')).toBeInTheDocument();
      expect(screen.getByTestId('agent-name')).toHaveTextContent('Research');
      expect(screen.getByTestId('agent-role')).toHaveTextContent('Content Research Specialist');
    });
  });

  it('closes AgentModal when clicking close button', async () => {
    renderWithTheme(<MainPanel />);
    
    // Open modal
    await waitFor(() => {
      const researchAgent = screen.getByText('Research');
      fireEvent.click(researchAgent);
    });
    
    // Verify modal is open
    await waitFor(() => {
      expect(screen.getByTestId('agent-modal')).toBeInTheDocument();
    });
    
    // Close modal
    const closeButton = screen.getByTestId('close-button');
    fireEvent.click(closeButton);
    
    // Verify modal is closed
    await waitFor(() => {
      expect(screen.queryByTestId('agent-modal')).not.toBeInTheDocument();
    });
  });
});
