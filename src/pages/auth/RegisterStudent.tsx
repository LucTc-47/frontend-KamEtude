import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Lock, Phone, GraduationCap, Upload, Camera,
  ChevronRight, ChevronLeft, Check, Eye, EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { uploadFile, useCreateVerification } from "@/hooks/useSupabaseData";

const SKILLS = [
  "Rédaction académique", "Programmation", "Design graphique", "Traduction",
  "Tutorat mathématiques", "Tutorat physique", "Comptabilité", "Marketing digital",
  "Montage vidéo", "Photographie", "Développement web", "Data science",
];

const UNIVERSITIES = [
  "Université de Yaoundé I", "Université de Yaoundé II", "Université de Douala",
  "Université de Dschang", "Université de Buea", "Université de Bamenda",
  "Université de Maroua", "Université de Ngaoundéré", "Autre",
];

const steps = [
  { title: "Informations personnelles", icon: User },
  { title: "Profil académique", icon: GraduationCap },
  { title: "Vérification d'identité", icon: Upload },
];

const RegisterStudent = () => {
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { register } = useAuth();
  const createVerification = useCreateVerification();
  const idFileRef = useRef<HTMLInputElement>(null);
  const selfieRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: "",
    university: "", faculty: "", level: "", bio: "",
    idType: "", idFile: null as File | null, selfieFile: null as File | null,
    studentCardFile: null as File | null,
  });

  const update = (key: string, value: string | File | null) => setForm((prev) => ({ ...prev, [key]: value }));
  const toggleSkill = (skill: string) => setSelectedSkills((prev) => prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]);

  const canNext = () => {
    if (step === 0) return form.firstName && form.lastName && form.email && form.phone && form.password && form.password === form.confirmPassword;
    if (step === 1) return form.university && form.level && selectedSkills.length > 0;
    if (step === 2) return form.idType && acceptTerms;
    return false;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");
    
    const success = await register({
      email: form.email, password: form.password,
      firstName: form.firstName, lastName: form.lastName,
      phone: form.phone, role: 'student',
      university: form.university, faculty: form.faculty,
      level: form.level, bio: form.bio, skills: selectedSkills,
    });

    if (!success) {
      setIsLoading(false);
      setError("Erreur lors de l'inscription. Vérifiez vos informations.");
      return;
    }

    toast({ title: "Inscription envoyée !", description: "Vérifiez votre email puis connectez-vous pour compléter la vérification." });
    setIsLoading(false);
    navigate("/connexion");
  };

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-warm py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg bg-gradient-hero flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-lg">K</span>
            </div>
            <span className="font-display font-bold text-xl text-foreground">Kam'<span className="text-gradient-primary">Etud</span></span>
          </Link>
          <h1 className="text-2xl font-display font-bold text-foreground">Inscription Étudiant</h1>
          <p className="text-muted-foreground mt-1">Rejoignez la communauté et proposez vos services</p>
        </div>

        <div className="mb-8">
          <Progress value={progress} className="h-2 mb-4" />
          <div className="flex justify-between">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${i < step ? "bg-primary text-primary-foreground" : i === step ? "bg-gradient-hero text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-xs hidden sm:inline ${i === step ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        <Card className="shadow-elevated border-border/50">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              {(() => { const Icon = steps[step].icon; return <Icon className="w-5 h-5 text-primary" />; })()}
              {steps[step].title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && <p className="text-sm text-destructive bg-destructive/10 p-2 rounded mb-4">{error}</p>}
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                {step === 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Prénom</Label><Input placeholder="Jean" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} /></div>
                      <div className="space-y-2"><Label>Nom</Label><Input placeholder="Nkoulou" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} /></div>
                    </div>
                    <div className="space-y-2"><Label>Email</Label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="jean@email.com" className="pl-10" value={form.email} onChange={(e) => update("email", e.target.value)} /></div></div>
                    <div className="space-y-2"><Label>Téléphone</Label><div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="+237 6XX XXX XXX" className="pl-10" value={form.phone} onChange={(e) => update("phone", e.target.value)} /></div></div>
                    <div className="space-y-2"><Label>Mot de passe</Label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input type={showPassword ? "text" : "password"} placeholder="Min. 8 caractères" className="pl-10 pr-10" value={form.password} onChange={(e) => update("password", e.target.value)} /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div></div>
                    <div className="space-y-2"><Label>Confirmer le mot de passe</Label><Input type="password" placeholder="••••••••" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} />{form.confirmPassword && form.password !== form.confirmPassword && <p className="text-xs text-destructive">Les mots de passe ne correspondent pas</p>}</div>
                  </div>
                )}
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-2"><Label>Université</Label><Select value={form.university} onValueChange={(v) => update("university", v)}><SelectTrigger><SelectValue placeholder="Sélectionnez" /></SelectTrigger><SelectContent>{UNIVERSITIES.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent></Select></div>
                    <div className="space-y-2"><Label>Faculté / Filière</Label><Input placeholder="Ex: Informatique" value={form.faculty} onChange={(e) => update("faculty", e.target.value)} /></div>
                    <div className="space-y-2"><Label>Niveau</Label><Select value={form.level} onValueChange={(v) => update("level", v)}><SelectTrigger><SelectValue placeholder="Sélectionnez" /></SelectTrigger><SelectContent><SelectItem value="licence1">Licence 1</SelectItem><SelectItem value="licence2">Licence 2</SelectItem><SelectItem value="licence3">Licence 3</SelectItem><SelectItem value="master1">Master 1</SelectItem><SelectItem value="master2">Master 2</SelectItem><SelectItem value="doctorat">Doctorat</SelectItem></SelectContent></Select></div>
                    <div className="space-y-2"><Label>Bio</Label><Textarea placeholder="Présentez-vous..." value={form.bio} onChange={(e) => update("bio", e.target.value)} className="min-h-[80px]" /></div>
                    <div className="space-y-2"><Label>Compétences (min. 1)</Label><div className="flex flex-wrap gap-2">{SKILLS.map((skill) => <Badge key={skill} variant={selectedSkills.includes(skill) ? "default" : "outline"} className="cursor-pointer" onClick={() => toggleSkill(skill)}>{skill}</Badge>)}</div></div>
                  </div>
                )}
                {step === 2 && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-muted/50 border border-border"><p className="text-sm text-muted-foreground">Vos documents seront vérifiés par un administrateur avant d'activer votre compte.</p></div>
                    <div className="space-y-2"><Label>Type de pièce d'identité</Label><Select value={form.idType} onValueChange={(v) => update("idType", v)}><SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger><SelectContent><SelectItem value="cni">CNI</SelectItem><SelectItem value="passport">Passeport</SelectItem><SelectItem value="permis">Permis</SelectItem></SelectContent></Select></div>
                    <div className="space-y-2">
                      <Label>Photo de la pièce d'identité</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer" onClick={() => idFileRef.current?.click()}>
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">{form.idFile ? form.idFile.name : "Glissez ou cliquez"}</p>
                        <input ref={idFileRef} type="file" accept="image/*" className="hidden" onChange={(e) => update("idFile", e.target.files?.[0] || null)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Selfie avec pièce d'identité</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer" onClick={() => selfieRef.current?.click()}>
                        <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">{form.selfieFile ? form.selfieFile.name : "Prenez un selfie"}</p>
                        <input ref={selfieRef} type="file" accept="image/*" capture="user" className="hidden" onChange={(e) => update("selfieFile", e.target.files?.[0] || null)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Carte étudiante (optionnel)</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer" onClick={() => cardRef.current?.click()}>
                        <GraduationCap className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">{form.studentCardFile ? form.studentCardFile.name : "Carte étudiante"}</p>
                        <input ref={cardRef} type="file" accept="image/*" className="hidden" onChange={(e) => update("studentCardFile", e.target.files?.[0] || null)} />
                      </div>
                    </div>
                    <div className="flex items-start gap-2 pt-2">
                      <Checkbox id="terms" checked={acceptTerms} onCheckedChange={(v) => setAcceptTerms(v === true)} />
                      <label htmlFor="terms" className="text-sm text-muted-foreground leading-tight">
                        J'accepte les <Link to="/conditions" className="text-primary hover:underline">conditions</Link> et la <Link to="/confidentialite" className="text-primary hover:underline">politique de confidentialité</Link>
                      </label>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 0}><ChevronLeft className="w-4 h-4 mr-1" /> Précédent</Button>
              {step < 2 ? (
                <Button onClick={() => setStep(step + 1)} disabled={!canNext()} className="bg-gradient-hero hover:opacity-90">Suivant <ChevronRight className="w-4 h-4 ml-1" /></Button>
              ) : (
                <Button onClick={handleSubmit} disabled={!canNext() || isLoading} className="bg-gradient-hero hover:opacity-90">{isLoading ? "Envoi..." : "Soumettre"} <Check className="w-4 h-4 ml-1" /></Button>
              )}
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Déjà un compte ? <Link to="/connexion" className="text-primary font-medium hover:underline">Se connecter</Link>
          {" · "}<Link to="/inscription/client" className="text-primary font-medium hover:underline">Inscription client</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterStudent;
