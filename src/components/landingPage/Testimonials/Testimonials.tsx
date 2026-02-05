import styles from './Testimonials.module.scss';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Pastor Daniel',
      role: 'Voorganger',
      content: 'Bedieningenprofiel hielp ons echt te begrijpen hoe ons team samen functioneert. We kunnen nu bedieningsgroepen bouwen die elkaar aanvullen in plaats van overlappen in rollen.',
    },
    {
      name: 'Zuster Esther',
      role: 'Kerkadministrateur',
      content: 'Deze tool gaf ons leiderschapsteam de duidelijkheid waar we voor hebben gebeden. We zien nu de gaven van onze mensen op een manier die zowel dienst als discipelschap begeleidt.',
    },
    {
      name: 'Dhr. Dayo',
      role: 'Ouderling / Kerkleider',
      content: 'We hebben eerder veel beoordelingen gebruikt, maar Bedieningenprofiel balanceert uniek geestelijk inzicht met praktische analyses. Het is een game-changer voor bedieningsgroei.',
    },
    {
      name: 'Mevr. Oreva',
      role: 'Lid van het Aanbiddingsteam',
      content: 'Ik ontdekte dat ik buiten mijn natuurlijke gave diende. Bedieningenprofiel hielp me mijn sterke punten af te stemmen op waar God me riep.',
    },
    {
      name: 'Pastor Grace',
      role: 'Jeugd & Missie Coördinator',
      content: 'Van onboarding tot inzichten, de ervaring is naadloos. Het maakt bedieningsontwikkeling georganiseerd, meetbaar en geïnspireerd aanvoelen.',
    },
    {
      name: 'Diaken Micheal',
      role: 'Teamleider, Evangelische kerk Utrecht',
      content: 'Het is verbazingwekkend hoe accuraat het aanvoelde. De inzichten beschreven me perfect en hielpen me te begrijpen hoe ik mijn team beter kan ondersteunen.',
    },
  ];

  return (
    <section id="testimonials" className={styles.testimonials}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Getuigenissen</h2>
          <div className={styles.divider}>
            <div className={styles.dividerLine}></div>
            <div className={styles.dividerStar}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 0L6.25 3.75L10 5L6.25 6.25L5 10L3.75 6.25L0 5L3.75 3.75L5 0Z" fill="#E0E0E0"/>
              </svg>
            </div>
            <div className={styles.dividerLine}></div>
          </div>
        </div>
        <div className={styles.testimonialsGrid}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className={styles.testimonialCard}>
              <p className={styles.content}>{testimonial.content}</p>
              <div className={styles.author}>
                <div className={styles.authorName}>{testimonial.name}</div>
                <div className={styles.authorRole}>{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
