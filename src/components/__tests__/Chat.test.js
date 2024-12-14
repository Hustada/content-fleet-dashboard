import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../test-utils';
import Chat from '../Chat';
import '@testing-library/jest-dom';

// Mock child components
jest.mock('../StatusIndicator', () => ({ status }) => <div data-testid="status-indicator">{status}</div>);

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
    svg: ({ children, ...props }) => <svg {...props}>{children}</svg>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>
  },
  AnimatePresence: ({ children }) => <>{children}</>,
  useAnimation: () => ({ start: jest.fn() }),
}));

// Mock the SoundEffects utility
jest.mock('../../utils/SoundEffects', () => ({
  send: jest.fn(),
  click: jest.fn(),
  receive: jest.fn(),
}));

// Mock mission context values
const mockMission = {
  id: 'test-mission-1',
  title: 'Test Mission',
  status: 'active',
  objective: 'Research and create content about AI trends',
  parameters: {
    topic: 'AI trends',
    wordCount: '1000',
    tone: 'Professional'
  },
  messages: [
    { id: 1, text: 'Starting content research for AI trends article.', sender: 'agent' },
    { id: 2, text: 'Research parameters set. Accessing databases...', sender: 'agent' },
    { id: 3, text: 'Analysis complete. Found 50 relevant articles. Proceeding with content synthesis.', sender: 'agent' }
  ]
};

jest.mock('../../contexts/MissionContext', () => ({
  ...jest.requireActual('../../contexts/MissionContext'),
  useMission: () => ({
    currentMission: mockMission,
    updateMission: jest.fn(),
    addMessage: jest.fn()
  })
}));

describe('Chat', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders chat interface', async () => {
    render(<Chat />);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Type your message or use commands/i)).toBeInTheDocument();
      expect(screen.getByTestId('send-button')).toBeInTheDocument();
    });
  });

  it('displays initial messages', async () => {
    render(<Chat />);
    
    await waitFor(() => {
      const input = screen.getByPlaceholderText(/Type your message or use commands/i);
      expect(input).toBeInTheDocument();
      expect(screen.getByText('Starting content research for AI trends article.')).toBeInTheDocument();
      expect(screen.getByText('Research parameters set. Accessing databases...')).toBeInTheDocument();
      expect(screen.getByText('Analysis complete. Found 50 relevant articles. Proceeding with content synthesis.')).toBeInTheDocument();
    });
  });

  it('allows typing messages', async () => {
    render(<Chat />);
    
    const input = await waitFor(() => screen.getByPlaceholderText(/Type your message or use commands/i));
    fireEvent.change(input, { target: { value: 'Hello agent!' } });
    
    expect(input.value).toBe('Hello agent!');
  });

  it('clears input after sending message', async () => {
    render(<Chat />);
    
    const input = await waitFor(() => screen.getByPlaceholderText(/Type your message or use commands/i));
    const sendButton = screen.getByTestId('send-button');
    
    fireEvent.change(input, { target: { value: 'Hello agent!' } });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  it('displays sent message in chat history', async () => {
    render(<Chat />);
    
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
    render(<Chat />);
    
    const commandsButton = screen.getByRole('button', { name: /commands/i });
    fireEvent.click(commandsButton);
    
    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: /research/i })).toBeInTheDocument();
    });
  });

  it('prevents sending empty messages', async () => {
    const { container } = render(<Chat />);
    
    const sendButton = screen.getByTestId('send-button');
    const messageInput = screen.getByPlaceholderText(/Type your message/i);
    
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(messageInput.value).toBe('');
      expect(screen.queryByText(/empty message/i)).toBeFalsy();
    });
  });
});
