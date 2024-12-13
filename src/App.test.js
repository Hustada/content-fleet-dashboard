import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom';

// Mock child components
jest.mock('./components/Header', () => () => <div data-testid="header">Header</div>);
jest.mock('./components/Sidebar', () => ({ onViewChange, currentView }) => (
  <div data-testid="sidebar">
    <button onClick={() => onViewChange('bridge')} data-testid="bridge-button">Bridge</button>
    <button onClick={() => onViewChange('logs')} data-testid="logs-button">Logs</button>
    <button onClick={() => onViewChange('chat')} data-testid="chat-button">Chat</button>
  </div>
));
jest.mock('./components/MissionControl', () => () => <div data-testid="mission-control">Mission Control</div>);
jest.mock('./components/AgentLogs', () => () => <div data-testid="agent-logs">Agent Logs</div>);
jest.mock('./components/Chat', () => () => <div data-testid="chat">Chat</div>);

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div'
  },
  AnimatePresence: ({ children }) => children
}));

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders main components', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('mission-control')).toBeInTheDocument();
    });
  });

  it('changes view when clicking sidebar links', async () => {
    render(<App />);
    
    // Initially shows mission control
    await waitFor(() => {
      expect(screen.getByTestId('mission-control')).toBeInTheDocument();
    });
    
    // Change to logs view
    fireEvent.click(screen.getByTestId('logs-button'));
    await waitFor(() => {
      expect(screen.getByTestId('agent-logs')).toBeInTheDocument();
      expect(screen.queryByTestId('mission-control')).not.toBeInTheDocument();
    });
    
    // Change to chat view
    fireEvent.click(screen.getByTestId('chat-button'));
    await waitFor(() => {
      expect(screen.getByTestId('chat')).toBeInTheDocument();
      expect(screen.queryByTestId('agent-logs')).not.toBeInTheDocument();
    });
    
    // Change back to bridge view
    fireEvent.click(screen.getByTestId('bridge-button'));
    await waitFor(() => {
      expect(screen.getByTestId('mission-control')).toBeInTheDocument();
      expect(screen.queryByTestId('chat')).not.toBeInTheDocument();
    });
  });

  it('shows "under development" message for incomplete views', async () => {
    const { container } = render(<App />);
    
    // Trigger a view change to an incomplete feature
    fireEvent.click(screen.getByTestId('logs-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('agent-logs')).toBeInTheDocument();
    });
  });
});
