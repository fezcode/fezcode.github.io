import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftIcon,
  LightbulbIcon,
  CaretRightIcon,
  CaretLeftIcon,
  CoffeeIcon,
  HeartIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import CoffeeStain from '../../components/CoffeeStain';

const COFFEE_TYPES = [
  {
    id: 'espresso',
    name: 'Classic Espresso',
    layers: [{ color: '#3E2723', height: 40, label: 'Pure Espresso', type: 'coffee' }],
    origin: 'Italy',
    temp: '94°C',
    ratio: '1:2',
    trivia: 'A perfect espresso has a "crema" – a creamy, reddish-brown froth on top.',
    description: 'The pure soul of coffee. Intense, bold, and brewed under high pressure for the ultimate kick.',
  },
  {
    id: 'latte',
    name: 'Creamy Latte',
    layers: [
      { color: '#3E2723', height: 20, label: 'Espresso Shot', type: 'coffee' },
      { color: '#F5F5F5', height: 60, label: 'Steamed Milk', type: 'milk' },
      { color: '#FFFFFF', height: 10, label: 'Silk Foam', type: 'foam' },
    ],
    origin: 'Europe',
    temp: '68°C',
    ratio: '1:3',
    trivia: 'Latte art is created by pouring microfoam into a shot of espresso.',
    description: 'A gentle balance of rich espresso and velvety steamed milk, finished with a delicate layer of foam.',
  },
  {
    id: 'cappuccino',
    name: 'Foamy Cappuccino',
    layers: [
      { color: '#3E2723', height: 33, label: 'Espresso Shot', type: 'coffee' },
      { color: '#F5F5F5', height: 33, label: 'Steamed Milk', type: 'milk' },
      { color: '#FFFFFF', height: 34, label: 'Mountain of Foam', type: 'foam' },
    ],
    origin: 'Italy',
    temp: '65°C',
    ratio: '1:1:1',
    trivia: 'Named after the Capuchin friars, as the color of the drink resembles their robes.',
    description: 'The perfect harmony of three: equal parts espresso, steamed milk, and airy foam.',
  },
  {
    id: 'flat-white',
    name: 'Silky Flat White',
    layers: [
      { color: '#3E2723', height: 40, label: 'Double Espresso', type: 'coffee' },
      { color: '#EDE0D4', height: 50, label: 'Velvet Microfoam', type: 'milk' },
    ],
    origin: 'Australia',
    temp: '62°C',
    ratio: '1:2',
    trivia: 'It’s all about the texture. The milk is "flat" because the bubbles are tiny and silky.',
    description: 'For those who love the strength of espresso but want the silkiness of perfectly textured milk.',
  },
  {
    id: 'americano',
    name: 'Smooth Americano',
    layers: [
      { color: '#3E2723', height: 30, label: 'Espresso Base', type: 'coffee' },
      { color: '#E0F7FA', height: 60, label: 'Hot Water', type: 'water' },
    ],
    origin: 'Italy/USA',
    temp: '90°C',
    ratio: '1:2',
    trivia: 'American soldiers in WWII diluted Italian espresso to mimic the coffee from back home.',
    description: 'A smooth, longer drink that lets the nuanced flavors of the espresso shine through.',
  },
  {
    id: 'turkish-coffee',
    name: 'Traditional Turkish',
    layers: [
      { color: '#2B1B17', height: 70, label: 'Rich Grounds', type: 'coffee' },
      { color: '#5D4037', height: 20, label: 'Golden Foam', type: 'foam' },
    ],
    origin: 'Turkey',
    temp: '92°C',
    ratio: '1:10',
    trivia: 'A cup of coffee is remembered for 40 years of friendship in Turkish culture.',
    description: 'Brewed in a cezve, this unfiltered treasure is famous for its thick foam and soul-warming intensity.',
  },
  {
    id: 'macchiato',
    name: 'Espresso Macchiato',
    layers: [
      { color: '#3E2723', height: 70, label: 'Espresso Base', type: 'coffee' },
      { color: '#FFFFFF', height: 20, label: 'Foam Spot', type: 'foam' },
    ],
    origin: 'Italy',
    temp: '90°C',
    ratio: '4:1',
    trivia: '"Macchiato" means "marked" or "stained." It’s an espresso marked with a small dollop of foam.',
    description: 'For those who want a bold espresso experience but with a touch of softness from a single mark of foam.',
  },
  {
    id: 'mocha',
    name: 'Velvet Mocha',
    layers: [
      { color: '#26160C', height: 20, label: 'Chocolate Syrup', type: 'coffee' },
      { color: '#3E2723', height: 20, label: 'Espresso Shot', type: 'coffee' },
      { color: '#F5F5F5', height: 40, label: 'Steamed Milk', type: 'milk' },
      { color: '#FFFFFF', height: 10, label: 'Whipped Cream', type: 'foam' },
    ],
    origin: 'Yemen/Italy',
    temp: '70°C',
    ratio: '1:1:2',
    trivia: 'The name "Mocha" comes from the Red Sea port city of Mocha in Yemen, once the center of the coffee trade.',
    description: 'The ultimate dessert-coffee. A rich, chocolatey embrace blended with deep espresso and smooth milk.',
  },
  {
    id: 'cortado',
    name: 'Balanced Cortado',
    layers: [
      { color: '#3E2723', height: 45, label: 'Espresso Base', type: 'coffee' },
      { color: '#EDE0D4', height: 45, label: 'Steamed Milk', type: 'milk' },
    ],
    origin: 'Spain',
    temp: '60°C',
    ratio: '1:1',
    trivia: '"Cortado" comes from the Spanish verb "cortar" (to cut), referring to the milk cutting through the espresso.',
    description: 'A perfect 1:1 ratio. It is designed to reduce the acidity of the espresso while keeping its bold character.',
  },
  {
    id: 'vienna',
    name: 'Vienna Coffee',
    layers: [
      { color: '#3E2723', height: 60, label: 'Black Coffee', type: 'coffee' },
      { color: '#FFFFFF', height: 30, label: 'Whipped Cream', type: 'foam' },
    ],
    origin: 'Austria',
    temp: '85°C',
    ratio: '2:1',
    trivia: 'In Vienna, this is known as "Einspänner," named after the one-horse carriages of old Vienna.',
    description: 'A sophisticated classic. Strong black coffee topped with a thick, cool layer of stiff whipped cream.',
  },
];

const PouringAnimation = ({ color, delay, isActive, xOffset }) => {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    let timer;
    if (isActive) {
      timer = setTimeout(() => {
        setShouldShow(true);
        setTimeout(() => setShouldShow(false), 1200);
      }, delay * 1000);
    } else {
      setShouldShow(false);
    }
    return () => clearTimeout(timer);
  }, [isActive, delay]);

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 180, opacity: 0.8 }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4 }}
          style={{ backgroundColor: color, left: `calc(50% + ${xOffset}px)` }}
          className="absolute top-[-120px] -translate-x-1/2 w-2 z-0 rounded-full"
        />
      )}
    </AnimatePresence>
  );
};

const BrewMasterPage = () => {
  const [index, setIndex] = useState(0);
  const [isPouring, setIsPouring] = useState(false);
  const activeType = COFFEE_TYPES[index];

  useEffect(() => {
    setIsPouring(false);
    const timer = setTimeout(() => setIsPouring(true), 400);
    return () => clearTimeout(timer);
  }, [index]);

  const next = () => setIndex((prev) => (prev + 1) % COFFEE_TYPES.length);
  const prev = () => setIndex((prev) => (prev - 1 + COFFEE_TYPES.length) % COFFEE_TYPES.length);

  const getXOffset = (type) => {
    switch (type) {
      case 'coffee': return 0;
      case 'milk': return -20;
      case 'foam': return 20;
      case 'water': return 15;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen bg-[#1b120f] text-[#ede0d4] selection:bg-[#7b3f00]/30 font-sans overflow-hidden">
      <Seo title="Fez Coffee House | Discover Your Brew" description="Explore the art of coffee in our cozy digital corner." />

      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#3e2723] blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#7b3f00] blur-[120px] rounded-full" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16 md:px-12 relative z-10">
        <header className="mb-12 text-center md:text-left">
          <Link to="/apps" className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#a68a64] hover:text-[#ede0d4] transition-colors">
            <ArrowLeftIcon weight="bold" className="transition-transform group-hover:-translate-x-1" />
            <span>Back to Apps</span>
          </Link>

                    <div className="mt-8">
                      <h1 className="text-5xl md:text-7xl font-instr-serif font-bold text-[#ede0d4] mb-4">
                        Fez Coffee House
                      </h1>
                      <p className="text-lg text-[#a68a64] max-w-xl font-medium leading-relaxed italic font-instr-serif">
                        "Where every drop tells a story. Find your perfect blend."
                      </p>
                    </div>
                  </header>

                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                            {/* Central Carousel & Cup */}
                            <div className="lg:col-span-7 flex flex-col items-center justify-center min-h-[600px] relative">                      <div className="relative flex items-center justify-center w-full">
                        <button onClick={prev} className="absolute left-[-20px] md:left-0 z-20 p-4 bg-[#3e2723]/80 hover:bg-[#5d4037] text-[#ede0d4] border border-[#a68a64]/20 shadow-xl transition-all rounded-full group">
                          <CaretLeftIcon size={24} weight="bold" />
                        </button>

                        <div className="relative w-80 h-96 flex flex-col items-center">
                          <div className="absolute top-[60px] w-full h-1 pointer-events-none">
                            {activeType.layers.map((layer, i) => (
                              <PouringAnimation
                                key={`${activeType.id}-stream-${i}`}
                                color={layer.color}
                                delay={i * 0.8}
                                isActive={isPouring}
                                xOffset={getXOffset(layer.type)}
                              />
                            ))}
                          </div>

                          <div className="relative w-64 h-80 mt-12">
                            <svg viewBox="0 0 200 200" className="w-full h-full relative z-10 overflow-visible drop-shadow-2xl">
                              <defs>
                                <clipPath id="cup-clip">
                                  <path d="M 40,40 L 160,40 L 155,165 Q 150,175 140,175 L 60,175 Q 50,175 45,165 Z" />
                                </clipPath>
                              </defs>

                              {/* Cup Body */}
                              <path d="M 40,40 L 160,40 L 155,165 Q 150,175 140,175 L 60,175 Q 50,175 45,165 Z" fill="#fff" fillOpacity="0.05" stroke="#ede0d4" strokeWidth="3" />
                              <path d="M 160,70 Q 190,70 190,100 Q 190,130 160,130" fill="none" stroke="#ede0d4" strokeWidth="6" strokeLinecap="round" />

                              {/* Liquid Layers */}
                              <g clipPath="url(#cup-clip)">
                                {activeType.layers.map((layer, i) => {
                                  const prevHeights = activeType.layers.slice(0, i).reduce((acc, curr) => acc + curr.height, 0);
                                  const layerHeight = layer.height * 1.35;
                                  const yPos = 175 - (prevHeights * 1.35 + layerHeight);

                                  return (
                                    <motion.rect
                                      key={`${activeType.id}-layer-${i}`}
                                      x="0"
                                      width="200"
                                      fill={layer.color}
                                      initial={{ height: 0, y: 200 }}
                                      animate={isPouring ? { height: layerHeight, y: yPos } : { height: 0, y: 200 }}
                                      transition={{ delay: i * 0.8 + 0.5, duration: 1.2, ease: "circOut" }}
                                    />
                                  );
                                })}
                              </g>
                            </svg>
                            <CoffeeStain />
                          </div>

                          <motion.div
                            key={activeType.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-12 text-center"
                          >
                            <h2 className="text-4xl font-instr-serif font-bold text-[#ede0d4] drop-shadow-md">
                              {activeType.name}
                            </h2>                  <div className="flex justify-center gap-3 mt-6">
                    {COFFEE_TYPES.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`h-2 rounded-full transition-all duration-500 ${i === index ? 'w-10 bg-[#a68a64]' : 'w-2 bg-[#3e2723] hover:bg-[#5d4037]'}`}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>

              <button onClick={next} className="absolute right-[-20px] md:right-0 z-20 p-4 bg-[#3e2723]/80 hover:bg-[#5d4037] text-[#ede0d4] border border-[#a68a64]/20 shadow-xl transition-all rounded-full group">
                <CaretRightIcon size={24} weight="bold" />
              </button>
            </div>
          </div>

          {/* Info Side Panel */}
          <div className="lg:col-span-5 space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeType.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="p-8 bg-[#3e2723]/40 border border-[#a68a64]/10 rounded-2xl shadow-2xl backdrop-blur-sm space-y-6">
                  <div className="flex items-center gap-3 text-[#a68a64] font-medium text-sm uppercase tracking-widest">
                    <CoffeeIcon weight="fill" />
                    <span>Brew Notes</span>
                  </div>
                  <p className="text-[#ede0d4]/90 leading-relaxed text-lg font-light">{activeType.description}</p>

                  <div className="grid grid-cols-2 gap-6 pt-6 border-t border-[#a68a64]/10">
                    <div>
                      <span className="text-[#a68a64] text-xs uppercase font-bold block mb-1">Origin</span>
                      <span className="text-[#ede0d4] text-lg font-medium italic">{activeType.origin}</span>
                    </div>
                    <div>
                      <span className="text-[#a68a64] text-xs uppercase font-bold block mb-1">Ideal Temp</span>
                      <span className="text-[#ede0d4] text-lg font-medium italic">{activeType.temp}</span>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-[#7b3f00]/10 border border-[#a68a64]/20 rounded-2xl space-y-4">
                  <div className="flex items-center gap-3 text-[#a68a64] font-medium text-sm uppercase tracking-widest">
                    <LightbulbIcon weight="fill" />
                    <span>A Little Secret...</span>
                  </div>
                  <p className="text-[#ede0d4] italic text-lg leading-relaxed">"{activeType.trivia}"</p>
                </div>

                <div className="p-8 bg-black/20 border border-[#a68a64]/10 rounded-2xl">
                  <h3 className="text-xs font-bold text-[#a68a64] uppercase tracking-widest mb-6">What's Inside?</h3>
                  <div className="space-y-4">
                    {activeType.layers.map((layer, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full shadow-inner" style={{ backgroundColor: layer.color }} />
                          <span className="text-[#ede0d4]/80 text-sm font-medium">{layer.label}</span>
                        </div>
                        <span className="text-[#a68a64] font-mono text-sm">{layer.height}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <footer className="mt-20 pt-10 border-t border-[#a68a64]/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 text-[#a68a64] text-sm italic">
            <HeartIcon weight="fill" className="text-[#7b3f00]" />
            <span>Hand-crafted with love at Fez Coffee House</span>
          </div>
          <div className="flex gap-8 text-[#a68a64] text-xs uppercase font-bold tracking-widest">
            <span className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isPouring ? 'bg-[#a68a64] animate-ping' : 'bg-[#3e2723]'}`} />
              {isPouring ? 'Now Brewing' : 'Ready to Serve'}
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default BrewMasterPage;