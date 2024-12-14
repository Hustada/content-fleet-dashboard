import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MissionContext } from '../../contexts/MissionContext';
import MissionControl from '../MissionControl';

// Mock child components
jest.mock('../StatusIndicator', () => ({ status }) => <div data-testid="status-indicator">{status}</div>);
jest.mock('../ParticleBackground', () => () => <div data-testid="particle-background">Particle Background</div>);

const mockMissions = [
  {
    id: 'm1',
    title: 'Content Optimization Alpha',
    status: 'in-progress',
    priority: 'high',
    progress: 65,
    agents: ['agent-1', 'agent-2'],
    timeline: {
      start: '2024-01-01T00:00:00Z',
      estimated_completion: '2024-01-15T00:00:00Z'
    },
    tasks: [
      { id: 't1', title: 'Analyze Content', status: 'completed' },
      { id: 't2', title: 'Generate Recommendations', status: 'in-progress' },
      { id: 't3', title: 'Implement Changes', status: 'pending' }
    ]
  }
];

const mockContextValue = {
  missions: mockMissions,
  createMission: jest.fn(),
  updateMission: jest.fn(),
  deleteMission: jest.fn()
};

describe('MissionControl Component', () => {
  const renderWithContext = (ui) => {
    return render(
      <MissionContext.Provider value={mockContextValue}>
        {ui}
      </MissionContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders mission timeline', () => {
    renderWithContext(<MissionControl />);
    expect(screen.getByTestId('mission-timeline')).toBeInTheDocument();
  });

  test('displays mission cards with correct information', () => {
    renderWithContext(<MissionControl />);
    const missionCard = screen.getByTestId('mission-card-m1');
    
    expect(within(missionCard).getByText('Content Optimization Alpha')).toBeInTheDocument();
    expect(within(missionCard).getByText('65%')).toBeInTheDocument();
    expect(within(missionCard).getByTestId('priority-indicator-high')).toBeInTheDocument();
  });

  test('allows creating new mission', () => {
    renderWithContext(<MissionControl />);
    const newMissionBtn = screen.getByText('New Mission');
    
    fireEvent.click(newMissionBtn);
    const missionDialog = screen.getByTestId('new-mission-dialog');
    
    expect(missionDialog).toBeInTheDocument();
    
    // Fill out new mission form
    fireEvent.change(screen.getByLabelText('Mission Title'), {
      target: { value: 'New Test Mission' }
    });
    
    fireEvent.click(screen.getByText('Create Mission'));
    
    expect(mockContextValue.createMission).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'New Test Mission'
      })
    );
  });

  test('shows mission details when mission card is clicked', () => {
    renderWithContext(<MissionControl />);
    const missionCard = screen.getByTestId('mission-card-m1');
    
    fireEvent.click(missionCard);
    
    const detailsPanel = screen.getByTestId('mission-details-panel');
    expect(detailsPanel).toBeInTheDocument();
    expect(within(detailsPanel).getByText('Content Optimization Alpha')).toBeInTheDocument();
    expect(within(detailsPanel).getByText('Analyze Content')).toBeInTheDocument();
  });

  test('updates mission status', async () => {
    const mockUpdateMission = jest.fn();
    const mockMission = {
      id: 'm1',
      title: 'Test Mission',
      priority: 'high',
      status: 'pending',
      progress: 75,
      agents: ['agent1', 'agent2']
    };

    render(
      <MissionContext.Provider value={{ missions: [mockMission], updateMission: mockUpdateMission }}>
        <MissionControl />
      </MissionContext.Provider>
    );

    // Open the select dropdown
    const select = screen.getByTestId('mission-status-select-m1');
    const selectButton = within(select).getByRole('combobox');
    fireEvent.mouseDown(selectButton);

    // The options should now be visible in a portal
    const options = await screen.findAllByRole('option');
    const completedOption = options.find(option => option.textContent === 'Completed');
    fireEvent.click(completedOption);

    // Verify the update was called
    expect(mockUpdateMission).toHaveBeenCalledWith('m1', { status: 'completed' });
  });

  test('displays mission progress visualization', () => {
    renderWithContext(<MissionControl />);
    const progressBar = screen.getByTestId('mission-progress-m1');
    
    expect(progressBar).toHaveAttribute('aria-valuenow', '65');
    expect(within(progressBar).getByText('65%')).toBeInTheDocument();
  });

  test('shows assigned agents', () => {
    renderWithContext(<MissionControl />);
    const agentsList = screen.getByTestId('mission-agents-m1');
    
    expect(within(agentsList).getAllByTestId('agent-avatar')).toHaveLength(2);
  });
});
