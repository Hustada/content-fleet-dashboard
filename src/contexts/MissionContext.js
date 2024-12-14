import { createContext, useContext, useState } from 'react';

const MissionContext = createContext();

export function MissionProvider({ children }) {
  const [missions, setMissions] = useState([
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
  ]);

  const createMission = (missionData) => {
    const newMission = {
      id: `m${missions.length + 1}`,
      status: 'pending',
      progress: 0,
      agents: [],
      tasks: [],
      timeline: {
        start: new Date().toISOString(),
        estimated_completion: null
      },
      ...missionData
    };
    setMissions(prev => [...prev, newMission]);
    return newMission;
  };

  const updateMission = (missionId, updates) => {
    setMissions(prev => prev.map(mission => 
      mission.id === missionId ? { ...mission, ...updates } : mission
    ));
  };

  const deleteMission = (missionId) => {
    setMissions(prev => prev.filter(mission => mission.id !== missionId));
  };

  const getMission = (missionId) => {
    return missions.find(mission => mission.id === missionId);
  };

  return (
    <MissionContext.Provider 
      value={{
        missions,
        createMission,
        updateMission,
        deleteMission,
        getMission
      }}
    >
      {children}
    </MissionContext.Provider>
  );
}

export function useMission() {
  const context = useContext(MissionContext);
  if (!context) {
    throw new Error('useMission must be used within a MissionProvider');
  }
  return context;
}

export { MissionContext };
