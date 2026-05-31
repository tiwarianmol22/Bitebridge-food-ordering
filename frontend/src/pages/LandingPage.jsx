import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import PageTransition from '../components/PageTransition';
import { animateHeroText, animateSubtext } from '../animations/gsap-utils';
import burgerImg from '../assets/burger.png';
import pizzaImg from '../assets/pizza.png';
import friesImg from '../assets/fries.png';

export default function LandingPage() {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Hero text animation
    if (titleRef.current) animateHeroText(titleRef.current);
    if (subtitleRef.current) animateSubtext(subtitleRef.current);

    // Particle/gradient animation on canvas
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        color: ['#F5A623', '#C9A84C', '#E0C96A'][Math.floor(Math.random() * 3)],
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw gradient background
      const grd = ctx.createRadialGradient(
        canvas.width * 0.3, canvas.height * 0.4, 0,
        canvas.width * 0.3, canvas.height * 0.4, canvas.width * 0.8
      );
      grd.addColorStop(0, 'rgba(245, 166, 35, 0.05)');
      grd.addColorStop(0.5, 'rgba(201, 168, 76, 0.02)');
      grd.addColorStop(1, 'rgba(13, 13, 13, 0)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw particles
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(p.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
      });

      // Draw connecting lines
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach((b) => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(245, 166, 35, ${0.05 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <PageTransition>
      <div className="relative min-h-screen overflow-hidden">
        {/* Particle Canvas Background */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-0"
          style={{ background: 'var(--color-charcoal)' }}
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gold/10 rounded-full blur-[120px]" />
        </div>

        {/* Floating Food Images */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <motion.img
            src={burgerImg}
            alt="Delicious Burger"
            className="absolute top-1/4 left-[15%] w-48 md:w-64 opacity-80"
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          />
          <motion.img
            src={pizzaImg}
            alt="Pepperoni Pizza"
            className="absolute top-1/3 right-[10%] w-56 md:w-72 opacity-80"
            animate={{ y: [0, 25, 0], rotate: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
          />
          <motion.img
            src={friesImg}
            alt="Crispy Fries"
            className="absolute bottom-1/4 left-[20%] w-40 md:w-56 opacity-80"
            animate={{ y: [0, -15, 0], rotate: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-4"
          >
            <span className="text-4xl md:text-5xl">🍽️</span>
          </motion.div>

          <h1
            ref={titleRef}
            className="text-6xl md:text-8xl lg:text-9xl font-black mb-6 tracking-tight gradient-text"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            BiteBridge
          </h1>

          <p
            ref={subtitleRef}
            className="text-lg md:text-xl text-cream/60 max-w-xl mb-10 leading-relaxed"
            style={{ opacity: 0 }}
          >
            Premium dining experience, delivered to your doorstep.
            Curated flavors. Cinematic taste.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/menu" className="btn-primary text-lg !px-10 !py-4">
              Explore Menu
            </Link>
            <Link to="/signup" className="btn-secondary text-lg !px-10 !py-4">
              Get Started
            </Link>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-10"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-6 h-10 border-2 border-cream/20 rounded-full flex justify-center pt-2"
            >
              <motion.div className="w-1 h-2 bg-amber rounded-full" />
            </motion.div>
          </motion.div>
        </div>

        {/* Features Section */}
        <section className="relative z-10 py-24 pb-32 md:pb-48 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-center mb-16"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Why <span className="gradient-text">BiteBridge</span>?
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: '⚡',
                  title: 'Lightning Fast',
                  desc: 'From order to delivery in under 30 minutes. Real-time tracking keeps you informed every step.',
                },
                {
                  icon: '🔒',
                  title: 'Secure Payments',
                  desc: 'Multiple payment options with bank-grade encryption. Your data stays safe with us.',
                },
                {
                  icon: '🍳',
                  title: 'Fresh & Curated',
                  desc: 'Every dish crafted with premium ingredients. Our menu is curated for the finest taste.',
                },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="card p-8 text-center group"
                >
                  <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </span>
                  <h3
                    className="text-xl font-semibold text-cream mb-3"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-cream/50 text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-10 py-24 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center glass rounded-3xl p-12 md:p-16"
          >
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Ready to <span className="gradient-text">taste the difference</span>?
            </h2>
            <p className="text-cream/50 mb-8 max-w-lg mx-auto">
              Join thousands of food lovers who trust BiteBridge for their daily meals.
            </p>
            <Link to="/signup" className="btn-primary text-lg !px-10 !py-4 inline-block">
              Start Ordering Now
            </Link>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/5 py-8 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-cream/30 text-sm">
              © 2025 BiteBridge. All rights reserved.
            </p>
            <div className="flex gap-6 text-cream/30 text-sm">
              <span>Built with Flask + React + MySQL</span>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
}
