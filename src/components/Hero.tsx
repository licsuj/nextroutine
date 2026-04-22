"use client";
import { useEffect, useRef } from "react";
import styles from "./Hero.module.css";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add(styles.visible);
  }, []);

  return (
    <section className={styles.hero} ref={ref}>
      {/* Decorative background grid */}
      <div className={styles.grid} aria-hidden="true" />

      {/* Floating badge */}
      <div className={styles.badge}>
        <span className={styles.dot} />
        Free to start &mdash; 60 seconds
      </div>

      <h1 className={styles.headline}>
        Stop Googling workouts.
        <br />
        <em>Start building routines</em>
        <br />
        that actually fit your life.
      </h1>

      <p className={styles.sub}>
        Tell us your goal, your schedule, and your limits.
        <br className={styles.br} />
        We'll generate a personalized routine — week by week — and adapt it as
        you improve.
      </p>

      <div className={styles.actions}>
        <a href="#build" className={styles.primary}>
          Build my routine — it&rsquo;s free
        </a>
        <a href="#how-it-works" className={styles.ghost}>
          See how it works
        </a>
      </div>

      <p className={styles.trust}>
        No account needed to start &mdash; 60 seconds to your first routine.
      </p>

      {/* Decorative ticker strip */}
      <div className={styles.ticker} aria-hidden="true">
        <div className={styles.tickerInner}>
          {[
            "Morning routine",
            "Strength training",
            "Shift workers",
            "20 minutes a day",
            "Injury recovery",
            "Remote workers",
            "Beginner-friendly",
            "No gym needed",
            "Morning routine",
            "Strength training",
            "Shift workers",
            "20 minutes a day",
            "Injury recovery",
            "Remote workers",
            "Beginner-friendly",
            "No gym needed",
          ].map((t, i) => (
            <span key={i} className={styles.tag}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
