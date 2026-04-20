import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-warm px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-xl">K</span>
            </div>
            <span className="font-display font-bold text-2xl text-foreground">
              Kam'<span className="text-gradient-primary">Etud</span>
            </span>
          </Link>
          <h1 className="text-2xl font-display font-bold text-foreground">Créer un compte</h1>
          <p className="text-muted-foreground mt-1">Choisissez votre profil pour commencer</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/inscription/etudiant">
            <Card className="h-full shadow-card hover:shadow-elevated border-border/50 transition-all hover:-translate-y-1 cursor-pointer group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-display font-bold text-lg text-foreground mb-2">Étudiant</h3>
                <p className="text-sm text-muted-foreground">
                  Proposez vos compétences et gagnez de l'argent en aidant les autres
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/inscription/client">
            <Card className="h-full shadow-card hover:shadow-elevated border-border/50 transition-all hover:-translate-y-1 cursor-pointer group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-gold flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-display font-bold text-lg text-foreground mb-2">Client</h3>
                <p className="text-sm text-muted-foreground">
                  Trouvez des étudiants talentueux pour vos projets et missions
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Déjà un compte ?{" "}
          <Link to="/connexion" className="text-primary font-medium hover:underline">Se connecter</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
