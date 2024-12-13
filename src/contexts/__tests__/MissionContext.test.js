import React from 'react';
import { render, act } from '@testing-library/react';
import { MissionProvider, useMission } from '../MissionContext';
import '@testing-library/jest-dom';

// Test component that uses the mission context
const TestComponent = () => {
  const { 
    currentMission, 
    missionHistory,
    startMission, 
    updateMissionStatus, 
    clearMission 
  } = useMission();

  return (
    <div>
      <div data-testid="mission-status">{currentMission?.status || 'no-mission'}</div>
      <div data-testid="mission-title">{currentMission?.title || 'no-title'}</div>
      <div data-testid="mission-objective">{currentMission?.objective || 'no-objective'}</div>
      <div data-testid="mission-history-count">{missionHistory.length}</div>
      <button onClick={() => startMission({ 
        id: 'test-1',
        title: 'Test Mission',
        objective: 'Test Objective',
        parameters: {},
        status: 'active'
      })}>
        Start Mission
      </button>
      <button onClick={() => updateMissionStatus('completed')}>
        Complete Mission
      </button>
      <button onClick={clearMission}>
        Clear Mission
      </button>
    </div>
  );
};

describe('MissionContext', () => {
  it('provides initial mission state', () => {
    const { getByTestId } = render(
      <MissionProvider>
        <TestComponent />
      </MissionProvider>
    );

    expect(getByTestId('mission-status')).toHaveTextContent('idle');
    expect(getByTestId('mission-title')).toHaveTextContent('no-title');
    expect(getByTestId('mission-objective')).toHaveTextContent('no-objective');
    expect(getByTestId('mission-history-count')).toHaveTextContent('2');
  });

  it('can start a new mission', () => {
    const { getByTestId, getByText } = render(
      <MissionProvider>
        <TestComponent />
      </MissionProvider>
    );

    act(() => {
      getByText('Start Mission').click();
    });

    expect(getByTestId('mission-status')).toHaveTextContent('active');
    expect(getByTestId('mission-title')).toHaveTextContent('Test Mission');
    expect(getByTestId('mission-objective')).toHaveTextContent('Test Objective');
  });

  it('can update mission status', () => {
    const { getByTestId, getByText } = render(
      <MissionProvider>
        <TestComponent />
      </MissionProvider>
    );

    // Start mission
    act(() => {
      getByText('Start Mission').click();
    });

    // Complete mission
    act(() => {
      getByText('Complete Mission').click();
    });

    expect(getByTestId('mission-status')).toHaveTextContent('completed');
  });

  it('can clear mission', () => {
    const { getByTestId, getByText } = render(
      <MissionProvider>
        <TestComponent />
      </MissionProvider>
    );

    // Start mission
    act(() => {
      getByText('Start Mission').click();
    });

    // Clear mission
    act(() => {
      getByText('Clear Mission').click();
    });

    expect(getByTestId('mission-status')).toHaveTextContent('idle');
    expect(getByTestId('mission-title')).toHaveTextContent('no-title');
    expect(getByTestId('mission-objective')).toHaveTextContent('no-objective');
  });

  it('maintains mission history', () => {
    const { getByTestId } = render(
      <MissionProvider>
        <TestComponent />
      </MissionProvider>
    );

    // Should have 2 missions in history from initial state
    expect(getByTestId('mission-history-count')).toHaveTextContent('2');
  });
});
