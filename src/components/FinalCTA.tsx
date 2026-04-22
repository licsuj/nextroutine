"use client";
import { useState } from "react";
import styles from "./FinalCTA.module.css";

const goals = [
  "Lose weight",
  "Build muscle",
  "More energy",
  "Better sleep",
  "Stay consistent",
  "Reduce stress",
];

const times = ["15 min", "20 min", "30 min", "45 min", "60 min+"];

export default function FinalCTA() {
  const [goal, setGoal] = useState("");
  const [time, setTime] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleBuild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal || !time) return;
    // Wire up to your AI routine builder endpoint
    setSubmitted(true);
  };

  return (
    <section className={styles.section} id="build">
      <div className={styles.inner}>
        {!submitted ? (
          <>
            <div className={styles.header}>
              <div className={styles.label}>Get started</div>
              <h2 className={styles.heading}>
                Your next routine is
                <br />
                <em>60 seconds away.</em>
              </h2>
              <p className={styles.sub}>Stop restarting. Start progressing.</p>
            </div>

            <form onSubmit={handleBuild} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>
                  What&rsquo;s your main goal?
                </label>
                <div className={styles.pills}>
                  {goals.map((g) => (
                    <button
                      key={g}
                      type="button"
                      className={`${styles.pill} ${goal === g ? styles.active : ""}`}
                      onClick={() => setGoal(g)}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>
                  How much time do you have per day?
                </label>
                <div className={styles.pills}>
                  {times.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`${styles.pill} ${time === t ? styles.active : ""}`}
                      onClick={() => setTime(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className={styles.submit}
                disabled={!goal || !time}
              >
                Build my routine — free
              </button>
              <p className={styles.note}>
                No account needed. Full routine in seconds.
              </p>
            </form>
          </>
        ) : (
          <div className={styles.success}>
            <div className={styles.successBadge}>
              Your routine is being built
            </div>
            <h2 className={styles.successHeading}>
              {goal}, {time} a day.
              <br />
              <em>Let&rsquo;s make it happen.</em>
            </h2>
            <p className={styles.successBody}>
              This is a demo — connect your AI backend to generate real routines.
              <br />
              The full builder goes live when you wire up the Anthropic API.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className={styles.resetBtn}
            >
              ← Try different inputs
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
