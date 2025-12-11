import {
  Cpu,
  TerminalWindow,
  MusicNotes,
  Bug,
  Lightning,
  Globe,
  Shield,
  Keyboard,
  Database,
  Cloud,
  Code,
  ShareNetwork
} from '@phosphor-icons/react';

export const aboutData = {
  profile: {
    name: "A. Samil Bulbul",
    role: "Senior Software Engineer",
    tagline: "I turn complex distributed problems into elegant, reliable code.",
    location: "Turkey",
    email: "samil.bulbul@gmail.com",
    avatar: "/images/herdaim.jpg",
  },
  stats: [
    { label: "Experience", value: "8+", unit: "Years" },
    { label: "Go Routines", value: "1M+", unit: "Spawned" },
    { label: "Uptime", value: "99.9%", unit: "Personal" },
  ],
  skills: [
    { name: "Go (Golang)", level: 98, icon: Cpu, type: "language" },
    { name: "System Architecture", level: 95, icon: Globe, type: "core" },
    { name: "Kubernetes & Cloud", level: 90, icon: Cloud, type: "devops" },
    { name: "Distributed Systems", level: 88, icon: ShareNetwork, type: "core" },
    { name: "PostgreSQL & SQL", level: 92, icon: Database, type: "backend" },
    { name: "React & Frontend", level: 85, icon: Code, type: "frontend" },
  ],
  experience: [
    {
      company: "Picus Security",
      role: "Senior Software Engineer",
      period: "2022 - 2025",
      desc: "Architected the core simulation engine for Breach & Attack Simulation. Optimized microservices to handle massive scale security validation.",
      type: "Cybersecurity",
    },
    {
      company: "Aselsan - Smart Cities",
      role: "Senior Software Engineer",
      period: "2021 - 2022",
      desc: "Built the nervous system for smart cities. Processed millions of IoT sensor events in real-time to optimize urban flow.",
      type: "IoT / Big Data",
    },
    {
      company: "Aselsan - Toll Collection",
      role: "Software Engineer",
      period: "2018 - 2021",
      desc: "Developed critical toll collection infrastructure. Bridged the gap between high-speed hardware and cloud reliability.",
      type: "Critical Infra",
    },
  ],
  traits: {
    superpower: {
      title: "The Deadlock Breaker",
      desc: "Possesses an uncanny ability to visualize race conditions and distributed state inconsistencies before they manifest in production.",
      icon: Lightning,
    },
    warStory: {
      title: "The Zero-Downtime Migration",
      desc: "Orchestrated a live migration of a terabyte-scale database for a critical city infrastructure system without dropping a single packet.",
      icon: Shield,
    },
    kryptonite: {
      title: "Scope Creep",
      desc: "The silent killer of clean architecture. 'Just one small change' is the most dangerous phrase in the English language.",
      icon: Bug,
    },
    hobby: {
      title: "Sonic Synthesis",
      desc: "Explores the intersection of algorithms and acoustics. Creating synthwave beats that compile without errors.",
      icon: MusicNotes,
    },
    tool: {
      title: "The CLI",
      desc: "Where the mouse fears to tread. Efficiency lies in the keystrokes.",
      icon: Keyboard,
    },
  },
};