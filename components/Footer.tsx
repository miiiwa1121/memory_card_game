import Link from "next/link";
import styles from "./Footer.module.css";

const gameLinks = [
  { name: "野菜神経衰弱", url: "/vegetable" },
  { name: "音階神経衰弱", url: "/sound" },
  { name: "色覚神経衰弱", url: "/color" },
  { name: "言語神経衰弱", url: "/language" },
  { name: "モールス神経衰弱", url: "/morse" },
  { name: "リズム感神経衰弱", url: "/rhythm" },
  { name: "知識神経衰弱", url: "/knowledge" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* ── Brand ── */}
        <div className={styles.brand}>
          <span className={styles.brandIcon}>🃏</span>
          <span className={styles.brandName}>Synesthesium</span>
          <p className={styles.brandDesc}>
            インストール不要・登録不要。
            <br />
            ブラウザだけで楽しめる無料カードゲーム集。
          </p>
        </div>

        {/* ── Game Links ── */}
        <div className={styles.linksSection}>
          <h3 className={styles.linksTitle}>ゲーム一覧</h3>
          <ul className={styles.linksList}>
            {gameLinks.map((game) => (
              <li key={game.url}>
                <Link href={game.url} className={styles.link}>
                  {game.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Copyright ── */}
      <div className={styles.bottom}>
        <p className={styles.copyright}>
          &copy; {currentYear} Synesthesium. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
