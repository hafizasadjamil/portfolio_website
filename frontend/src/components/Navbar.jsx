import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useList } from '../hooks/useApi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { key } = useLocation();
  const { items: demos } = useList('/demos');
  const { items: experience } = useList('/experience');

  // Close the phone menu after following a link, or with Escape.
  useEffect(() => setIsOpen(false), [key]);
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = event => event.key === 'Escape' && setIsOpen(false);
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const links = [
    { name: 'Projects', to: '/#projects' },
    demos.length > 0 && { name: 'Demo', to: '/#demo' },
    { name: 'About', to: '/#about' },
    experience.length > 0 && { name: 'Experience', to: '/#experience' },
    { name: 'Skills', to: '/#skills' },
    { name: 'Contact', to: '/#contact' },
  ].filter(Boolean);

  const linkTo = (link, className) => (
    link.to.includes('#')
      ? <Link key={link.name} to={link.to} className={className}>{link.name}</Link>
      : (
        <NavLink key={link.name} to={link.to} className={({ isActive }) => `${className} ${isActive ? '!text-accent' : ''}`}>
          {link.name}
        </NavLink>
      )
  );

  return (
    <nav aria-label="Main" className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/90 backdrop-blur">
      <div className="shell flex h-16 items-center justify-between gap-6">
        <Link to="/" className="text-lg font-bold text-paper" style={{ fontStretch: '112%' }}>Asad Jamil</Link>

        <div className="hidden items-center gap-6 lg:flex">
          {links.map(link => linkTo(link, 'nav-link text-muted hover:text-paper'))}
          <Link to="/booking" className="btn-primary !min-h-[2.5rem] !py-2">Book a call</Link>
        </div>

        <button
          type="button"
          className="-mr-2 flex h-11 w-11 items-center justify-center text-paper lg:hidden"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          aria-controls="phone-menu"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </div>

      {isOpen && (
        <div id="phone-menu" className="border-t border-line bg-ink lg:hidden">
          <div className="shell flex max-h-[calc(100vh-4rem)] flex-col overflow-y-auto py-4">
            {links.map(link => linkTo(link, 'py-3 text-lg text-paper'))}
            <Link to="/booking" className="btn-primary mt-4">Book a call</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
