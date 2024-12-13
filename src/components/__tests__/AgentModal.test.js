import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AgentModal from '../AgentModal';
import '@testing-library/jest-dom';

// Mock the child components
jest.mock('../StatusIndicator', () => ({ status }) => <div data-testid="status-indicator">{status}</div>);
jest.mock('../SystemMetrics', () => ({ title }) => <div data-testid="system-metrics">{title}</div>);
jest.mock('../AgentRadarChart', () => ({ status }) => <div data-testid="agent-radar">{status}</div>);
jest.mock('../ActivityStream', () => ({ status }) => <div data-testid="activity-stream">{status}</div>);

// Mock the SoundEffects utility
jest.mock('../../utils/SoundEffects', () => ({
  click: jest.fn(),
}));

describe('AgentModal', () => {
  const mockAgent = {
    name: 'Test Agent',
    role: 'Test Role',
    status: 'online',
    metrics: {
      accuracy: '95%',
      speed: '87%',
      efficiency: '92%'
    }
  };

  const defaultProps = {
    agent: mockAgent,
    status: 'online',
    onClose: jest.fn(),
    open: true
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when closed', () => {
    const { container } = render(<AgentModal {...defaultProps} open={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders agent information when open', () => {
    render(<AgentModal {...defaultProps} />);
    
    expect(screen.getByText('Test Agent')).toBeInTheDocument();
    expect(screen.getByText('Active and operational')).toBeInTheDocument();
  });

  it('displays metrics sections correctly', () => {
    render(<AgentModal {...defaultProps} />);
    
    expect(screen.getByText('Neural Processing')).toBeInTheDocument();
    expect(screen.getByText('Response Time')).toBeInTheDocument();
    expect(screen.getByText('Efficiency Rating')).toBeInTheDocument();
    expect(screen.getByText('Resource Usage')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<AgentModal {...defaultProps} />);
    
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking overlay', () => {
    render(<AgentModal {...defaultProps} />);
    
    // Click the overlay (the outer motion.div)
    const overlay = screen.getByTestId('modal-overlay');
    fireEvent.click(overlay);
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('handles missing agent data gracefully', () => {
    render(<AgentModal {...defaultProps} agent={null} />);
    
    expect(screen.getByText('Unknown Agent')).toBeInTheDocument();
    expect(screen.getByText('Latest activities will be displayed here...')).toBeInTheDocument();
  });
});
