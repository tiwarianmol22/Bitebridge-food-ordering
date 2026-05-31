import gsap from 'gsap';

/**
 * Split text into individual character spans for animation.
 * Replaces GSAP SplitText (paid plugin) with a free alternative.
 */
export function splitTextIntoChars(element) {
  if (!element) return [];
  const text = element.textContent;
  element.innerHTML = '';
  const chars = [];
  for (const char of text) {
    const span = document.createElement('span');
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.display = 'inline-block';
    span.className = 'char';
    element.appendChild(span);
    chars.push(span);
  }
  return chars;
}

/**
 * Cinematic hero text reveal animation.
 */
export function animateHeroText(element) {
  const chars = splitTextIntoChars(element);
  return gsap.fromTo(
    chars,
    { opacity: 0, y: 60, rotateX: -90 },
    {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 0.8,
      stagger: 0.03,
      ease: 'power4.out',
      delay: 0.3,
    }
  );
}

/**
 * Subtitle fade-in animation.
 */
export function animateSubtext(element) {
  return gsap.fromTo(
    element,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 1 }
  );
}

/**
 * Stagger animation for menu cards grid.
 */
export function staggerMenuCards(selector) {
  return gsap.fromTo(
    selector,
    { opacity: 0, y: 40, scale: 0.95 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power2.out',
    }
  );
}

/**
 * Counter animation for dashboard stats.
 */
export function animateCounter(element, endValue, duration = 1.5) {
  const obj = { value: 0 };
  return gsap.to(obj, {
    value: endValue,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      element.textContent = Math.round(obj.value).toLocaleString();
    },
  });
}

/**
 * Confetti/celebration animation for payment success.
 */
export function animateSuccess(container) {
  const particles = [];
  const colors = ['#F5A623', '#C9A84C', '#E0C96A', '#FFF8F0', '#4CAF50'];

  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 10 + 4}px;
      height: ${Math.random() * 10 + 4}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      pointer-events: none;
    `;
    container.appendChild(particle);
    particles.push(particle);
  }

  gsap.fromTo(
    particles,
    {
      x: container.offsetWidth / 2,
      y: container.offsetHeight / 2,
      scale: 0,
      opacity: 1,
    },
    {
      x: () => Math.random() * container.offsetWidth,
      y: () => Math.random() * container.offsetHeight,
      scale: () => Math.random() * 1.5 + 0.5,
      opacity: 0,
      rotation: () => Math.random() * 720 - 360,
      duration: 1.5,
      stagger: 0.02,
      ease: 'power3.out',
      onComplete: () => {
        particles.forEach((p) => p.remove());
      },
    }
  );
}

/**
 * Page entrance animation.
 */
export function animatePageEntrance(elements) {
  return gsap.fromTo(
    elements,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
    }
  );
}
