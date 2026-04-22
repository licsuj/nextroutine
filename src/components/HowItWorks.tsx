import styles from "./HowItWorks.module.css";

const steps = [
  {
    step: "1",
    title: "Tell us about yourself",
    body: "Five quick questions: your goal, available time, equipment, any injuries, and current level. No account required.",
  },
  {
    step: "2",
    title: "Get your 7-day routine",
    body: "Instantly receive a full week — daily structure, duration, and the reasoning behind every single choice.",
  },
  {
    step: "3",
    title: "Refine with one tap",
    body: "Doesn't fit? Hit refine and tell us why. The routine adapts immediately. Most users find their fit in one or two iterations.",
  },
  {
    step: "4",
    title: "Progress week by week",
    body: "Your routine gets smarter every week — harder, more tailored, and built around how you're actually progressing.",
  },
];

export default function HowItWorks() {
  return (
    <section className={styles.section} id="how-it-works">
      <div className={styles.inner}>
        <div className={styles.header}>
          <div className={styles.label}>How it works</div>
          <h2 className={styles.heading}>
            From zero to your perfect routine
            <br />
            <em>in under a minute.</em>
          </h2>
        </div>

        <div className={styles.steps}>
          {steps.map((s) => (
            <div key={s.step} className={styles.step}>
              <div className={styles.stepNum}>{s.step}</div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepBody}>{s.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.cta}>
          <a href="#build" className={styles.btn}>
            Build my routine — it&rsquo;s free
          </a>
          <p className={styles.note}>No account needed to start.</p>
        </div>
      </div>
    </section>
  );
}
