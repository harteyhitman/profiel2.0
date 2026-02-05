'use client';

import { useState } from 'react';
import styles from './FAQSection.module.scss';

export default function FAQSection() {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const toggleQuestion = (questionId: string) => {
    setOpenQuestion(openQuestion === questionId ? null : questionId);
  };

  const faqData = [
    {
      category: 'A',
      title: 'Persoonlijke Score',
      icon: '📊',
      questions: [
        {
          id: 'A1',
          question: 'Ben ik automatisch die bediening bij een hoge score?',
          answer: 'Nee. Een score laat zien waar je genade en aanleg ligt, maar bevestiging en vrucht komen door de Heilige Geest en de gemeente.'
        },
        {
          id: 'A2',
          question: 'Kan mijn score veranderen?',
          answer: 'Ja. Door groei, ervaringen en seizoenen kan een profiel verschuiven, maar je kernroeping blijft herkenbaar.'
        },
        {
          id: 'A3',
          question: 'Wat betekent een lage score?',
          answer: 'Dat betekent niet dat je "minder geestelijk" bent, maar dat die rol niet jouw primaire krachtveld is.'
        },
        {
          id: 'A4',
          question: 'Kan ik meerdere hoofdscores hebben?',
          answer: 'Soms wel. God combineert bedieningen, maar meestal word je in de praktijk vooral in één rol bevestigd.'
        }
      ]
    },
    {
      category: 'B',
      title: 'Roeping & Identiteit',
      icon: '🎯',
      questions: [
        {
          id: 'B1',
          question: 'Is score hetzelfde als roeping tot ambt?',
          answer: 'Nee. Een score laat aanleg zien, maar roeping wordt bevestigd door God, vrucht en de gemeente.'
        },
        {
          id: 'B2',
          question: 'Verschil tussen gave, roeping en ambt?',
          answer: 'Gave is geschenk van de Geest, roeping is Gods stem, ambt is herkenning door de gemeente.'
        },
        {
          id: 'B3',
          question: 'Hoe weet ik of God mijn bediening bevestigt?',
          answer: 'Door innerlijke overtuiging, vrucht in de praktijk en bevestiging door geestelijke leiders.'
        },
        {
          id: 'B4',
          question: 'Kan de kerk mij anders herkennen dan mijn score?',
          answer: 'Ja. De test is een hulpmiddel, maar Gods Geest en de gemeenschap zien soms bredere kanten.'
        }
      ]
    },
    {
      category: 'C',
      title: 'Relatie Gemeente',
      icon: '👥',
      questions: [
        {
          id: 'C1',
          question: 'Hoe gebruik ik mijn score in de gemeente?',
          answer: 'Door te dienen waar je gaven liggen en door anderen op te bouwen in liefde.'
        },
        {
          id: 'C2',
          question: 'Moet iedereen mijn bediening weten?',
          answer: 'Niet per se. Belangrijker is dat je bediening zichtbaar wordt in je daden en vrucht.'
        },
        {
          id: 'C3',
          question: 'Wat bij botsing met gemeentecultuur?',
          answer: 'Blijf in liefde dienen en zoek gesprek. God kan via jou nieuwe accenten brengen.'
        },
        {
          id: 'C4',
          question: 'Hoe omgaan met jaloezie over scores?',
          answer: 'Herinner jezelf dat alle gaven genade zijn en bedoeld om elkaar te dienen.'
        }
      ]
    },
    {
      category: 'D',
      title: 'Groei & Ontwikkeling',
      icon: '🌱',
      questions: [
        {
          id: 'D1',
          question: 'Kan ik groeien in een lage score rol?',
          answer: 'Ja, door oefening, onderwijs en de werking van de Geest kan groei plaatsvinden.'
        },
        {
          id: 'D2',
          question: 'Hoe ontwikkel ik mijn bediening?',
          answer: 'Door training, mentoring en actieve inzet in de gemeente.'
        },
        {
          id: 'D3',
          question: 'Is karakter belangrijker dan score?',
          answer: 'Ja. Karakter draagt de bediening; zonder karakter kan een hoge score schadelijk worden.'
        },
        {
          id: 'D4',
          question: 'Hoe weet ik of mijn bediening vrucht draagt?',
          answer: 'Door levens te zien veranderen en door bevestiging van anderen.'
        }
      ]
    },
    {
      category: 'E',
      title: 'Theologische Vragen',
      icon: '📖',
      questions: [
        {
          id: 'E1',
          question: 'Is mijn score Gods stem over mijn leven?',
          answer: 'Nee. Het is een hulpmiddel, maar Gods stem komt door de Geest, de Schrift en de gemeente.'
        },
        {
          id: 'E2',
          question: 'Hoe verhoudt dit zich tot de Geest?',
          answer: 'De Geest leidt altijd. De test helpt je dat concreet te herkennen.'
        },
        {
          id: 'E3',
          question: 'Is bediening een gave of opdracht?',
          answer: 'Beide: het is een genadegave en een roeping van Jezus om te dienen.'
        },
        {
          id: 'E4',
          question: 'Wat als mijn score me onzeker maakt?',
          answer: 'Breng je onzekerheid bij God. Je identiteit ligt in Christus, niet in cijfers.'
        }
      ]
    }
  ];

  return (
    <section id="faq" className={styles.faqSection}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Veelgestelde Vragen</h2>
          <p className={styles.subtitle}>
            Populaire vragen over de vijfvoudige bediening en persoonlijke scores
          </p>
        </div>

        {/* FAQ Cards Grid */}
        <div className={styles.faqGrid}>
          {faqData.map((category) => (
            <div 
              key={category.category}
              className={styles.faqCard}
            >
              {/* Category Header */}
              <div className={styles.categoryHeader}>
                <div className={styles.categoryHeaderContent}>
                  <div className={styles.iconWrapper}>
                    <span className={styles.icon}>{category.icon}</span>
                  </div>
                  <div className={styles.categoryInfo}>
                    <div className={styles.categoryTitleRow}>
                      <span className={styles.categoryBadge}>{category.category}</span>
                      <h3 className={styles.categoryTitle}>{category.title}</h3>
                    </div>
                    <p className={styles.questionCount}>
                      {category.questions.length} vragen
                    </p>
                  </div>
                </div>
              </div>

              {/* Questions List */}
              <div className={styles.questionsList}>
                {category.questions.map((item) => (
                  <div 
                    key={item.id}
                    className={`${styles.questionItem} ${
                      openQuestion === item.id ? styles.questionItemOpen : ''
                    }`}
                  >
                    <button
                      onClick={() => toggleQuestion(item.id)}
                      className={styles.questionButton}
                    >
                      <span className={styles.questionText}>{item.question}</span>
                      <svg
                        className={`${styles.chevronIcon} ${
                          openQuestion === item.id ? styles.chevronIconOpen : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    <div
                      className={`${styles.answerContainer} ${
                        openQuestion === item.id ? styles.answerContainerOpen : ''
                      }`}
                    >
                      <div className={styles.answerWrapper}>
                        <p className={styles.answerText}>
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Category Footer */}
              <div className={styles.categoryFooter}>
                <p className={styles.footerText}>
                  Meer vragen? Raadpleeg je gemeenteleiders
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={styles.bottomCTA}>
          <div className={styles.ctaCard}>
            <h3 className={styles.ctaTitle}>
              Nog meer vragen?
            </h3>
            <p className={styles.ctaText}>
              Neem contact op met je gemeenteleiders voor persoonlijk advies en geestelijke begeleiding.
            </p>
            <button className={styles.ctaButton}>
              Contact Opnemen
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
