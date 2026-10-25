import type { Branding, WorkingVerbsConfig } from "./capabilities";
import { useServerInfo } from "./CapabilitiesContext";

export const DEFAULT_APP_NAME = "Omnigent";
export const DEFAULT_HEADING = "What should we build?";

const EMPTY_BRANDING: Branding = {
  app_name: null,
  heading: null,
  logos: { main: null, loading: null, favicon: null },
  powered_by: true,
  working_verbs: null,
};

/** Current operator branding, or all-null while loading / when unset. */
export function useBranding(): Branding {
  const info = useServerInfo();
  return info !== "loading" && info.branding ? info.branding : EMPTY_BRANDING;
}

/** Operator app name, falling back to the built-in default. */
export function useAppName(): string {
  return useBranding().app_name ?? DEFAULT_APP_NAME;
}

/** Operator hero heading; an explicit `""` is kept (hides it), default only when unset. */
export function useHeading(): string {
  return useBranding().heading ?? DEFAULT_HEADING;
}

/** Logo URL for a variant, or null to fall back to the mascot; `loading` falls back to `main`. */
export function useLogoUrl(variant: "main" | "loading"): string | null {
  const { logos } = useBranding();
  return variant === "loading" ? (logos.loading ?? logos.main) : logos.main;
}

/** Show "Powered by Omnigent" only when custom branding is set and not disabled. */
export function usePoweredBy(): boolean {
  const info = useServerInfo();
  const branding = info !== "loading" ? info.branding : null;
  return branding != null && branding.powered_by;
}

/** Resolve the working-indicator verb pool for a branding block. */
export function resolveWorkingVerbs(
  branding: Branding | null,
  builtins: readonly string[],
): readonly string[] {
  const config: WorkingVerbsConfig | null = branding?.working_verbs ?? null;
  if (!config || config.verbs.length === 0) return builtins;
  if (config.mode === "append") return [...builtins, ...config.verbs];
  return [...config.verbs];
}

/** Working-indicator verbs for the current deployment (builtins when unset). */
export function useWorkingVerbs(builtins: readonly string[]): readonly string[] {
  return resolveWorkingVerbs(useBranding(), builtins);
}
