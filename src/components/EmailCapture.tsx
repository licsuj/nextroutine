"use client";
import { useState } from "react";
import styles from "./EmailCapture.module.css";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("loading");

    // Replace with your actual email provider endpoint (Beehiiv, ConvertKit, etc.)
    // Example Beehiiv: POST https://api.beehiiv.com/v2/publications/{id}/subscriptions
    try {
      await new Promise((res) => setTimeout(res, 800)); // simulate API call
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className={styles.section} id="newsletter">
      <div className={styles.inner}>
        <div className={styles.content}>
          <div className={styles.label}>Weekly routine tips</div>
          <h2 className={styles.heading}>
            Not ready yet?
            <br />
            <em>Get one thing instead.</em>
          </h2>
          <p className={styles.body}>
            We send one routine tip per week. No fluff — just a specific, tested
            adjustment that makes your next week better than your last.
          </p>
          <p className={styles.social}>
            Join 1,200+ people improving their routines.
          </p>
        </div>

        <div className={styles.formWrap}>
          {status === "success" ? (
            <div className={styles.success}>
              <span className={styles.successIcon}>✓</span>
              <p className={styles.successText}>You&rsquo;re in.</p>
              <p className={styles.successSub}>
                First tip lands in your inbox within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <label htmlFor="email-capture" className={styles.formLabel}>
                Your email address
              </label>
              <div className={styles.inputRow}>
                <input
                  id="email-capture"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={styles.input}
                  required
                  disabled={status === "loading"}
                />
                <button
                  type="submit"
                  className={styles.btn}
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "Sending…" : "Send me the first one"}
                </button>
              </div>
              {status === "error" && (
                <p className={styles.errorMsg}>
                  Something went wrong. Try again.
                </p>
              )}
              <p className={styles.fine}>
                One email per week. Unsubscribe anytime.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
