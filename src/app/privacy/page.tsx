import type { Metadata } from "next";
import styles from "./legal.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy — Next Routine",
};

export default function PrivacyPage() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <a href="/" className={styles.back}>← nextroutine.com</a>
        <h1 className={styles.heading}>Privacy policy</h1>
        <p className={styles.updated}>Last updated: April 2026</p>

        <div className={styles.body}>
          <h2>What we collect</h2>
          <p>When you use Next Routine, we collect the information you provide directly — your routine preferences (goal, available time, equipment), and your email address if you subscribe to our newsletter or create an account. We do not collect sensitive personal data.</p>

          <h2>How we use it</h2>
          <p>We use your information solely to generate and improve your personalized routines, send you the newsletter you opted into, and provide customer support. We do not sell your data to third parties.</p>

          <h2>Cookies</h2>
          <p>We use minimal cookies necessary to operate the site (session management, preferences). We use analytics cookies (via Plausible or PostHog) that are privacy-preserving and do not track you across other sites.</p>

          <h2>Third-party services</h2>
          <p>We use Anthropic's API to generate routines, Stripe to process payments, and Beehiiv to manage our newsletter. Each has its own privacy policy governing your data within their systems.</p>

          <h2>Your rights</h2>
          <p>You may request deletion of your account and associated data at any time by emailing us. Newsletter subscribers can unsubscribe via the link in any email.</p>

          <h2>Contact</h2>
          <p>Questions? Email <a href="mailto:hello@nextroutine.com">hello@nextroutine.com</a></p>
        </div>
      </div>
    </main>
  );
}
