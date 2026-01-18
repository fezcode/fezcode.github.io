import React from 'react';

export default function LinguaFranca() {
  return (
    <div className="space-y-4">
      <p>
        A <strong>Lingua Franca</strong> (literally "Frankish language") is a
        language or way of communicating which is used between people who do not
        speak each other's native language.
      </p>
      <p>
        In modern contexts, it often refers to a common language that is
        adopted as a bridge for communication across different linguistic
        groups.
      </p>
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <h4 className="text-sm font-bold text-blue-400 mb-2">Examples:</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-400">
          <li>
            <strong>English:</strong> The global lingua franca of science,
            aviation, and the internet.
          </li>
          <li>
            <strong>Latin:</strong> The lingua franca of scholars and the Catholic
            Church in Europe for centuries.
          </li>
          <li>
            <strong>Swahili:</strong> A major lingua franca in East Africa.
          </li>
          <li>
            <strong>JavaScript:</strong> Often called the lingua franca of the
            web.
          </li>
        </ul>
      </div>
    </div>
  );
}
