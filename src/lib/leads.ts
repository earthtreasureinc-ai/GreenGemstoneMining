import { getSupabase } from '@/lib/supabase';

export const INTERESTS = [
  'Investment',
  'Joint venture or partnership',
  'Offtake or purchasing',
  'Technical or operating services',
  'Other',
] as const;

export type Interest = (typeof INTERESTS)[number];

export interface LeadInput {
  name: string;
  email: string;
  company: string;
  interest: Interest;
  message: string;
  /** Honeypot: real visitors never fill this in. */
  website: string;
}

export type LeadErrors = Partial<Record<'name' | 'email' | 'message', string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateLead(input: LeadInput): LeadErrors {
  const errors: LeadErrors = {};
  if (input.name.trim().length < 2) errors.name = 'Please enter your name.';
  if (!EMAIL_RE.test(input.email.trim()) || input.email.length > 254) {
    errors.email = 'Please enter a valid email address.';
  }
  if (input.message.trim().length < 10) errors.message = 'Please tell us a little about what you need (10+ characters).';
  if (input.message.length > 2000) errors.message = 'Please keep your message under 2000 characters.';
  return errors;
}

export type SubmitResult = { ok: true } | { ok: false; reason: 'unavailable' | 'rejected' | 'network' };

/** Stores the enquiry in the `leads` table (insert-only for anonymous visitors). */
export async function submitLead(input: LeadInput): Promise<SubmitResult> {
  // Bots tend to fill every field: pretend success, store nothing.
  if (input.website.trim() !== '') return { ok: true };
  const supabase = await getSupabase();
  if (!supabase) return { ok: false, reason: 'unavailable' };

  try {
    const { error } = await supabase.from('leads').insert({
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      company: input.company.trim() || null,
      interest: input.interest,
      message: input.message.trim(),
    });
    if (error) return { ok: false, reason: 'rejected' };
    return { ok: true };
  } catch {
    return { ok: false, reason: 'network' };
  }
}
