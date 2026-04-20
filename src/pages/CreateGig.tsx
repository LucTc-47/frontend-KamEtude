import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCreateGig, useCategories, useCities } from "@/hooks/useSupabaseData";


const CreateGig = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createGig = useCreateGig();
  const { data: dbCategories } = useCategories();
  const { data: dbCities } = useCities();
  const categories = dbCategories || [];
  const cities = dbCities ? dbCities.map(c => c.name) : [];

  const [form, setForm] = useState({
    title: "", description: "", category: "", location: "",
    basique: { price: "", description: "", deliveryDays: "", features: [""] },
    standard: { price: "", description: "", deliveryDays: "", features: [""] },
    premium: { price: "", description: "", deliveryDays: "", features: [""] },
  });

  const updateTier = (tier: 'basique' | 'standard' | 'premium', field: string, value: string) => {
    setForm((prev) => ({ ...prev, [tier]: { ...prev[tier], [field]: value } }));
  };
  const addFeature = (tier: 'basique' | 'standard' | 'premium') => {
    setForm((prev) => ({ ...prev, [tier]: { ...prev[tier], features: [...prev[tier].features, ""] } }));
  };
  const updateFeature = (tier: 'basique' | 'standard' | 'premium', idx: number, value: string) => {
    setForm((prev) => { const f = [...prev[tier].features]; f[idx] = value; return { ...prev, [tier]: { ...prev[tier], features: f } }; });
  };
  const removeFeature = (tier: 'basique' | 'standard' | 'premium', idx: number) => {
    setForm((prev) => { const f = prev[tier].features.filter((_, i) => i !== idx); return { ...prev, [tier]: { ...prev[tier], features: f.length ? f : [""] } }; });
  };

  const buildTier = (tier: 'basique' | 'standard' | 'premium', label: string) => ({
    name: label, price: parseInt(form[tier].price) || 0,
    description: form[tier].description, deliveryDays: parseInt(form[tier].deliveryDays) || 1,
    features: form[tier].features.filter(Boolean),
  });

  const handleSubmit = async () => {
    try {
      await createGig.mutateAsync({
        title: form.title, description: form.description,
        category: form.category, location: form.location,
        tier_basique: buildTier('basique', 'Basique'),
        tier_standard: buildTier('standard', 'Standard'),
        tier_premium: buildTier('premium', 'Premium'),
      });
      toast({ title: "Gig publié !", description: "Votre service est maintenant visible." });
      navigate("/mes-gigs");
    } catch (e: any) {
      toast({ title: "Erreur", description: e.message, variant: "destructive" });
    }
  };

  const renderTierForm = (tier: 'basique' | 'standard' | 'premium', label: string) => (
    <Card className="shadow-card border-border/50">
      <CardHeader><CardTitle className="font-display text-base capitalize">{label}</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1"><Label className="text-xs">Prix (FCFA)</Label><Input type="number" placeholder="0" value={form[tier].price} onChange={(e) => updateTier(tier, "price", e.target.value)} /></div>
          <div className="space-y-1"><Label className="text-xs">Délai (jours)</Label><Input type="number" placeholder="1" value={form[tier].deliveryDays} onChange={(e) => updateTier(tier, "deliveryDays", e.target.value)} /></div>
        </div>
        <div className="space-y-1"><Label className="text-xs">Description</Label><Input placeholder="Ex: Landing page" value={form[tier].description} onChange={(e) => updateTier(tier, "description", e.target.value)} /></div>
        <div className="space-y-1">
          <Label className="text-xs">Inclus</Label>
          {form[tier].features.map((f, i) => (
            <div key={i} className="flex gap-1">
              <Input placeholder="Ex: Design responsive" value={f} onChange={(e) => updateFeature(tier, i, e.target.value)} className="text-sm" />
              {form[tier].features.length > 1 && <Button size="icon" variant="ghost" className="shrink-0" onClick={() => removeFeature(tier, i)}><Trash2 className="w-3 h-3" /></Button>}
            </div>
          ))}
          <Button size="sm" variant="ghost" onClick={() => addFeature(tier)} className="text-xs"><Plus className="w-3 h-3 mr-1" /> Ajouter</Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4"><ArrowLeft className="w-4 h-4 mr-1" /> Retour</Button>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-display font-bold text-foreground mb-6">Publier un nouveau gig</h1>
          <div className="space-y-6">
            <Card className="shadow-card border-border/50">
              <CardHeader><CardTitle className="font-display text-lg">Informations générales</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2"><Label>Titre</Label><Input placeholder="Ex: Création de site web" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
                <div className="space-y-2"><Label>Description</Label><Textarea placeholder="Décrivez votre service..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="min-h-[100px]" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Catégorie</Label><Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}><SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger><SelectContent>{categories.filter((c: any) => c.active).map((c: any) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent></Select></div>
                  <div className="space-y-2"><Label>Ville</Label><Select value={form.location} onValueChange={(v) => setForm({ ...form, location: v })}><SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger><SelectContent>{cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
                </div>
              </CardContent>
            </Card>
            <h2 className="font-display font-bold text-lg text-foreground">Tarification (3 paliers)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {renderTierForm("basique", "🟢 Basique")}
              {renderTierForm("standard", "🟡 Standard")}
              {renderTierForm("premium", "🔴 Premium")}
            </div>
            <Button className="w-full bg-gradient-hero hover:opacity-90 h-12" onClick={handleSubmit} disabled={createGig.isPending || !form.title || !form.category}>
              {createGig.isPending ? "Publication..." : "Publier le gig"}
            </Button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default CreateGig;
