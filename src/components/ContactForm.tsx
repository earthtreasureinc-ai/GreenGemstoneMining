import { FormEvent, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { INTERESTS, submitLead, validateLead, type Interest, type LeadErrors } from '@/lib/leads';
import { SITE } from '@/data/site';

type State = 'idle' | 'sending' | 'sent' | 'error';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', company: '', interest: INTERESTS[0] as Interest, message: '', website: '' });
  const [errors, setErrors] = useState<LeadErrors>({});
  const [state, setState] = useState<State>('idle');

  const set = (key: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validateLead(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setState('sending');
    const result = await submitLead(form);
    setState(result.ok ? 'sent' : 'error');
  };

  if (state === 'sent') {
    return (
      <div className="form-success" role="status">
        <Check size={18} /> Thank you. We have received your enquiry and will reply by email.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="contact-form contact-form-full" noValidate>
      <div className="field">
        <label htmlFor="cf-name">Your name</label>
        <input id="cf-name" autoComplete="name" value={form.name} onChange={set('name')} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'cf-name-err' : undefined} />
        {errors.name && <small id="cf-name-err" className="field-error">{errors.name}</small>}
      </div>
      <div className="field">
        <label htmlFor="cf-email">Email address</label>
        <input id="cf-email" type="email" autoComplete="email" value={form.email} onChange={set('email')} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'cf-email-err' : undefined} />
        {errors.email && <small id="cf-email-err" className="field-error">{errors.email}</small>}
      </div>
      <div className="field">
        <label htmlFor="cf-company">Company (optional)</label>
        <input id="cf-company" autoComplete="organization" value={form.company} onChange={set('company')} />
      </div>
      <div className="field">
        <label htmlFor="cf-interest">I am interested in</label>
        <select id="cf-interest" value={form.interest} onChange={set('interest')}>
          {INTERESTS.map((i) => <option key={i}>{i}</option>)}
        </select>
      </div>
      <div className="field field-wide">
        <label htmlFor="cf-message">How can we help?</label>
        <textarea id="cf-message" rows={4} value={form.message} onChange={set('message')} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'cf-msg-err' : undefined} />
        {errors.message && <small id="cf-msg-err" className="field-error">{errors.message}</small>}
      </div>
      <div className="hp" aria-hidden="true">
        <label htmlFor="cf-website">Website</label>
        <input id="cf-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} />
      </div>
      <button className="btn btn-gold" type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? 'Sending…' : <>Request an introduction <ArrowRight size={16} /></>}
      </button>
      {state === 'error' && (
        <p className="field-error" role="alert">
          We could not send that just now. Please email us at <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
      )}
    </form>
  );
}
