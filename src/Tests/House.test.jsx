import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import House from './House';

function renderHouse(initialPath = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route element={<House />}>
          <Route path="/" element={<div>Landing content</div>} />
          <Route path="/products" element={<div>Products content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('House', () => {
  it('renders the store name in the header', () => {
    renderHouse();
    expect(screen.getByText('Kush-n-')).toBeInTheDocument();
    expect(screen.getByText('Cozzy')).toBeInTheDocument();
  });

  it('renders the top nav links', () => {
    renderHouse();
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contact' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument();
  });

  it('renders the sidebar links', () => {
    renderHouse();
    expect(screen.getByRole('link', { name: 'Products' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Add Product' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Orders' })).toBeInTheDocument();
  });

  it('renders the matched child route inside the outlet', () => {
    renderHouse('/products');
    expect(screen.getByText('Products content')).toBeInTheDocument();
  });

  it('renders the footer copyright with the current year and team credit', () => {
    renderHouse();
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(`${year}.*Team 9`))).toBeInTheDocument();
  });
});