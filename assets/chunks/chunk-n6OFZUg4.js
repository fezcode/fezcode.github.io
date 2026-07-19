import{j as t}from"../entries/pages.Bef1y-Vk.js";const e=`url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.24 0 0 0 0 0.28 0 0 0 0 0.27 0 0 0 0.16 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,a=()=>t.jsxs("div",{"aria-hidden":"true",className:"pointer-events-none fixed inset-0 z-40",children:[t.jsx("style",{children:`
      @keyframes mist-veil-drift-a {
        0%, 100% { transform: translate3d(-4%, -2%, 0); opacity: 0.5; }
        50% { transform: translate3d(4%, 2%, 0); opacity: 0.75; }
      }
      @keyframes mist-veil-drift-b {
        0%, 100% { transform: translate3d(3%, 2%, 0); opacity: 0.4; }
        50% { transform: translate3d(-3%, -3%, 0); opacity: 0.65; }
      }
      @media (prefers-reduced-motion: reduce) {
        .mist-veil-a, .mist-veil-b { animation: none !important; }
      }
    `}),t.jsx("div",{className:"mist-veil-a absolute -top-[20%] -left-[15%] w-[80%] h-[60%] rounded-full",style:{background:"radial-gradient(ellipse, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 65%)",filter:"blur(40px)",animation:"mist-veil-drift-a 26s ease-in-out infinite"}}),t.jsx("div",{className:"mist-veil-b absolute -bottom-[25%] -right-[10%] w-[75%] h-[65%] rounded-full",style:{background:"radial-gradient(ellipse, rgba(223,229,227,0.9) 0%, rgba(223,229,227,0) 65%)",filter:"blur(50px)",animation:"mist-veil-drift-b 34s ease-in-out infinite"}}),t.jsx("div",{className:"absolute inset-0 opacity-[0.5] mix-blend-multiply",style:{backgroundImage:e}})]});export{a as M};
