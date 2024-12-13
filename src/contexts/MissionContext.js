import { createContext, useContext, useState } from 'react';

const MissionContext = createContext();

export function MissionProvider({ children }) {
  const [currentMission, setCurrentMission] = useState({
    id: null,
    title: '',
    objective: '',
    parameters: {},
    status: 'idle'
  });

  const [missionHistory] = useState([
    {
      id: 'M001',
      title: 'AI Trends Analysis',
      objective: 'Research and compile latest AI industry trends',
      parameters: {
        targetLength: '1500 words',
        tone: 'Technical but accessible',
        audience: 'Tech professionals',
        keyTopics: ['Machine Learning', 'Neural Networks', 'AI Ethics'],
        deadline: '2024-12-14'
      },
      status: 'in-progress'
    },
    {
      id: 'M002',
      title: 'Cloud Computing Overview',
      objective: 'Create comprehensive guide to cloud services',
      parameters: {
        targetLength: '2000 words',
        tone: 'Educational',
        audience: 'IT Managers',
        keyTopics: ['IaaS', 'PaaS', 'SaaS', 'Security'],
        deadline: '2024-12-15'
      },
      status: 'pending'
    }
  ]);

  const startMission = (mission) => {
    setCurrentMission({
      ...mission,
      status: 'active'
    });
  };

  const updateMissionStatus = (status) => {
    setCurrentMission(prev => ({
      ...prev,
      status
    }));
  };

  const clearMission = () => {
    setCurrentMission({
      id: null,
      title: '',
      objective: '',
      parameters: {},
      status: 'idle'
    });
  };

  return (
    <MissionContext.Provider 
      value={{
        currentMission,
        missionHistory,
        startMission,
        updateMissionStatus,
        clearMission
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
