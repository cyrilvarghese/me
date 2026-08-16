import styles from "./CaseStats.module.css";

export default function CaseStats({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <div className={styles.stats}>
      {stats.map((s) => (
        <div key={s.label}>
          <p className={styles.value}>{s.value}</p>
          <p className={`mono-label ${styles.label}`}>{s.label}</p>
        </div>
      ))}
    </div>
  );
}
