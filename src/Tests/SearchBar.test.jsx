import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ProductSearchApp from './SearchBar';

const mockData = {
  products: [
    { id: '1', name: 'Rolling Tray', category: 'Accessories', description: 'A sturdy metal tray', price: 500, image: 'tray.jpg' },
    { id: '2', name: 'Cozy Blanket', category: 'Home', description: 'Soft fleece blanket', price: 1200, image: 'blanket.jpg' },
  ],
};

function renderApp() {
  return render(
    <MemoryRouter>
      <ProductSearchApp />
    </MemoryRouter>
  );
}

beforeEach(() => {
  global.fetch = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ProductSearchApp (SearchBar)', () => {
  it('shows a loading state initially', () => {
    global.fetch.mockReturnValue(new Promise(() => {})); // never resolves
    renderApp();
    expect(screen.getByText(/loading product database/i)).toBeInTheDocument();
  });

  it('renders products once fetched', async () => {
    global.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) });
    renderApp();
    expect(await screen.findByText('Rolling Tray')).toBeInTheDocument();
    expect(screen.getByText('Cozy Blanket')).toBeInTheDocument();
  });

  it('shows an error message if the fetch fails', async () => {
    global.fetch.mockResolvedValue({ ok: false });
    renderApp();
    expect(await screen.findByText(/error loading products/i)).toBeInTheDocument();
  });

  it('filters products as the user types', async () => {
    global.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) });
    const user = userEvent.setup();
    renderApp();
    await screen.findByText('Rolling Tray');

    await user.type(screen.getByPlaceholderText(/search by name/i), 'blanket');

    expect(screen.getByText('Cozy Blanket')).toBeInTheDocument();
    expect(screen.queryByText('Rolling Tray')).not.toBeInTheDocument();
  });

  it('shows an empty state when nothing matches', async () => {
    global.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) });
    const user = userEvent.setup();
    renderApp();
    await screen.findByText('Rolling Tray');

    await user.type(screen.getByPlaceholderText(/search by name/i), 'zzz-nothing');

    expect(await screen.findByText(/no products match your search/i)).toBeInTheDocument();
  });
});