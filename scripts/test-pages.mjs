import { spawn } from "node:child_process";
import process from "node:process";

const BASE_URL = process.env.KAMETUD_TEST_BASE_URL || "http://localhost:5173";
const OPEN_DELAY_MS = Number(process.env.KAMETUD_TEST_OPEN_DELAY_MS || 1500);

const routes = [
  { name: "Accueil", path: "/", role: "public" },
  { name: "Services", path: "/services", role: "public" },
  { name: "Comment ca marche", path: "/comment-ca-marche", role: "public" },
  { name: "Connexion", path: "/connexion", role: "public" },
  { name: "Inscription", path: "/inscription", role: "public" },
  { name: "Inscription etudiant", path: "/inscription/etudiant", role: "public" },
  { name: "Inscription client", path: "/inscription/client", role: "public" },
  { name: "Profil etudiant mock", path: "/profil/stub-student-1", role: "public / owner with student" },
  { name: "Commander un service mock", path: "/commander/stub-gig-1", role: "client" },
  { name: "Mes commandes", path: "/mes-commandes", role: "client" },
  { name: "Demandes", path: "/demandes", role: "client / student" },
  { name: "Detail demande mock", path: "/demandes/stub-request-1", role: "client / student" },
  { name: "Mes demandes", path: "/mes-demandes", role: "client" },
  { name: "Mes missions", path: "/mes-missions", role: "student" },
  { name: "Mes gigs", path: "/mes-gigs", role: "student" },
  { name: "Creer un gig", path: "/mes-gigs/creer", role: "student" },
  { name: "Mes propositions", path: "/mes-propositions", role: "student" },
  { name: "Moderateur", path: "/moderateur", role: "moderator" },
  { name: "Admin", path: "/admin", role: "admin" },
  { name: "Confidentialite", path: "/confidentialite", role: "public" },
  { name: "CGU", path: "/cgu", role: "public" },
  { name: "Page 404", path: "/route-inexistante-test", role: "public" },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function isServerReady() {
  try {
    const response = await fetch(BASE_URL, { method: "HEAD" });
    return response.ok || response.status < 500;
  } catch {
    return false;
  }
}

async function waitForServer() {
  for (let i = 0; i < 30; i += 1) {
    if (await isServerReady()) return true;
    await sleep(1000);
  }
  return false;
}

function startDevServer() {
  const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
  console.log(`Dev server absent sur ${BASE_URL}. Lancement de npm run dev...`);
  return spawn(npmCommand, ["run", "dev", "--", "--host", "127.0.0.1"], {
    stdio: "inherit",
    shell: false,
  });
}

function openUrl(url) {
  if (process.platform === "win32") {
    spawn("cmd", ["/c", "start", "", url], { detached: true, stdio: "ignore" }).unref();
    return;
  }
  if (process.platform === "darwin") {
    spawn("open", [url], { detached: true, stdio: "ignore" }).unref();
    return;
  }
  spawn("xdg-open", [url], { detached: true, stdio: "ignore" }).unref();
}

let devServer = null;

if (!(await isServerReady())) {
  devServer = startDevServer();
  const ready = await waitForServer();
  if (!ready) {
    console.error(`Impossible de joindre ${BASE_URL}. Verifiez le dev server puis relancez.`);
    process.exit(1);
  }
}

for (const route of routes) {
  const url = new URL(route.path, BASE_URL).toString();
  console.log(`[${route.role}] ${route.name}: ${url}`);
  openUrl(url);
  await sleep(OPEN_DELAY_MS);
}

if (devServer) {
  console.log("Dev server lance par ce script. Appuyez sur Ctrl+C pour l'arreter.");
  await new Promise(() => {});
}
