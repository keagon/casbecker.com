export const metadata = {
  title: "DiscoSync — Request data deletion",
  description:
    "How to ask Cas Becker to delete DiscoSync room and clock-sync data associated with you.",
};

export default function DiscoSyncDeletePage() {
  const mail = "mailto:cas.interleaf@gmail.com?subject=DiscoSync%20data%20deletion";

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: 24, lineHeight: 1.7 }}>
      <p style={{ marginBottom: 8 }}>
        <a href="https://casbecker.com/" rel="noreferrer">
          casbecker.com
        </a>
        {" · "}
        <a href="https://casbecker.com/discosync">Privacy policy</a>
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
        DiscoSync data deletion
      </h1>
      <p style={{ color: "#555", marginBottom: 24 }}>Last updated: 2026-09-08</p>

      <section style={{ marginBottom: 24 }}>
        <p>
          DiscoSync does not use a name, email, or password. Firebase creates an anonymous
          ID on the phone. You can still ask us to delete the room and clock-sync data we
          can identify.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Request deletion</h2>
        <p>
          Email{" "}
          <a href={mail}>cas.interleaf@gmail.com</a> with subject “DiscoSync data
          deletion”. Include any of:
        </p>
        <ul style={{ paddingLeft: 18 }}>
          <li>Room codes you hosted or joined (the four-character code).</li>
          <li>Approximate date and time you used the app.</li>
          <li>The anonymous user ID, if you have it from a bug report.</li>
        </ul>
        <p>
          We will delete matching rooms, participant entries, and clock-sync records we
          can find, usually within a few days. We may not be able to match a request that
          has no room code or ID.
        </p>
        <p>
          <a href={mail}>Send a deletion email</a>
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>What is deleted automatically</h2>
        <ul style={{ paddingLeft: 18 }}>
          <li>Leaving a room removes your participant entry.</li>
          <li>Closing the app clears presence when the connection drops.</li>
          <li>
            Rooms older than about 7 days can be removed when someone next creates or
            joins. That is not a 90-day wipe of every anonymous ID.
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>On your phone</h2>
        <p>
          Uninstall DiscoSync or clear app storage to remove the downloaded audio file,
          headset calibration, and last-room code. Those never leave the device.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Contact</h2>
        <p>
          Cas Becker ·{" "}
          <a href="mailto:cas.interleaf@gmail.com">cas.interleaf@gmail.com</a> ·{" "}
          <a href="https://casbecker.com/discosync">Privacy policy</a>
        </p>
      </section>
    </main>
  );
}
