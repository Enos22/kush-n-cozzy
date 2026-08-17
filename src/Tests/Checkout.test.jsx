import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Checkout from './Checkout';
import { useCart } from '../CartContext';

vi.mock('../CartContext', () => ({
  useCart: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const cartItems = [
  { id: '1', name: 'Rolling Tray', price: 500, quantity: 2 },
];

function renderCheckout(overrides = {}) {
  useCart.mockReturnValue({
    cartItems,
    totalPrice: 1000,
    clearCart: vi.fn(),
    ...overrides,
  });

  return render(
    <MemoryRouter>
      <Checkout />
    </MemoryRouter>
  );
}

beforeEach(() => {
  global.fetch = vi.fn();
  mockNavigate.mockClear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Checkout', () => {
  it('shows an empty-cart message and no form when the cart is empty', () => {
    renderCheckout({ cartItems: [], totalPrice: 0 });
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /place order/i })).not.toBeInTheDocument();
  });

  it('renders the order summary with items and total', () => {
    renderCheckout();
    expect(screen.getByText(/rolling tray x2/i)).toBeInTheDocument();
    expect(screen.getByText(/total: kes 1,000/i)).toBeInTheDocument();
  });

  it('requires all fields before submitting', async () => {
    renderCheckout();
    expect(screen.getByLabelText(/full name/i)).toBeRequired();
    expect(screen.getByLabelText(/email/i)).toBeRequired();
    expect(screen.getByLabelText(/phone number/i)).toBeRequired();
    expect(screen.getByLabelText(/delivery address/i)).toBeRequired();
  });

  it('submits the order, clears the cart, and navigates to confirmation on success', async () => {
    const clearCart = vi.fn();
    global.fetch.mockResolvedValue({ ok: true });
    const user = userEvent.setup();
    renderCheckout({ clearCart });

    await user.type(screen.getByLabelText(/full name/i), 'Jane Doe');
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/phone number/i), '0712345678');
    await user.type(screen.getByLabelText(/delivery address/i), '123 Main St');
    await user.selectOptions(screen.getByLabelText(/payment method/i), 'mpesa');

    await user.click(screen.getByRole('button', { name: /place order/i }));

    await waitFor(() => expect(clearCart).toHaveBeenCalled());
    expect(mockNavigate).toHaveBeenCalledWith('/order-confirmation');

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3001/orders',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"paymentMethod":"mpesa"'),
      })
    );
  });

  it('shows an error message and does not navigate when the request fails', async () => {
    global.fetch.mockResolvedValue({ ok: false });
    const user = userEvent.setup();
    renderCheckout();

    await user.type(screen.getByLabelText(/full name/i), 'Jane Doe');
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/phone number/i), '0712345678');
    await user.type(screen.getByLabelText(/delivery address/i), '123 Main St');

    await user.click(screen.getByRole('button', { name: /place order/i }));

    expect(await screen.findByText(/something went wrong placing your order/i)).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('disables the submit button and shows "Placing Order..." while submitting', async () => {
    let resolveRequest;
    global.fetch.mockReturnValue(new Promise((resolve) => { resolveRequest = resolve; }));
    const user = userEvent.setup();
    renderCheckout();

    await user.type(screen.getByLabelText(/full name/i), 'Jane Doe');
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/phone number/i), '0712345678');
    await user.type(screen.getByLabelText(/delivery address/i), '123 Main St');

    await user.click(screen.getByRole('button', { name: /place order/i }));

    expect(screen.getByRole('button', { name: /placing order/i })).toBeDisabled();
    resolveRequest({ ok: true });
  });
});