import React from 'react';
import { render, screen } from '@testing-library/react';
import { Footer } from '@/components/layout/Footer';

describe('Footer', () => {
  it('renders the brand name', () => {
    render(<Footer />);
    expect(screen.getByText('SCHMALSTREETBETS')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Footer />);
    expect(screen.getByText('SchmalStreets List')).toBeInTheDocument();
    expect(screen.getByText('Market Intel')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('renders system status indicators', () => {
    render(<Footer />);
    expect(screen.getByText('API')).toBeInTheDocument();
    expect(screen.getByText('Data Feed')).toBeInTheDocument();
    expect(screen.getByText('Trade Engine')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });

  it('renders copyright with current year', () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });

  it('renders the tagline', () => {
    render(<Footer />);
    expect(screen.getByText('"THE MARKET REMEMBERS"')).toBeInTheDocument();
  });

  it('renders disclaimer', () => {
    render(<Footer />);
    expect(screen.getByText(/NOT FINANCIAL ADVICE/)).toBeInTheDocument();
  });
});
