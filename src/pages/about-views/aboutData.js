import {
  Cpu,
  TerminalWindow,
  MusicNotes,
  Bug,
  Lightning,
  Globe,
  Shield,
  Keyboard,
} from '@phosphor-icons/react';

export const aboutData = {
  profile: {
    name: "A. Samil Bulbul",
    role: "Senior Software Engineer",
    tagline: "Constructing robust systems & digital dreams.",
    location: "Turkey",
    email: "samil.bulbul@gmail.com",
    avatar: "/images/avatar/default.png", // Placeholder path
  },
  stats: [
    { label: "Experience", value: "8+", unit: "Years" },
    { label: "Systems Built", value: "100+", unit: "Nodes" },
    { label: "Coffee", value: "Inf", unit: "Liters" },
  ],
  skills: [
    { name: "Go (Golang)", level: 95, icon: Cpu, type: "language" },
    { name: "System Design", level: 90, icon: Globe, type: "core" },
    { name: "Kubernetes", level: 85, icon: TerminalWindow, type: "devops" },
    { name: "Distributed Systems", level: 88, icon: Globe, type: "core" },
    { name: "React & JS", level: 80, icon: TerminalWindow, type: "frontend" },
  ],
  experience: [
    {
      company: "Picus Security",
      role: "Senior Software Engineer",
      period: "2022 - 2025",
      desc: "Led product initiatives in security, optimized backend services.",
      type: "Security",
    },
    {
      company: "Aselsan - Smart Cities",
      role: "Senior Software Engineer",
      period: "2021 - 2022",
      desc: "Developed critical infrastructure for smart cities and real-time data.",
      type: "Smart City",
    },
    {
      company: "Aselsan - Toll Collection",
      role: "Software Engineer",
      period: "2018 - 2021",
      desc: "Bridged dev and ops for reliable toll collection systems.",
      type: "Infrastructure",
    },
  ],
  traits: {
    superpower: {
      title: "The Architect's Eye",
      desc: "Can visualize the entire system topology and potential failure points before a single line of code is written.",
      icon: Lightning,
    },
    warStory: {
      title: "The Smart City Scale-Up",
      desc: "Optimized a real-time data pipeline to handle millions of concurrent sensor inputs for a smart city project, reducing latency by 90%.",
      icon: Shield,
    },
    kryptonite: {
      title: "Ambiguous Specs",
      desc: "Requirements that change mid-sprint are the only thing that can pierce the armor.",
      icon: Bug,
    },
    hobby: {
      title: "Sonic Alchemist",
      desc: "Creating sick beats and melodies. Exploring the intersection of code and sound.",
      icon: MusicNotes,
    },
    tool: {
      title: "The Terminal",
      desc: "Where the magic happens. Efficiency is key.",
      icon: Keyboard,
    },
  },
};
