"use client";


import React, { useState, useMemo } from "react";

import Image from "next/image";
import styles from "./DashboardHeader.module.scss";
import Logo from "../../../../public/navbar/brand-logo.png";
import { IoIosNotifications } from "react-icons/io";
import { RiArrowDropDownLine } from "react-icons/ri";

import { useAuth } from "@/contexts/AuthContext";


interface DashboardHeaderProps {
  onMenuClick?: () => void;
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {

  const { user } = useAuth();
  const [showChurchDropdown, setShowChurchDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Get user initials from name
  const userInitials = useMemo(() => {
    if (!user?.name) return "U"; // Default to "U" for User
    
    const nameParts = user.name.trim().split(/\s+/);
    if (nameParts.length >= 2) {
      // First letter of first name + first letter of last name
      return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
    } else if (nameParts.length === 1) {
      // Single name - use first two letters
      return nameParts[0].substring(0, 2).toUpperCase();
    }
    return "U";
  }, [user?.name]);


  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button
          type="button"
          className={styles.menuButton}
          onClick={onMenuClick}
          aria-label="Menu openen"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <div className={styles.logoContainer}>
          <div className={styles.logo}>
            <Image src={Logo} alt="Logo" width={40} height={40} />
          </div>
          <h2>BEDIENINGENPROFIEL</h2>
        </div>
        <div className={styles.logoMobile}>
          <Image src={Logo} alt="Logo" width={32} height={32} />
        </div>
      </div>

      <div className={styles.headerActions}>
      <div className={styles.searchContainer}>
        <div className={styles.searchInput}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19 19L14.65 14.65"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            type="text"

            placeholder="Zoek naar lid, team of rol"

            className={styles.input}
          />
        </div>
      </div>
      <button className={styles.searchButtonMobile} aria-label="Zoeken">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19 19L14.65 14.65"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
        <button className={styles.iconButton} aria-label="Meldingen">
        <IoIosNotifications style={{ fontSize: '24px', color: '#000' }}/>
       
        </button>

        <div className={styles.dropdownContainer}>
          <button
            className={styles.dropdownButton}
            onClick={() => setShowChurchDropdown(!showChurchDropdown)}
          >

            <span>Kerk</span>

            <RiArrowDropDownLine style={{ fontSize: '24px', color: '#000' }}/>
          </button>
        </div>

        <div className={styles.userContainer}>
          <button
            className={styles.userButton}
            onClick={() => setShowUserDropdown(!showUserDropdown)}
          >
            <div className={styles.avatar}>

              <span>{userInitials}</span>

            </div>
            <RiArrowDropDownLine style={{ fontSize: '24px', color: '#000' }}/>
          </button>
        </div>
      </div>
    </header>
  );
}
