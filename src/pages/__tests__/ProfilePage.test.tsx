import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import ProfilePage from '../ProfilePage';
import * as authApi from '../../api/authApi';
import { vi, describe, test, expect, beforeEach } from 'vitest';

vi.mock('../../api/authApi', () => ({
  getProfile: vi.fn(),
  updateProfile: vi.fn(),
  logout: vi.fn(),
  deleteProfile: vi.fn(),
}));

const mockProfile = {
  username: 'testuser',
  email: 'test@example.com',
  first_name: 'Test',
  last_name: 'User',
  gender: 'M',
  birth_date: '1990-01-01',
  avatar: 'T'
};

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('authToken', 'test-token');
    vi.mocked(authApi.getProfile).mockResolvedValue(mockProfile);
    vi.mocked(authApi.logout).mockImplementation(() => {});
    vi.mocked(authApi.updateProfile).mockResolvedValue(mockProfile);
    vi.mocked(authApi.deleteProfile).mockResolvedValue({});
  });

  test('renders profile data on load', async () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <ProfilePage />
        </BrowserRouter>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });
  });

  test('switches to edit mode and shows form', async () => {
    const user = userEvent.setup();
    vi.mocked(authApi.getProfile).mockResolvedValue(mockProfile);
    
    render(
      <AuthProvider>
        <BrowserRouter>
          <ProfilePage />
        </BrowserRouter>
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByText('testuser')).toBeInTheDocument());
    
    const editBtn = screen.getByRole('button', { name: /Edit Profile/i });
    await user.click(editBtn);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test')).toBeInTheDocument();
    });
  });

  test('updates profile and shows success message', async () => {
    const user = userEvent.setup();
    vi.mocked(authApi.getProfile).mockResolvedValue(mockProfile);
    vi.mocked(authApi.updateProfile).mockResolvedValue({
      ...mockProfile,
      first_name: 'Updated'
    });

    render(
      <AuthProvider>
        <BrowserRouter>
          <ProfilePage />
        </BrowserRouter>
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByText('testuser')).toBeInTheDocument());
    
    const editBtn = screen.getByRole('button', { name: /Edit Profile/i });
    await user.click(editBtn);

    const firstNameInput = screen.getByDisplayValue('Test');
    await user.clear(firstNameInput);
    await user.type(firstNameInput, 'Updated');

    const saveBtn = await screen.findByRole('button', { name: /Save/i });
    await user.click(saveBtn);

    await waitFor(() => {
      expect(authApi.updateProfile).toHaveBeenCalled();
      expect(screen.getByText(/Profile updated/i)).toBeInTheDocument();
    });
  });

  test('handles delete account confirmation', async () => {
    const user = userEvent.setup();
    vi.mocked(authApi.getProfile).mockResolvedValue(mockProfile);
    vi.mocked(authApi.deleteProfile).mockResolvedValue({});

    render(
      <AuthProvider>
        <BrowserRouter>
          <ProfilePage />
        </BrowserRouter>
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByText('testuser')).toBeInTheDocument());
    
    const deleteAccountBtn = screen.getByRole('button', { name: /Delete Account/i });
    await user.click(deleteAccountBtn);

    const dialog = await screen.findByRole('dialog');
    const confirmDeleteBtn = within(dialog).getByRole('button', { name: /Delete/i });
    await user.click(confirmDeleteBtn);

    await waitFor(() => {
      expect(authApi.deleteProfile).toHaveBeenCalled();
    });
  });

  test('cancel delete does not call deleteProfile', async () => {
    const user = userEvent.setup();
    vi.mocked(authApi.getProfile).mockResolvedValue(mockProfile);
    vi.mocked(authApi.deleteProfile).mockResolvedValue({});

    render(
      <AuthProvider>
        <BrowserRouter>
          <ProfilePage />
        </BrowserRouter>
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByText('testuser')).toBeInTheDocument());

    const deleteAccountBtn = screen.getByRole('button', { name: /Delete Account/i });
    await user.click(deleteAccountBtn);

    const dialog = await screen.findByRole('dialog');
    const cancelBtn = within(dialog).getByRole('button', { name: /Cancel/i });
    await user.click(cancelBtn);

    await waitFor(() => {
      expect(authApi.deleteProfile).not.toHaveBeenCalled();
    });
  });

  test('cancel edit returns to view mode without saving', async () => {
    const user = userEvent.setup();
    vi.mocked(authApi.getProfile).mockResolvedValue(mockProfile);

    render(
      <AuthProvider>
        <BrowserRouter>
          <ProfilePage />
        </BrowserRouter>
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByText('testuser')).toBeInTheDocument());
    const editBtn = screen.getByRole('button', { name: /Edit Profile/i });
    await user.click(editBtn);

    const cancelBtn = await screen.findByRole('button', { name: /Cancel/i });
    await user.click(cancelBtn);

    await waitFor(() => {
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(authApi.updateProfile).not.toHaveBeenCalled();
    });
  });

  test('updates profile with changed gender and birth date', async () => {
    const user = userEvent.setup();
    const changedProfile = { ...mockProfile, gender: 'F', birth_date: '2000-02-02' };
    vi.mocked(authApi.getProfile).mockResolvedValue(mockProfile);
    vi.mocked(authApi.updateProfile).mockResolvedValue(changedProfile);

    render(
      <AuthProvider>
        <BrowserRouter>
          <ProfilePage />
        </BrowserRouter>
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByText('testuser')).toBeInTheDocument());
    const editBtn = screen.getByRole('button', { name: /Edit Profile/i });
    await user.click(editBtn);

    const genderField = await screen.findByLabelText(/Gender/i);
    await user.click(genderField);
  
    const listbox = await screen.findByRole('listbox');
    const femaleOption = within(listbox).getByRole('option', { name: /Жіноча/i });
    await user.click(femaleOption);

    const birthInput = screen.getByLabelText(/Birth Date/i);
    await user.clear(birthInput);
    await user.type(birthInput, '2000-02-02');

    const saveBtn = await screen.findByRole('button', { name: /Save/i });
    await user.click(saveBtn);

    await waitFor(() => {
      expect(authApi.updateProfile).toHaveBeenCalledWith(expect.objectContaining({ gender: expect.any(String) }));
      expect(screen.getByText(/Profile updated/i)).toBeInTheDocument();
    });
  });

  test('handles logout', async () => {
    const user = userEvent.setup();
    vi.mocked(authApi.getProfile).mockResolvedValue(mockProfile);
    vi.mocked(authApi.logout).mockImplementation(() => {});

    render(
      <AuthProvider>
        <BrowserRouter>
          <ProfilePage />
        </BrowserRouter>
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByText('testuser')).toBeInTheDocument());
    
    const logoutBtn = screen.getByRole('button', { name: /Log out/i });
    await user.click(logoutBtn);

    await waitFor(() => {
      expect(authApi.logout).toHaveBeenCalled();
    });
  });
});
