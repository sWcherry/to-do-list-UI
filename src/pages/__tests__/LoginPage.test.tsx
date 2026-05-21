import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import LoginPage from '../LoginPage';
import * as authApi from '../../api/authApi'; 
import { vi, describe, test, expect, beforeEach } from 'vitest';

vi.mock('../../api/authApi', () => ({
  loginRequest: vi.fn(),
  registerRequest: vi.fn(),
  getProfile: vi.fn(),
  logout: vi.fn(),
}));

const renderComponent = () => render(
  <AuthProvider>
    <BrowserRouter>
      <LoginPage />
    </BrowserRouter>
  </AuthProvider>
);

describe('LoginPage Component', () => {
  beforeEach(() => vi.clearAllMocks());

  test('should render login form correctly', () => {
    renderComponent();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument(); 
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument(); 
    expect(screen.getByRole('button', { name: /Log in/i })).toBeInTheDocument(); 
  });

  test('calls loginRequest and navigates on success', async () => {
    const user = userEvent.setup();
    const mockedLogin = vi.mocked(authApi.loginRequest);
    mockedLogin.mockResolvedValue({ token: 'test-token' });
    
    renderComponent();

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Log in/i });

    await user.type(emailInput, 'user@test.com');
    await user.type(passwordInput, 'password123');

    await user.click(submitButton);

    await waitFor(() => {
      expect(mockedLogin).toHaveBeenCalledTimes(1);
      expect(mockedLogin).toHaveBeenCalledWith('user@test.com', 'password123');
    }, { timeout: 2000 });
  });

  test('shows alert on login failure', async () => {
    const mockedLogin = vi.mocked(authApi.loginRequest);
    mockedLogin.mockRejectedValue(new Error('Unauthorized'));
    window.alert = vi.fn();

    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: /Log in/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Login failed"); 
    });
  });
});