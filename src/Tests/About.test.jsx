import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import About from './About';

describe('About', () => {
  it('renders the main heading', () => {
    render(<About />);
    expect(screen.getByRole('heading', { level: 1, name: /bringing quality to your doorstep/i })).toBeInTheDocument();
  });

  it('renders the story paragraphs', () => {
    render(<About />);
    expect(screen.getByText(/curate the finest collection/i)).toBeInTheDocument();
    expect(screen.getByText(/trusted suppliers worldwide/i)).toBeInTheDocument();
  });

  it('renders the stat highlights', () => {
    render(<About />);
    expect(screen.getByText('10k+')).toBeInTheDocument();
    expect(screen.getByText('Happy Customers')).toBeInTheDocument();
    expect(screen.getByText('24/7')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('renders the workspace image with alt text', () => {
    render(<About />);
    expect(screen.getByAltText('Our Team Workspace')).toBeInTheDocument();
  });
});