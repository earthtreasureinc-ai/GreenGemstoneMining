// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import App from '@/App';
import ContactForm from '@/components/ContactForm';
import Gallery from '@/components/Gallery';
import { GALLERY } from '@/data/site';

afterEach(cleanup);

describe('App', () => {
  it('renders one h1, a skip link and a closed mobile menu', () => {
    render(<App />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByText('Skip to content')).toBeTruthy();
    expect(document.querySelector('#main-nav')?.classList.contains('open')).toBe(false);
  });

  it('toggles the mobile menu with correct aria state', () => {
    render(<App />);
    const burger = screen.getByRole('button', { name: 'Open menu' });
    expect(burger.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(burger);
    expect(screen.getByRole('button', { name: 'Close menu' }).getAttribute('aria-expanded')).toBe('true');
    expect(document.querySelector('#main-nav')?.classList.contains('open')).toBe(true);
  });

  it('does not link to a LinkedIn page that is not configured', () => {
    render(<App />);
    expect(screen.queryByText('LinkedIn')).toBeNull();
  });
});

describe('ContactForm', () => {
  it('shows validation errors and does not submit an empty form', async () => {
    render(<ContactForm />);
    fireEvent.click(screen.getByRole('button', { name: /request an introduction/i }));
    expect(await screen.findByText('Please enter your name.')).toBeTruthy();
    expect(screen.getByText('Please enter a valid email address.')).toBeTruthy();
    expect(screen.queryByText(/we have received your enquiry/i)).toBeNull();
  });
});

describe('Gallery', () => {
  it('shows every built-in item by default and filters by group', () => {
    render(<Gallery uploads={[]} />);
    expect(screen.getByText(`${GALLERY.length} items`)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Gemstones' }));
    expect(screen.getByText('3 items')).toBeTruthy();
  });

  it('only offers the uploads filter when uploads exist', () => {
    render(<Gallery uploads={[]} />);
    expect(screen.queryByRole('button', { name: 'My uploads' })).toBeNull();
  });
});
