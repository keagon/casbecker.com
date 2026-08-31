export const metadata = {
  title: "Breathology Privacy Policy",
  description:
    "Privacy policy for Breathology, the breathwork and meditation timer. Local-only sessions, no accounts, no analytics.",
};

export default function BreathologyPrivacyPage() {
  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: 24, lineHeight: 1.7 }}>
      <p style={{ marginBottom: 8 }}>
        <a href="https://casbecker.com/" rel="noreferrer">
          casbecker.com
        </a>
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
        Breathology Privacy Policy
      </h1>
      <p style={{ color: "#555", marginBottom: 24 }}>Last updated: 2026-08-31</p>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Overview</h2>
        <p>
          Breathology is a breathwork and meditation timer (bundle ID{" "}
          <code>nl.breathology.app</code>). A mandala paces inhale, hold, and
          exhale, or stays with you during a countdown or a track you pick from
          Files.
        </p>
        <p>
          This policy describes what Breathology collects, why, and where it
          lives. The operator is Cas Becker. Contact:{" "}
          <a href="mailto:cas.interleaf@gmail.com">cas.interleaf@gmail.com</a>.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Data we process</h2>
        <ul style={{ paddingLeft: 18 }}>
          <li>
            <strong>On your device only:</strong> pattern choices, session
            length, volume, and any audio files you import. Imported tracks are
            copied into the app’s private documents folder so they can play
            without leaving the sandbox.
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>What we do not collect</h2>
        <ul style={{ paddingLeft: 18 }}>
          <li>No account email, name, or password.</li>
          <li>No servers receive session or file information.</li>
          <li>No advertising identifiers for ads, and no ad networks.</li>
          <li>No analytics, crash, or marketing SDKs in the current app.</li>
          <li>We do not sell personal data.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>How we use it</h2>
        <ul style={{ paddingLeft: 18 }}>
          <li>Remember the last pattern, duration, and volume you chose.</li>
          <li>Play a track you imported without asking for it again.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Storage and retention</h2>
        <ul style={{ paddingLeft: 18 }}>
          <li>
            Preferences and imported audio stay on the phone unless you
            uninstall the app or clear its data.
          </li>
          <li>
            We do not upload files to casbecker.com or to any other server.
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Permissions</h2>
        <p>
          Breathology plays audio in the background so a session can continue
          when the phone is locked, and may ask for notification access so
          lock-screen playback controls work. The document picker is used only
          when you choose a file from Files or iCloud. The app does not record
          the microphone, and it does not access contacts, location, or Apple
          Music.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Your choices</h2>
        <ul style={{ paddingLeft: 18 }}>
          <li>Remove an imported track in the app to delete that copy.</li>
          <li>Uninstall the app or clear app storage to remove local files and preferences.</li>
          <li>
            Email{" "}
            <a href="mailto:cas.interleaf@gmail.com">cas.interleaf@gmail.com</a>{" "}
            with questions. There is no cloud account to delete.
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Children</h2>
        <p>
          Breathology is not directed at children under 13. If you believe a
          child has used the app in a way that concerns you, contact us.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Changes</h2>
        <p>
          We may update this policy. The “Last updated” date at the top will
          change when we do.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Contact</h2>
        <p>
          Cas Becker ·{" "}
          <a href="mailto:cas.interleaf@gmail.com">cas.interleaf@gmail.com</a> ·{" "}
          <a href="https://casbecker.com/">casbecker.com</a>
        </p>
      </section>
    </main>
  );
}
