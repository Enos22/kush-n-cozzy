import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewProduct from './NewProduct';

const existingProducts = [
  { id: '1', name: 'Rolling Tray', price: 500, description: 'A tray', image: 'tray.jpg' },
];

beforeEach(() => {
  global.fetch = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('NewProduct', () => {
  it('loads and displays existing products on mount', async () => {
    global.fetch.mockResolvedValueOnce({ json: () => Promise.resolve(existingProducts) });
    render(<NewProduct />);
    expect(await screen.findByText('Rolling Tray')).toBeInTheDocument();
  });

  it('submits the form and adds the new product to the list', async () => {
    const user = userEvent.setup();
    global.fetch
      .mockResolvedValueOnce({ json: () => Promise.resolve([]) }) // initial GET
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ id: '2', name: 'Cozy Blanket', price: 1200, description: 'Soft', image: 'b.jpg' }),
      }); // POST response

    render(<NewProduct />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    await user.type(screen.getByLabelText(/product name/i), 'Cozy Blanket');
    await user.type(screen.getByLabelText(/price/i), '1200');
    await user.type(screen.getByLabelText(/description/i), 'Soft');
    await user.click(screen.getByRole('button', { name: /add product/i }));

    expect(await screen.findByText('Cozy Blanket')).toBeInTheDocument();
    expect(global.fetch).toHaveBeenLastCalledWith(
      'http://localhost:3001/products',
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('deletes a product when Delete is clicked', async () => {
    const user = userEvent.setup();
    global.fetch
      .mockResolvedValueOnce({ json: () => Promise.resolve(existingProducts) }) // initial GET
      .mockResolvedValueOnce({}); // DELETE response

    render(<NewProduct />);
    await screen.findByText('Rolling Tray');

    await user.click(screen.getByRole('button', { name: /delete/i }));

    await waitFor(() => expect(screen.queryByText('Rolling Tray')).not.toBeInTheDocument());
    expect(global.fetch).toHaveBeenLastCalledWith('http://localhost:3001/products/1', { method: 'DELETE' });
  });
});