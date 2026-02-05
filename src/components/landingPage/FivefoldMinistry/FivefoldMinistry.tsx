import { CgEye } from 'react-icons/cg';
import styles from './FivefoldMinistry.module.scss';
import { FaCompass, FaBullhorn, FaLeaf, FaBook, FaRegCompass } from "react-icons/fa";
import { LuHandshake } from 'react-icons/lu';
import { SlBookOpen } from 'react-icons/sl';

export default function FivefoldMinistry() {

const ministries = [
  {
    title: "Apostel",
    description: `Je bent een pionier en visionair, 
    je ziet het grote plaatje en bent gericht op het bouwen en 
    uitbreiden van Gods Koninkrijk, je legt graag nieuwe 
    fundamenten en geniet van uitdaging en verandering.`,
    icon: <FaRegCompass />,
    bgColor: "blue",
  },

  {
    title: "Profeet",
    description: `Je hebt een sterk vermogen om Gods stem te horen en zijn waarheid te spreken. 
    Je bent vaak gericht op het zien van wat er mis is en hoe het verbeterd kan worden, 
    je brengt inzichten en perspectief die mensen uitdagen om geestelijk te groeien.`,
    icon: <CgEye />,
    bgColor: "purple",
  },

  {
    title: "Evangelist",
    description: `Je bent gepassioneerd over het delen van het evangelie en het bereiken van mensen met de boodschap van redding. 
    Je hebt een natuurlijke gave om anderen te inspireren en te motiveren om hun geloof te delen. 
    Je geniet van het bouwen van relaties en het leiden van anderen naar Christus.`,
    icon: <FaBullhorn />,
    bgColor: "red",
  },

  {
    title: "Herder",
    description: `Je hebt een hart voor zorg en begeleiding. Je bent gericht op het welzijn en de groei van individuen. 
    Je bent geduldig, empathisch en geniet van het ondersteunen en bemoedigen van anderen in hun geloofsreis. 
    Je creëert graag een veilige en ondersteunende omgeving voor geestelijke groei.`,
    icon: <LuHandshake />,
    bgColor: "green",
  },

  {
    title: "Leraar",
    description: `Je hebt een passie voor het uitleggen en verdiepen van Gods Woord. 
    Je bent gericht op het helpen van anderen om de waarheid te begrijpen en toe te passen. 
    Je geniet van studie, onderzoek en het delen van kennis die anderen helpt geestelijk te groeien.`,
    icon: <SlBookOpen />,
    bgColor: "yellow",
  },

];

  return (
    <section id="fivefold-ministry" className={styles.fivefoldMinistry}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>De Vijfvoudige Bediening</h2>
          <p className={styles.subtitle}>
            Een eenvoudige visuele manier om te begrijpen hoe elke rol een gezonde, gebalanceerde kerk versterkt.
          </p>
        </div>
        <div className={styles.ministries}>
          {ministries.map((ministry, index) => (
            <div key={index} className={`${styles.ministryCard} ${styles[ministry.bgColor]}`}>
              <div className={styles.toping}>
                  <div className={styles.icon}>{ministry.icon}</div>
              <h3 className={styles.ministryTitle}>{ministry.title}</h3>
              </div>
            
              <p className={styles.ministryDescription}>{ministry.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
