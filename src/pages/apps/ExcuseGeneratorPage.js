import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, CopySimple, DiceFive } from '@phosphor-icons/react';
import useSeo from "../../hooks/useSeo";

const excuses = {
  late: [
    "My cat achieved sentience and demanded a philosophical debate on the nature of time.",
    "I was abducted by aliens, but they returned me after realizing I had no marketable skills.",
    "A rogue squirrel declared war on my shoelaces.",
    "I got stuck in a time loop and had to relive the same 5 minutes until I found the perfect outfit.",
    "My coffee machine staged a protest against early mornings.",
    "I accidentally joined a flash mob and couldn't find my way out.",
    "The traffic was unusually heavy due to a parade of very slow snails.",
    "I was helping a lost unicorn find its way back to its dimension.",
    "My alarm clock started playing interpretive dance music instead of ringing.",
    "I had to wrestle a giant rubber duck for control of the bathtub.",
    "I was momentarily trapped in a parallel dimension where socks only have one match.",
    "My pet rock needed emotional support after a bad dream.",
    "I overslept because my dreams were in 4K and I wanted to see the ending.",
    "A flock of geese stole my car keys and demanded a ransom of artisanal bread.",
    "I was busy perfecting my invisibility cloak, and it worked a little too well.",
    "My reflection challenged me to a dance-off, and I couldn't back down.",
    "I encountered a philosophical paradox while tying my shoes.",
    "My house spontaneously decided to redecorate itself, and I had to supervise.",
    "I was performing an emergency rescue of a tiny ant from a puddle.",
    "My internal clock is currently set to 'island time'.",
  ],
  work: [
    "My computer developed a personality and refused to cooperate.",
    "I was busy training a team of highly intelligent pigeons to deliver urgent messages.",
    "The internet went down because a rogue AI decided to play hide-and-seek with the servers.",
    "I spent all morning trying to teach my goldfish to code.",
    "My keyboard spontaneously combusted due to excessive typing of brilliant ideas.",
    "I was caught in a philosophical discussion with my stapler about its existential purpose.",
    "A flock of geese mistook my office for their annual migration stop.",
    "My monitor started displaying only cat memes, and I couldn't look away.",
    "I accidentally formatted my brain instead of my hard drive.",
    "I was performing emergency surgery on a broken coffee mug.",
    "My mouse ran away to join the circus, and I had to track it down.",
    "I was debugging a quantum entanglement issue in my coffee maker.",
    "My office plant started giving me unsolicited life advice, and I had to listen.",
    "I got into a staring contest with a blank document and lost.",
    "My productivity was severely hampered by a sudden urge to reorganize my sock drawer.",
    "I was busy translating ancient hieroglyphs found on my whiteboard.",
    "My chair achieved sentience and demanded a union contract.",
    "I was trapped in a spreadsheet vortex, unable to escape.",
    "My brain decided to take an unscheduled coffee break without me.",
    "I was trying to communicate with my printer using interpretive dance.",
  ],
  school: [
    "My dog ate my homework, then asked for seconds.",
    "I was busy conducting a scientific experiment on the optimal napping position.",
    "My textbook spontaneously transformed into a graphic novel, and I got engrossed.",
    "I accidentally joined a secret society dedicated to the preservation of forgotten memes.",
    "My pen ran out of ink because it was writing a novel in my dreams.",
    "I was helping a group of sentient dust bunnies unionize.",
    "The school Wi-Fi was so slow, I aged three years waiting for a page to load.",
    "My backpack declared independence and ran away with my assignments.",
    "I was trying to prove the existence of parallel universes using only a calculator and a rubber band.",
    "My brain decided to major in procrastination today.",
  ],
  partner: [
    "I was busy fighting a dragon in my dreams, and I needed my beauty sleep to recover.",
    "My pet hamster started a cryptocurrency mining operation, and I had to supervise.",
    "I got lost in the labyrinth of your amazingness.",
    "My phone ran out of battery because it was trying to calculate how much I love you.",
    "I was abducted by a rogue pillow and forced into a cuddle marathon.",
    "I was trying to teach the cat to fetch, and it's a very demanding student.",
    "My brain cells were too busy thinking about you to remember anything else.",
    "I was performing an archaeological dig for the remote control.",
    "I accidentally ordered a lifetime supply of compliments for you, and they just arrived.",
    "I was busy practicing my 'surprise romantic gesture' for you, but it's a secret!",
  ],
  general: [
    "I'm currently in a witness protection program for my embarrassing dance moves.",
    "My spirit animal is a sloth, and it's having a particularly strong influence today.",
    "I'm allergic to responsibilities.",
    "I'm operating on a different timezone, specifically 'whenever-I-feel-like-it' time.",
    "My inner child threw a tantrum and demanded ice cream.",
    "I'm conducting a very important experiment on the gravitational pull of my couch.",
    "I'm currently in a staring contest with my reflection, and I'm losing.",
    "My brain cells are on strike for better working conditions.",
    "I'm pretty sure I left my motivation in another dimension.",
    "I'm practicing my invisibility skills, and I'm getting really good at it.",
    "I was abducted by a rogue thought and couldn't find my way back.",
    "My imaginary friend needed urgent emotional support.",
    "I'm currently in a deep philosophical debate with my toaster.",
    "I accidentally swapped bodies with a squirrel, and it took a while to switch back.",
    "My pet rock is going through an existential crisis, and I'm its therapist.",
    "I'm training for the 'Extreme Couch Potato' Olympics.",
    "I'm pretty sure my socks are plotting against me.",
    "I was busy deciphering the secret language of dust bunnies.",
    "My attention span is currently on vacation in the Bahamas.",
    "I'm in a committed relationship with my bed, and it's very demanding.",
  ],
};

const ExcuseGeneratorPage = () => {
  useSeo({
    title: 'Excuse Generator | Fezcodex',
    description: 'Generate funny and absurd excuses for any situation.',
    keywords: ['Fezcodex', 'excuse generator', 'funny excuses', 'absurd excuses', 'humor', 'random generator'],
    ogTitle: 'Excuse Generator | Fezcodex',
    ogDescription: 'Generate funny and absurd excuses for any situation.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Excuse Generator | Fezcodex',
    twitterDescription: 'Generate funny and absurd excuses for any situation.',
    twitterImage: 'https://fezcode.github.io/logo512.png'
  });

  const [currentExcuse, setCurrentExcuse] = useState("Click 'Generate Excuse' to get started!");
  const [selectedCategory, setSelectedCategory] = useState('general');

  const generateExcuse = () => {
    const categoryExcuses = excuses[selectedCategory];
    const randomIndex = Math.floor(Math.random() * categoryExcuses.length);
    setCurrentExcuse(categoryExcuses[randomIndex]);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentExcuse)
      .then(() => {
        // In a real app, you might add a toast notification here
        console.log('Excuse copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy excuse: ', err);
      });
  };

  const buttonStyle = `px-6 py-2 rounded-md text-lg font-arvo font-normal transition-colors duration-300 ease-in-out border bg-tb text-app border-app-alpha-50 hover:bg-app/15`;

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-gray-300">
        <Link
          to="/apps"
          className="text-article hover:underline flex items-center justify-center gap-2 text-lg mb-4"
        >
          <ArrowLeftIcon size={24} /> Back to Apps
        </Link>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-4 flex items-center">
          <span className="codex-color">fc</span>
          <span className="separator-color">::</span>
          <span className="apps-color">apps</span>
          <span className="separator-color">::</span>
          <span className="single-app-color">excuse</span>
        </h1>
        <hr className="border-gray-700" />
        <div className="flex justify-center items-center mt-16">
          <div
            className="group bg-transparent border rounded-lg shadow-2xl p-6 flex flex-col justify-between relative overflow-hidden h-full w-full max-w-4xl"
            style={{
              backgroundColor: 'var(--app-alpha-10)',
              borderColor: 'var(--app-alpha-50)',
              color: 'var(--app)',
            }}
          >
            <div
              className="absolute top-0 left-0 w-full h-full opacity-10"
              style={{
                backgroundImage:
                  'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '10px 10px',
              }}
            ></div>
            <div className="relative z-10 p-1">
              <h1 className="text-3xl font-arvo font-normal mb-4 text-app"> Excuse Generator </h1>
              <hr className="border-gray-700 mb-4" />

              <div className="mb-6">
                <label htmlFor="category-select" className="block text-lg font-semibold mb-2 text-app">
                  Select Category:
                </label>
                <select
                  id="category-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
                >
                  {Object.keys(excuses).map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col items-center justify-center mb-6 p-4 bg-gray-800/50 rounded-md min-h-[120px]">
                <p className="text-xl text-center font-normal text-app-light">{currentExcuse}</p>
              </div>

              <div className="flex justify-center gap-4">
                <button onClick={generateExcuse} className={`${buttonStyle} flex items-center gap-2`}>
                  <DiceFive size={24} /> Generate Excuse
                </button>
                <button onClick={copyToClipboard} className={`${buttonStyle} flex items-center gap-2`}>
                  <CopySimple size={24} /> Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcuseGeneratorPage;
