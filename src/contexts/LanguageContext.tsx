import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'fr' | 'en';

const translations = {
  fr: {
    // Navbar
    home: "Accueil",
    services: "Services",
    howItWorks: "Comment ça marche",
    login: "Connexion",
    logout: "Déconnexion",
    register: "S'inscrire",
    myOrders: "Mes commandes",
    myMissions: "Mes missions",
    myGigs: "Mes gigs",
    myProfile: "Mon profil",
    adminDashboard: "Dashboard Admin",
    modDashboard: "Dashboard Modérateur",
    student: "Étudiant",
    moderator: "Modérateur",
    client: "Client",
    admin: "Admin",
    // Admin
    administration: "Administration",
    dashboard: "Tableau de bord",
    users: "Utilisateurs",
    verifications: "Vérifications",
    orders: "Commandes",
    moderation: "Modération",
    categories: "Catégories",
    reports: "Rapports",
    search: "Rechercher...",
    activeUsers: "Utilisateurs",
    revenue: "Revenus (FCFA)",
    disputes: "Litiges",
    identityVerification: "Vérifications d'identité",
    allProcessed: "Tout est traité !",
    userManagement: "Gestion des utilisateurs",
    reportedContent: "Contenus signalés",
    approve: "Approuver et attribuer le badge",
    reject: "Rejeter",
    verified: "Identité vérifiée ✓",
    rejected: "Identité rejetée",
    badgeAssigned: "Le badge 'Étudiant Vérifié' a été attribué.",
    willBeNotified: "L'étudiant sera notifié.",
    suspended: "Compte suspendu",
    banned: "Compte banni",
    reactivated: "Compte réactivé",
    contentRemoved: "Contenu supprimé",
    reportDismissed: "Signalement rejeté",
    refundDone: "Remboursement effectué",
    exportLaunched: "Export lancé",
    downloadSoon: "Le fichier sera téléchargé sous peu.",
    categoryAdded: "Catégorie ajoutée",
    cityAdded: "Ville ajoutée",
    newCategory: "Nouvelle catégorie",
    newCity: "Nouvelle ville",
    cities: "Villes",
    active: "Actif",
    inactive: "Inactif",
    config: "Configuration",
    email: "Email",
    university: "Université",
    documentType: "Type de pièce",
    submitted: "Soumis",
    idDocument: "Pièce d'identité",
    studentCard: "Carte étudiante",
    verificationSelfie: "Selfie de vérification",
    role: "Rôle",
    city: "Ville",
    status: "Statut",
    joined: "Inscrit",
    actions: "Actions",
    type: "Type",
    description: "Description",
    reportedBy: "Signalé par",
    reason: "Raison",
    amount: "Montant",
    service: "Service",
    refund: "Rembourser",
    completed: "Terminé",
    inProgress: "En cours",
    disputed: "Litige",
    pending: "En attente",
    // Theme
    lightMode: "Mode clair",
    darkMode: "Mode sombre",
  },
  en: {
    home: "Home",
    services: "Services",
    howItWorks: "How it works",
    login: "Login",
    logout: "Logout",
    register: "Sign up",
    myOrders: "My orders",
    myMissions: "My missions",
    myGigs: "My gigs",
    myProfile: "My profile",
    adminDashboard: "Admin Dashboard",
    modDashboard: "Moderator Dashboard",
    student: "Student",
    moderator: "Moderator",
    client: "Client",
    admin: "Admin",
    administration: "Administration",
    dashboard: "Dashboard",
    users: "Users",
    verifications: "Verifications",
    orders: "Orders",
    moderation: "Moderation",
    categories: "Categories",
    reports: "Reports",
    search: "Search...",
    activeUsers: "Users",
    revenue: "Revenue (FCFA)",
    disputes: "Disputes",
    identityVerification: "Identity Verifications",
    allProcessed: "All processed!",
    userManagement: "User Management",
    reportedContent: "Reported Content",
    approve: "Approve and assign badge",
    reject: "Reject",
    verified: "Identity verified ✓",
    rejected: "Identity rejected",
    badgeAssigned: "The 'Verified Student' badge has been assigned.",
    willBeNotified: "The student will be notified.",
    suspended: "Account suspended",
    banned: "Account banned",
    reactivated: "Account reactivated",
    contentRemoved: "Content removed",
    reportDismissed: "Report dismissed",
    refundDone: "Refund completed",
    exportLaunched: "Export launched",
    downloadSoon: "File will be downloaded shortly.",
    categoryAdded: "Category added",
    cityAdded: "City added",
    newCategory: "New category",
    newCity: "New city",
    cities: "Cities",
    active: "Active",
    inactive: "Inactive",
    config: "Configuration",
    email: "Email",
    university: "University",
    documentType: "Document type",
    submitted: "Submitted",
    idDocument: "ID Document",
    studentCard: "Student Card",
    verificationSelfie: "Verification Selfie",
    role: "Role",
    city: "City",
    status: "Status",
    joined: "Joined",
    actions: "Actions",
    type: "Type",
    description: "Description",
    reportedBy: "Reported by",
    reason: "Reason",
    amount: "Amount",
    service: "Service",
    refund: "Refund",
    completed: "Completed",
    inProgress: "In progress",
    disputed: "Disputed",
    pending: "Pending",
    lightMode: "Light mode",
    darkMode: "Dark mode",
  },
};

type Translations = typeof translations.fr;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('kam_lang') as Language) || 'fr';
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('kam_lang', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
