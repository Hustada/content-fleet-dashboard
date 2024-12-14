/**
 * MissionContext.js - Mission Management Context
 * 
 * This context provides global state management for missions, including:
 * 1. Mission data structure and state
 * 2. CRUD operations for missions
 * 3. Mission status tracking
 * 4. Mission assignment and timeline management
 */

import { createContext, useContext, useState } from 'react';

const MissionContext = createContext();

/**
 * Mission Provider Component
 * Manages the global state for all missions and provides methods to manipulate them
 */
export function MissionProvider({ children }) {
  // Mission state with initial demo data
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

  // Current mission state
  const [currentMission, setCurrentMission] = useState(null);

  /**
   * Create a new mission
   * @param {Object} missionData - Initial mission data
   * @returns {Object} The newly created mission
   */
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

  /**
   * Update an existing mission
   * @param {string} missionId - ID of the mission to update
   * @param {Object} updates - New mission data
   */
  const updateMission = (missionId, updates) => {
    setMissions(prev => prev.map(mission => 
      mission.id === missionId ? { ...mission, ...updates } : mission
    ));
  };

  /**
   * Delete a mission
   * @param {string} missionId - ID of the mission to delete
   */
  const deleteMission = (missionId) => {
    setMissions(prev => prev.filter(mission => mission.id !== missionId));
  };

  /**
   * Get a mission by ID
   * @param {string} missionId - ID of the mission to retrieve
   * @returns {Object|undefined} The mission object if found
   */
  const getMission = (missionId) => {
    return missions.find(mission => mission.id === missionId);
  };

  /**
   * Set the current active mission
   * @param {string} missionId - ID of the mission to set as current
   */
  const setActiveMission = (missionId) => {
    const mission = missions.find(m => m.id === missionId);
    setCurrentMission(mission || null);
  };

  // Provide mission state and methods to children
  return (
    <MissionContext.Provider 
      value={{
        missions,
        currentMission,
        createMission,
        updateMission,
        deleteMission,
        getMission,
        setActiveMission
      }}
    >
      {children}
    </MissionContext.Provider>
  );
}

/**
 * Custom hook to use the mission context
 * @throws {Error} If used outside of MissionProvider
 * @returns {Object} Mission context value
 */
export function useMission() {
  const context = useContext(MissionContext);
  if (!context) {
    throw new Error('useMission must be used within a MissionProvider');
  }
  return context;
}

export { MissionContext };
