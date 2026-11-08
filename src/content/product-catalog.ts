export type FlavorId =
  | "strawberry"
  | "classic"
  | "matcha"
  | "ube"
  | "mango"
  | "sesame"
  | "peach"
  | "coconut"
  | "yuzu"
  | "chocolate"
  | "sakura"
  | "hojicha";

export type UnlockKind = "starter" | "streak" | "petals" | "challenge";

export const FLAVOR_CATALOG: readonly { id: FlavorId; kind: UnlockKind }[] = [
  { id: "strawberry", kind: "starter" },
  { id: "classic", kind: "starter" },
  { id: "matcha", kind: "starter" },
  { id: "ube", kind: "streak" },
  { id: "mango", kind: "streak" },
  { id: "sesame", kind: "streak" },
  { id: "yuzu", kind: "streak" },
  { id: "chocolate", kind: "streak" },
  { id: "hojicha", kind: "streak" },
  { id: "sakura", kind: "petals" },
  { id: "peach", kind: "challenge" },
  { id: "coconut", kind: "challenge" },
];
