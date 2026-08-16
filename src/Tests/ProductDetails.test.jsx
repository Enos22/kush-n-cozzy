import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProductDetails from './ProductDetails';

const mockData = {
  products: [
    { id: '1', name: 'Rolling Tray', category: 'Accessories', description: 'A sturdy metal tray', price: 500, image: 'tray.jpg' },
  ],
};

function renderWithRoute(id) {
  return render(
    <MemoryRouter initialEntries={[`/product/${id}`]}>
      <Routes>
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  global.fetch = vi.fn();
  window.alert = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ProductDetails', () => {
  it('shows a loading state initially', () => {
    global.fetch.mockReturnValue(new Promise(() => {}));
    renderWithRoute('1');
    expect(screen.getByText(/loading product details/i)).toBeInTheDocument();
  });

  it('renders product details once found', async () => {
    global.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) });
    renderWithRoute('1');
    expect(await screen.findByText('Rolling Tray')).toBeInTheDocument();
    expect(screen.getByText(/KES 500/)).toBeInTheDocument();
  });

  it('shows an error when the product is not found', async () => {
    global.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) });
    renderWithRoute('999');
    expect(await screen.findByText(/product not found/i)).toBeInTheDocument();
  });

  it('increments and decrements quantity, never going below 1', async () => {
    global.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) });
    const user = userEvent.setup();
    renderWithRoute('1');
    await screen.findByText('Rolling Tray');

    const [decrementBtn, incrementBtn] = screen.getAllByRole('button', { name: /[-+]/ });

    await user.click(incrementBtn);
    expect(screen.getByText('2')).toBeInTheDocument();

    await user.click(decrementBtn);
    await user.click(decrementBtn); // try to go below 1
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('shows an alert with the correct total when adding to cart', async () => {
    global.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) });
    const user = userEvent.setup();
    renderWithRoute('1');
    await screen.findByText('Rolling Tray');

    await user.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Total: KES 500'));
  });
});