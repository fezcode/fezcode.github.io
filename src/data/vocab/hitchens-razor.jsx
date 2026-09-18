import React from 'react';
import MarkdownLink from '../../components/MarkdownLink';

export default function HitchensRazor() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        <strong className="text-current">Hitchens’s Razor</strong> holds that
        what can be asserted without evidence can be dismissed without evidence.
        It is a rule about the burden of proof: the person making a claim owes
        the support for it, and a bare assertion earns a bare denial.
      </p>

      <div className="border-l-2 border-red-500/50 pl-4 py-1 italic opacity-70 text-xs">
        "Quod gratis asseritur, gratis negatur." — What is asserted freely may
        be denied freely.
      </div>

      <p>
        Christopher Hitchens popularised it in <em>God Is Not Great</em> (2007),
        but the Latin formulation is a long-standing maxim of legal and
        theological debate. It is a restatement of the rule that shifting the
        burden onto the doubter is itself a{' '}
        <MarkdownLink
          href="/vocab/logical-fallacy"
          className="text-emerald-400 hover:underline"
        >
          logical fallacy
        </MarkdownLink>{' '}
        — the appeal to ignorance.
      </p>

      <p>
        The abuse is subtle. The razor applies to claims with{' '}
        <strong className="text-current">no</strong> evidence, not claims with
        evidence you find weak or distasteful. Firing it at a real if flimsy
        dataset converts "I am unconvinced" into "you have said nothing", which
        is a rhetorical promotion the speaker has not earned.
      </p>

      <div className="flex flex-col gap-4 pt-4 border-t border-current/10">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold opacity-50">
          <span>See also:</span>
          <MarkdownLink
            href="/vocab/falsifiability"
            className="text-emerald-400 hover:underline"
          >
            Falsifiability
          </MarkdownLink>
          <MarkdownLink
            href="/vocab/epistemology"
            className="text-emerald-400 hover:underline"
          >
            Epistemology
          </MarkdownLink>
        </div>
      </div>
    </div>
  );
}
