import React from 'react';

export default function Omarchy() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        <strong className="text-current">Omarchy</strong> is an "opinionated" Linux distribution created by <strong>David Heinemeier Hansson (DHH)</strong>. It is designed to be a "turn-key" masterpiece of a development environment, removing the paradox of choice by delivering a pre-configured, high-performance system.
      </p>

      <div className="border-l-2 border-emerald-500/50 pl-4 py-1 italic opacity-70 text-xs">
        Origin: A portmanteau of <strong>"Omakase"</strong> (the chef's choice) and <strong>"Arch"</strong> (the underlying Linux base).
      </div>

      <p>Key pillars of the Omarchy ecosystem:</p>
      <ul className="space-y-2 text-xs opacity-80 list-disc pl-4">
        <li>
          <strong>The "Omakase" Philosophy:</strong> Borrowed from Japanese dining, DHH applies the "chef's choice" to software. Instead of the user spending weeks configuring dotfiles, the system comes with a curated selection of tools (Hyprland, Neovim, Alacritty) tuned to professional standards.
        </li>
        <li>
          <strong>Arch Linux Foundation:</strong> It utilizes Arch for its rolling release model, ensuring the latest packages and kernel improvements are always available.
        </li>
        <li>
          <strong>Keyboard-Centric Workflow:</strong> Built around the <strong>Hyprland</strong> tiling window manager, it emphasizes extreme efficiency and speed through Wayland-based animations and a dedicated "Super-key" command hierarchy.
        </li>
      </ul>

      <p>
        Omarchy represents the "sister project" to <strong>Omakub</strong>. While Omakub is a script for Ubuntu, Omarchy is a standalone ISO intended for those who want a pure, uncompromising developer workstation that "just works" exactly the way its creator intended.
      </p>
    </div>
  );
}
