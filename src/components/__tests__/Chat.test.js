import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Chat from '../Chat';
import { MissionProvider } from '../../contexts/MissionContext';
import '@testing-library/jest-dom';

// Mock child components
jest.mock('../StatusIndicator', () => ({ status }) => <div data-testid="status-indicator">{status}</div>);

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
    svg: ({ children, ...props }) => <svg {...props}>{children}</svg>,
    button: ({ children, ...props }) => {
      const { whileHover, whileTap, ...rest } = props;
      return <button {...rest}>{children}</button>;
    }
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock the SoundEffects utility
jest.mock('../../utils/SoundEffects', () => ({
  send: jest.fn(),
  click: jest.fn(),
  receive: jest.fn(),
}));

describe('Chat', () => {
  const renderWithMissionContext = (component) => {
    return render(
      <MissionProvider>
        {component}
      </MissionProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders chat interface', async () => {
    renderWithMissionContext(<Chat />);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Type your message or use commands/i)).toBeInTheDocument();
      expect(screen.getByTestId('send-button')).toBeInTheDocument();
    });
  });

  it('displays initial messages', async () => {
    renderWithMissionContext(<Chat />);
    
    await waitFor(() => {
      const input = screen.getByPlaceholderText(/Type your message or use commands/i);
      expect(input).toBeInTheDocument();
      expect(screen.getByText('Starting content research for AI trends article.')).toBeInTheDocument();
      expect(screen.getByText('Research parameters set. Accessing databases...')).toBeInTheDocument();
      expect(screen.getByText('Analysis complete. Found 50 relevant articles. Proceeding with content synthesis.')).toBeInTheDocument();
    });
  });

  it('allows typing messages', async () => {
    renderWithMissionContext(<Chat />);
    
    const input = await waitFor(() => screen.getByPlaceholderText(/Type your message or use commands/i));
    fireEvent.change(input, { target: { value: 'Hello agent!' } });
    
    expect(input.value).toBe('Hello agent!');
  });

  it('clears input after sending message', async () => {
    renderWithMissionContext(<Chat />);
    
    const input = await waitFor(() => screen.getByPlaceholderText(/Type your message or use commands/i));
    const sendButton = screen.getByTestId('send-button');
    
    fireEvent.change(input, { target: { value: 'Hello agent!' } });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  it('displays sent message in chat history', async () => {
    renderWithMissionContext(<Chat />);
    
    const input = await waitFor(() => screen.getByPlaceholderText(/Type your message or use commands/i));
    const sendButton = screen.getByTestId('send-button');
    
    fireEvent.change(input, { target: { value: 'Hello agent!' } });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      const messages = screen.getAllByText('Hello agent!');
      expect(messages.length).toBeGreaterThan(0);
    });
  });

  it('shows command templates menu', async () => {
    renderWithMissionContext(<Chat />);
    
    const commandsButton = await waitFor(() => screen.getByTestId('commands-button'));
    fireEvent.click(commandsButton);
    
    await waitFor(() => {
      expect(screen.getByText('Start Research')).toBeInTheDocument();
      expect(screen.getByText('Generate Content')).toBeInTheDocument();
      expect(screen.getByText('Optimize Content')).toBeInTheDocument();
      expect(screen.getByText('Review Content')).toBeInTheDocument();
    });
  });

  it('prevents sending empty messages', async () => {
    renderWithMissionContext(<Chat />);
    
    const sendButton = await waitFor(() => screen.getByTestId('send-button'));
    const initialMessages = await screen.findAllByRole('listitem');
    const initialCount = initialMessages.length;
    
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      const currentMessages = screen.getAllByRole('listitem');
      expect(currentMessages).toHaveLength(initialCount);
    });
  });
});
