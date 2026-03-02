import React from 'react';

export default function BarnumEffect() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        The <strong className="text-current">Barnum Effect</strong>, also called the Forer Effect, is a common psychological phenomenon whereby individuals give high accuracy ratings to descriptions of their personality that supposedly are tailored specifically to them, yet which are in fact vague and general enough to apply to a wide range of people.
      </p>

      <p>
        This effect provides a partial explanation for the widespread acceptance of some paranormal beliefs and practices, such as astrology, fortune telling, aura reading, and some types of personality tests (like MBTI).
      </p>

      <div className="border-l-2 border-emerald-500/50 pl-4 py-2 my-6">
        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">
          Examples of Barnum Statements
        </h4>
        <ul className="space-y-2 text-xs text-gray-400">
          <li>-- "You have a great need for other people to like and admire you."</li>
          <li>-- "You have a tendency to be critical of yourself."</li>
          <li>-- "While you have some personality weaknesses, you are generally able to compensate for them."</li>
          <li>-- "At times you are extroverted, affable, sociable, while at other times you are introverted, wary, reserved."</li>
        </ul>
      </div>

      <p>
        Notice how these statements apply to almost <em>everyone</em>. The genius of the Barnum Effect is that it flatters the subject just enough to make them want to believe the source of the information.
      </p>
    </div>
  );
}