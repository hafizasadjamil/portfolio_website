import React from 'react';
import { Link } from 'react-router-dom';
import useApi from '../hooks/useApi';
import usePageTitle from '../hooks/usePageTitle';
import { externalUrl } from '../services/api';

const Booking = () => {
  usePageTitle('Book a call');
  const { data: profile, loading } = useApi('/profile');
  const calendar = externalUrl(profile?.bookingUrl);
  const email = profile?.socialLinks?.email;

  return (
    <div className="shell grid gap-10 pb-20 pt-28 md:pt-32 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-16">
      <div>
        <h1 className="text-4xl">Book a call</h1>
        <p className="mt-4 text-lg text-muted">30 minutes to talk about your project.</p>

        {/* A booking page inside a frame cannot report that it is closed, so this is always shown. */}
        <div className="mt-8 border-t border-line pt-6">
          <p className="text-muted">If the calendar is unavailable or no time suits you, write to me instead.</p>
          <div className="mt-2 flex flex-col items-start">
            {email && <a href={`mailto:${email}?subject=Call%20request`} className="text-link break-all">{email}</a>}
            <Link to="/#contact" className="text-link">Send a message</Link>
          </div>
        </div>
      </div>

      {calendar && (
        <iframe src={calendar} title="Booking calendar" className="h-[44rem] w-full rounded-xl bg-white" style={{ border: 0 }} />
      )}
      {loading && <p className="text-muted">Loading the calendar…</p>}
    </div>
  );
};

export default Booking;
