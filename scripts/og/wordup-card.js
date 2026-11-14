import piml from 'piml';
import { createSculptureScene } from '../../src/pages/wordup/sculptureScene.js';

const parts = {
  noun: 'isim',
  verb: 'fiil',
  adjective: 'sıfat',
  adverb: 'zarf',
  phrase: 'söz öbeği',
  interjection: 'ünlem',
};

async function renderCard() {
  const slug = new URL(window.location.href).searchParams.get('slug');
  const response = await fetch('/wordup/words.piml');
  if (!response.ok) throw new Error('Word registry could not be loaded.');
  const words = (piml.parse(await response.text()).words || []).filter(
    (word) => word.word && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(word.slug),
  );
  const word = slug ? words.find((entry) => entry.slug === slug) : null;
  if (slug && !word) throw new Error('This word is not registered.');
  const card = document.getElementById('card');
  const title = document.getElementById('title');
  const meaning = document.getElementById('meaning');
  const seed = word?.word || 'wordup';
  if (word) {
    const isTurkish = word.language === 'tr';
    document.documentElement.lang = isTurkish ? 'tr' : 'en';
    title.textContent = word.word;
    title.lang = word.language;
    meaning.textContent = isTurkish
      ? word.translation || word.definition || ''
      : word.definition || '';
    meaning.lang = isTurkish && word.translation ? 'tr' : 'en';
    const meta = document.getElementById('word-meta');
    for (const label of [
      isTurkish ? 'Türkçe' : 'English',
      isTurkish
        ? parts[word.partOfSpeech] || word.partOfSpeech
        : word.partOfSpeech,
    ].filter(Boolean)) {
      const tag = document.createElement('span');
      tag.textContent = label;
      meta.append(tag);
    }
    document.getElementById('header-note').textContent = isTurkish
      ? 'Dil hâlâ şekilleniyor.'
      : 'Language is still becoming.';
    document.getElementById('footer-note').textContent = isTurkish
      ? 'Uydurma bir kelime. Gerçek bir karşılık.'
      : 'An invented word. A real connection.';
    document.getElementById('page-url').textContent =
      'fezcode.com/wordup/' + word.slug;
  } else {
    card.classList.add('card--index');
    title.textContent = 'wordup';
    const dot = document.createElement('span');
    dot.textContent = '.';
    title.append(dot);
    meaning.textContent =
      'A living lexicon of invented Turkish & English words.';
    const collection = document.getElementById('collection');
    for (const entry of words.slice(0, 3)) {
      const label = document.createElement('span');
      label.textContent = entry.word;
      label.lang = entry.language;
      collection.append(label);
    }
  }
  await document.fonts.ready;
  if (!document.fonts.check('400 24px "Instrument Sans"'))
    throw new Error('Instrument Sans did not load.');
  if (word) {
    for (let size = 112; size >= 40; size -= 2) {
      title.style.fontSize = size + 'px';
      if (title.scrollWidth <= title.clientWidth && title.clientHeight <= 135)
        break;
    }
    for (let size = 25; size >= 18; size -= 1) {
      meaning.style.fontSize = size + 'px';
      if (meaning.clientHeight <= 138) break;
    }
  }
  const canvas = document.getElementById('sculpture');
  const studio = createSculptureScene({
    seed,
    canvas,
    width: 650,
    height: 600,
    pixelRatio: 2,
    preserveDrawingBuffer: true,
  });
  studio.render(0);
  await new Promise(requestAnimationFrame);
  studio.render(0);
  document.documentElement.dataset.ogSeed = studio.parameters.identity;
  document.documentElement.dataset.ogFamily = studio.parameters.family;
  document.documentElement.dataset.ogReady = 'true';
  window.addEventListener('pagehide', () => studio.dispose(), { once: true });
}

renderCard().catch((error) => {
  document.documentElement.dataset.ogError = error.message;
  const message = document.createElement('p');
  message.className = 'error';
  message.textContent = error.message;
  document.getElementById('card').replaceChildren(message);
  console.error(error);
});
