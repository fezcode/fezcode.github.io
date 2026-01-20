import React from 'react';
import {
  EnvelopeSimpleIcon,
  LinkedinLogoIcon,
  XLogoIcon,
  GithubLogoIcon,
  GlobeIcon,
  RedditLogoIcon,
  ArrowUpRightIcon,
} from '@phosphor-icons/react';
import GenericModal from './GenericModal';
import { useSiteConfig } from '../context/SiteConfigContext';
import { useVisualSettings } from '../context/VisualSettingsContext';

const socialIcons = {
  GithubLogo: GithubLogoIcon,
  XLogo: XLogoIcon,
  LinkedinLogo: LinkedinLogoIcon,
  EnvelopeSimple: EnvelopeSimpleIcon,
  RedditLogo: RedditLogoIcon,
};

const ContactModal = ({ isOpen, onClose }) => {
  const { config } = useSiteConfig();
  const { fezcodexTheme } = useVisualSettings();
  const isLuxe = fezcodexTheme === 'luxe';

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title={isLuxe ? "Establish Contact" : "Contact"}
    >
      <div className="flex flex-col gap-6">
        {isLuxe ? (
          <p className="font-outfit text-sm text-[#1A1A1A]/60 italic leading-relaxed mb-2">
            Choose a preferred channel to initiate communication with the primary node.
          </p>
        ) : (
          <p className="text-gray-400 mb-2 font-mono uppercase tracking-widest text-[10px]">
            {'//'} Establish connection via established protocols:
          </p>
        )}

        <div className={`grid grid-cols-1 ${isLuxe ? 'gap-4' : 'gap-3'}`}>
          {config?.socials &&
            config.socials.map((link) => {
              const Icon = socialIcons[link.icon] || GlobeIcon;
              if (isLuxe) {
                return (
                  <LuxeContactLink
                    key={link.id}
                    href={link.url}
                    icon={Icon}
                    label={link.label}
                    value={link.url.replace(/^mailto:/, '').replace(/^https?:\/\//, '')}
                  />
                );
              }
              return (
                <BrutalistContactLink
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

const LuxeContactLink = ({ href, icon: Icon, label, value }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex items-center justify-between border border-[#1A1A1A]/5 bg-[#FAFAF8] p-6 transition-all hover:bg-white hover:shadow-xl hover:border-[#8D4004]/20 rounded-sm"
  >
    <div className="flex items-center gap-6">
      <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-sm text-[#1A1A1A]/40 group-hover:text-[#8D4004] transition-colors">
        <Icon size={24} weight="light" />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-outfit uppercase tracking-[0.2em] text-[#1A1A1A]/40">
          {label}
        </span>
        <span className="font-playfairDisplay text-lg italic text-[#1A1A1A]">{value}</span>
      </div>
    </div>
    <ArrowUpRightIcon size={18} className="text-[#1A1A1A]/10 group-hover:text-[#8D4004] transition-colors" />
  </a>
);

const BrutalistContactLink = ({ href, icon: Icon, label, value }) => (
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
      <div className="flex flex-col text-white group-hover:text-black">
        <span className="text-[10px] font-mono uppercase tracking-widest opacity-50">
          {label}
        </span>
        <span className="font-bold tracking-tight">{value}</span>
      </div>
    </div>
  </a>
);

export default ContactModal;