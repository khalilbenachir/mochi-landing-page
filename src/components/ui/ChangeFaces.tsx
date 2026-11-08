import { asset } from "@/content/mochi";
import type { ChangeFace } from "@/lib/change-timer";
import styles from "./ui.module.css";

const FACES: readonly ChangeFace[] = ["calm", "soon", "due", "happy"];

/** Mochi's small face for the change reminder, crossfading between moods like the Live Activity. */
export function ChangeFaces({ face, width, height }: { face: ChangeFace; width: number; height: number }) {
  return (
    <div className={styles.faces} style={{ width, height }} aria-hidden="true">
      {FACES.map((f) => (
        // eslint-disable-next-line @next/next/no-img-element -- tiny decorative sprites, already sized
        <img key={f} src={asset.liveActivity[f]} alt="" className={f === face ? styles.on : undefined} />
      ))}
    </div>
  );
}
