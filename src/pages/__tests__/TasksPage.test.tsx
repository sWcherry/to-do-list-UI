import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { AuthProvider } from '../../context/AuthContext';
import TasksPage from '../TasksPage';
import * as tasksApi from '../../api/tasksApi';
import * as authApi from '../../api/authApi';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';

const mockTasks = [
  { id: 1, title: 'Task 1', description: 'Desc 1', owner: { id: 1, full_name: 'Admin' }, assigned_to: 1, status: 'Assigned' }
];
vi.mock('../../api/tasksApi', () => ({
  getTasks: vi.fn(),
  createTask: vi.fn(),
  deleteTask: vi.fn(),
  updateTask: vi.fn(),
}));

describe('TasksPage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(tasksApi.getTasks).mockResolvedValue({ results: mockTasks } );
  });

  test('renders tasks and handles loading state', async () => {
    render(
      <AuthProvider>
        <TasksPage />
      </AuthProvider>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument(); 

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument(); 
    });
  });

  test('opens create task dialog and submits', async () => {
    vi.mocked(tasksApi.createTask).mockResolvedValue({ id: 2, title: 'New' });
    render(<AuthProvider><TasksPage /></AuthProvider>);

    await waitFor(() => fireEvent.click(screen.getByText(/Create Task/i))); 
    
    const titleInput = screen.getByLabelText(/Title/i);
    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    fireEvent.click(screen.getByRole('button', { name: /Create/i })); 

    await waitFor(() => {
      expect(vi.mocked(tasksApi.createTask)).toHaveBeenCalledWith(expect.objectContaining({ title: 'Test Task' })); 
    });
  });

  test('handles task deletion through confirm dialog', async () => {
    const user = userEvent.setup();
    vi.spyOn(authApi, 'getProfile').mockResolvedValue({ id: 1, full_name: 'Admin' } as any);
    localStorage.setItem('authToken', 'test-token');
    vi.mocked(tasksApi.getTasks).mockResolvedValue({ results: mockTasks });
    vi.mocked(tasksApi.deleteTask).mockResolvedValue({} as any);
    render(<AuthProvider><TasksPage /></AuthProvider>);

    const accordionButton = await screen.findByRole('button', { name: /Task 1/i });
    await user.click(accordionButton);

    const deleteBtn = await screen.findByRole('button', { name: /Delete/i });
    await user.click(deleteBtn);

    const dialog = await screen.findByRole('dialog');
    const confirmBtn = within(dialog).getByRole('button', { name: /Delete/i });
    await user.click(confirmBtn);

    await waitFor(() => {
      expect(tasksApi.deleteTask).toHaveBeenCalledWith(1);
    });
  });

  test('filters tasks by status', async () => {
    vi.mocked(tasksApi.getTasks).mockResolvedValue({ results: mockTasks });
    render(<AuthProvider><TasksPage /></AuthProvider>);

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    const statusCombo = screen.getAllByRole('combobox')[1];
    const statusInput = statusCombo.parentElement?.querySelector('input.MuiSelect-nativeInput') as HTMLInputElement;
    fireEvent.change(statusInput, { target: { value: 'Completed' } });

    await waitFor(() => {
      expect(vi.mocked(tasksApi.getTasks)).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'Completed' })
      );
    });
  });

  test('sorts tasks by deadline', async () => {
    vi.mocked(tasksApi.getTasks).mockResolvedValue({ results: mockTasks });
    render(<AuthProvider><TasksPage /></AuthProvider>);

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    const sortCombo = screen.getAllByRole('combobox')[0];
    const sortInput = sortCombo.parentElement?.querySelector('input.MuiSelect-nativeInput') as HTMLInputElement;
    fireEvent.change(sortInput, { target: { value: 'deadline' } });

    await waitFor(() => {
      expect(vi.mocked(tasksApi.getTasks)).toHaveBeenCalledWith(
        expect.objectContaining({ sort: 'deadline' })
      );
    });
  });

  test('filters tasks by owner', async () => {
    vi.mocked(tasksApi.getTasks).mockResolvedValue({ results: mockTasks });
    render(<AuthProvider><TasksPage /></AuthProvider>);

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    const ownerCombo = screen.getAllByRole('combobox')[2];
    const ownerInput = ownerCombo.parentElement?.querySelector('input.MuiSelect-nativeInput') as HTMLInputElement;
    fireEvent.change(ownerInput, { target: { value: 'self' } });

    await waitFor(() => {
      expect(vi.mocked(tasksApi.getTasks)).toHaveBeenCalledWith(
        expect.objectContaining({ owner: 'self' })
      );
    });
  });

  test('updates task status', async () => {
    const user = userEvent.setup();
    vi.spyOn(authApi, 'getProfile').mockResolvedValue({ id: 1, full_name: 'Admin' } as any);
    localStorage.setItem('authToken', 'test-token');

    vi.mocked(tasksApi.getTasks).mockResolvedValue({ results: mockTasks });
    vi.mocked(tasksApi.updateTask).mockResolvedValue({ ...mockTasks[0], status: 'Completed' });

    render(<AuthProvider><TasksPage /></AuthProvider>);

    const accordionBtn = await screen.findByRole('button', { name: /Task 1/i });
    await user.click(accordionBtn);

    const editBtn = await screen.findByRole('button', { name: /Edit/i });
    await user.click(editBtn);

    await screen.findByLabelText(/Title/i);

    const titleInput = await screen.findByLabelText(/Title/i);
    let ancestor: HTMLElement | null = titleInput.parentElement;
    while (ancestor && !ancestor.querySelector('[aria-haspopup="listbox"]')) {
      ancestor = ancestor.parentElement as HTMLElement | null;
    }
    if (!ancestor) throw new Error('Edit form container with select not found');

    const selectTrigger = ancestor.querySelector('[aria-haspopup="listbox"]') as HTMLElement | null;
    if (!selectTrigger) throw new Error('Select trigger not found in edit form');
    fireEvent.mouseDown(selectTrigger);

    const listbox = await screen.findByRole('listbox');
    const completedOption = within(listbox).getByText(/Completed/i);
    await user.click(completedOption);

    const saveButn = await screen.findByRole('button', { name: /Save/i });
    await user.click(saveButn);

    await waitFor(() => {
      expect(tasksApi.updateTask).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ status: 'Completed' })
      );
    });
  });

  test('closes create dialog without submitting', async () => {
    const user = userEvent.setup();
    vi.mocked(tasksApi.getTasks).mockResolvedValue({ results: mockTasks });
    
    render(<AuthProvider><TasksPage /></AuthProvider>);

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    const createBtn = screen.getByRole('button', { name: /Create Task/i });
    await user.click(createBtn);

    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});