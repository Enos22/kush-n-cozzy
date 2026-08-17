import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OrderConfirmation from './OrderConfirmation';

function renderPage() {
  return render(
    <MemoryRouter>
      <OrderConfirmation />
    </MemoryRouter>
  );
}

describe('OrderConfirmation', () => {
  it('renders the confirmation heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: /order placed/i })).toBeInTheDocument();
  });

  it('renders a link back to home', () => {
    renderPage();
    expect(screen.getByRole('link', { name: /back to home/i })).toHaveAttribute('href', '/');
  });
});