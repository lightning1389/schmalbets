import React from 'react';
import { render, screen } from '@testing-library/react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

// Mock requestAnimationFrame
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('AnimatedCounter', () => {
  it('renders with prefix', () => {
    render(<AnimatedCounter value={100} prefix="$" />);
    const element = screen.getByText(/\$/);
    expect(element).toBeInTheDocument();
  });

  it('renders with suffix', () => {
    render(<AnimatedCounter value={100} suffix="%" />);
    const element = screen.getByText(/%/);
    expect(element).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<AnimatedCounter value={100} className="test-class" />);
    const element = screen.getByText(/0/);
    expect(element).toHaveClass('test-class');
  });

  it('renders initial value of 0', () => {
    render(<AnimatedCounter value={100} />);
    expect(screen.getByText(/0/)).toBeInTheDocument();
  });
});
