import React from 'react';
import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';

const NotFound = () => {
  usePageTitle('Page not found');

  return (
    <div className="shell min-h-screen pt-36">
      <h1 className="text-4xl">Page not found</h1>
      <p className="mt-4 text-lg text-muted">This page does not exist or has moved.</p>
      <Link to="/" className="btn-primary mt-8">Go to the home page</Link>
    </div>
  );
};

export default NotFound;
