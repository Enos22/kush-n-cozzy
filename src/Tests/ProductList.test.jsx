import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ProductList from './ProductList';
import * as api from '../api/products';

const mockProducts = [
  { id: '1', name: 'Rolling Tray', category: 'Accessories', description: 'A sturdy metal tray' },
  { id: '2', name: 'Cozy Blanket', category: 'Home', description: 'Soft fleece blanket' },
];

function renderPage() {
  return render(
    <MemoryRouter>
      <ProductList />
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('ProductList', () => {
  it('renders products once the fetch resolves', async () => {
    vi.spyOn(api, 'getProducts').mockResolvedValue(mockProducts);
    renderPage();
    expect(await screen.findByText('Rolling Tray')).toBeInTheDocument();
  });

  it('filters products as the user types', async () => {
    vi.spyOn(api, 'getProducts').mockResolvedValue(mockProducts);
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Rolling Tray');
    await user.type(screen.getByLabelText(/search products/i), 'blanket');
    expect(screen.getByText('Cozy Blanket')).toBeInTheDocument();
    expect(screen.queryByText('Rolling Tray')).not.toBeInTheDocument();
  });
});