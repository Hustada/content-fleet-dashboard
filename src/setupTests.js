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

// Mock framer-motion to avoid animation-related issues
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    button: 'button'
  },
  AnimatePresence: ({ children }) => children
}));

// Clean up after each test
afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

// Suppress React 18 console errors about act()
const originalError = console.error;
console.error = (...args) => {
  if (/Warning.*not wrapped in act/.test(args[0])) {
    return;
  }
  originalError.call(console, ...args);
};

afterAll(() => {
  console.error = originalError;
});
