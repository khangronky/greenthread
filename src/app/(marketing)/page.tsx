'use client';

import anime from 'animejs';
import {
  Activity,
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle,
  Droplet,
  FileText,
  Leaf,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hero Section Animation
    if (heroRef.current) {
      anime({
        targets: heroRef.current.querySelectorAll('.hero-text'),
        opacity: [0, 1],
        translateY: [50, 0],
        delay: anime.stagger(100),
        duration: 1200,
        easing: 'easeOutExpo',
      });

      anime({
        targets: heroRef.current.querySelectorAll('.hero-icon'),
        scale: [0, 1],
        rotate: [180, 0],
        opacity: [0, 1],
        delay: anime.stagger(150, { start: 400 }),
        duration: 1000,
        easing: 'easeOutElastic(1, .8)',
      });
    }

    // Cards Animation on Scroll
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px',
    };

    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          anime({
            targets: entry.target.querySelectorAll('.stat-card'),
            opacity: [0, 1],
            translateY: [40, 0],
            scale: [0.95, 1],
            delay: anime.stagger(100),
            duration: 800,
            easing: 'easeOutExpo',
          });
          cardObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    if (cardsRef.current) cardObserver.observe(cardsRef.current);

    // Features Animation
    const featureObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          anime({
            targets: entry.target.querySelectorAll('.feature-card'),
            opacity: [0, 1],
            translateX: [-60, 0],
            delay: anime.stagger(150),
            duration: 1000,
            easing: 'easeOutExpo',
          });
          featureObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    if (featuresRef.current) featureObserver.observe(featuresRef.current);

    // CTA Animation
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          anime({
            targets: entry.target.querySelectorAll('.cta-item'),
            opacity: [0, 1],
            translateY: [30, 0],
            delay: anime.stagger(100),
            duration: 800,
            easing: 'easeOutExpo',
          });
          ctaObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    if (ctaRef.current) ctaObserver.observe(ctaRef.current);

    // Floating Animation for Icons
    anime({
      targets: '.floating-icon',
      translateY: [-10, 10],
      duration: 2000,
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine',
    });
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-green-50 to-green-100">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-green-100 border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 font-bold text-2xl text-green-dark">
            <Leaf className="text-green-primary" />
            GreenThread
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <Button className="rounded-full bg-green-dark px-6 py-2 text-white transition hover:bg-green-primary">
              Contact Us
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative overflow-hidden px-6 pt-32 pb-20"
      >
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 opacity-5">
          <Image
            src="https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=1200&h=800&fit=crop"
            alt="Background texture"
            width={1200}
            height={800}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h1 className="hero-text mb-6 font-black text-6xl text-gray-900 leading-tight md:text-7xl">
              STOP WASTEWATER VIOLATIONS.
              <br />
              <span className="text-green-dark">START COMPLIANCE.</span>
            </h1>
            <p className="hero-text mx-auto mb-8 max-w-2xl text-gray-600 text-xl">
              Real-time monitoring. AI predictions. Verifiable compliance.
              <br />
              Protect your textile operations from costly fines and market
              access losses.
            </p>
            <Button className="hero-text group mx-auto flex items-center gap-2 rounded-full bg-green-primary px-8 py-4 font-semibold text-lg text-white transition hover:bg-green-dark">
              Learn More
              <ArrowRight className="transition group-hover:translate-x-1" />
            </Button>
          </div>

          {/* Stats Cards */}
          <div
            ref={cardsRef}
            className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {/* Decorative Icons */}
            <div className="hero-icon floating-icon absolute -top-10 left-10 rounded-full bg-green-light p-4 shadow-lg">
              <Leaf className="text-green-dark" size={32} />
            </div>
            <div className="hero-icon floating-icon absolute -top-5 right-20 rounded-full bg-green-light p-4 shadow-lg">
              <Droplet className="text-green-dark" size={32} />
            </div>
            <div className="hero-icon floating-icon absolute right-10 bottom-10 rounded-full bg-green-light p-4 shadow-lg">
              <Zap className="text-green-dark" size={32} />
            </div>

            {/* Stat Cards */}
            <div className="stat-card relative overflow-hidden rounded-3xl bg-white p-6 shadow-lg transition-all hover:-translate-y-2 hover:shadow-xl">
              <div className="absolute top-0 right-0 h-32 w-32 opacity-10">
                <Image
                  src="https://plus.unsplash.com/premium_photo-1680103931756-b58c6df85669?q=80&w=872&auto=format&fit=crop"
                  alt="Green textile background"
                  width={872}
                  height={872}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <div className="relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-light">
                <Shield className="text-green-dark" />
              </div>
              <h3 className="relative z-10 mb-2 font-bold text-gray-900">
                reduce wastewater violations
              </h3>
              <p className="relative z-10 mb-1 font-black text-2xl text-green-dark">
                484B VND
              </p>
              <p className="relative z-10 text-gray-600 text-sm">
                Prevent fines annually
              </p>
            </div>

            <div className="stat-card relative overflow-hidden rounded-3xl bg-white p-6 shadow-lg transition-all hover:-translate-y-2 hover:shadow-xl">
              <div className="absolute top-0 right-0 h-32 w-32 opacity-10">
                <Image
                  src="https://images.unsplash.com/photo-1732679216826-dbe10200cbfe?q=80&w=1374&auto=format&fit=crop"
                  alt="Natural patterns background"
                  width={1374}
                  height={1374}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <div className="relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-light">
                <Activity className="text-green-dark" />
              </div>
              <h3 className="relative z-10 mb-2 font-bold text-gray-900">
                pollution prediction
              </h3>
              <p className="relative z-10 mb-1 font-black text-2xl text-green-dark">
                1-6 hours
              </p>
              <p className="relative z-10 text-gray-600 text-sm">
                Advance alerts
              </p>
            </div>

            <div className="stat-card relative overflow-hidden rounded-3xl bg-white p-6 shadow-lg transition-all hover:-translate-y-2 hover:shadow-xl">
              <div className="absolute top-0 right-0 h-32 w-32 opacity-10">
                <Image
                  src="https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=300&h=300&fit=crop"
                  alt="Leaf background"
                  width={300}
                  height={300}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <div className="relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-light">
                <CheckCircle className="text-green-dark" />
              </div>
              <h3 className="relative z-10 mb-2 font-bold text-gray-900">
                verified traceability
              </h3>
              <div className="relative z-10 mb-2 flex gap-2">
                <span className="rounded-full bg-green-primary px-3 py-1 text-white text-xs">
                  Tag
                </span>
                <span className="rounded-full bg-green-primary px-3 py-1 text-white text-xs">
                  Tag
                </span>
              </div>
              <p className="relative z-10 text-gray-600 text-sm">
                Blockchain verified
              </p>
            </div>

            <div className="stat-card relative overflow-hidden rounded-3xl bg-white p-6 shadow-lg transition-all hover:-translate-y-2 hover:shadow-xl">
              <div className="absolute top-0 right-0 h-32 w-32 opacity-10">
                <Image
                  src="https://images.unsplash.com/photo-1695700753226-1066b5a9ce21?q=80&w=687&auto=format&fit=crop"
                  alt="Green foliage background"
                  width={687}
                  height={687}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <div className="relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-light">
                <Brain className="text-green-dark" />
              </div>
              <h3 className="relative z-10 mb-2 font-bold text-gray-900">
                AI optimization
              </h3>
              <p className="relative z-10 mb-1 font-black text-2xl text-green-dark">
                Save 40%+
              </p>
              <p className="relative z-10 text-gray-600 text-sm">
                Operational costs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden border-green-primary border-y-4 bg-green-dark py-4">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(12)].map((_, i) => (
            <span
              key={i}
              className="mx-8 flex items-center gap-3 font-bold text-2xl text-white"
            >
              <Sparkles className="text-green-light" size={24} />
              Green The Thread
            </span>
          ))}
        </div>
      </div>

      {/* About Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 font-black text-5xl text-gray-900">
                TURN WASTEWATER RISK INTO
                <br />
                <span className="text-green-dark">COMPETITIVE ADVANTAGE</span>
              </h2>
              <p className="mb-8 text-gray-600 text-lg leading-relaxed">
                GreenThread connects textile operators, waste management
                companies, and regulators with real-time IoT data, predictive
                AI, and blockchain-verified compliance—reducing pollution while
                boosting export revenue.
              </p>
              <div className="flex gap-4">
                <Button className="rounded-full border-2 border-green-dark bg-green-light px-6 py-3 font-semibold text-green-dark transition hover:bg-green-dark hover:text-white">
                  About Us
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 font-semibold text-green-dark transition-all hover:gap-3"
                >
                  View more <ArrowRight />
                </Button>
              </div>
            </div>
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1695700753226-1066b5a9ce21?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Green leaf texture"
                width={687}
                height={384}
                className="h-96 w-full rounded-3xl object-cover shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-green-light p-3">
                    <Leaf className="text-green-dark" size={32} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Our Product</p>
                    <p className="text-gray-600 text-sm">AI-Powered Platform</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Showcase Gallery */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-black text-4xl text-gray-900">
              Nature-Inspired{' '}
              <span className="text-green-dark">Sustainability</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Just as nature maintains its balance, GreenThread helps your
              operations stay in harmony
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="group relative h-64 overflow-hidden rounded-2xl shadow-lg transition-all hover:shadow-2xl">
              <Image
                src="https://plus.unsplash.com/premium_photo-1680103931756-b58c6df85669?q=80&w=872&auto=format&fit=crop"
                alt="Green textile texture"
                width={872}
                height={256}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-end bg-linear-to-t from-green-dark/80 to-transparent p-6 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="font-semibold text-white">Textile Innovation</p>
              </div>
            </div>

            <div className="group relative h-64 overflow-hidden rounded-2xl shadow-lg transition-all hover:shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1732679216826-dbe10200cbfe?q=80&w=1374&auto=format&fit=crop"
                alt="Natural patterns"
                width={1374}
                height={256}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-end bg-linear-to-t from-green-dark/80 to-transparent p-6 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="font-semibold text-white">Natural Balance</p>
              </div>
            </div>

            <div className="group relative h-64 overflow-hidden rounded-2xl shadow-lg transition-all hover:shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=600&h=600&fit=crop"
                alt="Leaf detail"
                width={600}
                height={256}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-end bg-linear-to-t from-green-dark/80 to-transparent p-6 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="font-semibold text-white">Growth & Renewal</p>
              </div>
            </div>

            <div className="group relative h-64 overflow-hidden rounded-2xl shadow-lg transition-all hover:shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1695700753226-1066b5a9ce21?q=80&w=687&auto=format&fit=crop"
                alt="Green foliage"
                width={687}
                height={256}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-end bg-linear-to-t from-green-dark/80 to-transparent p-6 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="font-semibold text-white">Clean Future</p>
              </div>
            </div>
          </div>

          {/* Large Featured Image */}
          <div className="relative mt-8 h-96 overflow-hidden rounded-3xl shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1552440046-6b8b84f08e5c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Fern leaves pattern"
              width={687}
              height={384}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center bg-linear-to-r from-green-dark/90 to-transparent px-12">
              <div className="max-w-xl text-white">
                <h3 className="mb-4 font-black text-4xl">
                  Monitor. Predict. Protect.
                </h3>
                <p className="mb-6 text-lg">
                  From nature's complexity comes simple solutions for
                  sustainable operations
                </p>
                <Button className="rounded-full bg-white px-8 py-3 font-bold text-green-dark transition hover:bg-green-light">
                  Discover How
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={featuresRef}
        className="bg-linear-to-b from-transparent to-green-50 px-6 py-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-6 font-black text-5xl text-gray-900">
              Our Product
            </h2>
            <p className="mx-auto max-w-3xl text-gray-600 text-xl">
              GreenThread is an AI-powered wastewater monitoring platform that
              transforms textile operations through real-time intelligence and
              verified compliance
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Real-Time Monitoring */}
            <div className="feature-card rounded-3xl bg-white p-8 shadow-lg transition-all hover:shadow-2xl">
              <div className="mb-6">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-light">
                  <Activity className="text-green-dark" size={32} />
                </div>
                <h3 className="mb-4 font-bold text-2xl text-gray-900">
                  REAL-TIME MONITORING
                </h3>
              </div>

              {/* Gauge Visual */}
              <div className="mb-6 rounded-2xl bg-linear-to-br from-green-50 to-green-100 p-6">
                <div className="mb-4 flex items-center justify-center">
                  <div className="relative h-32 w-32">
                    <svg
                      aria-label="pH Level Gauge"
                      className="-rotate-90 transform"
                      viewBox="0 0 120 120"
                    >
                      <title>pH Level Gauge showing current pH value</title>
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="10"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="#5C7A3F"
                        strokeWidth="10"
                        strokeDasharray="314"
                        strokeDashoffset="78"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-black text-4xl text-green-dark">
                        7.4
                      </span>
                      <span className="text-gray-600 text-xs">pH Level</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-gray-600 text-xs">
                  <span>Updated: 5:32:13 PM</span>
                  <span className="rounded-full bg-green-primary px-2 py-1 text-white">
                    COMPLIANT
                  </span>
                </div>
              </div>

              <ul className="mb-6 space-y-3">
                <li className="flex items-start gap-2 text-gray-700">
                  <CheckCircle
                    className="mt-1 shrink-0 text-green-primary"
                    size={18}
                  />
                  <span>
                    Track critical parameters: COD, BOD, pH, dissolved oxygen,
                    turbidity
                  </span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <CheckCircle
                    className="mt-1 shrink-0 text-green-primary"
                    size={18}
                  />
                  <span>
                    ESP32 IoT sensors capture data 24/7 from your wastewater
                    discharge
                  </span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <CheckCircle
                    className="mt-1 shrink-0 text-green-primary"
                    size={18}
                  />
                  <span>Instant alerts for anomalies and pollution spikes</span>
                </li>
              </ul>

              <Button
                variant="ghost"
                className="flex items-center gap-2 font-semibold text-green-dark transition-all hover:gap-3"
              >
                View more <ArrowRight size={18} />
              </Button>
            </div>

            {/* AI Predictions */}
            <div className="feature-card rounded-3xl bg-green-primary p-8 text-white shadow-lg transition-all hover:shadow-2xl">
              <div className="mb-6">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                  <Brain className="text-white" size={32} />
                </div>
                <h3 className="mb-4 font-bold text-2xl">
                  AI PREDICTIONS & GUIDANCE
                </h3>
              </div>

              <div className="mb-6 rounded-2xl bg-white/10 p-6 backdrop-blur">
                <div className="mb-4 flex items-center gap-3">
                  <Sparkles size={24} />
                  <span className="font-semibold">Next 6 Hours Forecast</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">COD Level</span>
                    <span className="font-bold">Rising ↗</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/20">
                    <div
                      className="h-2 rounded-full bg-yellow-300"
                      style={{ width: '65%' }}
                    ></div>
                  </div>
                  <p className="text-xs opacity-90">
                    Suggested: Increase aeration by 15%
                  </p>
                </div>
              </div>

              <ul className="mb-6 space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-1 shrink-0" size={18} />
                  <span>
                    LSTM neural networks predict violations 1-6 hours ahead
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-1 shrink-0" size={18} />
                  <span>Actionable recommendations to prevent issues</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-1 shrink-0" size={18} />
                  <span>Optimize chemical dosing and treatment processes</span>
                </li>
              </ul>

              <Button
                variant="ghost"
                className="flex items-center gap-2 font-semibold text-white transition-all hover:gap-3"
              >
                View more <ArrowRight size={18} />
              </Button>
            </div>

            {/* Blockchain */}
            <div className="feature-card rounded-3xl bg-white p-8 shadow-lg transition-all hover:shadow-2xl">
              <div className="mb-6">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-light">
                  <Shield className="text-green-dark" size={32} />
                </div>
                <h3 className="mb-4 font-bold text-2xl text-gray-900">
                  BLOCKCHAIN VERIFICATION
                </h3>
              </div>

              <div className="mb-6 rounded-2xl bg-linear-to-br from-green-50 to-green-100 p-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-primary font-bold text-white">
                      1
                    </div>
                    <span className="text-gray-700">Data captured</span>
                    <CheckCircle
                      className="ml-auto text-green-primary"
                      size={18}
                    />
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-primary font-bold text-white">
                      2
                    </div>
                    <span className="text-gray-700">Hash generated</span>
                    <CheckCircle
                      className="ml-auto text-green-primary"
                      size={18}
                    />
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-primary font-bold text-white">
                      3
                    </div>
                    <span className="text-gray-700">Blockchain stored</span>
                    <CheckCircle
                      className="ml-auto text-green-primary"
                      size={18}
                    />
                  </div>
                </div>
              </div>

              <ul className="mb-6 space-y-3">
                <li className="flex items-start gap-2 text-gray-700">
                  <CheckCircle
                    className="mt-1 shrink-0 text-green-primary"
                    size={18}
                  />
                  <span>
                    Immutable compliance records that can't be altered
                  </span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <CheckCircle
                    className="mt-1 shrink-0 text-green-primary"
                    size={18}
                  />
                  <span>
                    Export-ready documentation for international buyers
                  </span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <CheckCircle
                    className="mt-1 shrink-0 text-green-primary"
                    size={18}
                  />
                  <span>Build trust with transparent, verifiable data</span>
                </li>
              </ul>

              <Button
                variant="ghost"
                className="flex items-center gap-2 font-semibold text-green-dark transition-all hover:gap-3"
              >
                View more <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Large GreenThread Branding */}
      <section className="overflow-hidden px-6 py-20">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-8">
          <div className="font-black text-8xl text-gray-200 tracking-wider">
            GREEN
          </div>
          <div className="relative">
            <Image
              src="https://images.unsplash.com/photo-1582084954680-ebfebf33eff7?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Leaf detail"
              width={687}
              height={687}
              className="h-48 w-48 rounded-full border-8 border-white object-cover shadow-2xl"
            />
          </div>
          <div className="font-black text-8xl text-gray-900 tracking-wider">
            THREAD
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section
        ref={ctaRef}
        className="relative overflow-hidden bg-linear-to-br from-green-50 to-white px-6 py-20"
      >
        {/* Background decorative images */}
        <div className="absolute top-0 right-0 h-64 w-64 opacity-5">
          <Image
            src="https://images.unsplash.com/photo-1582084954680-ebfebf33eff7?q=80&w=687&auto=format&fit=crop"
            alt="Background texture"
            className="h-full w-full rounded-full object-cover"
            width={687}
            height={687}
          />
        </div>
        <div className="absolute bottom-0 left-0 h-48 w-48 opacity-5">
          <Image
            src="https://plus.unsplash.com/premium_photo-1680103931756-b58c6df85669?q=80&w=872&auto=format&fit=crop"
            alt="Background texture"
            className="h-full w-full rounded-full object-cover"
            width={872}
            height={872}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 font-black text-5xl text-gray-900">
                GET STARTED WITH GREENTHREAD
              </h2>
              <p className="mb-8 text-gray-600 text-lg">
                GreenThread serves textile operators, waste management
                companies, and environmental regulators. Choose your role and
                begin real-time compliance monitoring.
              </p>

              {/* Add visual element */}
              <div className="relative mb-6 h-64 overflow-hidden rounded-2xl shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1732679216826-dbe10200cbfe?q=80&w=1374&auto=format&fit=crop"
                  alt="Sustainable operations"
                  className="h-full w-full object-cover"
                  width={1374}
                  height={1374}
                />
                <div className="absolute inset-0 flex items-end bg-linear-to-t from-green-dark/70 to-transparent p-6">
                  <p className="font-bold text-lg text-white">
                    Real-time compliance at your fingertips
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="cta-item group cursor-pointer rounded-2xl bg-green-light p-6 transition-all hover:bg-green-primary hover:text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-white p-3 transition group-hover:bg-green-dark">
                      <BarChart3
                        className="text-green-dark transition group-hover:text-white"
                        size={24}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">
                        ACCESS LIVE DASHBOARDS
                      </h3>
                      <p className="text-sm opacity-80">
                        Real-time monitoring of COD, BOD, pH, dissolved oxygen
                        with trend visualizations
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="transition group-hover:translate-x-2" />
                </div>
              </div>

              <div className="cta-item group cursor-pointer rounded-2xl bg-white p-6 shadow-md transition-all hover:bg-green-primary hover:text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-green-light p-3 transition group-hover:bg-green-dark">
                      <FileText
                        className="text-green-dark transition group-hover:text-white"
                        size={24}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">
                        REQUEST COMPLIANCE REPORTS
                      </h3>
                      <p className="text-sm opacity-80">
                        Generate blockchain-verified reports for regulators and
                        buyers
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="transition group-hover:translate-x-2" />
                </div>
              </div>

              <div className="cta-item group cursor-pointer rounded-2xl bg-white p-6 shadow-md transition-all hover:bg-green-primary hover:text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-green-light p-3 transition group-hover:bg-green-dark">
                      <Sparkles
                        className="text-green-dark transition group-hover:text-white"
                        size={24}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">
                        SEE AI PLAN & SUGGESTION
                      </h3>
                      <p className="text-sm opacity-80">
                        Get predictive insights and optimization recommendations
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="transition group-hover:translate-x-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="mb-6 font-black text-4xl text-gray-900">
            VIEW MONITORING DATA IN REAL-TIME
            <br />
            OR EXPLORE COMPLIANCE ANALYTICS
          </h2>
          <Button className="mb-12 rounded-full bg-green-dark px-8 py-4 font-semibold text-lg text-white transition hover:bg-green-primary">
            Live Dashboard
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-dark px-6 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Leaf size={32} />
                <span className="font-bold text-2xl">GreenThread</span>
              </div>
              <p className="text-green-light text-sm">
                Transforming textile wastewater management with AI and
                blockchain technology.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-bold">Product</h4>
              <ul className="space-y-2 text-green-light text-sm">
                <li>
                  <Link href="#" className="transition hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition hover:text-white">
                    Case Studies
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-bold">Company</h4>
              <ul className="space-y-2 text-green-light text-sm">
                <li>
                  <Link href="#" className="transition hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-bold">Resources</h4>
              <ul className="space-y-2 text-green-light text-sm">
                <li>
                  <Link href="#" className="transition hover:text-white">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition hover:text-white">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-green-primary border-t pt-8 text-center text-green-light text-sm">
            <p>&copy; 2026 GreenThread. Built with sustainability in mind.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
