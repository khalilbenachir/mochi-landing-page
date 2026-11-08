import Image from "next/image";
import { APP_STORE_URL, asset } from "@/content/mochi";
import landing from "./MaquetteLanding.module.css";
import styles from "./HeroBand.module.css";

const NAV = [
  { href: "#features", label: "Features" },
  { href: "#flavors", label: "Flavors" },
  { href: "#privacy", label: "Privacy" },
  { href: "#faq", label: "FAQ" },
] as const;

const MOBILE_NAV = [...NAV.slice(0, 3), { href: "#plus", label: "Mochi Plus" }, NAV[3]] as const;

/** Mascot art for the hero. Swap this one path to change the illustration. */
export const HERO_MASCOT = { src: "/mochi/hero-mochi.webp", width: 1400, height: 1120 } as const;

export function AppleLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

function Sparkle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <path fill="currentColor" d="M20 0c1.6 10.2 9.8 18.4 20 20-10.2 1.6-18.4 9.8-20 20-1.6-10.2-9.8-18.4-20-20C10.2 18.4 18.4 10.2 20 0Z" />
    </svg>
  );
}

function Rays({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="5">
        <path d="M25 4 21 15" /><path d="M36 13 27 19" /><path d="M4 22 16 24" />
      </g>
    </svg>
  );
}

function Petal({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M12 4.2 10.4 1.1C6 1.4 3.4 5.8 4 11.2 4.6 17 8.4 21.4 12 23c3.6-1.6 7.4-6 8-11.8.6-5.4-2-9.8-6.4-10.1Z" />
    </svg>
  );
}

export function FreeSticker({ className }: { className?: string }) {
  return (
    <span className={className} aria-label="Free">
      <svg viewBox="0 0 100 64" aria-hidden="true">
        <path fill="#ffd93d" d="M14 12c6-6 14-3 19-7 6-4 13-5 19-1 6-3 14-2 19 2 7 0 13 4 15 10 6 4 8 11 5 17 2 7-1 13-7 16-3 6-10 9-17 8-6 4-14 4-20 1-7 2-14 0-18-5-7-1-12-6-12-13-5-5-5-12 0-17-1-5 2-9 7-11Z" />
        <text x="50" y="41" textAnchor="middle" fill="#0b121c" fontSize="24" fontWeight="1000" fontFamily="inherit" transform="rotate(-9 50 34)">FREE</text>
      </svg>
      <Rays className={styles.stickerRays} />
    </span>
  );
}

export function AppStoreBadge({ compact = false, dark = false }: { compact?: boolean; dark?: boolean }) {
  return (
    <a
      href={APP_STORE_URL}
      className={`${styles.badge} ${compact ? styles.badgeCompact : ""} ${dark ? styles.badgeDark : ""}`}
      aria-label="Download Mochi on the App Store"
    >
      <AppleLogo className={styles.apple} />
      {compact ? (
        <span>Download on the App Store</span>
      ) : (
        <span className={styles.badgeText}><small>Download on the</small><strong>App Store</strong></span>
      )}
    </a>
  );
}

function Header() {
  return (
    <header className={styles.header}>
      <a href="#top" className={styles.brand} aria-label="Mochi home">
        <Image src={asset.face.happy} alt="" width={58} height={46} priority />
        <span>Mochi</span>
      </a>
      <nav className={styles.nav} aria-label="Main navigation">
        {NAV.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
      </nav>
      <div className={styles.headerCta}><AppStoreBadge compact /></div>
      <details className={`${landing.mobileMenu} ${styles.mobileMenu}`}>
        <summary aria-label="Open navigation menu"><i /><i /><i /></summary>
        <nav aria-label="Mobile navigation">
          {MOBILE_NAV.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
          <AppStoreBadge dark />
        </nav>
      </details>
    </header>
  );
}

export function HeroBand() {
  return (
    <section id="top" className={styles.hero}>
      <div className={styles.stage}>
        <Header />

        <div className={styles.copy}>
          <h1><span>The cute, private</span> <span>period tracker</span> <span>for iPhone</span></h1>
          <p>
            Mochi is a free period tracker for iPhone that predicts your next period, reminds you when to
            change your pad and turns daily check-ins into a game. No account needed.
          </p>
          <div className={styles.actions}>
            <AppStoreBadge />
            <FreeSticker className={styles.free} />
          </div>
        </div>

        <div className={styles.art} aria-hidden="false">
          <Petal className={`${styles.petal} ${styles.petalA}`} />
          <Rays className={styles.mascotRays} />
          <Image
            className={styles.mascot}
            src={HERO_MASCOT.src}
            alt="Mochi, a smiling pink mochi mascot, resting on a cream cushion"
            width={HERO_MASCOT.width}
            height={HERO_MASCOT.height}
            priority
            sizes="(max-width: 1099px) 70vw, 33vw"
          />
          <Sparkle className={`${styles.sparkle} ${styles.sparkleA}`} />
          <Sparkle className={`${styles.sparkle} ${styles.sparkleB}`} />
          <Image
            className={styles.phone}
            src="/mochi/hero-phone.webp"
            alt="Mochi home screen on iPhone showing Day 2 of a period with Period, Mood and Symptoms shortcuts"
            width={1024}
            height={1536}
            priority
            sizes="(max-width: 1099px) 42vw, 23vw"
          />
          <Petal className={`${styles.petal} ${styles.petalB}`} />
          <Petal className={`${styles.petal} ${styles.petalC}`} />
          <Petal className={`${styles.petal} ${styles.petalD}`} />
        </div>
      </div>
    </section>
  );
}
