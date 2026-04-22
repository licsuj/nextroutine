import type { Metadata } from "next";
import styles from "../privacy/legal.module.css";

export const metadata: Metadata = {
  title: "Terms of Service — Next Routine",
};

export default function TermsPage() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <a href="/" className={styles.back}>← nextroutine.com</a>
        <h1 className={styles.heading}>Terms of service</h1>
        <p className={styles.updated}>Last updated: April 2026</p>

        <div className={styles.body}>
          <h2>Using Next Routine</h2>
          <p>Next Routine provides AI-generated fitness and lifestyle routines for personal, non-commercial use. By using this service you agree to these terms. You must be 16 or older to use the service.</p>

          <h2>Free and Pro plans</h2>
          <p>The free plan allows up to 3 routine generations with no account required. Pro subscribers ($9/month or $79/year) receive unlimited generations, progress tracking, and additional features as described on the pricing page. Subscriptions renew automatically and can be cancelled at any time.</p>

          <h2>Refund policy</h2>
          <p>We offer a 14-day money-back guarantee on new Pro subscriptions. Contact us within 14 days of your first charge for a full refund, no questions asked.</p>

          <h2>Medical disclaimer</h2>
          <p>Next Routine provides general fitness information, not medical advice. Consult a qualified healthcare professional before starting any new exercise programme, particularly if you have injuries, medical conditions, or have been inactive for an extended period.</p>

          <h2>Intellectual property</h2>
          <p>The routines generated for you are yours to use. The Next Routine platform, brand, and underlying technology remain the property of nextroutine.com.</p>

          <h2>Changes to these terms</h2>
          <p>We may update these terms from time to time. Continued use of the service after changes constitutes acceptance of the updated terms.</p>

          <h2>Contact</h2>
          <p>Questions? Email <a href="mailto:hello@nextroutine.com">hello@nextroutine.com</a></p>
        </div>
      </div>
    </main>
  );
}
