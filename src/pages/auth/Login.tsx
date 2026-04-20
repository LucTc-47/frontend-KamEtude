import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const { login, loginWithPhone, sendPhoneOtp } = useAuth();
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const success = await login(email, password);
    setIsLoading(false);
    if (success) {
      toast({ title: "Connexion réussie", description: "Bienvenue sur Kam'Etud !" });
      navigate("/");
    } else {
      setError("Email ou mot de passe incorrect.");
    }
  };

  const handleSendOtp = async () => {
    if (!phone.trim()) return;
    setIsLoading(true);
    const success = await sendPhoneOtp(phone);
    setIsLoading(false);
    if (success) {
      setOtpSent(true);
      toast({ title: "Code envoyé !", description: `Un code OTP a été envoyé au ${phone}` });
    } else {
      toast({ title: "Erreur", description: "Impossible d'envoyer le code.", variant: "destructive" });
    }
  };

  const handlePhoneLogin = async () => {
    if (otp.length < 6) return;
    setIsLoading(true);
    const success = await loginWithPhone(phone, otp);
    setIsLoading(false);
    if (success) {
      toast({ title: "Connexion réussie", description: "Bienvenue sur Kam'Etud !" });
      navigate("/");
    } else {
      setError("Code OTP invalide.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-warm px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-xl">K</span>
            </div>
            <span className="font-display font-bold text-2xl text-foreground">
              Kam'<span className="text-gradient-primary">Etud</span>
            </span>
          </Link>
          <h1 className="text-2xl font-display font-bold text-foreground">Connexion</h1>
          <p className="text-muted-foreground mt-1">Accédez à votre compte</p>
        </div>

        <Card className="shadow-elevated border-border/50">
          <CardContent className="pt-6">
            <Tabs defaultValue="email">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="email" className="flex-1"><Mail className="w-4 h-4 mr-1" /> Email</TabsTrigger>
                <TabsTrigger value="phone" className="flex-1"><Phone className="w-4 h-4 mr-1" /> Téléphone</TabsTrigger>
              </TabsList>

              <TabsContent value="email">
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  {error && <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">{error}</p>}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input id="email" type="email" placeholder="votre@email.com" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="password">Mot de passe</Label>
                      <Link to="/mot-de-passe-oublie" className="text-xs text-primary hover:underline">Oublié ?</Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-10 pr-10" value={password} onChange={(e) => setPassword(e.target.value)} required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-gradient-hero hover:opacity-90" disabled={isLoading}>
                    {isLoading ? "Connexion..." : "Se connecter"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="phone">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Numéro de téléphone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input placeholder="+237 6XX XXX XXX" className="pl-10" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                  </div>
                  {!otpSent ? (
                    <Button className="w-full bg-gradient-hero hover:opacity-90" onClick={handleSendOtp} disabled={!phone.trim() || isLoading}>
                      {isLoading ? "Envoi..." : "Envoyer le code OTP"}
                    </Button>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label>Code OTP (6 chiffres)</Label>
                        <div className="flex justify-center">
                          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} />
                              <InputOTPSlot index={3} /><InputOTPSlot index={4} /><InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                      </div>
                      <Button className="w-full bg-gradient-hero hover:opacity-90" onClick={handlePhoneLogin} disabled={isLoading || otp.length < 6}>
                        {isLoading ? "Vérification..." : "Vérifier et se connecter"}
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full" onClick={() => { setOtpSent(false); setOtp(""); }}>
                        Renvoyer le code
                      </Button>
                    </>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Pas encore de compte ?{" "}
          <Link to="/inscription" className="text-primary font-medium hover:underline">S'inscrire</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
