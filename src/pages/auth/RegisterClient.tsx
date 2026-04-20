import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Phone, Eye, EyeOff, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCities } from "@/hooks/useSupabaseData";

const FALLBACK_CITIES = ["Yaoundé", "Douala", "Bafoussam", "Bamenda", "Garoua", "Maroua", "Bertoua", "Ebolowa", "Ngaoundéré", "Buea"];

const RegisterClient = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { register } = useAuth();
  const { data: dbCities } = useCities();
  const cities = dbCities && dbCities.length > 0 ? dbCities.map((c) => c.name) : FALLBACK_CITIES;

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", city: "", password: "", confirmPassword: "",
  });

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return;
    setIsLoading(true);
    setError("");
    const success = await register({
      email: form.email, password: form.password,
      firstName: form.firstName, lastName: form.lastName,
      phone: form.phone, city: form.city, role: 'client',
    });
    setIsLoading(false);
    if (success) {
      toast({ title: "Inscription réussie !", description: "Vérifiez votre email pour activer votre compte." });
      navigate("/connexion");
    } else {
      setError("Erreur lors de l'inscription. Vérifiez vos informations.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-warm px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg bg-gradient-hero flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-lg">K</span>
            </div>
            <span className="font-display font-bold text-xl text-foreground">
              Kam'<span className="text-gradient-primary">Etud</span>
            </span>
          </Link>
          <h1 className="text-2xl font-display font-bold text-foreground">Inscription Client</h1>
          <p className="text-muted-foreground mt-1">Trouvez des étudiants talentueux pour vos projets</p>
        </div>

        <Card className="shadow-elevated border-border/50">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">{error}</p>}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Prénom</Label><Input placeholder="Marie" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} required /></div>
                <div className="space-y-2"><Label>Nom</Label><Input placeholder="Fotso" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} required /></div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="marie@email.com" className="pl-10" value={form.email} onChange={(e) => update("email", e.target.value)} required /></div>
              </div>
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="+237 6XX XXX XXX" className="pl-10" value={form.phone} onChange={(e) => update("phone", e.target.value)} required /></div>
              </div>
              <div className="space-y-2">
                <Label>Ville</Label>
                <Select value={form.city} onValueChange={(v) => update("city", v)}>
                  <SelectTrigger><MapPin className="w-4 h-4 mr-2 text-muted-foreground" /><SelectValue placeholder="Votre ville" /></SelectTrigger>
                  <SelectContent>{cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input type={showPassword ? "text" : "password"} placeholder="Min. 8 caractères" className="pl-10 pr-10" value={form.password} onChange={(e) => update("password", e.target.value)} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2"><Label>Confirmer</Label><Input type="password" placeholder="••••••••" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} required /></div>
              <div className="flex items-start gap-2">
                <Checkbox id="terms" checked={acceptTerms} onCheckedChange={(v) => setAcceptTerms(v === true)} />
                <label htmlFor="terms" className="text-sm text-muted-foreground leading-tight">
                  J'accepte les <Link to="/conditions" className="text-primary hover:underline">conditions</Link> et la <Link to="/confidentialite" className="text-primary hover:underline">politique de confidentialité</Link>
                </label>
              </div>
              <Button type="submit" className="w-full bg-gradient-hero hover:opacity-90" disabled={isLoading || !acceptTerms}>
                {isLoading ? "Création..." : "Créer mon compte"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Déjà un compte ? <Link to="/connexion" className="text-primary font-medium hover:underline">Se connecter</Link>
          {" · "}<Link to="/inscription/etudiant" className="text-primary font-medium hover:underline">Inscription étudiant</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterClient;
