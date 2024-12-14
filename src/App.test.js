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
jest.mock('./components/MainPanel', () => () => <div data-testid="main-panel">Main Panel</div>);

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, style, ...props }) => <div style={style}>{children}</div>
  },
  AnimatePresence: ({ children }) => children
}));

// Mock recharts to prevent ResponsiveContainer warnings
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div style={{ width: '100%', height: '100%' }}>{children}</div>,
  LineChart: () => <div data-testid="line-chart">LineChart</div>,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  AreaChart: () => <div data-testid="area-chart">AreaChart</div>,
  Area: () => null
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
      expect(screen.getByTestId('main-panel')).toBeInTheDocument();
    });
  });

  it('changes view when clicking sidebar links', async () => {
    render(<App />);
    
    // Initially shows bridge view
    await waitFor(() => {
      expect(screen.getByTestId('main-panel')).toBeInTheDocument();
    });
    
    // Change to logs view
    fireEvent.click(screen.getByTestId('logs-button'));
    await waitFor(() => {
      expect(screen.getByTestId('agent-logs')).toBeInTheDocument();
    });
    
    // Change to chat view
    fireEvent.click(screen.getByTestId('chat-button'));
    await waitFor(() => {
      expect(screen.getByTestId('chat')).toBeInTheDocument();
    });
  });
});
