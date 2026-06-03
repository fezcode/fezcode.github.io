import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { WarningIcon } from '@phosphor-icons/react';
import SnfLayout from '../../components/snf/SnfLayout';
import SnfDecryptText from '../../components/snf/SnfDecryptText';
import { SnfButton, SnfPanel } from '../../components/snf/SnfPrimitives';
import Seo from '../../components/Seo';
import { useSnf } from '../../context/SnfContext';

const SnfNotFoundPage = () => {
  const { language, setBreadcrumbs } = useSnf();
  const location = useLocation();

  useEffect(() => {
    setBreadcrumbs([{ label: 'SIGNAL LOST' }]);
  }, [setBreadcrumbs]);

  const tr = language === 'tr';

  return (
    <SnfLayout>
      <Seo title="Signal Lost | Serfs and Frauds Terminal" description="Record not found." />
      <div className="min-h-[55vh] flex items-center justify-center">
        <SnfPanel bracket className="max-w-lg w-full p-8 md:p-12 text-center">
          <WarningIcon
            size={48}
            weight="duotone"
            className="text-[var(--snf-alert)] mx-auto mb-6"
          />
          <div className="snf-display snf-glow text-6xl md:text-8xl font-bold text-[var(--snf-phos)] mb-2">
            404
          </div>
          <h1 className="snf-vt text-2xl text-[var(--snf-alert)] mb-4">
            <SnfDecryptText text={tr ? 'SİNYAL KAYBOLDU' : 'SIGNAL LOST'} />
          </h1>
          <p className="snf-mono text-xs snf-dim leading-relaxed mb-2">
            {tr
              ? 'Aradığınız kayıt arşivde yok ya da imha edildi.'
              : 'The record you requested is missing from the archive — or was destroyed.'}
          </p>
          <p className="snf-mono text-[10px] snf-dim mb-8 break-all">
            PATH :: {location.pathname}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <SnfButton to="/snf" primary>
              {tr ? 'TERMİNALE DÖN' : 'RETURN TO TERMINAL'}
            </SnfButton>
            <SnfButton to="/snf/archive">
              {tr ? 'ARŞİV' : 'ARCHIVE'}
            </SnfButton>
          </div>
        </SnfPanel>
      </div>
    </SnfLayout>
  );
};

export default SnfNotFoundPage;
