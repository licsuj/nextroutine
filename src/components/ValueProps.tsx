import styles from "./ValueProps.module.css";

const props = [
  {
    number: "01",
    title: "Actually personalized",
    body: "Not a template. Your routine is built around your real schedule, equipment, injuries, and goal — then gets harder as you improve.",
  },
  {
    number: "02",
    title: "Done in 60 seconds",
    body: "Answer five questions. Get a complete 7-day routine with daily structure, duration, and the reasoning behind every choice.",
  },
  {
    number: "03",
    title: "Adapts as you do",
    body: "Week two is harder than week one. Week four adapts if you tell us you're traveling. Your routine moves when your life does.",
  },
];

export default function ValueProps() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.label}>Why it works</div>
        <div className={styles.grid}>
          {props.map((p) => (
            <div key={p.number} className={styles.card}>
              <span className={styles.num}>{p.number}</span>
              <h3 className={styles.title}>{p.title}</h3>
              <p className={styles.body}>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
