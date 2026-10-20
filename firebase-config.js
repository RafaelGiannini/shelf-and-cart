// ───────────────────────────────────────────────────────────────
//  Shelf & Cart — your settings
//  Step 1: paste the config Firebase gives you (see SETUP.md, step 2).
// ───────────────────────────────────────────────────────────────

export const firebaseConfig = {
  apiKey: "AIzaSyAh43iZB_tyIRUWD752B9_b8zoBqNPtewk",
  authDomain: "shelf-and-cart.firebaseapp.com",
  projectId: "shelf-and-cart",
  storageBucket: "shelf-and-cart.firebasestorage.app",
  messagingSenderId: "871021951095",
  appId: "1:871021951095:web:32dbb19f6a3fd6c67eee72",
};

// The main app admin (also set in firestore.rules). More admins can be added in the app:
// Menu → Admin → People → Make admin.
// Emails here are stored as "sha256:" fingerprints so the public GitHub copy doesn't show anyone's address.
// A plain email works too. To make a fingerprint: SETUP.md → "Keeping emails off GitHub".
export const admins = ["sha256:b78ac6b56138f1eae627f2f95ba43afe97c89bdf67630a9757eb3672cb5c35f1"];

// Family names: fills in a person's first name when they create an account,
// and suggests their household name if they start one. Nobody is added to anything
// automatically; the admin manages who's in which household (Admin → People).
// "places" are the household's locations: the admin's app adds them to a household that
// has none yet. The first one is where any existing stock goes.
export const familyHouseholds = [
  {
    name: "Rafael & Raquel",
    places: ["Davie", "Plantation"],
    people: {
      "sha256:b78ac6b56138f1eae627f2f95ba43afe97c89bdf67630a9757eb3672cb5c35f1": "Rafael",
      "sha256:dcd02c5ad815175548d03b843d93476bc69f3f50c26d5bb886d0b484c942903a": "Raquel",
    },
  },
  {
    name: "Augusto & Maria Del Carmen",
    places: ["Wellington", "Jensen Beach"],
    people: {
      "sha256:edef076b4c2debd2b38ba568d884202cd1d16d9570bd9d0c75b2a1a77e0fe9c4": "Augusto",
      "sha256:e83e3781cddb6e9894d50d227f898e8c333d866741072097ae3984c4db47063b": "Maria Del Carmen",
    },
  },
];

// AI models for label reading, receipts and recipes (Firebase AI Logic, Gemini Developer API).
// Tried in order; the next one is a backup if Google retires or renames a model.
export const aiModels = ["gemini-3.8-flash", "gemini-3.5-flash", "gemini-3.1-flash-lite"];

// App Check (required by Google for AI features from November 2, 2026). See SETUP.md → "App Check".
// Paste the reCAPTCHA site key here (the public "key ID", not a secret). Leave it empty to skip App Check.
// provider: "enterprise" for a reCAPTCHA Enterprise key (recommended), "v3" for a classic reCAPTCHA v3 key.
export const appCheck = { provider: "enterprise", siteKey: "6LcpTPctAAAAAIYvNpSX_4qZYODnpYGRIvhh3X8n" };
