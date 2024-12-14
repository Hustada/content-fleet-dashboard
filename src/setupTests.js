// jest-dom adds custom jest matchers for asserting on DOM nodes.
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;

// Mock SoundEffects
jest.mock('./utils/SoundEffects', () => ({
  click: jest.fn(),
  hover: jest.fn(),
  scan: jest.fn(),
  alert: jest.fn(),
  success: jest.fn(),
  error: jest.fn(),
  send: jest.fn(),
  receive: jest.fn(),
  play: jest.fn(),
  toggle: jest.fn(),
}));

// Mock Howler
jest.mock('howler', () => ({
  Howl: jest.fn().mockImplementation(() => ({
    play: jest.fn(),
    stop: jest.fn(),
  })),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    span: 'span'
  },
  AnimatePresence: ({ children }) => children
}));

// Mock ParticleBackground component
jest.mock('./components/ParticleBackground', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="particle-background">Particle Background</div>
  };
});

// Suppress specific console errors
const originalError = console.error;
console.error = (...args) => {
  if (
    args[0].includes('Warning: Unknown event handler property') ||
    args[0].includes('Warning: React does not recognize the') ||
    args[0].includes('whileHover') ||
    args[0].includes('whileTap')
  ) {
    return;
  }
  originalError.call(console, ...args);
};

afterAll(() => {
  console.error = originalError;
});

// Mock window.matchMedia
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};

// Clean up after each test
afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});
