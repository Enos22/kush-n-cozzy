import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Cart from './Cart';
import { useCart } from '../CartContext';

vi.mock('../CartContext', () => ({
  useCart: vi.fn(),
}));

function renderCart() {
  return render(
    <MemoryRouter>
      <Cart />
    </MemoryRouter>
  );
}

describe('Cart', () => {
  it('shows an empty state and a Continue Shopping link when there are no items', () => {
    useCart.mockReturnValue({
      cartItems: [],
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      totalPrice: 0,
    });

    renderCart();
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /continue shopping/i })).toHaveAttribute('href', '/');
  });

  it('renders each cart item with name, price, and subtotal', () => {
    useCart.mockReturnValue({
      cartItems: [
        { id: '1', name: 'Rolling Tray', price: 500, quantity: 2, image: 'tray.jpg' },
      ],
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      totalPrice: 1000,
    });

    renderCart();
    expect(screen.getByText('Rolling Tray')).toBeInTheDocument();
    expect(screen.getByText('KES 500')).toBeInTheDocument();
    expect(screen.getByText('KES 1,000')).toBeInTheDocument(); // subtotal
  });

  it('renders the total and a checkout link', () => {
    useCart.mockReturnValue({
      cartItems: [{ id: '1', name: 'Rolling Tray', price: 500, quantity: 1, image: 'tray.jpg' }],
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      totalPrice: 500,
    });

    renderCart();
    expect(screen.getByText(/total: kes 500/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /proceed to checkout/i })).toHaveAttribute('href', '/checkout');
  });

  it('calls updateQuantity when + and - are clicked', async () => {
    const updateQuantity = vi.fn();
    useCart.mockReturnValue({
      cartItems: [{ id: '1', name: 'Rolling Tray', price: 500, quantity: 2, image: 'tray.jpg' }],
      removeFromCart: vi.fn(),
      updateQuantity,
      totalPrice: 1000,
    });

    const user = userEvent.setup();
    renderCart();

    await user.click(screen.getByRole('button', { name: '+' }));
    expect(updateQuantity).toHaveBeenCalledWith('1', 3);

    await user.click(screen.getByRole('button', { name: '-' }));
    expect(updateQuantity).toHaveBeenCalledWith('1', 1);
  });

  it('disables the decrement button at quantity 1', () => {
    useCart.mockReturnValue({
      cartItems: [{ id: '1', name: 'Rolling Tray', price: 500, quantity: 1, image: 'tray.jpg' }],
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      totalPrice: 500,
    });

    renderCart();
    expect(screen.getByRole('button', { name: '-' })).toBeDisabled();
  });

  it('calls removeFromCart when Remove is clicked', async () => {
    const removeFromCart = vi.fn();
    useCart.mockReturnValue({
      cartItems: [{ id: '1', name: 'Rolling Tray', price: 500, quantity: 1, image: 'tray.jpg' }],
      removeFromCart,
      updateQuantity: vi.fn(),
      totalPrice: 500,
    });

    const user = userEvent.setup();
    renderCart();
    await user.click(screen.getByRole('button', { name: /remove/i }));
    expect(removeFromCart).toHaveBeenCalledWith('1');
  });
});