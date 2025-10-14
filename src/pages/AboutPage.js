import React from 'react';

const AboutPage = () => {
  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8 text-gray-300">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-8">About Me</h1>

        <p className="mb-6 text-lg leading-8">
          Hello! I'm a passionate software engineer with a keen interest in web development, open-source projects, and creating engaging user experiences. I love exploring new technologies and continuously learning to build robust and scalable applications.
        </p>

        <h2 className="text-3xl font-semibold tracking-tight text-white mb-4">My Skills</h2>
        <ul className="list-disc list-inside mb-6 ml-4">
          <li>React, JavaScript, TypeScript</li>
          <li>Node.js, Express.js</li>
          <li>Python, Django, Flask</li>
          <li>HTML, CSS, Tailwind CSS</li>
          <li>Database Management (SQL, NoSQL)</li>
          <li>Cloud Platforms (AWS, GCP)</li>
        </ul>

        <h2 className="text-3xl font-semibold tracking-tight text-white mb-4">Useful Links</h2>
        <ul className="list-disc list-inside mb-6 ml-4">
          <li>
            <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-500 transition-colors">
              GitHub Profile
            </a>
          </li>
          <li>
            <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-500 transition-colors">
              LinkedIn Profile
            </a>
          </li>
          <li>
            <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-500 transition-colors">
              Twitter
            </a>
          </li>
          <li>
            <a href="/blog" className="text-primary-400 hover:text-primary-500 transition-colors">
              My Blog Posts
            </a>
          </li>
        </ul>

        <h2 className="text-3xl font-semibold tracking-tight text-white mb-4">Contact</h2>
        <p>
          Feel free to reach out to me at <a href="mailto:your.email@example.com" className="text-primary-400 hover:text-primary-500 transition-colors">your.email@example.com</a>.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;