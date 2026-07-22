"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import styles from "./Header.module.css";

const gameLinks = [
  { name: "野菜神経衰弱", url: "/vegetable" },
  { name: "音階神経衰弱", url: "/sound" },
  { name: "色覚神経衰弱", url: "/color" },
  { name: "言語神経衰弱", url: "/language" },
  { name: "モールス神経衰弱", url: "/morse" },
  { name: "リズム感神経衰弱", url: "/rhythm" },
  { name: "知識神経衰弱", url: "/knowledge" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} onClick={closeMenu}>
          <span className={styles.logoIcon}>🃏</span>
          <span className={styles.logoText}>Synesthesium</span>
        </Link>

        {/* ハンバーガーボタン */}
        <button
          className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ""}`}
          onClick={toggleMenu}
          aria-label="メニューを開く"
          aria-expanded={menuOpen}
        >
          <span className={styles.burgerLine} />
          <span className={styles.burgerLine} />
          <span className={styles.burgerLine} />
        </button>
      </div>

      {/* ドロップダウンメニュー */}
      {menuOpen && (
        <>
          <div className={styles.overlay} onClick={closeMenu} />
          <nav className={styles.menu}>
            <p className={styles.menuTitle}>ゲーム一覧</p>
            <ul className={styles.menuList}>
              {gameLinks.map((game) => (
                <li key={game.url}>
                  <Link
                    href={game.url}
                    className={styles.menuLink}
                    onClick={closeMenu}
                  >
                    {game.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
    </header>
  );
}
