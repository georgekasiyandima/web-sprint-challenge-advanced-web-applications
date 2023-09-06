// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import React from 'react';
import { render } from '@testing-library/react';
import Spinner from './Spinner';

describe('Spinner component', () => {
  it('should not render when "on" prop is false', () => {
    const { container } = render(<Spinner on={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render when "on" prop is true', () => {
    const { getByText } = render(<Spinner on={true} />);
    const spinnerElement = getByText('Please wait...');
    expect(spinnerElement).toBeTruthy();
  });
});


