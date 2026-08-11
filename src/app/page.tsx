import KnifeCanvas from "@/components/knife/KnifeCanvas";

/* Temporary Task 4 harness: closed vs open pose, replaced in Task 5. */
export default function Home() {
  return (
    <main
      className="section-shell"
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "center", minHeight: "100vh" }}
    >
      <div>
        <p className="mono-label" style={{ color: "var(--muted)", marginBottom: "1rem" }}>
          Closed
        </p>
        <KnifeCanvas />
      </div>
      <div>
        <p className="mono-label" style={{ color: "var(--muted)", marginBottom: "1rem" }}>
          Open
        </p>
        <KnifeCanvas
          angles={{ research: 72, product: 42, design: 18, code: -22, ai: -48, gtm: -76 }}
        />
      </div>
    </main>
  );
}
