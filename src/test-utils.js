import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { MissionProvider } from './contexts/MissionContext';
import theme from './theme';

// Mock canvas for tests
class MockCanvas {
  getContext() {
    return {
      clearRect: () => {},
      beginPath: () => {},
      arc: () => {},
      fill: () => {},
      stroke: () => {},
    };
  }
}

// Mock HTMLCanvasElement
global.HTMLCanvasElement.prototype.getContext = function() {
  return new MockCanvas().getContext();
};

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    span: 'span',
  },
  AnimatePresence: ({ children }) => children,
}));

const AllTheProviders = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <MissionProvider>
        {children}
      </MissionProvider>
    </ThemeProvider>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
