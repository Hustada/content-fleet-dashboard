import React from 'react';
import { render, act } from '@testing-library/react';
import { MissionProvider, useMission } from '../MissionContext';
import '@testing-library/jest-dom';

// Test component that uses the mission context
const TestComponent = () => {
  const { 
    missions,
    createMission,
    updateMission,
    deleteMission,
    getMission
  } = useMission();

  return (
    <div>
      <div data-testid="missions-count">{missions.length}</div>
      <div data-testid="first-mission-status">
        {missions[0]?.status || 'no-mission'}
      </div>
      <div data-testid="first-mission-title">
        {missions[0]?.title || 'no-title'}
      </div>
      <button onClick={() => createMission({ 
        title: 'Test Mission',
        priority: 'high',
        status: 'pending'
      })}>
        Create Mission
      </button>
      <button onClick={() => updateMission(missions[0]?.id, { status: 'completed' })}>
        Complete Mission
      </button>
      <button onClick={() => deleteMission(missions[0]?.id)}>
        Delete Mission
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

    expect(getByTestId('missions-count')).toHaveTextContent('1');
    expect(getByTestId('first-mission-status')).toHaveTextContent('in-progress');
    expect(getByTestId('first-mission-title')).toHaveTextContent('Content Optimization Alpha');
  });

  it('can create a new mission', () => {
    const { getByTestId, getByText } = render(
      <MissionProvider>
        <TestComponent />
      </MissionProvider>
    );

    act(() => {
      getByText('Create Mission').click();
    });

    expect(getByTestId('missions-count')).toHaveTextContent('2');
  });

  it('can update mission status', () => {
    const { getByTestId, getByText } = render(
      <MissionProvider>
        <TestComponent />
      </MissionProvider>
    );

    act(() => {
      getByText('Complete Mission').click();
    });

    expect(getByTestId('first-mission-status')).toHaveTextContent('completed');
  });

  it('can delete mission', () => {
    const { getByTestId, getByText } = render(
      <MissionProvider>
        <TestComponent />
      </MissionProvider>
    );

    const initialCount = parseInt(getByTestId('missions-count').textContent);

    act(() => {
      getByText('Delete Mission').click();
    });

    expect(getByTestId('missions-count')).toHaveTextContent((initialCount - 1).toString());
  });
});
