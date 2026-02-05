'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.scss';
import Image from 'next/image';
import BrandLogo from '../../../public/navbar/brand-logo.png'
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">
            <Image src={BrandLogo} alt='logo' />
          </Link>
        </div>
        
        <button 
          className={styles.menuToggle}
          onClick={toggleMenu}
          aria-label="Menu openen of sluiten"
          aria-expanded={isMenuOpen}
        >
          <span className={styles.hamburger}>
            <span className={isMenuOpen ? styles.active : ''}></span>
            <span className={isMenuOpen ? styles.active : ''}></span>
            <span className={isMenuOpen ? styles.active : ''}></span>
          </span>
        </button>

        <div className={`${styles.menuContent} ${isMenuOpen ? styles.active : ''}`}>
          <ul className={styles.navLinks}>
            <li><a href="#how-it-works" onClick={() => setIsMenuOpen(false)}>Hoe het werkt</a></li>
            <li><a href="#fivefold-ministry" onClick={() => setIsMenuOpen(false)}>Vijfvoudige bediening</a></li>
            <li><a href="#why-choose-us" onClick={() => setIsMenuOpen(false)}>Waarom kiezen voor ons</a></li>
            <li><Link href="/subscription" onClick={() => setIsMenuOpen(false)}>Abonnement</Link></li>
            <li><a href="#testimonials" onClick={() => setIsMenuOpen(false)}>Testimonials</a></li>
            <li><Link href="/about" onClick={() => setIsMenuOpen(false)}>Over ons</Link></li>
          </ul>

          <div className={styles.mobileAuthButtons}>
            <Link href="/login" className={styles.loginButton} onClick={() => setIsMenuOpen(false)}>Inloggen</Link>
            <Link href="/register" className={styles.registerButton} onClick={() => setIsMenuOpen(false)}>Registreren</Link>
          </div>
        </div>

        <div className={styles.authButtons}>
          <Link href="/login" className={styles.loginButton}>Inloggen</Link>
          <Link href="/register" className={styles.registerButton}>Registreren</Link>
        </div>
      </div>
    </nav>
  );
}

