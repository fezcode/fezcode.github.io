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
  const isTerracotta = fezcodexTheme === 'terracotta';

  const title = (() => {
    if (isLuxe) return 'Establish Contact';
    if (isTerracotta) return 'Correspondence';
    return 'Contact';
  })();

  return (
    <GenericModal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col gap-6">
        {isLuxe && (
          <p className="font-outfit text-sm text-[#1A1A1A]/60 italic leading-relaxed mb-2">
            Choose a preferred channel to initiate communication with the
            primary node.
          </p>
        )}
        {isTerracotta && (
          <div className="mb-1 flex items-center gap-3">
            <span className="h-[2px] w-[36px] bg-[#C96442]" />
            <p className="font-ibm-plex-mono text-[9.5px] uppercase tracking-[0.28em] text-[#2E2620]/70">
              Channels · open for letters
            </p>
          </div>
        )}
        {!isLuxe && !isTerracotta && (
          <p className="text-gray-400 mb-2 font-mono uppercase tracking-widest text-[10px]">
            {'//'} Establish connection via established protocols:
          </p>
        )}

        <div
          className={`grid grid-cols-1 ${
            isLuxe ? 'gap-4' : isTerracotta ? 'gap-0 border-t border-[#1A161320]' : 'gap-3'
          }`}
        >
          {config?.socials &&
            config.socials.map((link) => {
              const Icon = socialIcons[link.icon] || GlobeIcon;
              const cleaned = link.url
                .replace(/^mailto:/, '')
                .replace(/^https?:\/\//, '');
              if (isLuxe) {
                return (
                  <LuxeContactLink
                    key={link.id}
                    href={link.url}
                    icon={Icon}
                    label={link.label}
                    value={cleaned}
                  />
                );
              }
              if (isTerracotta) {
                return (
                  <TerracottaContactLink
                    key={link.id}
                    href={link.url}
                    icon={Icon}
                    label={link.label}
                    value={cleaned}
                  />
                );
              }
              return (
                <BrutalistContactLink
                  key={link.id}
                  href={link.url}
                  icon={Icon}
                  label={link.label}
                  value={cleaned}
                />
              );
            })}
        </div>
      </div>
    </GenericModal>
  );
};

const TerracottaContactLink = ({ href, icon: Icon, label, value }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group relative grid grid-cols-[52px_140px_1fr_auto] items-center gap-4 px-4 py-4 border-b border-[#1A161320] hover:bg-[#E8DECE]/60 transition-colors"
  >
    <span
      aria-hidden="true"
      className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#C96442] opacity-0 group-hover:opacity-100 transition-opacity"
    />
    <div className="flex items-center justify-center w-10 h-10 border border-[#1A161330] text-[#1A1613] group-hover:border-[#C96442] group-hover:text-[#9E4A2F] transition-colors">
      <Icon size={20} weight="duotone" />
    </div>
    <span className="font-ibm-plex-mono text-[9.5px] uppercase tracking-[0.28em] text-[#C96442]">
      {label}
    </span>
    <span className="font-fraunces italic text-[16px] text-[#1A1613] truncate">
      {value}
    </span>
    <ArrowUpRightIcon
      size={14}
      weight="bold"
      className="text-[#1A161340] group-hover:text-[#9E4A2F] transition-colors"
    />
  </a>
);

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
        <span className="font-playfairDisplay text-lg italic text-[#1A1A1A]">
          {value}
        </span>
      </div>
    </div>
    <ArrowUpRightIcon
      size={18}
      className="text-[#1A1A1A]/10 group-hover:text-[#8D4004] transition-colors"
    />
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
