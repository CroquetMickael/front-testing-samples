import { MicrocksContainer } from "@microcks/microcks-testcontainers";
import { MICROCKS_PORT, MICROCKS_URL } from "./endpoints.ts";

const IMAGE = "microcks/microcks-uber:1.14.0";

/**
 * Starts Microcks (empty: no artifact is imported) on MICROCKS_PORT.
 * Reuses an instance already listening on that port (e.g. `npm run microcks`). `MICROCKS=off` skips it.
 * Returns the teardown.
 */
export async function startMicrocks(): Promise<() => Promise<void>> {
  if (process.env.MICROCKS === "off" || (await isRunning())) return async () => {};

  const container = await new MicrocksContainer(IMAGE)
    .withExposedPorts({ container: MicrocksContainer.MICROCKS_HTTP_PORT, host: MICROCKS_PORT })
    .start();
  return async () => {
    await container.stop();
  };
}

async function isRunning(): Promise<boolean> {
  try {
    return (await fetch(`${MICROCKS_URL}/api/health`)).ok;
  } catch {
    return false;
  }
}
