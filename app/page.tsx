// ── Homepage variant switch ──────────────────────────────────────────────
// `/` renders ONE named homepage variation. Each is ALSO live at its own route:
//   /victory  full "Proof Before Price" newspaper (was canonical main)
//   /success  "finite universe of MBE traps" (redesign-v2)
//   /win      diagnostic-first / Red-Zone Map explainer (J7)
//   /pass     leaner newspaper (the ambassador build previously live)
//   /victory_jly archived copy of the current slash page
//   /getthewin diagnostic-first / Red-Zone Map test page
// To REPOINT the homepage: change the single path below to the variant you want,
// then redeploy. That's the only line to touch.
export { default, metadata } from "./victory/page";
