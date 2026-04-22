import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <a href="/" className={styles.logo}>
              next<span>routine</span>
            </a>
            <p className={styles.tagline}>
              Your next routine should always be better than your last.
            </p>
          </div>

          <nav className={styles.links} aria-label="Footer navigation">
            <div className={styles.col}>
              <div className={styles.colHead}>Product</div>
              <a href="#how-it-works">How it works</a>
              <a href="#pricing">Pricing</a>
              <a href="#build">Build my routine</a>
              <a href="#newsletter">Newsletter</a>
            </div>
            <div className={styles.col}>
              <div className={styles.colHead}>Legal</div>
              <a href="/privacy">Privacy policy</a>
              <a href="/terms">Terms of service</a>
            </div>
          </nav>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>
            &copy; {year} nextroutine.com — All rights reserved.
          </p>
          <p className={styles.made}>Built to help you build better habits.</p>
        </div>
      </div>
    </footer>
  );
}
