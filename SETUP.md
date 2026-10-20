# Shelf & Cart — setup

## Keeping emails off GitHub (3.17.2)

Your GitHub Pages repo is public, so nobody's email address is written in it anymore. In `firebase-config.js` and `firestore.rules` each address is replaced by a **fingerprint** (`sha256:` plus 64 letters and numbers). The app works out the same fingerprint from the signed-in email and compares the two, so admins and family names still work, but nobody can read the address back out of the fingerprint.

**Do this once after uploading 3.17.2:** Firebase console → Firestore Database → **Rules** → paste the whole new `firestore.rules` → **Publish**. Then sign in and check Household settings still shows **Admin**.

**Adding someone to `familyHouseholds` (or a new main admin) later.** Make their fingerprint from the email in lowercase:
- Mac: open Terminal and run `printf %s "name@example.com" | shasum -a 256`
- Windows: open PowerShell and run `[BitConverter]::ToString([Security.Cryptography.SHA256]::Create().ComputeHash([Text.Encoding]::UTF8.GetBytes("name@example.com"))).Replace("-","").ToLower()`

Put it in as `"sha256:<the result>"`. A plain email still works too, but it would be public. You don't need to do this to add people to a household; Admin → People does that inside the app, and those emails stay in Firebase, not GitHub.

**Clearing the old history.** Earlier commits still have the addresses in them. To start the repo clean while keeping the same web address:
1. On GitHub, open the repo → **Settings** → at the bottom, **Delete this repository**.
2. Create a new repo with the **same name**, `shelf-and-cart`, and make it **Public**.
3. **Add file → Upload files**, drag in every file of 3.17.2 (`index.html`, `sw.js`, `firebase-config.js`, `firestore.rules`, `SETUP.md`, `manifest.webmanifest`, `plu.json` and the three icons), then commit.
4. **Settings → Pages →** Source: *Deploy from a branch*, Branch: `main`, folder `/ (root)` → Save. Within a few minutes it's back at the same address.

Firebase, App Check and your saved data don't depend on the repo, so nothing else changes and nobody has to sign in again. One more setting stops future commits from showing your own address: GitHub → your photo → **Settings → Emails →** turn on **Keep my email addresses private**.

## App Check (do this before November 2, 2026)

Google will require **App Check** for Firebase AI Logic starting **November 2, 2026**; after that, AI features (reading labels, receipts and recipes, ideas, pictures, deals) stop working for apps without it. App Check runs an invisible reCAPTCHA check in the background so only your site can use your AI quota. Nobody sees a captcha. Everything else in the app works with or without it.

1. **Make a reCAPTCHA key.** Google Cloud console (same project, shelf-and-cart) → **Security → reCAPTCHA** → **Create key**. Platform: **Website**. Domain: `rafaelgiannini.github.io`. Leave the checkbox challenge off. Create, then copy the **key ID**.
2. **Register the app.** Firebase console → **App Check** → **Apps** → **Shelf & Cart (web)** → **reCAPTCHA Enterprise** → paste the key ID → **Save**.
3. **Put the key in the app.** In `firebase-config.js`, set `export const appCheck = { provider: "enterprise", siteKey: "PASTE-THE-KEY-ID" };` and upload it to GitHub with `index.html` and `sw.js`.
4. **Check it works.** Close and reopen the app and use any AI feature. In Firebase → App Check → **APIs → Firebase AI Logic**, requests should show as verified.
5. **Turn on enforcement** for Firebase AI Logic there (Google turns it on for everyone on November 2 anyway). Don't enforce Firestore or Authentication; the app doesn't need it.

reCAPTCHA has a free monthly allowance that a family app stays well inside (a check about once an hour per phone in use). If Google asks for a billing account to create the key, you can use a classic **reCAPTCHA v3** key instead: create it at google.com/recaptcha/admin (v3, domain `rafaelgiannini.github.io`), register it in App Check as **reCAPTCHA** (it asks for the secret key), and set `provider: "v3"` with the site key in `firebase-config.js`.

## Upgrading to 3.12 (categories)

1. **Publish the new rules.** Firebase → **Firestore** → **Rules** → replace everything with `firestore.rules` → **Publish**. (Your own categories won't save until you do; Spices & Seasonings works right away.)
2. **Upload to GitHub:** `index.html` and `sw.js`.
3. Menu (☰) → Help & what’s new should say **Shelf & Cart 3.17.2**.

## Upgrading to 3.11 (cleaner menus, search everywhere, ideas, deals, tip calculator)

Upload `index.html` and `sw.js` to GitHub. No rule changes. Menu (☰) → Help & what’s new said 3.11.

Sales & deals uses Gemini's Google Search grounding through Firebase AI Logic. Google's free tier allows a limited number of these searches a day; if it's used up, Read a weekly ad still works. Nothing to turn on.

## Upgrading to 3.10 (nutrition facts, cooking instructions)

Upload `index.html` and `sw.js` to GitHub. No rule changes.

## Upgrading to 3.9 (multi-packs, running out, produce codes, budget, bigger text)

1. **Publish the new rules.** Firebase → **Firestore** → **Rules** → replace everything with `firestore.rules` → **Publish**. (The budget won't save until you do. Everything else works without it.)
2. **Upload to GitHub:** `index.html`, `sw.js` and the new file `plu.json` (the produce sticker codes).
3. Close the app fully and reopen it. **?** should say **Shelf & Cart 3.9.0**. Everyone sees a short welcome tour once.

The produce codes come from the IFPS PLU list via the MIT-licensed `ferhatelmas/plu` dataset.

## Upgrading to 3.4 (Menu, food and water log)

1. **Publish the new rules.** Firebase → **Firestore** → **Rules** → replace everything with `firestore.rules` → **Publish**. (The food and water log won't save until you do.)
2. **Upload to GitHub:** `index.html` and `sw.js`.
3. Close the app fully and reopen it.

New: the people button opens a **Menu** with shortcuts to everything (Food & water, Fridge view, Leftovers, Meal plan, Recipe ideas, Food guide, Import an order, Spending, Expiring, Activity, Help), household switching, Health filters and the AI switch. Health labels open the food guide. In stock has one **View** button. **Food & water** logs meals with estimated or exact calories and counts cups of water; it's private to each person.

## Version 3.2 notes (orders, health filters, meal plan, leftovers, voice)

1. **Publish the new rules first.** Firebase → **Firestore** → **Rules** → replace everything with `firestore.rules` → **Publish**. (Meal plans, activity, waste and aisle order won't save until you do.)
2. **Upload to GitHub:** `index.html`, `sw.js` and `manifest.webmanifest`.
3. Close the app fully and reopen it. **?** should say **Shelf & Cart 3.8.0**.
4. **Android, for sharing orders into the app:** remove Shelf & Cart from the home screen and add it again, so Android learns it can receive shares. Then in Gmail or the Walmart/Amazon app: Share → Shelf & Cart. iPhone doesn't allow web apps to receive shares, so paste the email or add screenshots instead.

New: 6-month and 1/2/3-year expiration picks, **Import a Walmart or Amazon order**, **Health filters** (Household → You), **+ Leftovers**, **We made this** and **Plan it** on recipes, **This week** in Recipes, **Threw it away** and waste totals in Spending, voice add (mic on the list), **Quick add** grid, **Arrange aisles** per store, price per ounce and price check, and **Recent activity**. Tap **?** in the app for details.

## Version 3.1 notes (Fridge view, AI switch, saved photos)

Already on 3.0? Just upload `index.html` and `sw.js` (and `firebase-config.js` if you skipped 3.0.1). No rules change. Coming from 2.5? Follow all the 3.0 steps below.

- **Fridge view:** In stock → Fridge view. Big photo shelves for tablets and phones. Bookmark it while open (the address ends in `#fridge`) to open straight into it on a counter tablet.
- **Use a photo you already took** on the scan screen: finds a barcode in the photo, or makes it a photo item.
- **AI features switch:** Household → You. Off means nothing is sent to the AI.

## Upgrading to 3.0 (AI, types and brands, tracking, recipes)

1. **Publish the new rules first.** Firebase → **Firestore** → **Rules**. Replace everything with `firestore.rules`, click **Publish**. (Recipes and receipt photos won't save until you do.)
2. **Turn on AI (free, no credit card).** Firebase console → left menu **AI Services → AI Logic** → **Get started** → pick **Gemini Developer API** → **Enable**. Stay on the free Spark plan; don't add billing. Skip the App Check step.
3. **Upload to GitHub:** `index.html`, `sw.js` and `firebase-config.js`. (`firestore.rules` is pasted into Firebase, not uploaded.)
4. Open the app with signal, close it fully, open it again. Tap **?** at the top: it should say **Shelf & Cart 3.8.0**.
5. Optional cleanup: version 1 data is no longer used. In Firebase → **Firestore** → **Data**, if top-level `list` or `kitchen` collections are still there, you can delete them (⋮ → Delete collection). Don't touch `households`, `users`, `products`, `invites` or `config`.

### What's new

The full list is in the app: tap **?** → **What's new**. In short:

- **AI vision:** snap a label or a no-barcode item and the AI fills in name, brand, type, section, tracking and a keep-by date. It also reads receipts and recipe photos. Photos are cropped first.
- **Types and brands:** In stock shows *Mozzarella* with *Great Value* underneath and stacks same-type items (*Salad · 4*). **Sort with AI** does the whole household at once; tap any item to fix its type or brand. The list shows what you have of the same type, and **Keep at least** can count every brand together.
- **How much is left:** count single eggs, or set how full the oil is (tap the bar). The app estimates when you'll run out.
- **Recipes tab:** write, paste or snap recipes; each ingredient is checked against every household you're in; add what's missing in one tap; share with the other household. **Ideas from what we have** uses up what's expiring.
- **Today card** on the list, **Spending** in Receipts, **Tiles** view, **Backup** in Household, and **?** Help.
- **Household** moved to the people button at the top right (the bottom bar now has Recipes).

### Where everything is stored, and why it stays free

| What | Where |
|---|---|
| List, stock, recipes, receipts, prices, sections, locations | Your Firebase project (Firestore), one private area per household |
| Receipt photos | Separate documents, downloaded only when a receipt is opened |
| Barcode names and photos | A shared catalog in your Firebase project, used by every household |
| Theme, layout, folded sections, Tiles / Full names | Each device's own storage |
| The app itself | GitHub Pages |
| AI requests | Sent to Google Gemini only when you tap or snap; not stored by the app |

The free Spark plan includes **1 GiB of stored data, 50,000 reads, 20,000 writes and 20,000 deletes a day, and 10 GiB of downloads a month**. A family uses a small fraction of that:
- An item is a few KB with its photo, and a recipe is about the same.
- A receipt photo is up to about 0.7 MB, so receipts are what fill space: about 1,000 of them use roughly half the free storage.
- Opening the app reads your household's items. Even several people opening it many times a day stay well under 50,000 reads.

If a limit is ever reached, that part of Firebase pauses until the quota resets. Nothing is charged, because there's no billing account to charge. The AI's free tier has rate limits: if you hit one, the app says to try again later. Google may use free-tier AI requests to improve its products, so don't snap anything private. To keep space down, delete old receipts after downloading a backup (Household → Backup, with photos).

## Version 2.5 notes (custom sections, folding, receipt prices, theme and layout)

1. **Publish the new rules first.** Firebase → **Firestore** → **Rules**. Replace everything with `firestore.rules`, click **Publish**. (Custom sections won't save until you do.)
2. **Upload to GitHub:** `index.html` and `sw.js`.
3. Open the app with signal, close it fully, open it again. **Household** should show version **2.5.0**.

### What's new

- **Custom sections:** Household → **Sections**. Add (e.g. Snack shelf, Garage freezer, Spice rack), **Edit** to rename, change the group heading, color and temperature (cold / frozen / room temperature, used for sell-by estimates), ↑ ↓ to reorder, and remove (you choose where its items go). Each household has its own sections, shared by all its locations.
- **Folding:** tap any section, category or list aisle heading to hide or show it; **Collapse all / Expand all** on In stock and the List. Remembered on each device.
- **Big sections group by category** (Pantry · Snacks · Drinks…) once they have more than 8 items.
- **Receipt prices:** a receipt lists everything bought that day (scanned as Just bought, or put away from the list). Type each price to build that product's price history at that store, tap **Mine** for personal items (fills in the personal amount automatically), or add items by hand. It shows how much of the total is itemized.
- **This device:** Household → **Theme** (match device / light / dark) and **Layout** (automatic / phone / desktop wide). Desktop puts sections and list aisles side by side and centers pop-ups.

## Version 2.4 notes (date bought, sell-by estimates, receipts)

1. **Publish the new rules first.** Firebase → **Firestore** → **Rules**. Replace everything with `firestore.rules`, click **Publish**. (Receipts won't save until you do.)
2. **Upload to GitHub:** `index.html` and `sw.js`.
3. Open the app with signal, close it fully, open it again. The **Household** button at the bottom shows the version: it should say **2.4.0**.

### What's new

- **Bottom bar:** List · Receipts · Scan · In stock · Household.
- **Date bought:** in the scanner's Stock up mode, pick **Just bought** (saves today) or **Already had** (date unknown). Each item shows "Bought Oct 18"; tap an item to change it.
- **Sell-by dates:** after scanning, tap **Sell-by date…** (or tap an item → **Has a sell-by date?**). Pick the kind of food and fridge or freezer; the app shows the real use-or-freeze-by date from the FoodSafety.gov cold storage chart, counted from the day you bought it. Moving the item to the freezer recalculates it.
- **Receipts:** **Snap a receipt** (or **Choose photo**), enter the store, date and total, plus any **personal** amount that isn't shared. Pick who paid and who you're splitting with; each person owes an equal share of the rest. **Mark paid** when they pay you back. The top of the Receipts screen shows running balances ("Raquel owes you $37.00"). Leave **Split with** empty for personal shopping.
- **Scanner:** every result card has **Done**, which clears it and goes straight back to full-screen scanning.

## Version 2.3 notes (locations)

1. **Publish the new rules first.** Firebase → **Firestore** → **Rules**. Replace everything with `firestore.rules`, click **Publish**.
2. **Upload to GitHub:** `index.html`, `sw.js`, `firebase-config.js`.
3. Open the app with signal, close it fully, open it again. Check the version: people icon → under your name it should say **Shelf & Cart 2.3.0**. If it shows an older number, wait a couple of minutes and repeat.
4. The first time you (the admin) open it, **Rafael & Raquel** gets **Davie** and **Plantation**, and **Augusto & Maria Del Carmen** gets **Wellington** and **Jensen Beach**. Existing stock goes to Davie and Wellington.

### Locations

- The bar at the top switches between **All locations** and each location. Each phone remembers the last one used.
- **What we have** shows the stock for the chosen location. Under **All locations**, each item shows its location.
- **The grocery list is shared** by the household. Items added while a location is chosen are tagged with it; picking a location shows its items plus untagged ones.
- **Scanning in Stock up** asks which location (chips at the bottom of the scanner). **Used it up** takes from the chosen location.
- **Put away** sends items to the location they were tagged with.
- To move an item, tap it and pick another location.
- Manage locations from the people icon → **Locations**: add, rename or remove (removing moves its stock to the main location).

## Version 2.2 notes (admin manages people)

1. **Publish the new rules first.** Firebase → **Firestore** → **Rules**. Replace everything with `firestore.rules`, click **Publish**.
2. **Upload to GitHub:** `index.html`, `sw.js`, `firebase-config.js`.
3. Open the app with signal, close it fully, open it again. The old automatic joining is switched off the first time you (the admin) open it.

### Admin (people icon → Admin: people and households)

- **People:** everyone who has signed in. Tap a household chip to add (+) or remove (✓) that person. The **Households** tab has the same tap-to-add chips for each household. ★ marks the owner. **Make owner of…** hands a household to someone; **Make admin** gives them these admin screens too.
- **Households:** open, rename or delete any household, and create one by picking who's in it. Deleting moves a household to the **Trash** for 30 days; **Restore** brings it back with everything in it.
- Someone who has never opened version 2 or later won't be listed until they sign in once.
- People can still start their own households and invite others with a code.
- To remove someone's account completely, delete them in Firebase → Authentication → Users.

---

## First-time setup (already done)

About 15 minutes, all free. You'll do this once, on a computer.

You need:
- A Google account (for Firebase)
- A GitHub account (for hosting) — free at github.com

---

## 1. Create the Firebase project

1. Go to **https://console.firebase.google.com** and sign in.
2. Click **Create a project**. Name it `shelf-and-cart`. You can turn Google Analytics off.
3. On the project home page, click the **Web** icon (`</>`) to add a web app.
   Nickname: `Shelf & Cart`. Leave "Firebase Hosting" unchecked. Click **Register app**.
4. Firebase shows a block of code with `const firebaseConfig = { ... }`. Keep this page open for step 2.

## 2. Paste your settings into `firebase-config.js`

Open `firebase-config.js` in any text editor (Notepad is fine).

- Replace each `PASTE_...` value with the matching value from the Firebase page
  (`apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`).
- Optionally list family members in `familyHouseholds`.

These values are safe to put on a public site. What keeps your data private is the rules in step 3.

## 3. Turn on the database

1. In the Firebase left menu: **Build → Firestore Database → Create database**.
2. Pick a location close to you (for Florida, `us-east1`) and choose **Start in production mode**.
3. Open the **Rules** tab. Delete what's there and paste in the contents of `firestore.rules`.
4. Click **Publish**.

## 4. Turn on sign-in

1. Left menu: **Build → Authentication → Get started**.
2. Under **Sign-in method**, choose **Email/Password**, switch on the first toggle, and **Save**.
3. People create their own accounts in the app (**Create account**).

## 5. Put the app online with GitHub Pages

The camera only works on a secure (`https://`) site, and GitHub Pages gives you one for free.

1. On github.com click **New repository**. Name it `shelf-and-cart`, set it to **Public**, and create it.
2. Click **uploading an existing file**, then drag in every file from this folder:
   `index.html`, `sw.js`, `firebase-config.js`, `manifest.webmanifest`, `icon.svg`, `icon-192.png`, `icon-512.png`
   (you can include `SETUP.md` and `firestore.rules` too; they're harmless). Click **Commit changes**.
3. In the repository: **Settings → Pages**. Under "Build and deployment", set **Source: Deploy from a branch**, **Branch: main**, folder **/ (root)**, and **Save**.
4. After a minute or two the page shows your link: `https://YOUR-GITHUB-NAME.github.io/shelf-and-cart/`

## 6. Put it on both phones

1. Open the link on the phone and sign in (or **Create account**), then start or join a household.
2. Add it to the home screen:
   - **iPhone (Safari):** Share button → **Add to Home Screen**
   - **Android (Chrome):** ⋮ menu → **Add to Home screen** (or **Install app**)
3. Open it from the new icon. The first time you tap **Scan barcodes**, allow the camera.

---

## Using it

- **Scan barcodes** opens a live camera. Hold a barcode inside the frame; it beeps when it reads one and keeps going, so you can unpack a whole bag in one go.
- Pick a mode at the bottom of the scanner:
  - **Stock up** adds one to the section you pick (Fridge, Freezer, Pantry, Bathroom, Laundry, Cleaning).
  - **Used it up** takes one out and puts it on the grocery list.
  - **Add to list** puts it straight on the grocery list.
- New barcodes are looked up in Open Food Facts (food), Open Products Facts (household) and Open Beauty Facts (toiletries). If none of them know it, you type the name once and it's remembered.
- **No barcode** lets you snap a photo and write your own description.
- **Barcode not found?** Use **Search by name** in the form (for example "gain detergent") and pick the closest match. Adjust the size in the name if it differs.
- **Expiration dates:** after a Stock up scan, tap 3 days / 1 week / 2 weeks / 1 month / 3 months or **Pick date**. Tap any item later to add or change its date. **Expiring soon** shows at the top of What we have, and the **Expiring** filter lists everything with a date.
- **Low-stock alerts:** tap an item under What we have and set **Keep at least**. When it drops below that number it goes on the grocery list automatically, and it stays visible at 0 ("Out") instead of disappearing.
- **Stores:** tap a list item to set its store (Publix, Costco…). Store chips at the top of the list filter it; items added while a store is selected get that store, and each product remembers its usual store.
- **Prices:** enter what you paid on a list item (or the **$** button in shopping mode). The app keeps the history and shows the last and lowest price.
- **Shopping mode:** **Start shopping** on the list opens a big-button view that keeps the screen awake. **Scan into cart** checks items off as you scan them (extras are added as bought). **Done** offers to put everything away at home.
- The flashlight button appears in the scanner on phones that support it (most Android phones; many iPhones don't allow it from a web app).
- It opens and works with no signal (after you've opened it once online). Changes are saved on the phone and sync when you're back online; the top corner says **Offline** until then.

## Updating it later

Edit files and upload them again to the same GitHub repository (**Add file → Upload files**, then commit). When you upload a new `index.html`, also upload the new `sw.js` that comes with it (its version number tells phones to refresh their saved copy). Phones pick up the new version the next time the app is opened; if one doesn't, close the app fully and reopen it.

## If something's wrong

| What you see | Fix |
|---|---|
| "This copy isn't connected to your Firebase project yet" | `firebase-config.js` still has `PASTE_...` values, or the old file is still on GitHub. |
| "That email and password don't match" | Use **Forgot password** to reset, or **Create account** if they never made one. |
| "That code doesn't work" | Someone made a newer code. Ask for the current one (people icon → Invite someone). |
| "Couldn't join that household" | The new rules aren't published yet. Redo step 1 of the upgrade. |
| Someone isn't in the People list | They need to sign in to the app once (version 2 or later). |
| Mom/Dad see an empty app after signing in | They need to start a household or join one with a code. |
| Camera is black or blocked | Allow the camera for the site in the phone's browser settings. It must be the `https://` GitHub link. |
| A product name is wrong | Tap **Wrong name? Fix it** after scanning, or tap the item and rename it. The fix applies everywhere. |
