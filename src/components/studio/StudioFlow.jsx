import React, { useEffect, useRef } from 'react';
import { useAnimation } from '../../context/AnimationContext';
import { studioFlowFragment } from './studioFlowShader';

// The original Studio shader, with React lifecycle cleanup and live motion
// preferences. The CSS colour field remains when WebGL is unavailable.
export default function StudioFlow() {
  const ref = useRef(null);
  const { reduceMotion } = useAnimation();
  useEffect(() => {
    const canvas = ref.current;
    const host = canvas.parentElement;
    const gl = canvas.getContext('webgl', {
      antialias: false,
      alpha: false,
      powerPreference: 'low-power',
    });
    if (!gl) return undefined;
    const shaders = [];
    const program = gl.createProgram();
    const buffer = gl.createBuffer();
    const release = () => {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      shaders.forEach((shader) => gl.deleteShader(shader));
    };
    for (const [type, source] of [
      [
        gl.VERTEX_SHADER,
        'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}',
      ],
      [gl.FRAGMENT_SHADER, studioFlowFragment],
    ]) {
      const shader = gl.createShader(type);
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        release();
        return undefined;
      }
      gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      release();
      return undefined;
    }
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, 'p');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const uniform = (name) => gl.getUniformLocation(program, name);
    ['#fbf4e6', '#f6d2c0', '#c9e4d4', '#ee9166'].forEach((hex, index) =>
      gl.uniform3fv(
        uniform(`c${index}`),
        [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255),
      ),
    );
    const time = uniform('t');
    const pointer = uniform('m');
    gl.uniform1f(uniform('boost'), 0);
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let visible = true;
    let lost = false;
    let x = 0.5;
    let y = 0.5;
    let targetX = x;
    let targetY = y;
    const still = () => reduceMotion || media.matches;
    const draw = (now = 0) => {
      if (lost) return;
      x += (targetX - x) * 0.04;
      y += (targetY - y) * 0.04;
      gl.uniform1f(time, 32 + (still() ? 0 : now / 1000));
      gl.uniform2f(pointer, x, y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = (now) => {
      draw(now);
      frame = requestAnimationFrame(loop);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      if (!lost && !still() && visible && !document.hidden)
        frame = requestAnimationFrame(loop);
      else draw();
    };
    const resize = () => {
      canvas.width = Math.max(2, Math.round(host.clientWidth * 0.4));
      canvas.height = Math.max(2, Math.round(host.clientHeight * 0.4));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uniform('r'), canvas.width, canvas.height);
      draw();
    };
    const move = (event) => {
      if (still()) return;
      const rect = host.getBoundingClientRect();
      targetX = (event.clientX - rect.left) / rect.width;
      targetY = 1 - (event.clientY - rect.top) / rect.height;
    };
    const onLost = () => {
      lost = true;
      canvas.style.opacity = '0';
      cancelAnimationFrame(frame);
    };
    const resizeObserver = new ResizeObserver(resize);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    resizeObserver.observe(host);
    observer.observe(host);
    media.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    host.addEventListener('pointermove', move);
    canvas.addEventListener('webglcontextlost', onLost);
    resize();
    sync();
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      observer.disconnect();
      media.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
      host.removeEventListener('pointermove', move);
      canvas.removeEventListener('webglcontextlost', onLost);
      release();
    };
  }, [reduceMotion]);
  return <canvas ref={ref} className="std-flow-canvas" aria-hidden="true" />;
}
