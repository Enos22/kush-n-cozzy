import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './Login';

beforeEach(() => {
  global.fetch = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Login', () => {
  it('defaults to client role', () => {
    render(<Login />);
    expect(screen.getByRole('button', { name: 'Client' })).toHaveClass('active');
    expect(screen.getByRole('button', { name: /log in as client/i })).toBeInTheDocument();
  });

  it('switches to admin role when Admin is clicked', async () => {
    const user = userEvent.setup();
    render(<Login />);
    await user.click(screen.getByRole('button', { name: 'Admin' }));
    expect(screen.getByRole('button', { name: 'Admin' })).toHaveClass('active');
    expect(screen.getByRole('button', { name: /log in as admin/i })).toBeInTheDocument();
  });

  it('logs in successfully and shows a welcome message', async () => {
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve([{ id: '1', username: 'jane' }]),
    });
    const user = userEvent.setup();
    render(<Login />);

    await user.type(screen.getByLabelText(/username/i), 'jane');
    await user.type(screen.getByLabelText(/password/i), 'pass123');
    await user.click(screen.getByRole('button', { name: /log in as client/i }));

    expect(await screen.findByText(/welcome, jane/i)).toBeInTheDocument();
    expect(screen.getByText(/logged in as client/i)).toBeInTheDocument();
  });

  it('hits the admins endpoint when role is admin', async () => {
    global.fetch.mockResolvedValue({ json: () => Promise.resolve([{ id: '1', username: 'boss' }]) });
    const user = userEvent.setup();
    render(<Login />);

    await user.click(screen.getByRole('button', { name: 'Admin' }));
    await user.type(screen.getByLabelText(/username/i), 'boss');
    await user.type(screen.getByLabelText(/password/i), 'adminpass');
    await user.click(screen.getByRole('button', { name: /log in as admin/i }));

    await screen.findByText(/welcome, boss/i);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/admins?username=boss'));
  });

  it('shows an error message for invalid credentials', async () => {
    global.fetch.mockResolvedValue({ json: () => Promise.resolve([]) });
    const user = userEvent.setup();
    render(<Login />);

    await user.type(screen.getByLabelText(/username/i), 'wrong');
    await user.type(screen.getByLabelText(/password/i), 'wrong');
    await user.click(screen.getByRole('button', { name: /log in as client/i }));

    expect(await screen.findByText(/invalid username or password/i)).toBeInTheDocument();
  });

  it('shows an error message when the request fails', async () => {
    global.fetch.mockRejectedValue(new Error('network down'));
    const user = userEvent.setup();
    render(<Login />);

    await user.type(screen.getByLabelText(/username/i), 'jane');
    await user.type(screen.getByLabelText(/password/i), 'pass');
    await user.click(screen.getByRole('button', { name: /log in as client/i }));

    expect(await screen.findByText(/is json-server running/i)).toBeInTheDocument();
  });

  it('logs out and clears the form', async () => {
    global.fetch.mockResolvedValue({ json: () => Promise.resolve([{ id: '1', username: 'jane' }]) });
    const user = userEvent.setup();
    render(<Login />);

    await user.type(screen.getByLabelText(/username/i), 'jane');
    await user.type(screen.getByLabelText(/password/i), 'pass');
    await user.click(screen.getByRole('button', { name: /log in as client/i }));
    await screen.findByText(/welcome, jane/i);

    await user.click(screen.getByRole('button', { name: /log out/i }));

    expect(screen.getByLabelText(/username/i)).toHaveValue('');
  });
});