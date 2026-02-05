import Image from 'next/image';
import styles from './SubscriptionPage.module.scss';
import BrandLogo from '../../../../public/Subscriptions/tarieven.svg';
import BrandLogo1 from '../../../../public/Subscriptions/tolieting.svg';
import BrandLogo2 from '../../../../public/Subscriptions/waroom.svg';
import BrandLogo3 from '../../../../public/Subscriptions/investeringskosten.svg';
import Subscription from '@/components/landingPage/Subscription/Subscription';

const SubscriptionPage = () => {
  return (
    <div className={styles.subscriptionPage}>
      <Image src={BrandLogo} alt="Tarieven" className={styles.BrandLogo1} />
      <Subscription /> <br />
      <Image src={BrandLogo1} alt="Tarieven" className={styles.BrandLogo1} />
      <Image src={BrandLogo2} alt="Tarieven" className={styles.BrandLogo2} />
      <Image src={BrandLogo3} alt="Tarieven" className={styles.BrandLogo3} />
    </div>
  );
};

export default SubscriptionPage;