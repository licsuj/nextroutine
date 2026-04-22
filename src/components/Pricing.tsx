import styles from "./Pricing.module.css";

const free = [
  "Generate up to 3 routines",
  "7-day structured plan",
  "One-tap refinement",
  "No account required",
];

const pro = [
  "Unlimited routine generation",
  "Save & track week-by-week progress",
  "Automatic weekly adaptation",
  "Export to PDF or calendar",
  "Priority support",
];

export default function Pricing() {
  return (
    <section className={styles.section} id="pricing">
      <div className={styles.inner}>
        <div className={styles.header}>
          <div className={styles.label}>Pricing</div>
          <h2 className={styles.heading}>
            Start free.
            <br />
            <em>Upgrade when it clicks.</em>
          </h2>
        </div>

        <div className={styles.grid}>
          {/* Free card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.tier}>Free</div>
              <div className={styles.price}>
                <span className={styles.amount}>$0</span>
                <span className={styles.period}>forever</span>
              </div>
            </div>
            <ul className={styles.features}>
              {free.map((f) => (
                <li key={f} className={styles.feature}>
                  <span className={styles.check}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <a href="#build" className={styles.freeBtn}>
              Get started free
            </a>
          </div>

          {/* Pro card */}
          <div className={`${styles.card} ${styles.proCard}`}>
            <div className={styles.proBadge}>Most popular</div>
            <div className={styles.cardHeader}>
              <div className={styles.tier}>Pro</div>
              <div className={styles.price}>
                <span className={styles.amount}>$9</span>
                <span className={styles.period}>/month</span>
              </div>
              <div className={styles.annual}>or $79/year — save 27%</div>
            </div>
            <ul className={styles.features}>
              {pro.map((f) => (
                <li key={f} className={`${styles.feature} ${styles.proFeature}`}>
                  <span className={styles.check}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <a href="#build" className={styles.proBtn}>
              Start with Pro
            </a>
            <p className={styles.proNote}>14-day money-back guarantee.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
