import React, { useEffect, useRef } from 'react';
import useMotion from '../hooks/useMotion';

const LINK = 150;
const COLORS = ['126,166,255', '165,139,255', '86,214,196'];

// A live network behind the hero: nodes drift, and packets travel along their links.
const NetworkCanvas = ({ className = '' }) => {
  const ref = useRef(null);
  const moving = useMotion();

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas.getContext('2d');
    if (!context) return undefined;

    let nodes = [];
    let packets = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    const pointer = { x: -999, y: -999 };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.min(70, Math.round((width * height) / 16000));
      nodes = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1 + Math.random() * 1.8,
        color: COLORS[i % COLORS.length],
      }));
      packets = [];
      draw();
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      const links = [];
      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const distance = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (distance < LINK) {
            links.push([nodes[i], nodes[j]]);
            context.strokeStyle = `rgba(${nodes[i].color},${0.28 * (1 - distance / LINK)})`;
            context.beginPath();
            context.moveTo(nodes[i].x, nodes[i].y);
            context.lineTo(nodes[j].x, nodes[j].y);
            context.stroke();
          }
        }
        const near = Math.hypot(nodes[i].x - pointer.x, nodes[i].y - pointer.y);
        if (near < 180) {
          context.strokeStyle = `rgba(126,166,255,${0.5 * (1 - near / 180)})`;
          context.beginPath();
          context.moveTo(nodes[i].x, nodes[i].y);
          context.lineTo(pointer.x, pointer.y);
          context.stroke();
        }
        context.fillStyle = `rgba(${nodes[i].color},0.75)`;
        context.beginPath();
        context.arc(nodes[i].x, nodes[i].y, nodes[i].r, 0, Math.PI * 2);
        context.fill();
      }
      return links;
    };

    const tick = () => {
      frame = requestAnimationFrame(tick);
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
      });
      const links = draw();
      if (links.length > 0 && packets.length < 8 && Math.random() < 0.06) {
        const [a, b] = links[Math.floor(Math.random() * links.length)];
        packets.push({ a, b, at: 0 });
      }
      packets = packets.filter(packet => packet.at <= 1);
      packets.forEach(packet => {
        packet.at += 0.02;
        const x = packet.a.x + (packet.b.x - packet.a.x) * packet.at;
        const y = packet.a.y + (packet.b.y - packet.a.y) * packet.at;
        context.fillStyle = '#dfe8ff';
        context.beginPath();
        context.arc(x, y, 2.2, 0, Math.PI * 2);
        context.fill();
      });
    };

    const start = () => {
      cancelAnimationFrame(frame);
      if (moving && visible) frame = requestAnimationFrame(tick);
    };

    const onPointer = event => {
      const box = canvas.getBoundingClientRect();
      pointer.x = event.clientX - box.left;
      pointer.y = event.clientY - box.top;
    };

    const sizes = new ResizeObserver(resize);
    const views = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    sizes.observe(canvas);
    views.observe(canvas);
    window.addEventListener('pointermove', onPointer, { passive: true });
    start();

    return () => {
      cancelAnimationFrame(frame);
      sizes.disconnect();
      views.disconnect();
      window.removeEventListener('pointermove', onPointer);
    };
  }, [moving]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
};

export default NetworkCanvas;
