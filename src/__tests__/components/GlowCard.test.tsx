import React from 'react';
import { render, screen } from '@testing-library/react';
import { GlowCard } from '@/components/ui/GlowCard';

describe('GlowCard', () => {
  it('renders children', () => {
    render(<GlowCard>Test content</GlowCard>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<GlowCard className="custom-class">Content</GlowCard>);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders with default glass-card styling', () => {
    const { container } = render(<GlowCard>Content</GlowCard>);
    expect(container.firstChild).toHaveClass('glass-card');
  });

  it('renders with different glow colors', () => {
    const { rerender, container } = render(
      <GlowCard glowColor="accent">Content</GlowCard>
    );
    expect(container.firstChild).toBeInTheDocument();

    rerender(<GlowCard glowColor="profit">Content</GlowCard>);
    expect(container.firstChild).toBeInTheDocument();

    rerender(<GlowCard glowColor="loss">Content</GlowCard>);
    expect(container.firstChild).toBeInTheDocument();

    rerender(<GlowCard glowColor="warning">Content</GlowCard>);
    expect(container.firstChild).toBeInTheDocument();
  });
});
