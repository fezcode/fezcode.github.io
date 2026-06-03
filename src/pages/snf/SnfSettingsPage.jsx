import React, { useEffect } from 'react';
import {
  MonitorIcon,
  TextTIcon,
  SpeakerHighIcon,
  GearSixIcon,
  ArrowCounterClockwiseIcon,
  PlayIcon,
} from '@phosphor-icons/react';
import SnfLayout from '../../components/snf/SnfLayout';
import {
  SnfPageHeader,
  SnfToggle,
  SnfSelect,
  SnfRange,
} from '../../components/snf/SnfPrimitives';
import Seo from '../../components/Seo';
import { useSnf } from '../../context/SnfContext';
import { playBeep } from '../../components/snf/snfSound';

/* --- small local building blocks --------------------------------------- */
const Group = ({ icon, title, children }) => (
  <section className="snf-panel snf-panel-bracket">
    <div className="snf-bar flex items-center gap-2.5 px-4 py-2.5">
      <span className="snf-phos-text">{icon}</span>
      <h2 className="snf-vt snf-phos-text text-lg tracking-wide">{title}</h2>
    </div>
    <div className="px-4 md:px-5 py-1">{children}</div>
  </section>
);

const Row = ({ label, hint, children, disabled }) => (
  <div
    className={`flex items-center justify-between gap-4 py-3.5 border-b border-[var(--snf-line)] last:border-0 ${
      disabled ? 'opacity-40 pointer-events-none' : ''
    }`}
  >
    <div className="min-w-0">
      <div className="snf-mono text-xs uppercase tracking-[0.14em] text-[var(--snf-ink)]">
        {label}
      </div>
      {hint && <div className="snf-mono text-[10px] snf-dim mt-0.5">{hint}</div>}
    </div>
    <div className="flex-none">{children}</div>
  </div>
);

const Segmented = ({ value, onChange, options }) => (
  <div className="flex border border-[var(--snf-line)]">
    {options.map((o) => (
      <button
        key={o.value}
        type="button"
        onClick={() => onChange(o.value)}
        className={`snf-mono text-[10px] uppercase tracking-[0.12em] px-3 py-1.5 transition-colors ${
          value === o.value
            ? 'bg-[rgba(var(--snf-phos-rgb),0.14)] text-[var(--snf-phos)]'
            : 'snf-dim hover:text-[var(--snf-phos)]'
        }`}
      >
        {o.label}
      </button>
    ))}
  </div>
);

const SnfSettingsPage = () => {
  const { settings, setSetting, toggle, resetSettings, language, setLanguage, setBreadcrumbs } =
    useSnf();

  useEffect(() => {
    setBreadcrumbs([{ label: 'SYSTEM CONFIG' }]);
  }, [setBreadcrumbs]);

  const blip = () => settings.beeps && playBeep(settings.volume);
  const change = (key, val) => {
    setSetting(key, val);
    blip();
  };
  const flip = (key) => {
    toggle(key);
    blip();
  };

  const replayBoot = () => {
    try {
      window.sessionStorage.removeItem('snf-booted');
    } catch {
      /* ignore */
    }
    window.location.assign('/snf');
  };

  const tr = language === 'tr';

  return (
    <SnfLayout>
      <Seo
        title="System Config | Serfs and Frauds Terminal"
        description="Configure every visual effect, CRT colour, typography and audio option of the Serfs and Frauds terminal."
        keywords={['serfs and frauds', 'settings', 'crt', 'configuration']}
      />
      <SnfPageHeader
        fileNo="SYS"
        label="TERMINAL CONFIGURATION"
        title={tr ? 'YAPILANDIRMA' : 'SYSTEM CONFIG'}
        subtitle={
          tr
            ? 'Her efekt anında uygulanır ve cihazınıza kaydedilir.'
            : 'Every change applies live and is saved to this device.'
        }
        icon={<GearSixIcon size={40} weight="duotone" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* DISPLAY */}
        <Group icon={<MonitorIcon size={18} weight="bold" />} title="DISPLAY">
          <Row label={tr ? 'CRT Rengi' : 'CRT Colour'} hint="phosphor tone">
            <SnfSelect
              value={settings.crt}
              onChange={(v) => change('crt', v)}
              options={[
                { value: 'amber', label: 'AMBER' },
                { value: 'green', label: 'GREEN' },
                { value: 'blue', label: 'BLUE' },
                { value: 'white', label: 'WHITE' },
              ]}
            />
          </Row>
          <Row label={tr ? 'Tarama Çizgileri' : 'Scanlines'} hint="CRT raster lines">
            <SnfToggle on={settings.scanlines} onChange={() => flip('scanlines')} label="scanlines" />
          </Row>
          <Row label={tr ? 'Çizgi Yoğunluğu' : 'Scan Intensity'} disabled={!settings.scanlines}>
            <Segmented
              value={settings.scanlineIntensity}
              onChange={(v) => change('scanlineIntensity', v)}
              options={[
                { value: 'low', label: 'LO' },
                { value: 'med', label: 'MID' },
                { value: 'high', label: 'HI' },
              ]}
            />
          </Row>
          <Row label={tr ? 'Titreme' : 'Flicker'} hint="screen instability">
            <SnfToggle on={settings.flicker} onChange={() => flip('flicker')} label="flicker" />
          </Row>
          <Row label={tr ? 'Fosfor Parıltısı' : 'Phosphor Glow'} hint="text bloom">
            <SnfToggle on={settings.glow} onChange={() => flip('glow')} label="glow" />
          </Row>
          <Row label={tr ? 'Renk Sapması' : 'Chromatic Aberration'} hint="RGB split">
            <SnfToggle on={settings.aberration} onChange={() => flip('aberration')} label="aberration" />
          </Row>
          <Row label={tr ? 'Eğrilik' : 'Curvature'} hint="screen bow + edge dark">
            <SnfToggle on={settings.curvature} onChange={() => flip('curvature')} label="curvature" />
          </Row>
          <Row label={tr ? 'Gren / Kir' : 'Grain / Grime'} hint="film noise">
            <SnfToggle on={settings.grain} onChange={() => flip('grain')} label="grain" />
          </Row>
          <Row label={tr ? 'Vinyet' : 'Vignette'}>
            <SnfToggle on={settings.vignette} onChange={() => flip('vignette')} label="vignette" />
          </Row>
          <Row label={tr ? 'Ekran Sarsıntısı' : 'Screen Shake'} hint="camera jitter + rotation">
            <SnfToggle on={settings.shake} onChange={() => flip('shake')} label="screen shake" />
          </Row>
          <Row label={tr ? 'Sarsıntı Şiddeti' : 'Shake Intensity'} disabled={!settings.shake}>
            <Segmented
              value={settings.shakeIntensity}
              onChange={(v) => change('shakeIntensity', v)}
              options={[
                { value: 'low', label: 'LO' },
                { value: 'med', label: 'MID' },
                { value: 'high', label: 'HI' },
              ]}
            />
          </Row>
        </Group>

        <div className="space-y-5">
          {/* TEXT */}
          <Group icon={<TextTIcon size={18} weight="bold" />} title="TEXT">
            <Row label={tr ? 'Okuma Yazı Tipi' : 'Reading Font'} hint="report body">
              <Segmented
                value={settings.readingFont}
                onChange={(v) => change('readingFont', v)}
                options={[
                  { value: 'terminal', label: tr ? 'TERM' : 'TERM' },
                  { value: 'document', label: tr ? 'BELGE' : 'DOC' },
                ]}
              />
            </Row>
            <Row label={tr ? 'Metin Boyutu' : 'Text Size'}>
              <Segmented
                value={settings.textSize}
                onChange={(v) => change('textSize', v)}
                options={[
                  { value: 'sm', label: 'S' },
                  { value: 'md', label: 'M' },
                  { value: 'lg', label: 'L' },
                ]}
              />
            </Row>
            <Row label={tr ? 'Şifre Çözme Efekti' : 'Decrypt Reveal'} hint="typewriter / scramble">
              <SnfToggle on={settings.decrypt} onChange={() => flip('decrypt')} label="decrypt" />
            </Row>
          </Group>

          {/* AUDIO */}
          <Group icon={<SpeakerHighIcon size={18} weight="bold" />} title="AUDIO">
            <Row label={tr ? 'Ortam Sesi' : 'Ambient Audio'} hint="synthesised — never autoplays">
              <SnfToggle on={settings.audio} onChange={() => flip('audio')} label="ambient audio" />
            </Row>
            <Row label={tr ? 'Kanal' : 'Channel'} disabled={!settings.audio}>
              <Segmented
                value={settings.audioTrack}
                onChange={(v) => change('audioTrack', v)}
                options={[
                  { value: 'hum', label: 'HUM' },
                  { value: 'rain', label: 'RAIN' },
                  { value: 'static', label: 'STAT' },
                ]}
              />
            </Row>
            <Row label={tr ? 'Ses Düzeyi' : 'Volume'} disabled={!settings.audio}>
              <SnfRange
                value={settings.volume}
                onChange={(v) => setSetting('volume', v)}
                min={0}
                max={1}
                step={0.05}
                className="w-32"
              />
            </Row>
            <Row label={tr ? 'Arayüz Bipleri' : 'UI Beeps'} hint="control feedback">
              <SnfToggle on={settings.beeps} onChange={() => flip('beeps')} label="ui beeps" />
            </Row>
          </Group>

          {/* SYSTEM */}
          <Group icon={<GearSixIcon size={18} weight="bold" />} title="SYSTEM">
            <Row label={tr ? 'Önyükleme Dizisi' : 'Boot Sequence'} hint="on terminal entry">
              <SnfToggle on={settings.boot} onChange={() => flip('boot')} label="boot sequence" />
            </Row>
            <Row label={tr ? 'Hareketi Azalt' : 'Reduced Motion'} hint="stops all animation">
              <SnfToggle on={settings.reducedMotion} onChange={() => flip('reducedMotion')} label="reduced motion" />
            </Row>
            <Row label={tr ? 'Dil' : 'Language'}>
              <Segmented
                value={language}
                onChange={(v) => {
                  setLanguage(v);
                  blip();
                }}
                options={[
                  { value: 'en', label: 'EN' },
                  { value: 'tr', label: 'TR' },
                ]}
              />
            </Row>
            <Row label={tr ? 'Önyüklemeyi Tekrar Oynat' : 'Replay Boot'}>
              <button type="button" onClick={replayBoot} className="snf-btn !px-3 !py-1.5 flex items-center gap-2">
                <PlayIcon size={13} weight="fill" /> RUN
              </button>
            </Row>
            <Row label={tr ? 'Varsayılanlara Sıfırla' : 'Reset to Defaults'}>
              <button
                type="button"
                onClick={() => {
                  resetSettings();
                  blip();
                }}
                className="snf-btn !px-3 !py-1.5 flex items-center gap-2"
              >
                <ArrowCounterClockwiseIcon size={13} weight="bold" /> RESET
              </button>
            </Row>
          </Group>
        </div>
      </div>
    </SnfLayout>
  );
};

export default SnfSettingsPage;
