import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import RegisterPage from '../RegisterPage';
import * as authApi from '../../api/authApi';
import { vi, describe, test, expect } from 'vitest';

vi.mock('../../api/authApi', () => ({
  registerRequest: vi.fn(),
  loginRequest: vi.fn(),
  getProfile: vi.fn(),
  logout: vi.fn(),
}));

const renderComponent = () => render(
  <AuthProvider>
    <BrowserRouter>
      <RegisterPage />
    </BrowserRouter>
  </AuthProvider>
);

describe('RegisterPage Component', () => {
  test('submits registration form with all fields', async () => {
    const user = userEvent.setup();
    const mockedRegister = vi.mocked(authApi.registerRequest);
    
    mockedRegister.mockResolvedValue({ token: 'new-user-token' });

    renderComponent();

    const emailInput = screen.getByLabelText(/Email/i);
    const usernameInput = screen.getByLabelText(/Username/i);
    const firstNameInput = screen.getByLabelText(/First Name/i);
    const lastNameInput = screen.getByLabelText(/Last Name/i);
    const passwordInput = screen.getByLabelText('Password', { selector: 'input' });
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: /Sign up/i });

    await user.type(emailInput, 'new@test.com');
    await user.type(usernameInput, 'tester');
    await user.type(firstNameInput, 'Viktoriia');
    await user.type(lastNameInput, 'Panchenko');
    await user.type(passwordInput, 'secret123');
    await user.type(confirmPasswordInput, 'secret123');

    await user.click(submitButton);

    await waitFor(() => {
      expect(mockedRegister).toHaveBeenCalledTimes(1);
      expect(mockedRegister).toHaveBeenCalledWith(expect.objectContaining({
        email: 'new@test.com',
        username: 'tester',
        first_name: 'Viktoriia'
      }));
    }, { timeout: 5000 });
  });
});