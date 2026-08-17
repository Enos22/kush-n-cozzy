import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Checkout from './components/Checkout';
import { CartProvider } from './CartContext';

const STORAGE_KEY = 'kush-n-cozzy_cart';

describe('Checkout flow', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('renders order summary and submits an order successfully', async () => {
        // seed localStorage with a cart item
        const sampleCart = [
            { id: '3', name: 'Smartphone', price: 35000, quantity: 2, image: '' },
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleCart));

        const fakeFetch = vi.fn(() =>
            Promise.resolve({ ok: true, json: () => Promise.resolve({ id: 1 }) }),
        );
        globalThis.fetch = fakeFetch;

        render(
            <CartProvider>
                <MemoryRouter>
                    <Checkout />
                </MemoryRouter>
            </CartProvider>,
        );

        // expect the order summary to contain our product
        expect(await screen.findByText(/Smartphone x2/i)).toBeInTheDocument();

        // fill out form
        await userEvent.type(screen.getByLabelText(/Full Name/i), 'Test User');
        await userEvent.type(screen.getByLabelText(/Email/i), 'test@example.com');
        await userEvent.type(screen.getByLabelText(/Phone Number/i), '0712345678');
        await userEvent.type(screen.getByLabelText(/Delivery Address/i), '123 Test St');

        // submit
        await userEvent.click(screen.getByRole('button', { name: /Place Order/i }));

        // wait for fetch to have been called and success message shown
        await waitFor(() => expect(fakeFetch).toHaveBeenCalled());
        expect(await screen.findByText(/Order placed successfully/i)).toBeInTheDocument();
    });
});
