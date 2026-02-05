import Image from 'next/image';
import styles from './MapSection.module.scss';
import MapImg from '../../../../public/whychooseus/map.png'
export default function MapSection() {
  return (
    <section id="map" className={styles.mapSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Ontdek Bedieningen in Nederland</h2>
          <p className={styles.subtitle}>
            Verken kerken en bedieningen die verbonden zijn via Bedieningenprofiel. Zoom in op de kaart om actieve gemeenten, leiderschapsteams en regionale bedieningen te zien die samen groeien.
          </p>
        </div>
        <div className={styles.mapContainer}>
          <div className={styles.mapPlaceholder}>
          
          <Image src={MapImg} alt='map' />
          </div>
        </div>
      </div>
    </section>
  );
}

