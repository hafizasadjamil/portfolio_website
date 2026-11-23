import React, { useState } from 'react';
import useApi from '../hooks/useApi';
import api from '../services/api';
import { socialLinks } from '../utils/social';
import Reveal from './Reveal';
import Section from './Section';

const EMPTY = { name: '', email: '', subject: '', message: '' };

const FIELDS = [
  { name: 'name', label: 'Your name', type: 'text', autoComplete: 'name', maxLength: 100 },
  { name: 'email', label: 'Your email', type: 'email', autoComplete: 'email', maxLength: 200 },
  { name: 'subject', label: 'Subject', type: 'text', autoComplete: 'off', maxLength: 200, full: true },
];

const Contact = () => {
  const { data: profile } = useApi('/profile');
  const [formData, setFormData] = useState(EMPTY);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const { email, phone } = profile?.socialLinks || {};
  const profiles = socialLinks(profile).filter(link => link.label !== 'Email');

  const onChange = event => setFormData({ ...formData, [event.target.name]: event.target.value });

  const onSubmit = async event => {
    event.preventDefault();
    setStatus('sending');
    setError('');

    try {
      await api.post('/contact', formData);
      setStatus('sent');
      setFormData(EMPTY);
    } catch (err) {
      setStatus('idle');
      setError(err.response?.data?.msg || 'The message was not sent. Check your connection and try again.');
    }
  };

  return (
    <Section id="contact" title="Contact" className="bg-panel/40">
      <Reveal className="grid gap-12 md:grid-cols-[minmax(0,1fr)_14rem]">
        <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
          {FIELDS.map(({ name, label, full, ...input }) => (
            <div key={name} className={full ? 'sm:col-span-2' : ''}>
              <label htmlFor={name} className="mb-1.5 block font-semibold">{label}</label>
              <input id={name} name={name} value={formData[name]} onChange={onChange} required className="field" {...input} />
            </div>
          ))}
          <div className="sm:col-span-2">
            <label htmlFor="message" className="mb-1.5 block font-semibold">Message</label>
            <textarea id="message" name="message" value={formData.message} onChange={onChange} required rows="6" maxLength="5000" className="field" />
          </div>

          <div className="sm:col-span-2">
            <div aria-live="polite">
              {status === 'sent' && <p className="mb-4 rounded-lg bg-[#123b34] p-4 text-[#a9f0d8]">Message sent. I will reply by email.</p>}
              {error && <p className="mb-4 rounded-lg bg-[#4a1b2b] p-4 text-[#ffc2d1]">{error}</p>}
            </div>
            <button type="submit" disabled={status === 'sending'} className="btn-primary btn-shine w-full disabled:opacity-60 sm:w-auto">
              {status === 'sending' ? 'Sending…' : 'Send message'}
            </button>
          </div>
        </form>

        <dl className="space-y-5">
          {email && (
            <div>
              <dt className="font-semibold">Email</dt>
              <dd><a href={`mailto:${email}`} className="break-all text-accent hover:underline">{email}</a></dd>
            </div>
          )}
          {phone && (
            <div>
              <dt className="font-semibold">Phone</dt>
              <dd><a href={`tel:${phone.replace(/[^+\d]/g, '')}`} className="text-accent hover:underline">{phone}</a></dd>
            </div>
          )}
          <div>
            <dt className="font-semibold">Location</dt>
            <dd className="text-muted">Lahore, Pakistan</dd>
          </div>
          {profiles.length > 0 && (
            <div>
              <dt className="font-semibold">Profiles</dt>
              {profiles.map(({ label, href }) => (
                <dd key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="inline-block py-1 text-accent hover:underline">{label}</a>
                </dd>
              ))}
            </div>
          )}
        </dl>
      </Reveal>
    </Section>
  );
};

export default Contact;
