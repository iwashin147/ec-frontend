// src/app/[locale]/page.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HomePage from './page';

describe('HomePage', () => {
  it('renders the main heading', () => {
    render(<HomePage />);
    // page.tsxの初期内容に合わせてテストを記述
    const heading = screen.getByRole('heading', {
      level: 1,
    });
    expect(heading).toBeInTheDocument();
  });
});