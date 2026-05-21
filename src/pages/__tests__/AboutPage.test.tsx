import { render, screen } from '@testing-library/react';
import AboutPage from '../AboutPage';

describe('AboutPage Component', () => {
  test('renders about page content', () => {
    render(<AboutPage />);
    
    expect(screen.getByText(/To-Do List/i)).toBeInTheDocument(); 
    expect(screen.getByText(/Version 1.0.0/i)).toBeInTheDocument(); 
    expect(screen.getByText(/Viktoriia Panchenko/i)).toBeInTheDocument(); 
  });

  test('renders all features list', () => {
    render(<AboutPage />);
    const features = [
      "Реєстрація та авторизація користувачів",
      "Додавання завдань",
      "Видалення завдань"
    ];
    
    features.forEach(feature => {
      expect(screen.getByText(feature)).toBeInTheDocument(); 
    });
  });
});