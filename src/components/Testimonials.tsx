import styles from "./Testimonials.module.css";

const quotes = [
  {
    text: "I've tried every fitness app. This is the first routine that didn't feel copy-pasted from a magazine.",
    author: "Jamie",
    detail: "34 — remote worker",
    initial: "J",
  },
  {
    text: "I told it I had a bad knee, 20 minutes in the morning, and no gym. It gave me something I could actually do.",
    author: "Marcus",
    detail: "41 — shift nurse",
    initial: "M",
  },
  {
    text: "I upgraded after three days. The week-two progression alone was worth it.",
    author: "Priya",
    detail: "28 — student",
    initial: "P",
  },
];

export default function Testimonials() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.label}>What people are saying</div>
        <div className={styles.grid}>
          {quotes.map((q, i) => (
            <figure key={i} className={styles.card}>
              <blockquote className={styles.quote}>
                &ldquo;{q.text}&rdquo;
              </blockquote>
              <figcaption className={styles.author}>
                <div className={styles.avatar}>{q.initial}</div>
                <div>
                  <div className={styles.name}>{q.author}</div>
                  <div className={styles.detail}>{q.detail}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
