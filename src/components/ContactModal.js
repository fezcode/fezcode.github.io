import React from 'react';
import { Envelope, LinkedinLogo, TwitterLogo } from '@phosphor-icons/react';
import GenericModal from './GenericModal';

const ContactModal = ({ isOpen, onClose }) => {
  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title="Contact"
    >
      <div className="flex flex-col gap-6">
        <p className="text-gray-400 mb-2 font-mono uppercase tracking-widest text-xs">
          Reach out through any of these channels:
        </p>

        <div className="flex flex-col gap-3">
          <ContactLink
            href="mailto:samil.bulbul@gmail.com"
            icon={Envelope}
            label="Email"
            value="samil.bulbul@gmail.com"
          />
          <ContactLink
            href="https://www.linkedin.com/in/ahmed-samil-bulbul/?locale=en_US"
            icon={LinkedinLogo}
            label="LinkedIn"
            value="Ahmed Samil Bulbul"
          />
          <ContactLink
            href="https://x.com/fezcoddy"
            icon={TwitterLogo}
            label="Twitter"
            value="@fezcoddy"
          />
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
      <Icon size={24} weight="bold" className="text-emerald-500 group-hover:text-black transition-colors" />
      <div className="flex flex-col">
        <span className="text-[10px] font-mono uppercase tracking-widest opacity-50">{label}</span>
        <span className="font-bold tracking-tight">{value}</span>
      </div>
    </div>
  </a>
);

export default ContactModal;
