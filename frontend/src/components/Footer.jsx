import React from 'react';
import useApi from '../hooks/useApi';
import { socialLinks } from '../utils/social';

const Footer = () => {
  const { data: profile } = useApi('/profile');

  return (
    <footer className="border-t border-line py-8">
      <div className="shell flex flex-wrap items-center justify-between gap-4">
        <p className="text-muted">© {new Date().getFullYear()} Muhammad Asad Jamil</p>
        <div className="-mr-2 flex">
          {socialLinks(profile).map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              {...(href.startsWith('mailto:') ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
              className="flex h-11 w-11 items-center justify-center text-muted hover:text-accent"
            >
              <Icon size={20} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
