import React, { useState } from 'react';

const TextTransformer = () => {
    const [inputText, setInputText] = useState('');

    const toLeet = (text) => {
        const leetMap = {
            'a': '4', 'b': '8', 'e': '3', 'g': '6', 'l': '1',
            'o': '0', 's': '5', 't': '7', 'z': '2',
            'A': '4', 'B': '8', 'E': '3', 'G': '6', 'L': '1',
            'O': '0', 'S': '5', 'T': '7', 'Z': '2'
        };
        return text.split('').map(char => leetMap[char] || char).join('');
    };

    const transformedText = toLeet(inputText);

    const textAreaStyle = {
        width: '100%',
        minHeight: '150px',
        backgroundColor: '#1F2937',
        color: '#E5E7EB',
        border: '1px solid #374151',
        borderRadius: '8px',
        padding: '10px',
        fontFamily: 'monospace',
        fontSize: '16px',
    };

    return (
        <div className="flex flex-col gap-4">
            <div>
                <label className="block mb-2 text-lg font-arvo text-gray-300">Your Text</label>
                <textarea
                    style={textAreaStyle}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type here..."
                />
            </div>
            <div>
                <label className="block mb-2 text-lg font-arvo text-gray-300">1337 5p34k</label>
                <textarea
                    style={textAreaStyle}
                    value={transformedText}
                    readOnly
                    placeholder="...b3c0m3s 7h15"
                />
            </div>
        </div>
    );
};

export default TextTransformer;
