import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import Index from "./pages/Index";
import Services from "./pages/Services";
import HowItWorks from "./pages/HowItWorks";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import RegisterStudent from "./pages/auth/RegisterStudent";
import RegisterClient from "./pages/auth/RegisterClient";
import StudentProfile from "./pages/StudentProfile";
import AdminDashboard from "./pages/AdminDashboard";
import ModeratorDashboard from "./pages/ModeratorDashboard";
import OrderPage from "./pages/OrderPage";
import MyOrders from "./pages/MyOrders";
import MyMissions from "./pages/MyMissions";
import MyGigs from "./pages/MyGigs";
import CreateGig from "./pages/CreateGig";
import Requests from "./pages/Requests";
import RequestDetail from "./pages/RequestDetail";
import MyRequests from "./pages/MyRequests";
import MyProposals from "./pages/MyProposals";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <NotificationProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/comment-ca-marche" element={<HowItWorks />} />
                  <Route path="/connexion" element={<Login />} />
                  <Route path="/inscription" element={<Register />} />
                  <Route path="/inscription/etudiant" element={<RegisterStudent />} />
                  <Route path="/inscription/client" element={<RegisterClient />} />
                  <Route path="/profil/:id" element={<StudentProfile />} />
                  <Route path="/commander/:gigId" element={<OrderPage />} />
                  <Route path="/mes-commandes" element={<MyOrders />} />
                  <Route path="/mes-missions" element={<MyMissions />} />
                  <Route path="/mes-gigs" element={<MyGigs />} />
                  <Route path="/mes-gigs/creer" element={<CreateGig />} />
                  <Route path="/demandes" element={<Requests />} />
                  <Route path="/demandes/:id" element={<RequestDetail />} />
                  <Route path="/mes-demandes" element={<MyRequests />} />
                  <Route path="/mes-propositions" element={<MyProposals />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/moderateur" element={<ModeratorDashboard />} />
                  <Route path="/confidentialite" element={<Privacy />} />
                  <Route path="/cgu" element={<Terms />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </NotificationProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
