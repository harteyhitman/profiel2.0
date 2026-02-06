import styles from './Subscription.module.scss';

export default function Subscription() {
  const plans = [
    {
      name: 'Gratis',
      desc: 'Voor kleine teams en individuen',
      price: '€0',
      period: '/ maand',
      features: [
        'Max. 40 gebruikers',
        '1 team',
        'Basis teamanalyses',
        'Persoonlijke profielen',
      ],
      popular: false,
    },
    {
      name: 'Pro',
      desc: 'Voor middelgrote teams en kerken',
      price: '€10',
      period: '/ maand',
      features: [
        'Max. 200 gebruikers',
        '20 teams',
        'Geavanceerde teamanalyses',
        'Data export opties',
        'Team gap analyse',
      ],
      popular: true,
    },
    {
      name: 'Pro Plus',
      desc: 'Voor grote kerken en organisaties',
      price: '€25',
      period: '/ maand',
      features: [
        'Max. 5000 gebruikers',
        '500 teams',
        'Alle Pro functies',
        'Kerkbrede statistieken',
        'Prioriteitsondersteuning',
        'Klantrapporten',
      ],
      popular: false,
    },
  ];

  return (
    <section id="subscription" className={styles.subscription}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Abonnement</h2>
          <p className={styles.subtitle}>
            Kies het plan dat bij jouw kerk of team past
          </p>
        </div>
        <div className={styles.plans}>
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`${styles.planCard} ${plan.popular ? styles.popular : ''}`}
            >
              {plan.popular && <div className={styles.badge}>Aanbevolen</div>}
              <h3 className={styles.planName}>{plan.name}</h3>
              <div className={styles.price}>
                <span className={styles.priceAmount}>{plan.price}</span>
                <span className={styles.pricePeriod}>{plan.period}</span>
              </div>
              <div className={styles.desc}>{plan.desc}</div>
              <ul className={styles.features}>
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className={styles.feature}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.667 5L7.5 14.167 3.333 10" stroke={plan.popular ? "#FFFFFF" : "#34C759"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>

                    {feature}
                  </li>
                ))}
              </ul>
              <a href="/register" className={styles.ctaButton}>
                Registreren
              </a>
            </div>
          ))}
        </div>
        <p className={styles.footerText}>
          Jaarlijkse facturering is beschikbaar met 20% korting. Neem contact met ons op voor meer informatie
        </p>
      </div>
    </section>
  );
}
