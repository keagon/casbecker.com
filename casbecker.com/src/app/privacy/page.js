export const metadata = {
  title: "Privacy Policy – Audio Recording & Transcription",
  description: "Privacy policy for the Android app that records and uploads audio for transcription to casbecker.com/transvibe.",
};

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: 24, lineHeight: 1.7 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Privacy Policy – Audio Recording & Transcription</h1>
      <p style={{ color: "#555", marginBottom: 24 }}>Last updated: 2025-09-08</p>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Overview</h2>
        <p>
          This policy describes how the Android application (the “App”) and the backend service at
          {" "}
          <a href="https://www.casbecker.com/transvibe/api" target="_blank" rel="noreferrer">casbecker.com/transvibe</a>
          {" "}
          (the “Service”) handle audio that you record and upload for transcription.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Data We Collect</h2>
        <ul style={{ paddingLeft: 18 }}>
          <li>
            <strong>Audio content you record or select:</strong> The App allows you to record audio on your device or pick an
            existing audio file and upload it to the Service for transcription.
          </li>
          <li>
            <strong>Technical data (minimal):</strong> We may process limited technical metadata (file type/size) needed to
            accept and process your upload.
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>How We Use Your Data</h2>
        <ul style={{ paddingLeft: 18 }}>
          <li>
            <strong>Transcription:</strong> Your audio is transmitted to our transcription provider (OpenAI) solely to convert
            speech to text. The resulting text is returned to you in the App.
          </li>
          <li>
            <strong>No advertising:</strong> We do not use your audio or transcripts for advertising purposes.
          </li>
          <li>
            <strong>No sale of personal data:</strong> We do not sell your audio or transcripts.
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Processing & Storage</h2>
        <ul style={{ paddingLeft: 18 }}>
          <li>
            <strong>Transcoding:</strong> The Service may transcode your audio (e.g., to Opus) and split it into segments to
            ensure reliable transcription.
          </li>
          <li>
            <strong>Temporary storage:</strong> Audio files and intermediate segments are stored temporarily only for the
            duration of processing and then deleted automatically.
          </li>
          <li>
            <strong>Transcripts:</strong> Transcripts are generated and returned to your device. We do not persist transcripts on
            the server beyond the processing session unless explicitly stated elsewhere in the App.
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Third‑Party Processing</h2>
        <p>
          We use OpenAI’s transcription services to process your audio. Audio content is transmitted to OpenAI for the sole
          purpose of transcription and returned as text. OpenAI processes data in accordance with its terms and privacy
          commitments.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Security</h2>
        <ul style={{ paddingLeft: 18 }}>
          <li>Audio is uploaded over encrypted connections (HTTPS) in production.</li>
          <li>Server access to the transcription API is protected by server‑side credentials.</li>
          <li>The App authenticates to the Service using an API key you control.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Your Choices & Rights</h2>
        <ul style={{ paddingLeft: 18 }}>
          <li>You control which audio is recorded or uploaded.</li>
          <li>You can delete the App’s local data (including transcripts) from your device at any time.</li>
          <li>If you have questions about your data, contact us using the details below.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Children’s Privacy</h2>
        <p>
          The App and Service are not directed to children under 13. If you believe a child has provided audio or personal
          data, please contact us and we will take appropriate action.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>International Transfers</h2>
        <p>
          Audio and transcripts may be processed on servers located in different countries. We take steps to ensure
          appropriate protections consistent with applicable laws.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Changes to This Policy</h2>
        <p>
          We may update this policy from time to time. Material changes will be reflected on this page with an updated
          “Last updated” date.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Contact</h2>
        <p>
          For questions about this policy or your data, please reach out via the contact options on
          {" "}
          <a href="https://www.casbecker.com/" target="_blank" rel="noreferrer">casbecker.com</a>.
        </p>
      </section>
    </main>
  );
}


