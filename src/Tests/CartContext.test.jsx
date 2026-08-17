import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, renderHook, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider, useCart } from './CartContext';

const product1 = { id: '1', name: 'Rolling Tray', price: 500 };
const product2 = { id: '2', name: 'Cozy Blanket', price: 1200 };

function wrapper({ children }) {
  return <CartProvider>{children}</CartProvider>;
}

beforeEach(() => {
  localStorage.clear();
});

describe('useCart (outside a CartProvider)', () => {
  it('throws if used without a CartProvider', () => {
    // Suppress the expected React error log for this one test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useCart())).toThrow(
      'useCart must be used within a CartProvider'
    );
    spy.mockRestore();
  });
});

describe('CartProvider / useCart', () => {
  it('starts empty when localStorage has nothing', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.cartItems).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it('adds a new product to the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addToCart(product1));

    expect(result.current.cartItems).toEqual([{ ...product1, quantity: 1 }]);
    expect(result.current.totalItems).toBe(1);
    expect(result.current.totalPrice).toBe(500);
  });

  it('increments quantity when adding a product already in the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addToCart(product1));
    act(() => result.current.addToCart(product1));

    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0].quantity).toBe(2);
    expect(result.current.totalItems).toBe(2);
  });

  it('respects a custom quantity when adding', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(product1, 3));
    expect(result.current.cartItems[0].quantity).toBe(3);
  });

  it('removes a product from the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addToCart(product1));
    act(() => result.current.addToCart(product2));
    act(() => result.current.removeFromCart('1'));

    expect(result.current.cartItems).toEqual([{ ...product2, quantity: 1 }]);
  });

  it('updates the quantity of a specific item', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addToCart(product1));
    act(() => result.current.updateQuantity('1', 5));

    expect(result.current.cartItems[0].quantity).toBe(5);
  });

  it('ignores updateQuantity calls below 1', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addToCart(product1));
    act(() => result.current.updateQuantity('1', 0));

    expect(result.current.cartItems[0].quantity).toBe(1); // unchanged
  });

  it('clears the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addToCart(product1));
    act(() => result.current.addToCart(product2));
    act(() => result.current.clearCart());

    expect(result.current.cartItems).toEqual([]);
    expect(result.current.totalPrice).toBe(0);
  });

  it('calculates totalItems and totalPrice across multiple products', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addToCart(product1, 2)); // 2 x 500 = 1000
    act(() => result.current.addToCart(product2, 1)); // 1 x 1200 = 1200

    expect(result.current.totalItems).toBe(3);
    expect(result.current.totalPrice).toBe(2200);
  });

  it('persists cart items to localStorage', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(product1));

    const stored = JSON.parse(localStorage.getItem('kush-n-cozzy_cart'));
    expect(stored).toEqual([{ ...product1, quantity: 1 }]);
  });

  it('loads existing cart items from localStorage on mount', () => {
    localStorage.setItem(
      'kush-n-cozzy_cart',
      JSON.stringify([{ ...product1, quantity: 4 }])
    );

    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.cartItems).toEqual([{ ...product1, quantity: 4 }]);
  });

  it('falls back to an empty cart if localStorage has corrupted JSON', () => {
    localStorage.setItem('kush-n-cozzy_cart', 'not valid json{{{');

    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.cartItems).toEqual([]);
  });
});