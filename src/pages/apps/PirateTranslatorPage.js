import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowLeftIcon, SkullIcon, CopySimpleIcon} from '@phosphor-icons/react';
import colors from '../../config/colors';
import useSeo from '../../hooks/useSeo';
import {useToast} from '../../hooks/useToast';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const pirateDictionary = {
  "hello": "ahoy",
  "hi": "ahoy",
  "hey": "ahoy",
  "my": "me",
  "friend": "matey",
  "friends": "hearties",
  "is": "be",
  "are": "be",
  "am": "be",
  "you": "ye",
  "your": "yer",
  "yours": "yers",
  "where": "whar",
  "to": "t'",
  "the": "th'",
  "of": "o'",
  "for": "fer",
  "stop": "avast",
  "yes": "aye",
  "no": "nay",
  "girl": "lass",
  "girls": "lassies",
  "boy": "lad",
  "boys": "laddies",
  "guy": "lubber",
  "man": "scallywag",
  "woman": "wench",
  "money": "booty",
  "cash": "doubloons",
  "quickly": "smartly",
  "fast": "smartly",
  "captain": "cap'n",
  "beer": "grog",
  "alcohol": "rum",
  "water": "brine",
  "wine": "grog",
  "drink": "swig",
  "happy": "jolly",
  "good": "grand",
  "bad": "scurvy",
  "very": "mighty",
  "wow": "blimey",
  "there": "thar",
  "mad": "addled",
  "crazy": "mad as a hatter",
  "boss": "admiral",
  "food": "grub",
  "hotel": "inn",
  "house": "shack",
  "home": "port",
  "kill": "keelhaul",
  "died": "walked the plank",
  "dead": "feeding the fish",
  "old": "barnacle-covered",
  "bathroom": "head",
  "restroom": "head",
  "toilet": "head",
  "wife": "ball and chain",
  "husband": "old man",
  "song": "shanty",
  "music": "shanty",
  "cheat": "hornswaggle",
  "rob": "pillage",
  "steal": "plunder",
  "take": "seize",
  "gun": "pistol",
  "sword": "cutlass",
  "knife": "dagger",
  "ship": "vessel",
  "boat": "dinghy",
  "sea": "big blue wet thing",
  "ocean": "seven seas",
  "treasure": "treasure",
  "chest": "coffer",
  "talk": "parley",
  "speak": "parley",
  "look": "spy",
  "saw": "spied",
  "find": "come across",
  "run": "scamper",
  "leave": "weigh anchor",
  "after": "aft",
  "forward": "fore",
};

const piratePhrases = [" Arrr!", " Shiver me timbers!", " Walk the plank!", " Yo ho ho!", " Avast ye!", " Dead men tell no tales.", " By Blackbeard's ghost!", " Blow me down!", " Savvy?", " ...and a bottle of rum!", " Weigh anchor!", " Batten down the hatches!",];

const PirateTranslatorPage = () => {
  useSeo({
    title: 'Pirate Speak Translator | Fezcodex',
    description: 'Translate yer landlubber words into proper Pirate speak!',
    keywords: ['Fezcodex', 'pirate translator', 'pirate speak', 'fun', 'converter'],
    ogTitle: 'Pirate Speak Translator | Fezcodex',
    ogDescription: 'Translate yer landlubber words into proper Pirate speak!',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Pirate Speak Translator | Fezcodex',
    twitterDescription: 'Translate yer landlubber words into proper Pirate speak!',
    twitterImage: 'https://fezcode.github.io/logo512.png',
  });
  const {addToast} = useToast();
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const translate = () => {
    let text = inputText.toLowerCase();
    // Dictionary replacements
    Object.keys(pirateDictionary).forEach(key => {
      const regex = new RegExp(`\\b${key}\\b`, 'g');
      text = text.replace(regex, pirateDictionary[key]);
    });
    // Grammar tweaks: replacing 'ing' at the end of words with "in'"
    text = text.replace(/ing\b/g, "in'");
    // Capitalize first letter of sentences
    text = text.replace(/(^\w|\.\s\w)/g, c => c.toUpperCase());
    // Add some pirate flair randomly
    if (text.length > 0) {
      const randomPhrase = piratePhrases[Math.floor(Math.random() * piratePhrases.length)];
      text += randomPhrase;
    }
    setTranslatedText(text);
  };
  const copyToClipboard = () => {
    navigator.clipboard.writeText(translatedText).then(() => {
      addToast({title: 'Copied!', message: 'Translated text copied to clipboard.', duration: 2000});
    }).catch(() => {
      addToast({title: 'Error', message: 'Failed to copy translated text!', duration: 2000});
    });
  };
  const cardStyle = {
    backgroundColor: colors['app-alpha-10'],
    borderColor: colors['app-alpha-50'],
    color: colors.app,
  };

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-gray-300">
        <Link to="/apps" className="group text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4" >
          <ArrowLeftIcon className="text-xl transition-transform group-hover:-translate-x-1" /> Back to Apps
        </Link>
          <BreadcrumbTitle title="Pirate Speak Translator" slug="pirate" />
        <hr className="border-gray-700"/>
        <div className="flex justify-center items-center mt-16">
          <div
            className="group bg-transparent border rounded-lg shadow-2xl p-6 flex flex-col justify-between relative transform overflow-hidden h-full w-full max-w-2xl"
            style={cardStyle}
          >
            <div
              className="absolute top-0 left-0 w-full h-full opacity-10"
              style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '10px 10px',
              }}
            ></div>
            <div className="relative z-10 p-1 text-center">
              <h1 className="text-3xl font-arvo font-normal mb-4 text-app flex items-center justify-center gap-2">
                <SkullIcon size={32}/> Pirate Speak Translator
              </h1>
              <hr className="border-gray-700 mb-6"/>
              <div className="flex flex-col gap-4 mb-6">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type yer message here, matey..."
                  className="w-full h-32 bg-black/20 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-red-500 transition-colors resize-none"
                />
                <div className="flex justify-center gap-4">
                  <button
                    onClick={translate}
                    className="px-6 py-2 rounded-md font-arvo font-normal border transition-colors duration-300 hover:bg-red-500/20 text-red-500 border-red-500"
                  >
                    Translate, Yarr!
                  </button>
                  <button
                    onClick={copyToClipboard}
                    disabled={!translatedText}
                    className={`px-6 py-2 rounded-md font-arvo font-normal border transition-colors duration-300 text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white ${
                      !translatedText ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <CopySimpleIcon size={24} className="inline-block mr-2"/> Copy
                  </button>
                </div>
              </div>
              {translatedText && (
                <div
                  className="bg-black/30 p-4 rounded border border-gray-700 min-h-[80px] text-left font-serif italic text-lg text-gray-200">
                  {translatedText}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PirateTranslatorPage;
