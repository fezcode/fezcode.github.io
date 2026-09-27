import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  CheckIcon,
  CopyIcon,
  GithubLogoIcon,
  ListIcon,
  PlusIcon,
  XIcon,
} from '@phosphor-icons/react';
import {
  useAppConfig,
  useThemeFonts,
  AppLoading,
  AppMissing,
  AppSeo,
} from './app-shell';

/* ============================================================
 * "capsules" — after capsules.moyra.co, dressed as Qemik.
 *
 * The borrowed grammar: a giant wordmark inside a rounded hero
 * card, a floating Menu pill, "(Scroll)" markers, pill tags, a
 * paragraph that inks in word by word as you scroll, a picture
 * that grows from a thumbnail to the whole screen behind a moving
 * wordmark, full-screen cards that stack as you scroll, a "Why X?*"
 * marquee, levelled horizontal cards, a quote carousel, a closing
 * "Book your capsule—" ribbon and a giant gradient wordmark footer.
 * The "Reserve" drawer becomes a machine wizard.
 *
 * The palette is Qemik's own (its window greens and #D7F59A), and
 * every picture is a real screenshot or the app's artwork. Qemik
 * ships from GitHub Releases: every "Get Qemik" goes there, and the
 * wizard can also hand over a real machine config to import.
 * ============================================================ */

const FONTS =
  'https://fonts.googleapis.com/css2?family=Host+Grotesk:ital,wght@0,300;0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap';

const BG = '#111310';
const PANEL = '#191D17';
const CARD = '#20261D';
const LINE = 'rgba(237,242,234,0.12)';
const CREAM = '#EDF2EA';
const DIM = '#949C8F';
const ACC = '#D7F59A';
const ON_ACC = '#1C2614';

const HOST = { fontFamily: "'Host Grotesk', system-ui, sans-serif" };
const MONO = { fontFamily: "'JetBrains Mono', ui-monospace, monospace" };

/* The site scrolls <body>, not the window; scroll-linked effects must say so. */
const scrollRoot = () => {
  if (typeof document === 'undefined') return undefined;
  const b = document.body;
  return /(auto|scroll)/.test(getComputedStyle(b).overflowY)
    ? { current: b }
    : undefined;
};
const useBodyScroll = (ref, offset) => {
  const [root] = useState(scrollRoot);
  return useScroll({ target: ref, container: root, offset });
};

/* ---------- aurora: the waves from Qemik's icon, as a living backdrop ---------- */

const Aurora = ({ className = '', strong = false }) => {
  const reduce = useReducedMotion();
  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
      style={{
        background:
          'radial-gradient(120% 90% at 70% 40%, #0B2A26 0%, #07100E 55%, #050807 100%)',
      }}
    >
      {[
        ['#1FB6A0', '12%', '58%', 70, 0],
        ['#2EE08A', '64%', '30%', 60, 4],
        ['#C9F27A', '82%', '70%', 44, 8],
      ].map(([c, x, y, s, d]) => (
        <motion.span
          key={c}
          className="absolute rounded-full"
          style={{
            left: x,
            top: y,
            width: `${s}vmax`,
            height: `${s * 0.42}vmax`,
            background: c,
            filter: 'blur(70px)',
            opacity: strong ? 0.32 : 0.22,
            translateX: '-50%',
            translateY: '-50%',
            mixBlendMode: 'screen',
          }}
          animate={
            reduce
              ? undefined
              : {
                  rotate: [-8, 10, -8],
                  scale: [1, 1.15, 1],
                  x: ['0%', '6%', '0%'],
                }
          }
          transition={{
            duration: 18 + d,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: d,
          }}
        />
      ))}
    </div>
  );
};

/* ---------- small parts ---------- */

const Pill = ({
  children,
  onClick,
  href,
  tone = 'cream',
  size = 'md',
  className = '',
}) => {
  const tones = {
    cream: { background: CREAM, color: BG },
    lime: { background: ACC, color: ON_ACC },
    ghost: {
      background: 'rgba(237,242,234,0.08)',
      color: CREAM,
      border: `1px solid ${LINE}`,
      backdropFilter: 'blur(10px)',
    },
  };
  const sizes = {
    sm: 'h-9 pl-4 pr-1 text-[12.5px]',
    md: 'h-11 pl-5 pr-1.5 text-[14px]',
    lg: 'h-14 pl-7 pr-2 text-[16px]',
  };
  const dot =
    size === 'lg' ? 'w-10 h-10' : size === 'sm' ? 'w-7 h-7' : 'w-8 h-8';
  const inner = (
    <>
      <span className="font-medium">{children}</span>
      <span
        className={`${dot} rounded-full flex items-center justify-center transition-transform group-hover:rotate-45`}
        style={{
          background: tone === 'cream' ? BG : tone === 'lime' ? ON_ACC : CREAM,
          color: tone === 'ghost' ? BG : tone === 'lime' ? ACC : CREAM,
        }}
      >
        <ArrowUpRightIcon size={size === 'lg' ? 17 : 14} weight="bold" />
      </span>
    </>
  );
  const cls = `group inline-flex items-center gap-3 rounded-full whitespace-nowrap ${sizes[size]} ${className}`;
  if (href) {
    const internal = href.startsWith('/') || href.startsWith('#');
    return internal && !href.startsWith('#') ? (
      <Link to={href} className={cls} style={{ ...HOST, ...tones[tone] }}>
        {inner}
      </Link>
    ) : (
      <a
        href={href}
        className={cls}
        style={{ ...HOST, ...tones[tone] }}
        {...(href.startsWith('#')
          ? {}
          : { target: '_blank', rel: 'noopener noreferrer' })}
      >
        {inner}
      </a>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={cls}
      style={{ ...HOST, ...tones[tone] }}
    >
      {inner}
    </button>
  );
};

const Tiny = ({ children, className = '' }) => (
  <p
    className={`text-[11.5px] leading-[1.35] font-medium ${className}`}
    style={{ color: CREAM }}
  >
    {children}
  </p>
);

const Rise = ({ children, className = '', delay = 0 }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

/** A heading whose words slide up from behind a mask, like Moyra's.
 *  The parent watches the viewport: each word starts clipped out of sight,
 *  so a word could never report itself as visible. */
const WORD = {
  hidden: { y: '105%' },
  show: (i) => ({
    y: '0%',
    transition: { duration: 0.9, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] },
  }),
};
const Masked = ({ text, className = '', style, now = false }) => {
  const reduce = useReducedMotion();
  const trigger = now
    ? { animate: 'show' }
    : { whileInView: 'show', viewport: { once: true, amount: 0.3 } };
  return (
    <motion.span
      className={`inline ${className}`}
      style={style}
      initial={reduce ? false : 'hidden'}
      {...trigger}
    >
      {text.split(' ').map((w, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom pb-[0.1em] -mb-[0.1em]"
        >
          <motion.span className="inline-block" variants={WORD} custom={i}>
            {w}
            {i < text.split(' ').length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
};

const Marquee = ({
  text,
  size = 'clamp(80px, 13vw, 220px)',
  speed = 26,
  onClick,
  reverse,
}) => {
  const reduce = useReducedMotion();
  const row = Array.from({ length: 6 }, () => text).join('');
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`block w-full overflow-hidden whitespace-nowrap text-left ${onClick ? 'cursor-pointer group' : ''}`}
      aria-label={onClick ? text.replace(/—$/, '') : undefined}
    >
      <motion.span
        className="inline-block leading-[1.05] tracking-[-0.045em] font-normal transition-colors"
        style={{ ...HOST, fontSize: size, color: CREAM }}
        animate={
          reduce ? undefined : { x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }
        }
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
      >
        <span
          className={
            onClick ? 'group-hover:text-[#D7F59A] transition-colors' : ''
          }
        >
          {row}
        </span>
        <span
          className={
            onClick ? 'group-hover:text-[#D7F59A] transition-colors' : ''
          }
        >
          {row}
        </span>
      </motion.span>
    </Tag>
  );
};

/* ---------- intro paragraph that inks in as you scroll ---------- */

const Word = ({ w, i, n, progress }) => {
  const o = useTransform(progress, [i / n, (i + 1) / n], [0.16, 1]);
  return <motion.span style={{ opacity: o }}>{w} </motion.span>;
};
const InkParagraph = ({ text }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useBodyScroll(ref, ['start 85%', 'end 45%']);
  const words = text.split(' ');
  return (
    <p
      ref={ref}
      className="text-[30px] sm:text-[40px] md:text-[52px] leading-[1.08] tracking-[-0.03em]"
      style={{ ...HOST, color: CREAM }}
    >
      {reduce
        ? text
        : words.map((w, i) => (
            <Word
              key={i}
              w={w}
              i={i}
              n={words.length}
              progress={scrollYProgress}
            />
          ))}
    </p>
  );
};

/* ---------- a thumbnail that becomes the whole screen ---------- */

const GrowBand = ({ image, word }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useBodyScroll(ref, ['start start', 'end end']);
  const w = useTransform(
    scrollYProgress,
    [0, 0.75],
    reduce ? ['92vw', '92vw'] : ['30vw', '96vw'],
  );
  const h = useTransform(
    scrollYProgress,
    [0, 0.75],
    reduce ? ['70svh', '70svh'] : ['22vw', '92svh'],
  );
  const r = useTransform(scrollYProgress, [0, 0.75], [44, 22]);
  const textO = useTransform(scrollYProgress, [0.35, 0.7], [1, 0]);
  return (
    <section
      ref={ref}
      className="relative"
      style={{ height: reduce ? 'auto' : '240vh' }}
    >
      <div
        className={`${reduce ? '' : 'sticky top-0'} h-[100svh] flex items-center justify-center overflow-hidden`}
      >
        <motion.div
          className="absolute inset-x-0 top-1/2 -translate-y-1/2"
          style={{ opacity: textO }}
          aria-hidden
        >
          <Marquee text={`${word}® `} speed={30} />
        </motion.div>
        <motion.div
          className="relative overflow-hidden"
          style={{
            width: w,
            height: h,
            borderRadius: r,
            boxShadow: '0 40px 100px -30px rgba(0,0,0,0.9)',
          }}
        >
          <Aurora strong />
          <img
            src={image}
            alt="Qemik's virtual machine library"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[78%] max-w-[1200px] rounded-[1.4vw]"
            style={{ boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}
          />
        </motion.div>
      </div>
    </section>
  );
};

/* ---------- machines: full-screen cards that stack ---------- */

const MachineCard = ({ m, i, n, onDetails }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useBodyScroll(ref, ['start start', 'end start']);
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [1, 1] : [1, 0.9],
  );
  const dim = useTransform(scrollYProgress, [0, 1], [0, 0.55]);
  return (
    <div
      ref={ref}
      className="h-[100svh] sticky top-0 px-2 py-2"
      style={{ zIndex: i + 1 }}
    >
      <motion.article
        className="relative h-full rounded-[28px] overflow-hidden origin-top"
        style={{ scale }}
      >
        <Aurora strong={i % 2 === 0} />
        <img
          src={m.image}
          alt={`${m.name} in Qemik`}
          className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 w-[82%] md:w-[62%] max-w-[1100px] rounded-[18px]"
          style={{
            boxShadow: '0 50px 100px rgba(0,0,0,0.7)',
            transform: `translate(-50%,-50%) rotate(${[-2, 1.5, -1][i % 3]}deg)`,
          }}
          loading="lazy"
        />
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: '#000', opacity: dim }}
        />
        <div
          className="absolute inset-x-0 bottom-0 p-5 md:p-8 flex flex-wrap items-end justify-between gap-4"
          style={{
            background:
              'linear-gradient(180deg, transparent, rgba(5,8,7,0.85))',
          }}
        >
          <div>
            <h3
              className="text-[44px] sm:text-[64px] md:text-[88px] leading-[0.9] tracking-[-0.045em]"
              style={{ ...HOST, color: CREAM }}
            >
              {m.name}
              <sup className="text-[0.32em] align-super">®</sup>
            </h3>
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => onDetails(i)}
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ border: `1px solid ${CREAM}`, color: CREAM }}
                aria-label={`Details of ${m.name}`}
              >
                <PlusIcon size={15} weight="bold" />
              </button>
              <p
                className="max-w-[46ch] text-[13px] leading-[1.4]"
                style={{ ...HOST, color: CREAM }}
              >
                {m.blurb}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <span className="text-[15px]" style={{ ...HOST, color: DIM }}>
              ({String(i + 1).padStart(2, '0')}/{String(n).padStart(2, '0')})
              (Scroll)
            </span>
            <Pill tone="cream" onClick={() => onDetails(i)}>
              Details
            </Pill>
          </div>
        </div>
      </motion.article>
    </div>
  );
};

/* ---------- side drawer (details and the wizard share it) ---------- */

const Drawer = ({ open, onClose, children, label }) => {
  useEffect(() => {
    if (!open) return undefined;
    const k = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[130]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="absolute inset-0 w-full h-full cursor-default"
            style={{
              background: 'rgba(5,8,7,0.6)',
              backdropFilter: 'blur(6px)',
            }}
            onClick={onClose}
            aria-label="Close"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={label}
            className="absolute right-2 top-2 bottom-2 w-[min(560px,calc(100vw-16px))] rounded-[26px] overflow-y-auto p-6 md:p-9"
            style={{
              background: PANEL,
              border: `1px solid ${LINE}`,
              ...HOST,
              color: CREAM,
            }}
            initial={{ x: '105%' }}
            animate={{ x: 0 }}
            exit={{ x: '105%' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-5 top-5 h-9 px-4 rounded-full text-[13px] inline-flex items-center gap-2"
              style={{ background: CREAM, color: BG }}
            >
              Close <XIcon size={12} weight="bold" />
            </button>
            {children}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const CopyLines = ({ lines }) => {
  const [ok, setOk] = useState(false);
  return (
    <div
      className="rounded-[16px] overflow-hidden"
      style={{ background: BG, border: `1px solid ${LINE}` }}
    >
      <div
        className="flex items-center justify-between h-10 px-4 text-[12px]"
        style={{ borderBottom: `1px solid ${LINE}`, color: DIM }}
      >
        <span>PowerShell · .NET 10 SDK</span>
        <button
          type="button"
          onClick={() =>
            navigator.clipboard?.writeText(lines.join('\n')).then(() => {
              setOk(true);
              window.setTimeout(() => setOk(false), 1400);
            })
          }
          className="inline-flex items-center gap-1.5"
          style={{ color: ok ? ACC : CREAM }}
        >
          {ok ? <CheckIcon size={13} /> : <CopyIcon size={13} />}{' '}
          {ok ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre
        className="m-0 p-4 overflow-x-auto text-[13px] leading-[1.9]"
        style={{ ...MONO, color: CREAM }}
      >
        {lines.map((l) => (
          <div key={l}>
            <span style={{ color: ACC }}>PS&gt; </span>
            {l}
          </div>
        ))}
      </pre>
    </div>
  );
};

const Choice = ({ on, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={on}
    className="h-11 px-5 rounded-full text-[14px] transition-colors"
    style={
      on
        ? { background: CREAM, color: BG }
        : { border: `1px solid ${LINE}`, color: CREAM }
    }
  >
    {children}
  </button>
);

/* The wizard's last step can hand over a real machine: a Qemik configuration
 * file that Preferences › Import configuration reads. It mirrors
 * VmConfig.Template(guest) in Qemik.Core/Models.cs field for field (default
 * System.Text.Json names, so PascalCase); import assigns its own ID and MAC,
 * clears extra arguments, validates it and opens Settings for review. */
const hex = (n) =>
  Array.from(crypto.getRandomValues(new Uint8Array(n)), (b) =>
    b.toString(16).padStart(2, '0'),
  ).join('');

const qemikConfig = ({ os, mem, cpu, accel }) => {
  const win = os === 'Windows';
  return {
    Id: hex(16),
    Name: win ? 'Windows Sandbox' : `${os} Workspace`,
    IsBlueprint: false,
    Description: win
      ? 'Made on fezcode.com. Attach a Windows ISO from Microsoft in Drives, then start the machine.'
      : `Made on fezcode.com. Get ${os} from Download an OS, or attach its ISO in Drives, then start the machine.`,
    Guest: win ? 'Windows' : 'Linux',
    Architecture: 'x86_64',
    Machine: 'q35',
    Cpu: 'max',
    CpuFeatures: '',
    Accelerator: accel,
    MemoryMiB: mem * 1024,
    Cores: cpu,
    Threads: 1,
    Uefi: false,
    FirmwareCode: '',
    FirmwareVarsTemplate: '',
    BootOrder: 'dc',
    BootMenu: true,
    Kernel: '',
    Initrd: '',
    KernelArguments: '',
    Drives: [],
    Display: 'qemik',
    Video: win ? 'VGA' : 'virtio-vga',
    Fullscreen: false,
    VncDisplay: 1,
    Audio: 'intel-hda',
    AudioCapture: false,
    SharedClipboard: false,
    Network: 'user',
    NetworkCard: win ? 'e1000e' : 'virtio-net-pci',
    MacAddress: `52:54:00:${hex(1)}:${hex(1)}:${hex(1)}`,
    TapInterface: '',
    IsolateNetwork: false,
    PortForwards: [],
    Usb: true,
    Tablet: true,
    UsbDevices: '',
    Serial: 'none',
    SerialPort: 4444,
    SharedFolder: '',
    ShareReadOnly: true,
    RtcLocaltime: false,
    NoReboot: false,
    Ephemeral: false,
    ExtraArguments: '',
    Created: new Date().toISOString(),
  };
};

const downloadConfig = (choice) => {
  const vm = qemikConfig(choice);
  const blob = new Blob([JSON.stringify(vm, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${vm.Name}.qemik.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  return vm.Name;
};

const Wizard = ({ cfg, preset, onClose }) => {
  const w = cfg.wizard;
  const [step, setStep] = useState(0);
  const [os, setOs] = useState(preset?.os || w.systems[0]);
  const [mem, setMem] = useState(preset?.mem || 4);
  const [cpu, setCpu] = useState(preset?.cpu || 2);
  const [accel, setAccel] = useState('tcg');
  const [saved, setSaved] = useState(null);
  const isWin = os === 'Windows';

  const GetApp = () => (
    <div className="mt-6">
      <p className="text-[13px]" style={{ color: DIM }}>
        Qemik {cfg.version} for Windows x64 is on GitHub Releases. Keep the
        whole folder together; QEMU itself is set up from inside the app.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Pill tone="lime" href={cfg.releases}>
          Download from Releases
        </Pill>
        <Pill tone="ghost" href={cfg.repo}>
          View the source
        </Pill>
      </div>
      <p className="mt-6 text-[13px]" style={{ color: DIM }}>
        Or build it yourself with the .NET 10 SDK:
      </p>
      <div className="mt-3">
        <CopyLines lines={cfg.build} />
      </div>
    </div>
  );

  if (step === 2)
    return (
      <div className="pt-12">
        <p className="text-[12px]" style={{ color: DIM }}>
          Your machine
        </p>
        <>
          <h2 className="mt-3 text-[34px] md:text-[44px] leading-[1] tracking-[-0.035em]">
            Your {os} machine is ready to{' '}
            <span style={{ color: ACC }}>import.</span>
          </h2>
          <p
            className="mt-5 text-[14.5px] leading-[1.6]"
            style={{ color: DIM }}
          >
            A real Qemik configuration: {cpu} virtual CPU{cpu > 1 ? 's' : ''},{' '}
            {mem} GB of memory, {accel === 'whpx' ? 'WHPX' : 'TCG'} on x86_64,
            with {isWin ? 'Windows' : 'Linux'} defaults for video, network and
            sound. It has no disks yet — you add the installer in Qemik.
          </p>
          <div className="mt-6 rounded-[18px] p-5" style={{ background: CARD }}>
            <Pill
              tone="lime"
              onClick={() => setSaved(downloadConfig({ os, mem, cpu, accel }))}
            >
              {saved ? 'Download again' : 'Download machine config'}
            </Pill>
            {saved && (
              <p
                className="mt-3 text-[12.5px]"
                style={{ color: ACC }}
                role="status"
              >
                Saved “{saved}.qemik.json”.
              </p>
            )}
            <ol className="mt-5 grid gap-2 text-[13.5px] leading-[1.5]">
              {[
                'Open Qemik › Preferences › Import configuration and choose the file.',
                'Review the settings Qemik opens, then save the machine.',
                isWin
                  ? 'In Drives, attach a Windows ISO from Microsoft.'
                  : `Get ${os} from Download an OS and attach it to the machine.`,
                'Start it and follow the installer.',
              ].map((t, i) => (
                <li key={t} className="flex gap-3">
                  <span
                    className="shrink-0 w-6 h-6 rounded-full text-[11px] flex items-center justify-center"
                    style={{ border: `1px solid ${LINE}` }}
                  >
                    {i + 1}
                  </span>
                  {t}
                </li>
              ))}
            </ol>
          </div>
          <p className="mt-8 text-[14px]">Need the app first?</p>
          <GetApp />
          <button
            type="button"
            onClick={onClose}
            className="mt-8 text-[13px] underline underline-offset-4"
            style={{ color: DIM }}
          >
            Keep exploring Qemik
          </button>
        </>
      </div>
    );

  return (
    <div className="pt-12">
      <p className="text-[12px]" style={{ color: DIM }}>
        Set up a machine · optional
      </p>
      <h2 className="mt-3 text-[34px] md:text-[44px] leading-[1] tracking-[-0.035em]">
        Make it yours and boot one of our—machines
      </h2>
      <p className="mt-4 text-[14px] leading-[1.55]" style={{ color: DIM }}>
        Pick a system and the hardware, and take home a configuration file Qemik
        can import. Or skip all of it.
      </p>
      <a
        href={cfg.releases}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 h-10 pl-4 pr-1.5 rounded-full inline-flex items-center gap-2.5 text-[13.5px]"
        style={{ border: `1px solid ${ACC}`, color: ACC }}
      >
        Skip — just get the app
        <span
          className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: ACC, color: ON_ACC }}
        >
          <ArrowUpRightIcon size={13} weight="bold" />
        </span>
      </a>

      {step === 0 && (
        <div className="mt-8">
          <p className="text-[14px]">(1) Which system would you like to run?</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {w.systems.map((s) => (
              <Choice key={s} on={s === os} onClick={() => setOs(s)}>
                {s}
              </Choice>
            ))}
          </div>
          <p
            className="mt-4 text-[12.5px] leading-[1.5]"
            style={{ color: DIM }}
          >
            {isWin
              ? 'Windows uses an ISO you download from Microsoft; Qemik attaches it for you.'
              : `${os} comes straight from Download an OS: publisher metadata, a verified download and a mounted installer.`}
          </p>
        </div>
      )}
      {step === 1 && (
        <div className="mt-8 grid gap-6">
          <div>
            <p className="text-[14px]">(2) How much memory?</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {w.memory.map((m) => (
                <Choice key={m} on={m === mem} onClick={() => setMem(m)}>
                  {m} GB
                </Choice>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[14px]">(3) How many virtual CPUs?</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {w.cpus.map((c) => (
                <Choice key={c} on={c === cpu} onClick={() => setCpu(c)}>
                  {c} CPU{c > 1 ? 's' : ''}
                </Choice>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[14px]">(4) Acceleration</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Choice on={accel === 'tcg'} onClick={() => setAccel('tcg')}>
                TCG · works everywhere
              </Choice>
              <Choice on={accel === 'whpx'} onClick={() => setAccel('whpx')}>
                WHPX · faster
              </Choice>
            </div>
            <p
              className="mt-3 text-[12.5px] leading-[1.5]"
              style={{ color: DIM }}
            >
              WHPX needs Windows Hypervisor Platform turned on and a QEMU build
              with WHPX support. You can switch later in System settings.
            </p>
          </div>
        </div>
      )}

      <div
        className="mt-10 rounded-[18px] p-5 grid grid-cols-2 gap-4"
        style={{ background: CARD }}
      >
        {[
          ['Machine', isWin ? 'Windows Sandbox' : `${os} Workspace`],
          ['Hardware', `${cpu} CPU · ${mem} GB`],
          ['Acceleration', `${accel === 'whpx' ? 'WHPX' : 'TCG'} · x86_64`],
          ['Cost', '0 USD'],
        ].map(([k, v]) => (
          <div key={k}>
            <p className="text-[12px]" style={{ color: DIM }}>
              {k}
            </p>
            <p className="mt-1 text-[18px]">{v}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 flex gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="h-11 px-5 rounded-full text-[14px]"
            style={{ border: `1px solid ${LINE}` }}
          >
            Back
          </button>
        )}
        <Pill tone="lime" onClick={() => setStep(step + 1)}>
          {step === 1 ? 'Make the config' : 'Next'}
        </Pill>
      </div>
    </div>
  );
};

/* ---------- horizontal, draggable settings cards ---------- */

const DragRail = ({ cards, onCta }) => {
  const ref = useRef(null);
  const [at, setAt] = useState(0);
  const drag = useRef(null);
  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAt(max > 0 ? el.scrollLeft / max : 0);
  };
  return (
    <div>
      <div
        ref={ref}
        onScroll={onScroll}
        onPointerDown={(e) => {
          if (e.pointerType !== 'mouse') return;
          drag.current = { x: e.clientX, s: ref.current.scrollLeft };
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          ref.current.scrollLeft =
            drag.current.s - (e.clientX - drag.current.x);
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerLeave={() => {
          drag.current = null;
        }}
        className="flex gap-3 overflow-x-auto px-2 pb-2 cursor-grab active:cursor-grabbing select-none"
        style={{ scrollbarWidth: 'none' }}
      >
        {cards.map((c, i) => (
          <article
            key={c.title}
            className="relative shrink-0 w-[86vw] sm:w-[62vw] lg:w-[44vw] h-[70svh] min-h-[460px] rounded-[26px] overflow-hidden"
          >
            <Aurora strong={i % 2 === 1} />
            <img
              src={c.image}
              alt=""
              draggable={false}
              className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-[84%] rounded-[14px] pointer-events-none"
              style={{ boxShadow: '0 30px 70px rgba(0,0,0,0.65)' }}
              loading="lazy"
            />
            <div
              className="absolute inset-x-0 top-0 p-5 md:p-6 flex justify-between items-start"
              style={{
                background:
                  'linear-gradient(180deg, rgba(5,8,7,0.7), transparent)',
              }}
            >
              <h3
                className="text-[26px] md:text-[30px] leading-[1.02] tracking-[-0.03em] whitespace-pre-line"
                style={{ ...HOST, color: CREAM }}
              >
                {c.title}
              </h3>
              <span
                className="h-7 px-3 rounded-full text-[11.5px] inline-flex items-center"
                style={{ border: `1px solid ${CREAM}`, color: CREAM }}
              >
                {c.level}
              </span>
            </div>
            <div
              className="absolute inset-x-0 bottom-0 p-5 md:p-6 flex items-end justify-between gap-4"
              style={{
                background:
                  'linear-gradient(180deg, transparent, rgba(5,8,7,0.85))',
              }}
            >
              <p
                className="max-w-[40ch] text-[12.5px] leading-[1.45]"
                style={{ ...HOST, color: CREAM }}
              >
                {c.body}
              </p>
              <span className="text-[12px] shrink-0" style={{ color: DIM }}>
                {String(i + 1).padStart(2, '0')} /{' '}
                {String(cards.length).padStart(2, '0')}
              </span>
            </div>
          </article>
        ))}
        <article
          className="shrink-0 w-[70vw] sm:w-[40vw] lg:w-[28vw] h-[70svh] min-h-[460px] rounded-[26px] p-7 flex flex-col justify-between"
          style={{ background: ACC, color: ON_ACC }}
        >
          <p
            className="text-[34px] leading-[1] tracking-[-0.035em]"
            style={HOST}
          >
            Every setting,
            <br />
            one page each.
          </p>
          <button
            type="button"
            onClick={onCta}
            className="h-12 px-6 rounded-full text-[14px] font-medium self-start inline-flex items-center gap-2"
            style={{ background: ON_ACC, color: ACC }}
          >
            Configure a machine <ArrowRightIcon size={14} weight="bold" />
          </button>
        </article>
      </div>
      <div className="mx-2 mt-5 h-px relative" style={{ background: LINE }}>
        <div
          className="absolute top-0 left-0 h-px transition-all"
          style={{ width: `${Math.max(12, at * 100)}%`, background: CREAM }}
        />
      </div>
    </div>
  );
};

/* ============================================================ */

const SECTIONS = [
  ['#welcome', 'Welcome'],
  ['#introduction', 'Introduction'],
  ['#machines', 'Machines'],
  ['#why', 'Why Qemik®'],
  ['#settings', 'Settings'],
  ['#words', 'In its words'],
];

const CapsulesProjectPage = () => {
  const { cfg, failed, project, loading } = useAppConfig();
  useThemeFonts(FONTS, 'capsules');
  const [menu, setMenu] = useState(false);
  const [drawer, setDrawer] = useState(null); // { kind: 'wizard' | 'details', i, preset }
  const [quote, setQuote] = useState(0);
  const [rule, setRule] = useState(null);

  if (loading) return <AppLoading />;
  if (failed || !cfg) return <AppMissing background={BG} color={CREAM} />;

  const openWizard = (preset) => {
    setMenu(false);
    setDrawer({ kind: 'wizard', preset });
  };
  const m = drawer?.kind === 'details' ? cfg.machines[drawer.i] : null;
  const presetFor = (mc) => ({
    os: mc.name.startsWith('Windows') ? 'Windows' : 'Ubuntu',
    mem:
      parseInt(
        (mc.details.find((d) => d[0] === 'Memory') || [0, '4'])[1],
        10,
      ) || 4,
    cpu:
      parseInt((mc.details.find((d) => d[0] === 'CPUs') || [0, '2'])[1], 10) ||
      2,
  });

  return (
    <div
      className="min-h-screen overflow-x-clip"
      style={{ background: BG, color: CREAM, ...HOST }}
    >
      <AppSeo cfg={cfg} project={project} />

      {/* ---------- floating chrome: back, CTA, Menu pill ---------- */}
      <Link
        to="/projects"
        className="fixed left-5 top-5 z-[110] h-9 px-3.5 rounded-full inline-flex items-center gap-1.5 text-[12.5px]"
        style={{
          background: 'rgba(17,19,16,0.55)',
          color: CREAM,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${LINE}`,
        }}
      >
        <ArrowLeftIcon size={12} /> Projects
      </Link>
      <div className="fixed right-5 top-5 z-[110]">
        <Pill tone="cream" size="sm" href={cfg.releases}>
          Get Qemik
        </Pill>
      </div>
      <button
        type="button"
        onClick={() => setMenu(true)}
        className="fixed left-1/2 bottom-5 -translate-x-1/2 z-[110] h-11 pl-5 pr-1.5 rounded-full inline-flex items-center gap-3 text-[13px] font-medium"
        style={{
          background: CREAM,
          color: BG,
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.6)',
        }}
        aria-haspopup="dialog"
      >
        Menu
        <span
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: BG, color: CREAM }}
        >
          <ListIcon size={14} weight="bold" />
        </span>
      </button>

      <AnimatePresence>
        {menu && (
          <motion.div
            className="fixed inset-0 z-[130] flex items-end justify-center p-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 w-full h-full cursor-default"
              style={{
                background: 'rgba(5,8,7,0.55)',
                backdropFilter: 'blur(6px)',
              }}
              onClick={() => setMenu(false)}
              aria-label="Close menu"
            />
            <motion.nav
              className="relative w-full max-w-[520px] rounded-[26px] p-6"
              style={{ background: CREAM, color: BG }}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              aria-label="Sections"
            >
              <ul>
                {SECTIONS.map(([h, l]) => (
                  <li key={h}>
                    <a
                      href={h}
                      onClick={() => setMenu(false)}
                      className="flex items-center justify-between py-2.5 text-[30px] tracking-[-0.03em] leading-none hover:opacity-60"
                      style={{ borderBottom: '1px solid rgba(17,19,16,0.1)' }}
                    >
                      {l} <ArrowUpRightIcon size={18} />
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => openWizard()}
                  className="h-12 px-6 rounded-full text-[14px] font-medium"
                  style={{ background: BG, color: ACC }}
                >
                  Set up a machine
                </button>
                <a
                  href={cfg.releases}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 px-6 rounded-full text-[14px] inline-flex items-center gap-2"
                  style={{ border: '1px solid rgba(17,19,16,0.2)' }}
                >
                  <GithubLogoIcon size={15} /> Download from Releases
                </a>
                <button
                  type="button"
                  onClick={() => setMenu(false)}
                  className="h-12 px-5 rounded-full text-[14px] ml-auto"
                  style={{ border: '1px solid rgba(17,19,16,0.2)' }}
                >
                  Close
                </button>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      <Drawer
        open={!!drawer}
        onClose={() => setDrawer(null)}
        label={
          drawer?.kind === 'wizard' ? 'Set up a machine' : 'Machine details'
        }
      >
        {drawer?.kind === 'wizard' && (
          <Wizard
            cfg={cfg}
            preset={drawer.preset}
            onClose={() => setDrawer(null)}
          />
        )}
        {m && (
          <div className="pt-12">
            <p className="text-[12px]" style={{ color: DIM }}>
              Details
            </p>
            <p className="mt-1 text-[13px]" style={{ color: DIM }}>
              ({m.name}®)
            </p>
            <p className="mt-6 text-[26px] leading-[1.1] tracking-[-0.025em]">
              {m.blurb}
            </p>
            <dl className="mt-8">
              {m.details.map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between py-3 text-[15px]"
                  style={{ borderBottom: `1px solid ${LINE}` }}
                >
                  <dt style={{ color: DIM }}>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <div
              className="mt-8 rounded-[18px] p-5 flex items-center justify-between gap-4"
              style={{ background: CARD }}
            >
              <span>
                <span className="block text-[12px]" style={{ color: DIM }}>
                  Ready to start?
                </span>
                <span className="block mt-1 text-[20px]">{m.cost}</span>
              </span>
              <Pill
                tone="lime"
                onClick={() =>
                  setDrawer({ kind: 'wizard', preset: presetFor(m) })
                }
              >
                Set it up
              </Pill>
            </div>
          </div>
        )}
      </Drawer>

      {/* ---------- hero card ---------- */}
      <section id="welcome" className="p-2">
        <div className="relative h-[calc(100svh-16px)] min-h-[560px] rounded-[28px] overflow-hidden">
          <Aurora strong />
          <div className="absolute right-[-10%] md:right-[5%] top-1/2 -translate-y-1/2 w-[80vw] md:w-[40vw] max-w-[680px] aspect-square">
            <motion.img
              src={cfg.hero.image}
              alt="Qemik's icon: an ivory Q with a bone for a tail"
              className="w-full h-full rounded-[22%]"
              initial={{ opacity: 0, scale: 0.9, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              style={{
                boxShadow:
                  '0 60px 120px rgba(0,0,0,0.55), 0 0 0 1px rgba(237,242,234,0.08)',
              }}
            />
          </div>
          <h1
            className="absolute left-4 md:left-6 top-14 md:top-0 leading-[0.86] tracking-[-0.06em] font-normal"
            style={{
              ...HOST,
              fontSize: 'clamp(96px, 17vw, 300px)',
              color: CREAM,
            }}
          >
            <Masked text={cfg.hero.wordmark} now />
            <sup className="text-[0.14em] align-top ml-1 relative top-[0.9em]">
              ®
            </sup>
          </h1>
          <span
            className="absolute left-5 md:left-6 bottom-[92px] md:bottom-[96px] h-7 px-3 rounded-full text-[11px] hidden md:inline-flex items-center"
            style={{
              border: `1px solid ${LINE}`,
              color: CREAM,
              background: 'rgba(5,8,7,0.3)',
            }}
          >
            {cfg.status} · v{cfg.version} · Windows x64
          </span>
          <p
            className="absolute left-5 md:left-6 bottom-24 md:bottom-6 text-[20px] md:text-[26px] leading-[1.05] tracking-[-0.02em] whitespace-pre-line"
            style={{ color: CREAM }}
          >
            {cfg.hero.corner}
          </p>
          <div className="absolute right-5 md:right-6 bottom-44 md:bottom-6 flex flex-col items-end gap-3">
            <Tiny className="text-right max-w-[26ch]">{cfg.hero.note}</Tiny>
            <Pill tone="lime" size="md" onClick={() => openWizard()}>
              Set up your first machine
            </Pill>
          </div>
        </div>
      </section>

      {/* ---------- intro ---------- */}
      <section id="introduction" className="px-4 md:px-6 pt-28 md:pt-40 pb-20">
        <div className="max-w-[1100px] ml-auto">
          <InkParagraph text={cfg.intro.lead} />
        </div>
        <div className="mt-20 grid md:grid-cols-[1fr_1fr] gap-10 items-end">
          <div className="flex gap-3">
            {cfg.intro.thumbs.map((t) => (
              <Rise key={t}>
                <img
                  src={t}
                  alt=""
                  className="w-[42vw] md:w-[18vw] aspect-[16/10] object-cover object-left-top rounded-full"
                  style={{ border: `1px solid ${LINE}` }}
                  loading="lazy"
                />
              </Rise>
            ))}
          </div>
          <div className="md:justify-self-end max-w-[380px]">
            {cfg.intro.aside.map((a) => (
              <p
                key={a}
                className="text-[17px] leading-[1.25]"
                style={{ color: CREAM }}
              >
                {a}
              </p>
            ))}
            <div className="mt-6">
              <Pill tone="ghost" size="sm" href="#machines">
                Discover available machines
              </Pill>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- choose ---------- */}
      <section className="px-4 md:px-6 pt-16">
        <h2 className="text-[56px] sm:text-[88px] md:text-[128px] leading-[0.9] tracking-[-0.055em]">
          <Masked text={cfg.choose.title} />
        </h2>
        <div className="mt-12 grid md:grid-cols-[1fr_1.2fr_auto] gap-8 items-start">
          <p className="max-w-[40ch] text-[16px] leading-[1.35]">
            {cfg.choose.body}
          </p>
          <div>
            <Tiny>{cfg.choose.rulesLabel}</Tiny>
            <div className="mt-3 flex flex-wrap gap-2">
              {cfg.choose.rules.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRule(rule === r ? null : r)}
                  aria-pressed={rule === r}
                  className="h-10 px-4 rounded-full text-[15px] transition-colors"
                  style={
                    rule === r
                      ? { background: ACC, color: ON_ACC }
                      : { border: `1px solid ${LINE}`, color: CREAM }
                  }
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <Pill tone="cream" onClick={() => openWizard()}>
            Choose yours
          </Pill>
        </div>
      </section>

      <GrowBand image="/images/projects/qemik/library.webp" word={cfg.name} />

      {/* ---------- machines ---------- */}
      <section id="machines" className="relative">
        {cfg.machines.map((mc, i) => (
          <MachineCard
            key={mc.name}
            m={mc}
            i={i}
            n={cfg.machines.length}
            onDetails={(k) => setDrawer({ kind: 'details', i: k })}
          />
        ))}
      </section>

      {/* ---------- steps ---------- */}
      <section className="px-4 md:px-6 pt-32 md:pt-44 pb-20 text-center">
        <Tiny className="mb-6">{cfg.steps.eyebrow}</Tiny>
        <h2 className="mx-auto max-w-[18ch] text-[38px] md:text-[64px] leading-[1.02] tracking-[-0.04em]">
          {cfg.steps.title}{' '}
          <a
            href="#steps"
            className="underline decoration-2 underline-offset-[0.12em]"
            style={{ color: DIM }}
          >
            {cfg.steps.link}
          </a>
        </h2>
        <ol id="steps" className="mt-16 mx-auto max-w-[980px] text-left">
          {cfg.steps.items.map(([t, b], i) => (
            <Rise key={t} delay={i * 0.05}>
              <li
                className="grid grid-cols-[48px_1fr] md:grid-cols-[80px_1fr_1.4fr] gap-4 py-6"
                style={{ borderTop: `1px solid ${LINE}` }}
              >
                <span className="text-[14px]" style={{ color: DIM }}>
                  0{i + 1}
                </span>
                <span className="text-[24px] md:text-[30px] leading-[1.05] tracking-[-0.03em]">
                  {t}
                </span>
                <span
                  className="col-start-2 md:col-start-auto text-[14.5px] leading-[1.5]"
                  style={{ color: DIM }}
                >
                  {b}
                </span>
              </li>
            </Rise>
          ))}
        </ol>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Pill tone="lime" onClick={() => openWizard()}>
            Start step one
          </Pill>
          <Pill tone="ghost" href="#build">
            Build from source
          </Pill>
        </div>
      </section>

      {/* ---------- why ---------- */}
      <section id="why" className="pt-24">
        <Tiny className="px-4 md:px-6 mb-6 max-w-[24ch]">
          {cfg.why.eyebrow}
        </Tiny>
        <Marquee text={`${cfg.why.marquee}`} speed={34} />
        <div className="mt-10 px-2 grid gap-2">
          {cfg.why.cards.map((c, i) => (
            <div
              key={c.title}
              className="sticky top-2 grid md:grid-cols-2 gap-2"
              style={{ zIndex: i + 1 }}
            >
              <div
                className="rounded-[26px] p-6 md:p-8 min-h-[44svh] md:h-[80svh] flex flex-col justify-between"
                style={{ background: CARD }}
              >
                <h3 className="text-[32px] md:text-[48px] leading-[1] tracking-[-0.04em] whitespace-pre-line">
                  {c.title}
                </h3>
                <div className="flex items-end justify-between gap-4">
                  <span className="flex gap-1.5">
                    {cfg.why.cards.map((_, k) => (
                      <span
                        key={k}
                        className="w-8 h-8 rounded-full text-[11px] flex items-center justify-center"
                        style={
                          k === i
                            ? { background: CREAM, color: BG }
                            : { border: `1px solid ${LINE}`, color: DIM }
                        }
                      >
                        0{k + 1}
                      </span>
                    ))}
                  </span>
                  <p className="max-w-[34ch] text-[12.5px] leading-[1.45] text-right">
                    {c.body}
                  </p>
                </div>
              </div>
              <div className="relative rounded-[26px] overflow-hidden min-h-[40svh] md:h-[80svh]">
                <Aurora strong={i === 1} />
                <img
                  src={c.image}
                  alt=""
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[86%] rounded-[14px]"
                  style={{ boxShadow: '0 30px 70px rgba(0,0,0,0.6)' }}
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Pill tone="cream" onClick={() => openWizard()}>
            See it for yourself
          </Pill>
        </div>
      </section>

      {/* ---------- settings ---------- */}
      <section id="settings" className="pt-32 md:pt-44">
        <div className="px-4 md:px-6">
          <Tiny className="mb-4">{cfg.settings.eyebrow}</Tiny>
          <h2 className="text-[52px] sm:text-[84px] md:text-[120px] leading-[0.9] tracking-[-0.055em] max-w-[12ch]">
            <Masked text={cfg.settings.title} />
          </h2>
          <div className="mt-12 grid md:grid-cols-[300px_1fr] gap-10">
            <div>
              <Tiny>{cfg.settings.levelsLabel}</Tiny>
              <ul className="mt-4">
                {cfg.settings.levels.map(([l, d], i) => (
                  <li
                    key={l}
                    className="py-3"
                    style={{ borderBottom: `1px solid ${LINE}` }}
                  >
                    <span className="flex justify-between text-[15px]">
                      <span>{l}</span>
                      <span className="text-[11.5px]" style={{ color: DIM }}>
                        {d}
                      </span>
                    </span>
                    <span
                      className="mt-3 block h-px relative"
                      style={{ background: LINE }}
                    >
                      <motion.span
                        className="absolute left-0 top-0 h-px"
                        style={{ background: CREAM }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${[40, 70, 100][i]}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.1, delay: i * 0.15 }}
                      />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="max-w-[46ch] text-[20px] md:text-[24px] leading-[1.2] tracking-[-0.02em]">
              {cfg.settings.body}
            </p>
          </div>
        </div>
        <div className="mt-14">
          <DragRail cards={cfg.settings.cards} onCta={() => openWizard()} />
        </div>
      </section>

      {/* ---------- in its own words ---------- */}
      <section
        id="words"
        className="px-4 md:px-6 pt-32 md:pt-44 grid md:grid-cols-[1.3fr_1fr] gap-10 items-end"
      >
        <div>
          <Tiny className="mb-6">{cfg.quotes.eyebrow}</Tiny>
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={quote}
              className="text-[32px] md:text-[48px] leading-[1.05] tracking-[-0.035em] max-w-[22ch]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45 }}
            >
              “{cfg.quotes.items[quote].text}”
            </motion.blockquote>
          </AnimatePresence>
          <div className="mt-8 flex items-center gap-3">
            <img
              src="/images/projects/qemik/icon.png"
              alt=""
              className="w-10 h-10 rounded-full"
            />
            <span>
              <span className="block text-[13px]">
                {cfg.quotes.items[quote].who}
              </span>
              <span className="block text-[12px]" style={{ color: DIM }}>
                ({cfg.quotes.items[quote].where})
              </span>
            </span>
          </div>
          <div className="mt-8 flex items-center gap-2">
            {[-1, 1].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() =>
                  setQuote(
                    (q) =>
                      (q + d + cfg.quotes.items.length) %
                      cfg.quotes.items.length,
                  )
                }
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ border: `1px solid ${LINE}` }}
                aria-label={d < 0 ? 'Previous quote' : 'Next quote'}
              >
                {d < 0 ? (
                  <ArrowLeftIcon size={14} />
                ) : (
                  <ArrowRightIcon size={14} />
                )}
              </button>
            ))}
            <span
              className="ml-4 flex-1 max-w-[220px] h-px relative"
              style={{ background: LINE }}
            >
              <span
                className="absolute left-0 top-0 h-px transition-all duration-500"
                style={{
                  width: `${((quote + 1) / cfg.quotes.items.length) * 100}%`,
                  background: CREAM,
                }}
              />
            </span>
          </div>
        </div>
        <div id="build" className="scroll-mt-24">
          <Tiny className="mb-3">Or build it from source</Tiny>
          <CopyLines lines={cfg.build} />
          <div className="mt-4 flex flex-wrap gap-2">
            <Pill tone="lime" size="sm" href={cfg.releases}>
              Download
            </Pill>
            <Pill tone="ghost" size="sm" onClick={() => openWizard()}>
              Plan a machine
            </Pill>
          </div>
        </div>
      </section>

      {/* ---------- closing card + ribbon ---------- */}
      <section className="px-2 pt-32">
        <div className="relative h-[80svh] min-h-[480px] rounded-[28px] overflow-hidden flex items-center justify-center">
          <Aurora strong />
          <img
            src="/images/projects/qemik/os-catalog.webp"
            alt=""
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] max-w-[1000px] rounded-[16px] opacity-70"
            style={{ boxShadow: '0 40px 90px rgba(0,0,0,0.6)' }}
            loading="lazy"
          />
          <div className="relative text-center">
            <Pill tone="cream" href={cfg.releases}>
              Get Qemik
            </Pill>
            <p
              className="mt-6 leading-[0.86] tracking-[-0.06em]"
              style={{
                fontSize: 'clamp(90px, 16vw, 260px)',
                textShadow: '0 20px 60px rgba(0,0,0,0.5)',
              }}
            >
              qemik<sup className="text-[0.14em]">®</sup>
            </p>
          </div>
        </div>
        <Tiny className="px-4 md:px-6 mt-16 mb-4 whitespace-pre-line">
          {cfg.closing.eyebrow}
        </Tiny>
        <Marquee
          text={cfg.closing.marquee}
          speed={20}
          onClick={() => openWizard()}
        />
      </section>

      {/* ---------- footer ---------- */}
      <footer
        className="mt-16 pt-12"
        style={{ borderTop: `1px solid ${LINE}` }}
      >
        <div className="px-4 md:px-6 grid md:grid-cols-[1fr_auto] gap-10">
          <div>
            <p className="max-w-[40ch] text-[17px] leading-[1.3]">
              {cfg.footer.note}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Pill tone="lime" size="sm" href={cfg.releases}>
                Download from Releases
              </Pill>
              <Pill tone="ghost" size="sm" href="/projects/airlift">
                See Airlift
              </Pill>
              <Pill tone="ghost" size="sm" href="/projects/hisashi">
                Meet Hisashi
              </Pill>
            </div>
          </div>
          <ul className="text-[17px] leading-[1.25] md:text-right">
            {SECTIONS.map(([h, l]) => (
              <li key={h}>
                <a href={h} className="hover:opacity-60">
                  {l}
                </a>
              </li>
            ))}
            <li>
              <Link
                to="/projects"
                className="hover:opacity-60"
                style={{ color: DIM }}
              >
                All projects
              </Link>
            </li>
          </ul>
        </div>
        <div
          className="px-4 md:px-6 mt-14 flex flex-wrap justify-between gap-4 text-[11.5px] pb-6"
          style={{ color: DIM, borderBottom: `1px solid ${LINE}` }}
        >
          <span>
            Powered by{' '}
            <a
              href="https://www.qemu.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              style={{ color: CREAM }}
            >
              QEMU
            </a>{' '}
            · Inspired by{' '}
            <a
              href="https://getutm.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              style={{ color: CREAM }}
            >
              UTM
            </a>
          </span>
          <span className="whitespace-pre-line text-right">
            {cfg.footer.blurb}
          </span>
          <span>
            Page design after{' '}
            <a
              href="https://capsules.moyra.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              style={{ color: CREAM }}
            >
              Capsules by Moyra
            </a>{' '}
            · © {new Date().getFullYear()} Fezcode
          </span>
        </div>
        <p
          className="px-2 leading-[0.8] tracking-[-0.065em] select-none pb-16"
          aria-hidden
          style={{
            fontSize: 'clamp(120px, 30vw, 520px)',
            background: `linear-gradient(180deg, ${CREAM} 20%, ${BG} 100%)`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          qemik<span className="text-[0.14em] align-top">®</span>
        </p>
      </footer>
    </div>
  );
};

export default CapsulesProjectPage;
