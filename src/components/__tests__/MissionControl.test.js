import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MissionContext } from '../../contexts/MissionContext';
import MissionControl from '../MissionControl';

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

  test('updates mission status', () => {
    renderWithContext(<MissionControl />);
    const statusSelect = screen.getByTestId('mission-status-select-m1');
    
    fireEvent.change(statusSelect, {
      target: { value: 'completed' }
    });
    
    expect(mockContextValue.updateMission).toHaveBeenCalledWith(
      'm1',
      expect.objectContaining({
        status: 'completed'
      })
    );
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
