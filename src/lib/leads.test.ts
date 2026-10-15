import { describe, expect, it } from 'vitest';
import { validateLead, type LeadInput } from './leads';

const base: LeadInput = {
  name: 'Amina Yusuf',
  email: 'amina@example.com',
  company: '',
  interest: 'Investment',
  message: 'I would like the investor pack, please.',
  website: '',
};

describe('validateLead', () => {
  it('accepts a complete enquiry', () => {
    expect(validateLead(base)).toEqual({});
  });
  it('flags a bad email', () => {
    expect(validateLead({ ...base, email: 'nope' }).email).toBeTruthy();
    expect(validateLead({ ...base, email: 'a@b' }).email).toBeTruthy();
  });
  it('flags short name and message', () => {
    const errors = validateLead({ ...base, name: 'A', message: 'hi' });
    expect(errors.name).toBeTruthy();
    expect(errors.message).toBeTruthy();
  });
  it('flags an over-long message', () => {
    expect(validateLead({ ...base, message: 'x'.repeat(2001) }).message).toBeTruthy();
  });
});
