import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
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
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/moderateur" element={<ModeratorDashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
