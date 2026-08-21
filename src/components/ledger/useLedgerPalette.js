import { useEffect } from 'react';
import usePersistentState from '../../hooks/usePersistentState';

/**
 * Register (sub-palette) registry shared by every Ledger surface. The id is
 * written to <html data-ledger-register="..."> which drives the --ldg-*
 * custom properties defined in src/styles/Ledger.css.
 */
export const LEDGER_REGISTERS = [
  { id: '1', label: 'PAPER' },
  { id: '2', label: 'SLATE' },
  { id: '3', label: 'CARBON' },
  { id: '4', label: 'PHOSPHOR' },
  { id: '5', label: 'AMBER' },
];

// Paper. Bare :root in Ledger.css carries the same palette so the first
// paint matches — change both together.
const DEFAULT_REGISTER = '1';

/**
 * Keeps the ledger register consistent across every page and chrome piece,
 * and remembers the reader's choice between visits.
 *
 * The attribute is deliberately never removed on unmount: route transitions
 * mount the next page before the previous one tears down, so a cleanup would
 * strip the attribute the incoming page just set and snap the palette back to
 * the :root default. The attribute only affects --ldg-* vars, which nothing
 * outside the ledger theme consumes.
 */
const useLedgerPalette = () => {
  const [register, setRegister] = usePersistentState(
    'ledger-register',
    DEFAULT_REGISTER,
  );
  const isKnown = LEDGER_REGISTERS.some((entry) => entry.id === register);
  const activeRegister = isKnown ? register : DEFAULT_REGISTER;

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-ledger-register',
      activeRegister,
    );
  }, [activeRegister]);

  const cycleRegister = () => {
    setRegister((current) => {
      const idx = LEDGER_REGISTERS.findIndex((entry) => entry.id === current);
      return LEDGER_REGISTERS[(idx + 1) % LEDGER_REGISTERS.length].id;
    });
  };

  const registerLabel = LEDGER_REGISTERS.find(
    (entry) => entry.id === activeRegister,
  ).label;

  return {
    register: activeRegister,
    registerLabel,
    setRegister,
    cycleRegister,
  };
};

export default useLedgerPalette;
