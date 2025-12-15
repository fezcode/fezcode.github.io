import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {
  ArrowLeftIcon,
  BaseballHelmetIcon, BeanieIcon, BroomIcon,
  ClipboardIcon, TaxiIcon,
} from '@phosphor-icons/react';
import {useToast} from '../../hooks/useToast';
import useSeo from '../../hooks/useSeo';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';
import formatMarkdownTable from "../../utils/markdownUtils";
import {useSidePanel} from "../../context/SidePanelContext";

const FruitDashboard = () => {
  useSeo({
    title: 'Markdown Table Formatter | Fezcodex',
    description: 'Format your markdown tables.',
    keywords: ['Fezcodex', 'md', 'markdown', 'table'],
    ogTitle: 'Markdown Table Formatter | Fezcodex',
    ogDescription: 'Format your markdown tables.',
    ogImage: '/images/ogtitle.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Markdown Table Formatter | Fezcodex',
    twitterDescription: 'Format your markdown tables.',
    twitterImage: '/images/ogtitle.png',
  });

  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const {addToast} = useToast();
  const { openSidePanel } = useSidePanel();

  const ReasonComponent = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center gap-4">
          <TaxiIcon size={24} weight="fill" />
          <h1 className="text-white font-arvo">... Because of Taxi Driver ...</h1>
          <TaxiIcon size={24} weight="fill" />
        </div>
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
          <h3 className="text-white font-bold mb-2">Markdown Log Entries</h3>
          <p className="text-sm text-gray-400">
            I watched Taxi Driver (1976).
            Then I started to write a review, log entry for it.
            Creating a <strong> Markdown Table </strong>is one of the hardest parts of writing markdown.
            Each table row looked worse than the previous one.
            I needed a formatter.
          </p>
          <br/>
          <p className="text-sm text-gray-400">
            After hours of writing a React component, finally here it is.
            It is 5 AM and I'm <i>finally</i> done.
          </p>
        </div>
      </div>
    );
  }

  const convertMarkdownTable = () => {
    try {
      let formattedTable = formatMarkdownTable(inputText);
      setOutputText(formattedTable);
    } catch (error) {
      addToast({
        title: 'Error',
        message: 'Failed to format given markdown table text.',
        duration: 3000,
      });
      setOutputText('');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        addToast({
          title: 'Success',
          message: 'Copied to clipboard!',
          duration: 2000,
        });
      })
      .catch(() => {
        addToast({
          title: 'Error',
          message: 'Failed to copy!',
          duration: 2000,
        });
      });
  };

  return (
    // bg-[#CFD8DC]
    <div className="py-16 sm:py-24 min-h-screen bg-[#FFEDCF]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-gray-300">
        <Link to="/apps" className="group text-rose-800 hover:underline flex items-center justify-center gap-2 text-lg mb-4 font-arvo">
          <ArrowLeftIcon className="text-xl transition-transform group-hover:-translate-x-1"/>
          Back to Apps
        </Link>

        <BreadcrumbTitle title="Markdown Table Formatter" slug="mtf" sansFont={true} lightStyle={false}/>
        <hr className="border-gray-700"/>
        <div className="flex justify-center items-center mt-16 text-[#1A2E1A]">
          {/*Our Text Div*/}
          <div
            className="group bg-[#FBF7F0] rounded-[0.25rem] border border-neutral-700 shadow-2xl p-6 flex flex-col justify-between relative transform transition-all duration-300 ease-in-out overflow-hidden h-full w-full max-w-4xl">
            <div className="absolute top-0 left-0 w-full h-full opacity-10"  style={{ backgroundImage: 'radial-gradient(circle, black 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>

            <div className="relative z-10 p-1">
              <div className="flex flex-row items-center justify-items-start gap-2">
                <h1 className="text-4xl font-serif text-[#1A2E1A] mb-2">Table Formatter</h1>
                <button
                  onClick={() => openSidePanel('Why Create a Formatter', <ReasonComponent />, 400)}
                  className="text-gray-500 hover:text-[#1A2E1A] transition-colors hover:scale-105"
                  aria-label="Rating System Info"
                >
                  <BeanieIcon className="rotate-12 hover:rotate-0 transition" size={24} />
                </button>
              </div>

              <hr className="border-gray-700 mb-4"/>
              {/*Input Text*/}
              <div className="mb-4">
                <label className="block text-2xl font-normal italic text-[#2c3e2c] mb-2 font-playfairDisplay">Input Text</label>

                <textarea
                  className="w-full h-32 p-4 bg-[#f3e2c850] font-mono resize-y border rounded-md border-app-alpha-50 text-[#1A2E1A]"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter markdown table here..."
                />
              </div>

              {/*Button*/}
              <div className="flex justify-center gap-4 mb-4 mt-4">
                <button
                  onClick={convertMarkdownTable}
                  className="px-6 py-2 rounded-md text-lg font-arvo font-normal transition-colors duration-300 ease-in-out bg-[#f0e3c980] hover:bg-[#fef9e6]  text-[#2e5341] border-[#2e5341] border flex items-center gap-2"
                >
                  <BaseballHelmetIcon size={24}/>
                  Format Table
                </button>

                <button
                  onClick={ () => setInputText('')}
                  className="px-6 py-2 rounded-md text-lg font-arvo font-normal transition-colors duration-300 ease-in-out bg-[#f0e3c980] hover:bg-[#fef9e6]  text-[#2e5341] border-[#2e5341] border flex items-center gap-2"
                >
                  <BroomIcon size={24}/>
                  Clear Text
                </button>
              </div>

              {/*Output Text*/}
              <div className="mb-4">
                <label className="block text-2xl font-normal italic text-[#2c3e2c] mb-2 font-playfairDisplay">Output Text</label>
                <div className="relative overflow-hidden">
                  <textarea
                    readOnly
                    className="w-full h-32 p-4 bg-[#f3e2c850] font-mono resize-y border rounded-md border-app-alpha-50 text-[#1A2E1A]"
                    value={outputText}
                    placeholder="Formatted text will appear here..."
                  />
                  <button
                    onClick={() => copyToClipboard(outputText)}
                    className="absolute top-2 right-2 px-3 py-2 bg-gray-700 text-white text-sm font-arvo rounded hover:bg-gray-600 flex items-center justify-center gap-2 "
                  >
                    <ClipboardIcon size={16}> </ClipboardIcon>
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FruitDashboard;
