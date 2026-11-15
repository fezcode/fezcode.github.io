import React, { Suspense, lazy } from 'react';
import { CircleNotch } from '@phosphor-icons/react';

/** Side-panel body for a vocabulary entry, whose definition loads on demand. */
export default function vocabPanelContent(entry) {
  const Definition = lazy(entry.loader);
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-8">
          <CircleNotch size={32} className="animate-spin text-gray-400" />
        </div>
      }
    >
      <Definition />
    </Suspense>
  );
}
