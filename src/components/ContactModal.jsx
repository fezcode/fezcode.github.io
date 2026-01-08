import React from 'react';
import {
  EnvelopeSimpleIcon,
  LinkedinLogoIcon,
  XLogoIcon,
  GithubLogoIcon,
  GlobeIcon,
  RedditLogoIcon,
} from '@phosphor-icons/react';
import GenericModal from './GenericModal';
import { useSiteConfig } from '../context/SiteConfigContext';

const socialIcons = {
  GithubLogo: GithubLogoIcon,
  XLogo: XLogoIcon,
  LinkedinLogo: LinkedinLogoIcon,
  EnvelopeSimple: EnvelopeSimpleIcon,
  RedditLogo: RedditLogoIcon,
};

const ContactModal = ({ isOpen, onClose }) => {
  const { config } = useSiteConfig();

  return (
    <GenericModal isOpen={isOpen} onClose={onClose} title="Contact">
      <div className="flex flex-col gap-6">
        <p className="text-gray-400 mb-2 font-mono uppercase tracking-widest text-[10px]">
          {/* // CONNECT_PROTOCOLS */}
          {'//'} Establish connection via established protocols:
        </p>

        <div className="flex flex-col gap-3">
          {config?.socials &&
            config.socials.map((link) => {
              const Icon = socialIcons[link.icon] || GlobeIcon;
              return (
                <ContactLink
                  key={link.id}
                  href={link.url}
                  icon={Icon}
                  label={link.label}
                  value={link.url.replace(/^mailto:/, '').replace(/^https?:\/\//, '')}
                />
              );
            })}
        </div>
      </div>
    </GenericModal>
  );
};

const ContactLink = ({ href, icon: Icon, label, value }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex items-center justify-between border border-white/10 bg-white/[0.02] p-4 transition-all hover:bg-emerald-500 hover:text-black hover:border-emerald-500 rounded-sm"
  >
    <div className="flex items-center gap-4">
      <Icon
        size={24}
        weight="bold"
        className="text-emerald-500 group-hover:text-black transition-colors"
      />
      <div className="flex flex-col">
        <span className="text-[10px] font-mono uppercase tracking-widest opacity-50">
          {label}
        </span>
        <span className="font-bold tracking-tight">{value}</span>
      </div>
    </div>
  </a>
);

export default ContactModal;
