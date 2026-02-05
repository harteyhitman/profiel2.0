import styles from './DataCard.module.scss';

export default function DataCard() {
  const ministries = [
    { name: 'Apostel', value: 85 },
    { name: 'Profeet', value: 70 },
    { name: 'Evangelist', value: 60 },
    { name: 'Herder', value: 75 },
    { name: 'Leraar', value: 65 },
  ];

  const lineData = [82, 75, 68, 72, 78];
  const maxValue = 100;

  return (
    <div className={styles.card}>
      {/* HEADER */}
      <div className={styles.membersChip}>
  <span className={styles.membersIcon}>👥</span>
  <span>Leden</span>
</div>

      <div className={styles.header}>
        <div>
          <span className={styles.meta}>Leden</span>
          <h2 className={styles.value}>2,847  <span className={styles.sub}>Actieve Profielen</span></h2>
         
        </div>

        <span className={styles.badge}>
          Vijfvoudige Bediening Rapport
        </span>
      </div>

      {/* CHART */}
      <div className={styles.chartShell}>
        <div className={styles.bars}>
          {ministries.map((m) => (
            <div key={m.name} className={styles.barCol}>
              <div
                className={styles.bar}
                style={{ height: `${(m.value / maxValue) * 100}%` }}
              />
              <span className={styles.label}>{m.name}</span>
            </div>
          ))}
        </div>

        <svg
          className={styles.line}
          viewBox="0 0 100 40"
          preserveAspectRatio="none"
        >
          <polyline
            points={lineData
              .map((v, i) => {
                const x = (i / (lineData.length - 1)) * 100;
                const y = 40 - (v / maxValue) * 40;
                return `${x},${y}`;
              })
              .join(' ')}
          />
        </svg>
      </div>

      {/* STATS */}
      <div className={styles.stats}>
        <Stat value="82%" label="Team Balans Score" />
        <Stat value="76%" label="Profiel Voltooiing" />
        <Stat value="23%" label="Nieuwe Profielen (30d)" />
      </div>
      <div className={styles.reportBadge}>
  <span className={styles.reportIcon}>📊</span>
  <span>Rapport</span>
</div>

    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className={styles.stat}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
