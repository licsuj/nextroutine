"use client";
import { useState } from "react";
import styles from "./FAQ.module.css";

const faqs = [
  {
    q: "Is this just AI-generated fluff?",
    a: "No. Every routine is built from your specific inputs — your available time, equipment, injuries, goal, and current level. If it doesn't fit, you can refine it in one tap. Most users find something they actually want to do within two iterations.",
  },
  {
    q: "What if I'm a complete beginner?",
    a: "That's exactly who this is built for. Tell us you're starting from zero and you'll get a starting-from-zero routine — not a scaled-down version of something designed for athletes.",
  },
  {
    q: "What does Pro get me that free doesn't?",
    a: "Free lets you generate up to 3 routines and view them. Pro ($9/month) gives you unlimited generation, saved progress tracked week by week, automatic adaptation, and export to PDF or calendar. Most people upgrade when they find a routine they want to stick to.",
  },
  {
    q: "Does it work without a gym?",
    a: "Completely. Tell us what you have — bodyweight only, resistance bands, a park nearby — and the routine is built around exactly that. No equipment is a valid and common answer.",
  },
  {
    q: "How does the week-by-week progression work?",
    a: "Each week is slightly harder than the last — more reps, longer duration, reduced rest. If you tell us week three was too easy or too hard, we recalibrate. The goal is continuous progress without burnout.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.col}>
          <div className={styles.label}>FAQ</div>
          <h2 className={styles.heading}>
            Honest answers
            <br />
            <em>to real questions.</em>
          </h2>
          <p className={styles.sub}>
            Still unsure? Build a free routine and see for yourself — no account
            required.
          </p>
          <a href="#build" className={styles.cta}>
            Try it free →
          </a>
        </div>

        <div className={styles.faqs}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`${styles.item} ${open === i ? styles.open : ""}`}
            >
              <button
                className={styles.question}
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span>{faq.q}</span>
                <span className={styles.icon}>{open === i ? "−" : "+"}</span>
              </button>
              <div className={styles.answer}>
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
