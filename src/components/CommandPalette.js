import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import useSearchableData from '../hooks/useSearchableData';
import { useAnimation } from '../context/AnimationContext';
import { useToast } from '../hooks/useToast';
import { SIDEBAR_KEYS, remove as removeLocalStorageItem } from '../utils/LocalStorageManager';
import { version } from '../version'; // Import the version
import LiveClock from './LiveClock'; // Import LiveClock
import GenerativeArt from './GenerativeArt'; // Import GenerativeArt
import TextTransformer from './TextTransformer'; // Import TextTransformer
import Stopwatch from './Stopwatch'; // Import Stopwatch
import { filterItems } from '../utils/search'; // Import the search utility

const CommandPalette = ({ isOpen, setIsOpen, openGenericModal, toggleDigitalRain }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { items, isLoading } = useSearchableData();
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const resultsRef = useRef(null);
    const { isAnimationEnabled, toggleAnimation } = useAnimation();
    const { addToast } = useToast();

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
                    SIDEBAR_KEYS.forEach((key) => {
                        removeLocalStorageItem(key);
                    });
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
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    break;
                case 'scrollToBottom':
                    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
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
                    openGenericModal('Her Daim', <img src="/images/herdaim.jpg" alt="Her Daim" className="max-w-full h-auto" />);
                    break;
                case 'showTime': {
                    openGenericModal('Current Time', <LiveClock />);
                    break;
                }
                case 'digitalRain':
                    toggleDigitalRain();
                    break;
                case 'generateArt':
                    openGenericModal('Generative Art', <GenerativeArt />);
                    break;
                case 'leetTransformer':
                    openGenericModal('Leet Speak Transformer', <TextTransformer />);
                    break;
                case 'stopwatch':
                    openGenericModal('Stopwatch', <Stopwatch />);
                    break;
                case 'showOSInfo': {
                    const osInfo = (
                        <div>
                            <p><strong>User Agent:</strong> {navigator.userAgent}</p>
                            <br />
                            <p><strong>Platform:</strong> {navigator.platform}</p>
                            <br />
                            <p><strong>App Version:</strong> {navigator.appVersion}</p>
                            <br />
                            <p><strong>Language:</strong> {navigator.language}</p>
                            <br />
                            <p><strong>Online:</strong> {navigator.onLine ? 'Yes' : 'No'}</p>
                        </div>
                    );
                    openGenericModal('User/Browser Information', osInfo);
                    break;
                }
                case 'copyCurrentURL':
                    navigator.clipboard.writeText(window.location.href);
                    addToast({ title: 'Copied', message: 'Current URL copied to clipboard!', duration: 3000 });
                    break;
                case 'clearLocalStorage':
                    localStorage.clear();
                    addToast({ title: 'Success', message: 'Local storage cleared!', duration: 3000 });
                    break;
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
                    className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-start justify-center pt-16 md:pt-32"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-2xl w-full max-w-xl mx-4"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-3">
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder={isLoading ? "Loading data..." : "Search or type a command..."}
                                className="w-full bg-transparent text-lg placeholder-gray-500 focus:outline-none"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div ref={resultsRef} className="border-t border-gray-200 dark:border-gray-700 p-2 max-h-[50vh] overflow-y-auto">
                            {filteredItems.length > 0 ? (
                                filteredItems.map((item, index) => (
                                    <div
                                        key={`${item.type}-${item.slug || item.commandId}-${index}`}
                                        className={`p-3 rounded-lg cursor-pointer flex justify-between items-center ${
                                            selectedIndex === index ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }`}
                                        onClick={() => handleItemClick(item)}
                                        onMouseMove={() => setSelectedIndex(index)}
                                    >
                                        <span>{item.title}</span>
                                        <span className="text-xs uppercase bg-gray-300 dark:bg-gray-600 px-2 py-1 rounded">{item.type}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center text-gray-500">
                                     {isLoading ? "Loading..." : `No results found for "${searchTerm}"`}
                                </div>
                            )}
                        </div>
                         <div className="border-t border-gray-200 dark:border-gray-700 p-2 text-xs text-gray-400 dark:text-gray-500 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="border border-gray-300 dark:border-gray-600 rounded px-1.5 py-0.5">ESC</span> to close
                                <span className="border border-gray-300 dark:border-gray-600 rounded px-1.5 py-0.5">↑</span>
                                <span className="border border-gray-300 dark:border-gray-600 rounded px-1.5 py-0.5">↓</span> to navigate
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
