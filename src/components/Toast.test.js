import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Toast from './Toast';
import { BrowserRouter } from 'react-router-dom';

const renderToast = (props) => {
  return render(
    <BrowserRouter>
      <Toast {...props} />
    </BrowserRouter>
  );
};

describe('Toast Component', () => {
  const mockRemoveToast = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders toast with message', () => {
    renderToast({
      id: 1,
      title: 'Test Title',
      message: 'Test Message',
      removeToast: mockRemoveToast,
    });

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  test('renders links as buttons', () => {
    const links = [
      { label: 'Internal Link', to: '/internal' },
      { label: 'External Link', href: 'https://example.com' },
      { label: 'Action Button', onClick: jest.fn() },
    ];

    renderToast({
      id: 1,
      title: 'Link Test',
      message: 'Testing Links',
      links: links,
      removeToast: mockRemoveToast,
    });

    expect(screen.getByRole('link', { name: 'Internal Link' })).toHaveAttribute('href', '/internal');

    expect(screen.getByText('External Link')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'External Link' })).toHaveAttribute('href', 'https://example.com');

    expect(screen.getByText('Action Button')).toBeInTheDocument();
    const actionButton = screen.getByText('Action Button');
    fireEvent.click(actionButton);
    expect(links[2].onClick).toHaveBeenCalled();
    expect(mockRemoveToast).toHaveBeenCalledWith(1);
  });

  test('calls removeToast when close button is clicked', () => {
    renderToast({
        id: 1,
        title: 'Close Test',
        message: 'Testing Close',
        removeToast: mockRemoveToast
    });

    const closeButton = screen.getByRole('button'); // The X button
    fireEvent.click(closeButton);
    expect(mockRemoveToast).toHaveBeenCalledWith(1);
  });
});
