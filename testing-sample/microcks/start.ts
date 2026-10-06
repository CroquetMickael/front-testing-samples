// `npm run microcks`: a long-lived instance (UI on MICROCKS_URL) that the test runs reuse instead of starting their own.
import { MICROCKS_URL } from "./endpoints.ts";
import { startMicrocks } from "./microcks.ts";

const stop = await startMicrocks();
console.log(`Microcks prêt sur ${MICROCKS_URL} (Ctrl+C pour arrêter)`);

// Nothing else keeps Node alive: without this the process exits and the container is reaped.
const keepAlive = setInterval(() => {}, 1 << 30);
for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.once(signal, async () => {
    clearInterval(keepAlive);
    await stop();
  });
}
