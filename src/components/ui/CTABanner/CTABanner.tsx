import { FaArrowRightLong } from 'react-icons/fa6';
import styles from './CTABanner.module.scss';

export default function CTABanner() {
  return (
    <section className={styles.ctaBanner}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Klaar om je kerk naar het volgende niveau te brengen</h2>
        <p className={styles.description}>
          Ontdek hoe het Vijfvoudige Bedieningsmodel je team kan transformeren
        </p>
        <a href="/login" className={styles.ctaButton}>
          Begin vandaag
          {/* <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 15L12.5 10L7.5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg> */}
          <FaArrowRightLong color="white" size={20} className={styles.arrowIcon}/>
        </a>
      </div>
    </section>
  );
}

