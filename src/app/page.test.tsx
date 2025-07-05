import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Home from './page';

describe('HomePage', () => {
  it('renders the main heading', () => {
    render(<Home />);
    // page.tsxの初期内容に合わせてテストを記述
    const heading = screen.getByRole('heading', {
      level: 1,
    });
    expect(heading).toBeInTheDocument();
  });
});
