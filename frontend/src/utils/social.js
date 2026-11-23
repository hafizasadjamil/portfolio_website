import { FaEnvelope, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { externalUrl } from '../services/api';

// Only the profiles that are filled in.
export const socialLinks = (profile) => {
  const social = profile?.socialLinks || {};
  return [
    { label: 'GitHub', href: externalUrl(social.github), icon: FaGithub },
    { label: 'LinkedIn', href: externalUrl(social.linkedin), icon: FaLinkedin },
    { label: 'Twitter', href: externalUrl(social.twitter), icon: FaTwitter },
    { label: 'Email', href: social.email && `mailto:${social.email}`, icon: FaEnvelope },
  ].filter(link => link.href);
};
