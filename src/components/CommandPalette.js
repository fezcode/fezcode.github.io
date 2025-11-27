import React, {useState, useEffect, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import {AnimatePresence, motion} from 'framer-motion';
import useSearchableData from '../hooks/useSearchableData';
import {useAnimation} from '../context/AnimationContext';
import {useToast} from '../hooks/useToast';
import {useVisualSettings} from '../context/VisualSettingsContext';
import {KEY_SIDEBAR_STATE, remove as removeLocalStorageItem} from '../utils/LocalStorageManager';
import {version} from '../version'; // Import the version
import LiveClock from './LiveClock'; // Import LiveClock
import GenerativeArt from './GenerativeArt'; // Import GenerativeArt
import TextTransformer from './TextTransformer'; // Import TextTransformer
import Stopwatch from './Stopwatch'; // Import Stopwatch
import {filterItems} from '../utils/search';
import {TerminalWindowIcon} from "@phosphor-icons/react"; // Import the search utility

const categoryColorMap = {
  'page': 'bg-red-400',
  'command': 'bg-amber-400',
  'post': 'bg-blue-400',
  'project': 'bg-orange-400',
  'log': 'bg-rose-400',
  'app': 'bg-teal-400',
  'story': 'bg-violet-400',
  'notebook': 'bg-lime-400',
};

const categoryTextColorMap = {
  'page': 'text-red-100',
  'command': 'text-amber-100',
  'post': 'text-blue-100',
  'project': 'text-orange-100',
  'log': 'text-rose-100',
  'app': 'text-teal-100',
  'story': 'text-violet-100',
  'notebook': 'text-lime-100',
};

const getCategoryColorClass = (type) => {
  return categoryColorMap[type] || 'bg-gray-500'; // Default gray for unmapped types
};

const CommandPalette = ({isOpen, setIsOpen, openGenericModal, toggleDigitalRain}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const {items, isLoading} = useSearchableData();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const {isAnimationEnabled, toggleAnimation} = useAnimation();
  const {addToast} = useToast();
  const {
    isInverted, toggleInvert,
    isRetro, toggleRetro,
    isParty, toggleParty
  } = useVisualSettings();

  const filteredItems = filterItems(items, searchTerm);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchTerm, items]);

  const handleItemClick = (item) => {
    if (!item) return;

    if (item.type === 'command') {
      switch (item.commandId) {
        case 'toggleAnimations':
          toggleAnimation();
          addToast({
            title: 'Settings Updated',
            message: `Animations have been ${!isAnimationEnabled ? 'enabled' : 'disabled'}.`,
          });
          break;
        case 'resetSidebarState':
          removeLocalStorageItem(KEY_SIDEBAR_STATE);
          addToast({
            title: 'Success',
            message: 'Sidebar state has been reset. The page will now reload.',
            duration: 3000,
          });
          setTimeout(() => {
            window.location.reload();
          }, 3000);
          break;
        case 'viewSource':
          window.open('https://github.com/fezcode/fezcode.github.io', '_blank', 'noopener,noreferrer');
          break;
        case 'randomPost': {
          const posts = items.filter(i => i.type === 'post');
          if (posts.length > 0) {
            const randomPost = posts[Math.floor(Math.random() * posts.length)];
            navigate(randomPost.path);
          }
          break;
        }
        case 'sendEmailFezcode':
          window.open('mailto:samil.bulbul@gmail.com', '_blank', 'noopener,noreferrer');
          break;
        case 'openGitHub':
          window.open('https://github.com/fezcode', '_blank', 'noopener,noreferrer');
          break;
        case 'openTwitter':
          window.open('https://x.com/fezcoddy', '_blank', 'noopener,noreferrer');
          break;
        case 'openLinkedIn':
          window.open('https://tr.linkedin.com/in/ahmed-samil-bulbul', '_blank', 'noopener,noreferrer');
          break;
        case 'scrollToTop':
          window.scrollTo({top: 0, behavior: 'smooth'});
          break;
        case 'scrollToBottom':
          window.scrollTo({top: document.documentElement.scrollHeight, behavior: 'smooth'});
          break;
        case 'showSiteStats': {
          const postCount = items.filter(i => i.type === 'post').length;
          const projectCount = items.filter(i => i.type === 'project').length;
          const logCount = items.filter(i => i.type === 'log').length;
          const appCount = items.filter(i => i.type === 'app').length;
          openGenericModal('Site Statistics', (
            <div>
              <p><strong>Posts:</strong> {postCount}</p>
              <p><strong>Projects:</strong> {projectCount}</p>
              <p><strong>Logs:</strong> {logCount}</p>
              <p><strong>Apps:</strong> {appCount}</p>
            </div>
          ));
          break;
        }
        case 'showVersion':
          openGenericModal('Application Version', <p>Version: <strong>v{version}</strong></p>);
          break;
        case 'latestPost': {
          const posts = items.filter(i => i.type === 'post');
          if (posts.length > 0) {
            posts.sort((a, b) => new Date(b.date) - new Date(a.date));
            navigate(posts[0].path);
          }
          break;
        }
        case 'latestLog': {
          const logs = items.filter(i => i.type === 'log');
          if (logs.length > 0) {
            logs.sort((a, b) => new Date(b.date) - new Date(a.date));
            navigate(logs[0].path);
          }
          break;
        }
        case 'herDaim':
          openGenericModal('Her Daim', <img src="/images/herdaim.jpg" alt="Her Daim" className="max-w-full h-auto"/>);
          break;
        case 'doBarrelRoll':
          document.body.classList.add('do-a-barrel-roll');
          addToast({title: 'Wheeeee!', message: 'Do a Barrel Roll!', duration: 1000});
          setTimeout(() => {
            document.body.classList.remove('do-a-barrel-roll');
          }, 1000);
          break;
        case 'toggleInvertColors':
          toggleInvert();
          addToast({
            title: !isInverted ? 'Colors Inverted' : 'Colors Restored',
            message: !isInverted ? 'Welcome to the upside down!' : 'Back to normal!',
            duration: 2000
          });
          break;
        case 'partyMode':
          toggleParty();
          addToast({
            title: !isParty ? 'Let\'s Party!' : 'Party Over',
            message: !isParty ? 'Boots and cats and boots and cats!' : 'Party\'s over...',
            duration: 2000
          });
          break;
        case 'toggleRetroMode':
          toggleRetro();
          addToast({
            title: !isRetro ? 'Retro Mode On' : 'Retro Mode Off',
            message: !isRetro ? '80s Vibes Initiated.' : 'Back to the future!',
            duration: 2000
          });
          break;
        case 'showTime': {
          openGenericModal('Current Time', <LiveClock/>);
          break;
        }
        case 'digitalRain':
          toggleDigitalRain();
          break;
        case 'generateArt':
          openGenericModal('Generative Art', <GenerativeArt/>);
          break;
        case 'leetTransformer':
          openGenericModal('Leet Speak Transformer', <TextTransformer/>);
          break;
        case 'stopwatch':
          openGenericModal('Stopwatch', <Stopwatch/>);
          break;
        case 'showOSInfo': {
          const osInfo = (
            <div>
              <p><strong>User Agent:</strong> {navigator.userAgent}</p>
              <br/>
              <p><strong>Platform:</strong> {navigator.platform}</p>
              <br/>
              <p><strong>App Version:</strong> {navigator.appVersion}</p>
              <br/>
              <p><strong>Language:</strong> {navigator.language}</p>
              <br/>
              <p><strong>Online:</strong> {navigator.onLine ? 'Yes' : 'No'}</p>
            </div>
          );
          openGenericModal('User/Browser Information', osInfo);
          break;
        }
        case 'copyCurrentURL':
          navigator.clipboard.writeText(window.location.href);
          addToast({title: 'Copied', message: 'Current URL copied to clipboard!', duration: 3000});
          break;
        case 'clearLocalStorage':
          localStorage.clear();
          addToast({title: 'Success', message: 'Local storage cleared!', duration: 3000});
          break;
        case 'reloadPage':
          addToast({title: 'Reloading', message: 'Page will reload shortly...', duration: 1500});
          setTimeout(() => window.location.reload(), 1500);
          break;
        case 'randomApp': {
          const apps = items.filter(i => i.type === 'app');
          if (apps.length > 0) {
            const randomApp = apps[Math.floor(Math.random() * apps.length)];
            addToast({title: 'Random App', message: `Navigating to ${randomApp.title}`, duration: 2000});
            navigate(randomApp.path);
          } else {
            addToast({title: 'Random App', message: 'No apps found to navigate to.', duration: 2000});
          }
          break;
        }
        case 'toggleFullScreen':
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
              addToast({title: 'Full Screen', message: 'Entered full screen mode.', duration: 2000});
            }).catch(err => {
              addToast({title: 'Error', message: `Could not enter full screen: ${err.message}`, duration: 3000});
            });
          } else {
            if (document.exitFullscreen) {
              document.exitFullscreen().then(() => {
                addToast({title: 'Full Screen', message: 'Exited full screen mode.', duration: 2000});
              }).catch(err => {
                addToast({title: 'Error', message: `Could not exit full screen: ${err.message}`, duration: 3000});
              });
            }
          }
          break;
        case 'openGitHubIssue': {
          const issueTitle = encodeURIComponent(`Issue on page: ${window.location.pathname}`);
          const issueBody = encodeURIComponent(`Found an issue on:\n${window.location.href}\n\n[Please describe the issue here]`);
          const githubIssueUrl = `https://github.com/fezcode/fezcode.github.io/issues/new?title=${issueTitle}&body=${issueBody}`;
          window.open(githubIssueUrl, '_blank', 'noopener,noreferrer');
          addToast({title: 'GitHub Issue', message: 'Opening new GitHub issue tab!', duration: 3000});
          break;
        }
        default:
          break;
      }
    } else {
      navigate(item.path);
    }
    handleClose();
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isOpen) return;

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex((prevIndex) =>
          prevIndex === 0 ? filteredItems.length - 1 : prevIndex - 1
        );
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex((prevIndex) =>
          prevIndex === filteredItems.length - 1 ? 0 : prevIndex + 1
        );
      } else if (event.key === 'Enter') {
        event.preventDefault();
        if (filteredItems[selectedIndex]) {
          handleItemClick(filteredItems[selectedIndex]);
        }
      } else if (event.key === 'Escape') {
        handleClose();
      } else if (event.key === 'PageUp') {
        event.preventDefault();
        setSelectedIndex((prevIndex) =>
          prevIndex <= 0 ? filteredItems.length - 1 : prevIndex - 10
        );
      } else if (event.key === 'PageDown') {
        event.preventDefault();
        setSelectedIndex((prevIndex) =>
          prevIndex >= filteredItems.length - 10 ? 0 : prevIndex + 10
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, isAnimationEnabled]);

  useEffect(() => {
    const selectedItem = resultsRef.current?.children[selectedIndex];
    if (selectedItem) {
      selectedItem.scrollIntoView({
        block: 'nearest',
      });
    }
  }, [selectedIndex]);

  const handleClose = () => {
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-start justify-center pt-16 md:pt-32 "
          onClick={handleClose}
        >
          <motion.div
            initial={{opacity: 0, scale: 0.95, y: -20}}
            animate={{opacity: 1, scale: 1, y: 0}}
            exit={{opacity: 0, scale: 0.95, y: -20}}
            transition={{duration: 0.2, ease: 'easeOut'}}
            className="bg-gray-900  text-gray-100 rounded-lg shadow-2xl w-full max-w-xl mx-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-3 flex items-center justify-center">
              <TerminalWindowIcon size={36} weight="light" className="mr-2 text-gray-200 "/>
              <input
                ref={inputRef}
                type="text"
                placeholder={isLoading ? "Loading data..." : "Search or type a command..."}
                className="w-full bg-transparent text-lg placeholder-gray-500 focus:outline-none font-mono"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div ref={resultsRef}
                 className="border-t border-gray-200 dark:border-gray-700 p-2 max-h-[50vh] overflow-y-auto scrollbar-hide">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <div
                    key={`${item.type}-${item.slug || item.commandId}-${index}`}
                    className={`p-3 rounded-lg cursor-pointer flex justify-between items-center font-mono ${
                      selectedIndex === index ? 'bg-gray-800' : 'hover:bg-gray-800'
                    }`}
                    onClick={() => handleItemClick(item)}
                    onMouseMove={() => setSelectedIndex(index)}
                  >
                    <span className="mr-2 text-gray-500 "> » </span>
                    <span className={`w-5/6 text-gray-100`}>{item.title}</span>
                    <span
                      className={`w-20 h-6 flex items-center justify-center text-xs uppercase text-gray-800 font-bold ${getCategoryColorClass(item.type)} rounded border-2 border-black`}>{item.type}</span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  {isLoading ? "Loading..." : `No results found for "${searchTerm}"`}
                </div>
              )}
            </div>
            <div
              className="border-t border-gray-200 dark:border-gray-700 p-2 text-xs text-gray-400 dark:text-gray-500 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="border border-gray-300 dark:border-gray-600 rounded px-1.5 py-0.5">ESC</span> to close
                <span className="border border-gray-300 dark:border-gray-600 rounded px-1.5 py-0.5">↑</span>
                <span className="border border-gray-300 dark:border-gray-600 rounded px-1.5 py-0.5">↓</span>
                <span className="border border-gray-300 dark:border-gray-600 rounded px-1.5 py-0.5">PgUp</span>
                <span className="border border-gray-300 dark:border-gray-600 rounded px-1.5 py-0.5">PgDn</span> to
                navigate
                <span className="border border-gray-300 dark:border-gray-600 rounded px-1.5 py-0.5">↵</span> to select
              </div>
              <div className="font-semibold text-gray-400">
                Fez<span className="text-accent-500">codex</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
