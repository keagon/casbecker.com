export const metadata = {
  title: "DiscoSync Privacy Policy",
  description:
    "Privacy policy for DiscoSync, the shared-listening app. How rooms, clock sync, and Google Drive file links are handled.",
};

export default function DiscoSyncPrivacyPage() {
  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: 24, lineHeight: 1.7 }}>
      <p style={{ marginBottom: 8 }}>
        <a href="https://casbecker.com/" rel="noreferrer">
          casbecker.com
        </a>
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
        DiscoSync Privacy Policy
      </h1>
      <p style={{ color: "#555", marginBottom: 24 }}>Last updated: 2026-09-08</p>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Overview</h2>
        <p>
          DiscoSync is a shared-listening app (bundle ID <code>nl.discosync.app</code>).
          One person hosts a room with a public Google Drive file link; others join with a
          four-character code so phones can play the same track in sync.
        </p>
        <p>
          This policy describes what DiscoSync collects, why, and where it lives. The
          operator is Cas Becker. Contact:{" "}
          <a href="mailto:cas.interleaf@gmail.com">cas.interleaf@gmail.com</a>.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Data we process</h2>
        <ul style={{ paddingLeft: 18 }}>
          <li>
            <strong>Anonymous account:</strong> Firebase creates an anonymous user ID when
            you open the app. We do not ask for your name, email, or phone number.
          </li>
          <li>
            <strong>Room state:</strong> room code, whether playback is playing or paused,
            track position, a revision number, and who is hosting. Participant entries use
            generic labels (“DJ” / “Dancer”), join time, and a clock-confidence value.
          </li>
          <li>
            <strong>Clock sync:</strong> short timing pings against Firebase Realtime
            Database so devices can estimate clock offset. These are tied to the anonymous
            user ID.
          </li>
          <li>
            <strong>Track link (host only):</strong> the public Google Drive file URL the
            host pastes so everyone can download the same file. DiscoSync does not host
            or store the audio on our servers.
          </li>
          <li>
            <strong>On your device only:</strong> the downloaded audio file, headset
            calibration values, and app preferences. Those stay on the phone unless you
            uninstall the app or clear its data.
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>What we do not collect</h2>
        <ul style={{ paddingLeft: 18 }}>
          <li>No account email, name, or password.</li>
          <li>No advertising identifiers for ads, and no ad networks.</li>
          <li>No analytics, crash, or marketing SDKs in the current app.</li>
          <li>We do not sell personal data.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>How we use it</h2>
        <ul style={{ paddingLeft: 18 }}>
          <li>Keep a room’s playback position aligned across phones.</li>
          <li>Show who is in the room and whether they are the host.</li>
          <li>Let everyone download the host’s public Drive file to their own device.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Storage and retention</h2>
        <ul style={{ paddingLeft: 18 }}>
          <li>
            Room and clock-sync data live in Google Firebase Realtime Database (region
            europe-west1). Rooms can be removed after about 7 days of inactivity.
          </li>
          <li>
            Leaving a room removes your participant entry. Closing the app also clears
            presence when the connection drops.
          </li>
          <li>
            Audio files are fetched from Google Drive to your device. We do not upload
            them to Firebase Storage or to casbecker.com.
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Third parties</h2>
        <p>
          We use Google Firebase (Authentication and Realtime Database) to run rooms and
          clock sync. Google processes that data under its terms. When you play a track,
          your device downloads it from Google Drive using the public link the host
          provided. Drive’s own privacy policy applies to that file.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Permissions</h2>
        <p>
          DiscoSync may ask for lock-screen / notification access and, on Android, an
          unrestricted-battery setting so playback can continue in the background. You
          can skip those prompts; playback still works, but background reliability may
          be lower. The app does not request microphone, contacts, or location.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Your choices</h2>
        <ul style={{ paddingLeft: 18 }}>
          <li>Leave a room at any time to drop your presence entry.</li>
          <li>Uninstall the app or clear app storage to remove local files and calibration.</li>
          <li>
            Request deletion at{" "}
            <a href="https://casbecker.com/discosync/delete">
              casbecker.com/discosync/delete
            </a>{" "}
            or email{" "}
            <a href="mailto:cas.interleaf@gmail.com">cas.interleaf@gmail.com</a>.
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Children</h2>
        <p>
          DiscoSync is not directed at children under 13. If you believe a child has
          used the app in a way that concerns you, contact us and we will delete the
          related room data we can identify.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>International transfers</h2>
        <p>
          Firebase may process data on servers outside your country, including the EU
          region we configure and other Google locations needed to run the service.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Changes</h2>
        <p>
          We may update this policy. The “Last updated” date at the top will change when
          we do.
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
