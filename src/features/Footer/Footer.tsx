import styles from './Footer.module.scss';
import BrandLogo from '../../../public/whychooseus/footerLogo.png'
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerColumn}>
            <div className={styles.logo}>
          <Image src={BrandLogo} alt='logo' className={styles.BrandLogoFooter}/>
            </div>
            <p className={styles.description}>
              Bedieningenprofiel helpt teams en individuen hun gaven te ontdekken en effectiever te begrijpen op basis van het Vijfvoudige Bedieningsmodel.
            </p>
            <p className={styles.copyright}>
              @2025 Bedieningenprofiel. Alle rechten voorbehouden
            </p>
          </div>

          <div className={styles.footerColumn}>
            <h3 className={styles.columnTitle}>Snelle Links</h3>
            <ul className={styles.links}>
              <li><a href="#about">Over ons</a></li>
              <li><a href="#why-choose-us">Waarom kiezen voor ons</a></li>
              <li><a href="#subscription">Abonnement</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
            </ul>
          </div>

          <div className={styles.footerColumn}>
            <h3 className={styles.columnTitle}>Juridisch</h3>
            <ul className={styles.links}>
              <li><a href="#terms">Algemene Voorwaarden</a></li>
              <li><a href="#privacy">Privacybeleid</a></li>
            </ul>
          </div>

          <div className={styles.footerColumn}>
            <h3 className={styles.columnTitle}>Contact</h3>
            <ul className={styles.contact}>
              <li>
                <a href="mailto:infobediengingerprofiel@gmail.com">
                  infobediengingerprofiel@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+31201234567">
                  +31 (0) 20 123 4567
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

