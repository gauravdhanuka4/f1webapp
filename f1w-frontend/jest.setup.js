require('@testing-library/jest-dom');

// Mock ResizeObserver
window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

// Mock Recharts ResponsiveContainer
jest.mock('recharts', () => {
    const OriginalModule = jest.requireActual('recharts');
    const React = require('react');
    return {
        ...OriginalModule,
        ResponsiveContainer: ({ children }) => {
            const child = React.Children.only(children);
            return React.cloneElement(child, { width: 800, height: 800 });
        },
    };
});
