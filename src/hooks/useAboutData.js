import { useMemo } from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { aboutData as staticAboutData } from '../pages/about-views/aboutData';
import {
  GithubLogoIcon,
  LinkedinLogoIcon,
  EnvelopeIcon,
  XLogoIcon,
  GlobeIcon,
  RedditLogoIcon,
  GitBranchIcon,
  EnvelopeSimpleIcon,
} from '@phosphor-icons/react';

const ICON_MAP = {
  GithubLogo: GithubLogoIcon,
  LinkedinLogo: LinkedinLogoIcon,
  EnvelopeSimple: EnvelopeSimpleIcon,
  Envelope: EnvelopeIcon,
  XLogo: XLogoIcon,
  Globe: GlobeIcon,
  RedditLogo: RedditLogoIcon,
  GitBranch: GitBranchIcon,
};

export const useAboutData = () => {
  const { config } = useSiteConfig();

  const data = useMemo(() => {
    if (!config || !config.socials) return staticAboutData;

    const socialLinks = config.socials.map((link) => {
        let label = link.label.charAt(0).toUpperCase() + link.label.slice(1).toLowerCase();

        // Custom label overrides to match original style if needed
        if (link.id === 'twitter') label = 'X (Twitter)';
        if (link.id === 'github') label = 'GitHub';
        if (link.id === 'linkedin') label = 'LinkedIn';
        if (link.id === 'website') label = 'Fezcode';

        return {
            id: link.id,
            label: label,
            url: link.url,
            icon: ICON_MAP[link.icon] || GlobeIcon,
        };
    });

    return {
      ...staticAboutData,
      profile: {
        ...staticAboutData.profile,
        email: config.socials.find((s) => s.id === 'email')?.url.replace('mailto:', '') || staticAboutData.profile.email,
        links: socialLinks,
      },
    };
  }, [config]);

  return data;
};
