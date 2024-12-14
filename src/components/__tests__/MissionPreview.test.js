/**
 * MissionPreview.test.js - Tests for MissionPreview Component
 */

import React from 'react';
import { render, screen, fireEvent } from '../../test-utils';
import MissionPreview from '../MissionPreview';

// Mock mission data for testing
const mockMission = {
  id: 'test-mission-1',
  title: 'Test Mission Alpha',
  priority: 'high',
  progress: 75,
  agents: ['agent-1', 'agent-2'],
  timeline: {
    start: '2024-01-01T00:00:00Z',
    estimated_completion: '2024-02-01T00:00:00Z'
  },
  status: 'in-progress'
};

describe('MissionPreview Component', () => {
  const mockViewDetails = jest.fn();
  const mockUpdateStatus = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders mission title and priority', () => {
    render(
      <MissionPreview 
        mission={mockMission}
        onViewDetails={mockViewDetails}
        onUpdateStatus={mockUpdateStatus}
      />
    );

    expect(screen.getByText('Test Mission Alpha')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('displays correct progress percentage', () => {
    render(
      <MissionPreview 
        mission={mockMission}
        onViewDetails={mockViewDetails}
        onUpdateStatus={mockUpdateStatus}
      />
    );

    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('shows correct number of assigned agents', () => {
    render(
      <MissionPreview 
        mission={mockMission}
        onViewDetails={mockViewDetails}
        onUpdateStatus={mockUpdateStatus}
      />
    );

    expect(screen.getByText('2 agents')).toBeInTheDocument();
  });

  it('handles missing timeline gracefully', () => {
    const missionWithoutTimeline = { ...mockMission, timeline: {} };
    render(
      <MissionPreview 
        mission={missionWithoutTimeline}
        onViewDetails={mockViewDetails}
        onUpdateStatus={mockUpdateStatus}
      />
    );

    expect(screen.getByText('No deadline set')).toBeInTheDocument();
  });

  it('calls onViewDetails when view button is clicked', () => {
    render(
      <MissionPreview 
        mission={mockMission}
        onViewDetails={mockViewDetails}
        onUpdateStatus={mockUpdateStatus}
      />
    );

    fireEvent.click(screen.getByTestId('view-details-button'));
    expect(mockViewDetails).toHaveBeenCalledTimes(1);
  });

  it('calls onUpdateStatus when edit button is clicked', () => {
    render(
      <MissionPreview 
        mission={mockMission}
        onViewDetails={mockViewDetails}
        onUpdateStatus={mockUpdateStatus}
      />
    );

    fireEvent.click(screen.getByTestId('update-status-button'));
    expect(mockUpdateStatus).toHaveBeenCalledTimes(1);
  });

  it('handles singular/plural agents text correctly', () => {
    const singleAgentMission = { ...mockMission, agents: ['agent-1'] };
    render(
      <MissionPreview 
        mission={singleAgentMission}
        onViewDetails={mockViewDetails}
        onUpdateStatus={mockUpdateStatus}
      />
    );

    expect(screen.getByText('1 agent')).toBeInTheDocument();
  });

  it('applies correct color for different priority levels', () => {
    const priorities = ['high', 'medium', 'low'];
    const expectedColors = ['error', 'warning', 'success'];

    priorities.forEach((priority, index) => {
      const mission = {
        ...mockMission,
        priority: priority
      };

      render(<MissionPreview mission={mission} />);

      const chipElement = screen.getByText(priority);
      expect(chipElement.closest('.MuiChip-root')).toHaveClass(`MuiChip-color${expectedColors[index].charAt(0).toUpperCase() + expectedColors[index].slice(1)} MuiChip-filled${expectedColors[index].charAt(0).toUpperCase() + expectedColors[index].slice(1)}`);
    });
  });
});
