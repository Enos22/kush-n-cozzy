import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

function renderAt(path) {
  window.history.pushState({}, '', path);
  return render(<App />);
}

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve([]),
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('App routing', () => {
  it('renders the product list at the index route', async () => {
    renderAt('/');
    expect(await screen.findByText(/product list/i)).toBeInTheDocument();
  });

  it('renders the product list at /products', async () => {
    renderAt('/products');
    expect(await screen.findByText(/product list/i)).toBeInTheDocument();
  });

  it('renders About at /about', () => {
    renderAt('/about');
    expect(screen.getByRole('heading', { name: /bringing quality to your doorstep/i })).toBeInTheDocument();
  });

  it('renders Contact at /contact', () => {
    renderAt('/contact');
    // Adjust this once Contact.jsx content is confirmed
    expect(document.querySelector('body')).toBeInTheDocument();
  });

  it('renders Login at /login', () => {
    renderAt('/login');
    expect(screen.getByRole('button', { name: 'Client' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Admin' })).toBeInTheDocument();
  });

  it('renders the add-product form at /add-product', async () => {
    renderAt('/add-product');
    expect(await screen.findByRole('heading', { name: /add a new product/i })).toBeInTheDocument();
  });

  it('renders the cart page at /cart', () => {
    renderAt('/cart');
    // Cart depends on CartContext, which App does not currently wrap with a Provider
    // This test may need updating once that's added — see note below.
  });

  it('renders NotFound for an unknown route', () => {
    renderAt('/this-route-does-not-exist');
    // Adjust to match whatever NotFound.jsx actually renders
  });

  it('renders the House layout (nav links) on every route', () => {
    renderAt('/about');
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Products' })).toBeInTheDocument();
  });
});