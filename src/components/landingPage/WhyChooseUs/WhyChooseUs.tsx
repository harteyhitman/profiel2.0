import { PiUsersThreeBold } from 'react-icons/pi';
import styles from './WhyChooseUs.module.scss';
import { GiCogLock, GiProgression } from 'react-icons/gi';

export default function WhyChooseUs() {
  const features = [
    {
      title: 'Betere Teamvorming',
      description: 'Identificeer hiaten en sterke punten in je bedieningsteams om effectievere en gebalanceerde groepen op te bouwen.',
      icon: <PiUsersThreeBold />,
    },
    {
      title: 'Persoonlijke Ontwikkeling',
      description: 'Help individuen hun unieke geestelijke gaven te ontdekken en hun roeping in de bediening te begrijpen.',
      icon: <GiCogLock />,
    },
    {
      title: 'Datagestuurde Inzichten',
      description: 'Krijg uitgebreide analyses over de verdeling van geestelijke gaven en teambalans van je gemeente.',
      icon: <GiProgression />,
    },
  ];

  return (
    <section id="why-choose-us" className={styles.whyChooseUs}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Waarom Kiezen voor Ons</h2>
          <p className={styles.subtitle}>
            Ontdek hoe kerken en bedieningen Bedieningenprofiel gebruiken om eenheid op te bouwen, leiderschap te versterken en met doel te groeien.
          </p>
        </div>
        <div className={styles.features}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.icon}>{feature.icon}</div>
              <div className={styles.downtown}>
                    <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
              </div>
          
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
