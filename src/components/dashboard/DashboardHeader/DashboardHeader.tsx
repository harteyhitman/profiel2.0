"use client";


import React, { useEffect, useMemo, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./DashboardHeader.module.scss";
import Logo from "../../../../public/navbar/brand-logo.png";
import { IoIosNotifications } from "react-icons/io";
import { RiArrowDropDownLine } from "react-icons/ri";

import { useAuth } from "@/contexts/AuthContext";
import { useMyChurch, useMyChurches } from "@/hooks/use-dashboard";
import { useStoredActiveChurchId } from "@/hooks/use-active-church";


interface DashboardHeaderProps {
  onMenuClick?: () => void;
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [showChurchDropdown, setShowChurchDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const churchDropdownRef = useRef<HTMLDivElement | null>(null);
  const userDropdownRef = useRef<HTMLDivElement | null>(null);
  const { data: myChurchData } = useMyChurch();
  const { data: myChurchesData } = useMyChurches();
  const [selectedChurchId, setSelectedChurchId] = useStoredActiveChurchId();

  const displayName = user?.name?.trim() || "Gebruiker";
  const avatarLabel = displayName.charAt(0).toUpperCase();
  const churchName = myChurchData?.church?.name || myChurchesData?.[0]?.name || "Kerk";
  const showChurchMenu = user?.role === "teamleader";
  const churchOptions = myChurchesData ?? (myChurchData?.church ? [myChurchData.church] : []);

  const userMenuItems = useMemo(
    () =>
      user?.role === "teamleader"
        ? [
            { label: "Mijn profiel", href: "/dashboard/profile" },
            { label: "Mijn account", href: "/dashboard/account" },
          ]
        : [
            { label: "Mijn profiel", href: "/dashboard/profile" },
            { label: "Resultaat", href: "/dashboard/result" },
          ],
    [user?.role]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (churchDropdownRef.current && !churchDropdownRef.current.contains(target)) {
        setShowChurchDropdown(false);
      }

      if (userDropdownRef.current && !userDropdownRef.current.contains(target)) {
        setShowUserDropdown(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowChurchDropdown(false);
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleToggleChurchDropdown = () => {
    setShowChurchDropdown((prev) => !prev);
    setShowUserDropdown(false);
  };

  const handleToggleUserDropdown = () => {
    setShowUserDropdown((prev) => !prev);
    setShowChurchDropdown(false);
  };

  const handleCloseMenus = () => {
    setShowChurchDropdown(false);
    setShowUserDropdown(false);
  };

  const handleSelectChurch = (churchId: number) => {
    setSelectedChurchId(churchId);
    setShowChurchDropdown(false);
  };

  const handleLogout = async () => {
    handleCloseMenus();
    await logout();
  };


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
        <button className={styles.iconButton} aria-label="Meldingen">
        <IoIosNotifications style={{ fontSize: '24px', color: '#000' }}/>
       
        </button>

        {showChurchMenu && (
          <div className={styles.dropdownContainer} ref={churchDropdownRef}>
            <button
              type="button"
              className={styles.dropdownButton}
              onClick={handleToggleChurchDropdown}
              aria-expanded={showChurchDropdown}
              aria-haspopup="menu"
            >
              <span className={styles.dropdownLabel}>{churchName}</span>
              <RiArrowDropDownLine
                style={{ fontSize: '24px', color: '#000' }}
                className={showChurchDropdown ? styles.dropdownIconOpen : undefined}
              />
            </button>
            {showChurchDropdown && (
              <div className={styles.dropdownMenu} role="menu" aria-label="Kerk menu">
                {churchOptions.map((church) => {
                  const isActiveChurch = church.id === (selectedChurchId ?? myChurchData?.church?.id);
                  const location = [church.city, church.denomination].filter(Boolean).join(" · ");

                  return (
                    <button
                      key={church.id}
                      type="button"
                      className={`${styles.dropdownAction} ${isActiveChurch ? styles.dropdownItemActive : ""}`}
                      role="menuitemradio"
                      aria-checked={isActiveChurch}
                      onClick={() => handleSelectChurch(church.id)}
                    >
                      <span className={styles.dropdownItemBody}>
                        <span className={styles.dropdownItemTitle}>{church.name}</span>
                        {location ? <span className={styles.dropdownItemMeta}>{location}</span> : null}
                      </span>
                      {isActiveChurch ? <span className={styles.dropdownCheck}>Actief</span> : null}
                    </button>
                  );
                })}
                <Link
                  href="/dashboard/profile/church"
                  className={`${styles.dropdownItem} ${pathname === "/dashboard/profile/church" ? styles.dropdownItemActive : ""}`}
                  role="menuitem"
                  onClick={handleCloseMenus}
                >
                  Kerkprofiel beheren
                </Link>
              </div>
            )}
          </div>
        )}

        <div className={styles.userContainer} ref={userDropdownRef}>
          <button
            type="button"
            className={styles.userButton}
            onClick={handleToggleUserDropdown}
            aria-expanded={showUserDropdown}
            aria-haspopup="menu"
          >
            <div className={styles.avatar}>
              <span>{avatarLabel}</span>
            </div>
            <span className={styles.userName}>{displayName}</span>
            <RiArrowDropDownLine
              style={{ fontSize: '24px', color: '#000' }}
              className={`${styles.userDropdownIcon} ${showUserDropdown ? styles.dropdownIconOpen : ""}`}
            />
          </button>
          {showUserDropdown && (
            <div className={`${styles.dropdownMenu} ${styles.userDropdownMenu}`} role="menu" aria-label="Gebruiker menu">
              {userMenuItems.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${styles.dropdownItem} ${isActive ? styles.dropdownItemActive : ""}`}
                    role="menuitem"
                    onClick={handleCloseMenus}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <button type="button" className={styles.dropdownAction} onClick={handleLogout}>
                Uitloggen
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
