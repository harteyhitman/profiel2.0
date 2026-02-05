import styles from './HowItWorks.module.scss';
import Img1 from '../../../../public/quetsionnaires.jpg'
import Img2 from '../../../../public/profile.png'
import Img3 from '../../../../public/team.png'
import Img4 from '../../../../public/results.png'
import Image from 'next/image';

export default function HowItWorks() {

  const steps = [
    {
      icon: Img1,
      title: 'Vragenlijst',
      description: 'Leden vullen een uitgebreide beoordeling van geestelijke gaven in om hun unieke roeping en sterke punten te identificeren.',
    },
    {
      icon: Img2,
      title: 'Persoonlijk Profiel',
      description: 'Elk lid ontvangt een gedetailleerd profiel dat hun vijfvoudige bedieningsgaven toont en hoe ze bijdragen aan het team.',
    },
    {
      icon: Img3,
      title: 'Teamvorming',
      description: 'Leiders kunnen teamcomposities bekijken, hiaten identificeren en gebalanceerde bedieningsteams opbouwen op basis van datagestuurde inzichten.',
    },
    {
      icon: Img4,
      title: 'Resultaten',
      description: 'Volg teambalans, monitor groei en neem weloverwogen beslissingen om de effectiviteit van de bediening van je gemeente te versterken.',
    },
  ];

  return (
    <section id="how-it-works" className={styles.howItWorks}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Hoe werkt het?</h2>
          <p className={styles.subtitle}>
            De vijfvoudige bediening helpt kerkteams hun unieke samenstelling te begrijpen. Door een eenvoudig maar inzichtelijk proces kunnen leden hun door God gegeven sterke punten ontdekken, terwijl leiders inzicht krijgen in teamdynamiek en bedieningsgezondheid.
          </p>
        </div>
        <div className={styles.steps}>
          {steps.map((step, index) => (
            <div key={index} className={styles.step}>
              <div className={styles.icon}><Image src={step.icon} alt='thumbnails' /></div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
