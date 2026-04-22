"use client";
import { useState, useEffect } from "react";
import styles from "./Nav.module.css";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        <a href="/" className={styles.logo}>
          next<span>routine</span>
        </a>
        <div className={styles.actions}>
          <a href="#how-it-works" className={styles.link}>
            How it works
          </a>
          <a href="#pricing" className={styles.link}>
            Pricing
          </a>
          <a href="#build" className={styles.cta}>
            Build my routine
          </a>
        </div>
      </div>
    </nav>
  );
}
