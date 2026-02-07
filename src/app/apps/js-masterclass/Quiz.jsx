import React, { useState, useEffect } from 'react';
import { CheckIcon, XIcon, TrophyIcon, ArrowRightIcon, WarningIcon, CodeIcon, ArrowsLeftRightIcon, TextTIcon } from '@phosphor-icons/react';

// --- Sub-Components ---

const MultipleChoiceQuestion = ({ question, showResult, isCorrect, selectedOption, onSelectOption }) => (
    <div className="space-y-4">
        {question.options.map((option, index) => {
        let containerClass = "border-white/10 hover:border-white/30 hover:bg-white/5";
        let icon = <div className="w-4 h-4 border border-white/20 flex items-center justify-center transition-colors group-hover:border-white/50" />;

        if (showResult) {
            if (index === question.answer) {
                containerClass = "bg-emerald-500/10 border-emerald-500/50";
                icon = <div className="w-4 h-4 bg-emerald-500 flex items-center justify-center text-black"><CheckIcon weight="bold" size={10} /></div>;
            } else if (index === selectedOption && !isCorrect) {
                containerClass = "bg-rose-500/10 border-rose-500/50";
                icon = <div className="w-4 h-4 bg-rose-500 flex items-center justify-center text-black"><XIcon weight="bold" size={10} /></div>;
            } else {
                containerClass = "opacity-30 border-white/5 grayscale pointer-events-none";
            }
        } else if (selectedOption === index) {
            containerClass = "bg-white/10 border-emerald-500";
            icon = <div className="w-4 h-4 bg-emerald-500" />;
        }

        return (
            <button
            key={index}
            onClick={() => !showResult && onSelectOption(index)}
            disabled={showResult}
            className={`group w-full text-left p-5 border transition-all duration-200 flex items-center gap-6 ${containerClass}`}
            >
            <div className="flex-shrink-0 font-mono text-[10px] text-gray-500">0{index + 1}</div>
            <div className="flex-shrink-0">{icon}</div>
            <span className={`font-mono text-xs uppercase tracking-wider ${showResult && index === question.answer ? 'text-emerald-400' : 'text-gray-300'}`}>{option}</span>
            </button>
        );
        })}
    </div>
);

const FillInTheBlanksQuestion = ({ question, showResult, isCorrect, fillAnswer, onFillChange }) => (
    <div className="space-y-6">
        <div className="p-6 bg-white/5 border border-white/10 font-mono text-sm text-gray-300 leading-loose">
            {question.text.split('[BLANK]').map((part, i, arr) => (
                <React.Fragment key={i}>
                    {part}
                    {i < arr.length - 1 && (
                        <input
                        type="text"
                        disabled={showResult}
                        value={fillAnswer}
                        onChange={(e) => onFillChange(e.target.value)}
                        className={`mx-2 bg-black border-b-2 outline-none text-center min-w-[100px] transition-colors ${
                            showResult
                                ? isCorrect
                                    ? 'border-emerald-500 text-emerald-500'
                                    : 'border-rose-500 text-rose-500'
                                : 'border-white/20 focus:border-emerald-500 text-white'
                        }`}
                        placeholder="..."
                        />
                    )}
                </React.Fragment>
            ))}
        </div>
        {showResult && !isCorrect && (
            <div className="p-4 border border-emerald-500/20 bg-emerald-500/5 text-[10px] font-mono text-emerald-500 uppercase tracking-widest flex items-center gap-3">
                <CheckIcon weight="bold" /> Correct Answer: <span className="text-white bg-black/50 px-2 py-1 rounded-sm">{question.answer}</span>
            </div>
        )}
    </div>
);

const CodeWritingQuestion = ({ question, showResult, isCorrect, codeAnswer, onCodeChange }) => (
    <div className="space-y-4">
        <div className="relative group">
        <textarea
            value={codeAnswer}
            onChange={(e) => onCodeChange(e.target.value)}
            disabled={showResult && isCorrect}
            className={`w-full h-48 bg-black p-4 font-mono text-sm text-gray-300 border focus:border-emerald-500 outline-none resize-none ${
                showResult
                    ? isCorrect ? 'border-emerald-500/50' : 'border-rose-500/50'
                    : 'border-white/10'
            }`}
            spellCheck="false"
        />
        </div>
        <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
            Validation_Logic: {question.testCase}
        </p>

        {showResult && !isCorrect && (
            <div className="p-4 border border-rose-500/20 bg-rose-500/5 mt-4 space-y-2">
                <div className="text-rose-500 text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-2">
                    <XIcon weight="bold" /> Verification Failed
                </div>
                <div className="text-[10px] font-mono text-gray-400">
                    The code did not satisfy the test case requirements. Ensure you are returning the expected value or performing the required action.
                </div>
            </div>
        )}
    </div>
);

const MatchingQuestion = ({ question, showResult, matches, onMatch }) => {
    const [activeLeft, setActiveLeft] = useState(null);

    // Stable shuffled indices for right side render
    const rightSideIndices = React.useMemo(() => {
        return question.pairs.map((_, i) => i).reverse();
    }, [question.pairs]);

    const handleLeftClick = (index) => {
        setActiveLeft(index);
    };

    const handleRightClick = (rightIndex) => {
        if (activeLeft !== null) {
            onMatch(activeLeft, rightIndex);
            setActiveLeft(null);
        }
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                    <div className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-2">Items</div>
                    {question.pairs.map((pair, index) => (
                        <button
                        key={`left-${index}`}
                        disabled={showResult || matches[index] !== undefined}
                        onClick={() => handleLeftClick(index)}
                        className={`w-full p-3 text-left border text-xs font-mono transition-all ${
                            matches[index] !== undefined
                                ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                                : activeLeft === index
                                    ? 'border-emerald-500 bg-white/5 text-white'
                                    : 'border-white/10 hover:border-white/30 text-gray-400'
                        }`}
                        >
                            {pair.left}
                        </button>
                    ))}
                </div>
                <div className="space-y-2">
                    <div className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-2">Matches</div>
                    {rightSideIndices.map((originalIndex) => {
                        const pair = question.pairs[originalIndex];
                        const isMatchedBy = Object.keys(matches).find(key => matches[key] === originalIndex);

                        let borderClass = 'border-white/10 hover:border-white/30 text-gray-400';
                        if (showResult) {
                            if (isMatchedBy !== undefined && parseInt(isMatchedBy, 10) === originalIndex) {
                                borderClass = 'border-emerald-500 bg-emerald-500/10 text-emerald-400';
                            } else if (isMatchedBy !== undefined) {
                                borderClass = 'border-rose-500 bg-rose-500/10 text-rose-500';
                            }
                        } else if (isMatchedBy !== undefined) {
                            borderClass = 'border-emerald-500/50 text-emerald-400';
                        } else if (activeLeft !== null) {
                            borderClass = 'border-white/30 cursor-pointer hover:bg-white/5';
                        }

                        return (
                        <button
                            key={`right-${originalIndex}`}
                            disabled={showResult || (activeLeft === null && isMatchedBy === undefined)}
                            onClick={() => handleRightClick(originalIndex)}
                            className={`w-full p-3 text-left border text-xs font-mono transition-all ${borderClass}`}
                        >
                            {pair.right}
                        </button>
                        );
                    })}
                </div>
            </div>

            {showResult && (
                <div className="p-6 border border-white/10 bg-white/5">
                    <h5 className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest mb-4">Correct_Configuration</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {question.pairs.map((pair, idx) => (
                            <div key={idx} className="flex items-center gap-3 text-xs font-mono text-gray-400 border border-white/5 p-2 bg-black/20">
                                <span className="text-white">{pair.left}</span>
                                <ArrowRightIcon size={12} className="text-emerald-500/50" />
                                <span className="text-emerald-400">{pair.right}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Main Component ---

const Quiz = ({ questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [completed, setCompleted] = useState(false);

  // State for different question types
  const [selectedOption, setSelectedOption] = useState(null); // Multiple Choice
  const [matches, setMatches] = useState({}); // Matching: { leftIndex: rightIndex }
  const [fillAnswer, setFillAnswer] = useState(''); // Fill in blanks
  const [codeAnswer, setCodeAnswer] = useState(''); // Code writing

  const currentQuestion = questions[currentQuestionIndex];
  const questionType = currentQuestion.type || 'multiple-choice';

  // Reset state on question change
  useEffect(() => {
    setSelectedOption(null);
    setMatches({});
    setFillAnswer('');
    setCodeAnswer(currentQuestion.starterCode || '');
    setShowResult(false);
    setIsCorrect(false);
  }, [currentQuestionIndex, currentQuestion]);

  const handleCheckAnswer = () => {
    let correct = false;

    switch (questionType) {
      case 'multiple-choice':
        correct = selectedOption === currentQuestion.answer;
        break;

      case 'matching':
        const allSelected = Object.keys(matches).length === currentQuestion.pairs.length;
        const allMatched = currentQuestion.pairs.every((_, index) => matches[index] === index);
        correct = allSelected && allMatched;
        break;

      case 'fill-in-the-blanks':
        correct = fillAnswer.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase();
        break;

      case 'code-writing':
        try {
            // eslint-disable-next-line no-new-func
            const testFn = new Function(codeAnswer + '; return ' + currentQuestion.testCase);
            correct = testFn() === true;
        } catch (e) {
            console.error(e);
            correct = false;
        }
        break;
      default:
        correct = false;
    }

    setIsCorrect(correct);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setCompleted(true);
      onComplete();
    }
  };

  if (completed) {
    return (
      <div className="bg-[#050505] border border-emerald-500/30 p-12 text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        <div className="inline-flex p-4 border border-emerald-500/20 bg-emerald-500/10 mb-8 rounded-sm">
            <TrophyIcon size={48} className="text-emerald-500" weight="fill" />
        </div>
        <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-4">Assessment_Complete</h3>
        <p className="text-gray-400 font-mono text-xs uppercase tracking-wider mb-8 max-w-md mx-auto leading-relaxed">
          Neural pathways established. Concept integration verified at 100% efficiency.
        </p>
        <div className="inline-flex items-center gap-3 text-black font-black bg-emerald-500 px-6 py-3 text-[10px] uppercase tracking-[0.2em] hover:bg-white transition-colors cursor-default">
            <CheckIcon weight="bold" size={14} /> PROTOCOL_PASSED
        </div>
      </div>
    );
  }

  const getIconForType = () => {
      switch(questionType) {
          case 'matching': return <ArrowsLeftRightIcon size={16} weight="fill" className="text-emerald-500"/>;
          case 'code-writing': return <CodeIcon size={16} weight="fill" className="text-emerald-500"/>;
          case 'fill-in-the-blanks': return <TextTIcon size={16} weight="fill" className="text-emerald-500"/>;
          default: return <WarningIcon size={16} weight="fill" className="text-emerald-500"/>;
      }
  };

  return (
    <div className="bg-[#050505] border border-white/10 mt-12 relative">
      {/* Quiz Header */}
      <div className="bg-white/5 px-8 py-6 border-b border-white/10 flex justify-between items-center">
        <div className="flex items-center gap-4">
            {getIconForType()}
            <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">
                    {questionType.replace(/-/g, '_')}
                </h3>
                <p className="text-[10px] text-gray-500 font-mono uppercase mt-1">Verify_Data_Integrity</p>
            </div>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px]">
            <span className="text-emerald-500 uppercase tracking-widest">Index</span>
            <span className="text-white">[{String(currentQuestionIndex + 1).padStart(2, '0')}]</span>
            <span className="text-gray-600">/</span>
            <span className="text-gray-500">[{String(questions.length).padStart(2, '0')}]</span>
        </div>
      </div>

      <div className="p-8 md:p-12">
        <h4 className="text-lg md:text-xl font-bold text-white mb-10 leading-relaxed font-mono">
            <span className="text-emerald-500 mr-3">{'>'}</span>
            {currentQuestion.question}
        </h4>

        {/* Dynamic Content Body */}
        <div className="mb-8">
            {questionType === 'multiple-choice' && (
                <MultipleChoiceQuestion
                    question={currentQuestion}
                    showResult={showResult}
                    isCorrect={isCorrect}
                    selectedOption={selectedOption}
                    onSelectOption={setSelectedOption}
                />
            )}
            {questionType === 'matching' && (
                <MatchingQuestion
                    question={currentQuestion}
                    showResult={showResult}
                    matches={matches}
                    onMatch={(left, right) => setMatches(prev => ({...prev, [left]: right}))}
                />
            )}
            {questionType === 'fill-in-the-blanks' && (
                <FillInTheBlanksQuestion
                    question={currentQuestion}
                    showResult={showResult}
                    isCorrect={isCorrect}
                    fillAnswer={fillAnswer}
                    onFillChange={setFillAnswer}
                />
            )}
            {questionType === 'code-writing' && (
                <CodeWritingQuestion
                    question={currentQuestion}
                    showResult={showResult}
                    isCorrect={isCorrect}
                    codeAnswer={codeAnswer}
                    onCodeChange={setCodeAnswer}
                />
            )}
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-8">
            <div className="h-1 flex-1 bg-white/5 overflow-hidden max-w-[100px] mr-8">
                 <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}></div>
            </div>

          {!showResult ? (
            <button
              onClick={handleCheckAnswer}
              className="px-8 py-4 bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
            >
              EXECUTE_CHECK
            </button>
          ) : (
            <button
              onClick={handleNext}
              className={`px-8 py-4 font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${
                isCorrect
                ? 'bg-emerald-500 text-black hover:bg-white'
                : 'bg-white text-black hover:bg-gray-200'
              }`}
            >
              <span>{currentQuestionIndex < questions.length - 1 ? 'NEXT_NODE' : 'FINALIZE'}</span>
              <ArrowRightIcon weight="bold" size={14} />
            </button>
          )}
        </div>

        {showResult && !isCorrect && (
            <div className="mt-6 flex items-start gap-4 p-4 border border-rose-500/20 bg-rose-500/5 text-rose-500">
                <WarningIcon size={20} className="flex-shrink-0" weight="fill" />
                <div className="space-y-1">
                    <p className="font-bold text-[10px] uppercase tracking-widest">Error_Detected</p>
                    <p className="font-mono text-[10px] opacity-70">Review the correct output above. Logic adjustment required.</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;