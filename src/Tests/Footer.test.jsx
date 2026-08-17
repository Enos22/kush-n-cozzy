import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from './Footer';

function renderFooter() {
  return render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>
  );
}

describe('Footer', () => {
  it('renders the brand name and tagline', () => {
    renderFooter();
    expect(screen.getByText(/Kush-n-/i)).toBeInTheDocument();
    expect(screen.getByText(/your cozy corner store/i)).toBeInTheDocument();
  });

  it('renders shop category links', () => {
    renderFooter();
    expect(screen.getByRole('link', { name: 'Electronics' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Clothes' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Furniture' })).toBeInTheDocument();
  });

  it('renders the Add Product link pointing to /new-product', () => {
    renderFooter();
    expect(screen.getByRole('link', { name: 'Add Product' })).toHaveAttribute('href', '/new-product');
  });

  it('renders the copyright line with the current year', () => {
    renderFooter();
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });
});