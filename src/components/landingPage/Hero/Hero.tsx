import styles from './Hero.module.scss';
import DataCard from '@/components/ui/DataCard/DataCard';

export default function Hero() {
  return (
    <section id="home" className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.textContent}>
            <h1 className={styles.heading}>
              Begrijp je gemeente en kerk.
            </h1>
            <p className={styles.subheading}>
              Bedieningenprofiel onthult de geestelijke gaven en leiderschapsbalans binnen je gemeente, waardoor je sterkere teams kunt opbouwen, wijs kunt coachen en met vertrouwen kunt leiden.
            </p>
            <div className={styles.ctaButtons}>
              <a href="#register" className={styles.primaryButton}>
                Start je profiel
              </a>
            </div>
          </div>
          <div className={styles.cardContent}>
            <DataCard />
          </div>
        </div>
      </div>
    </section>
  );
}
