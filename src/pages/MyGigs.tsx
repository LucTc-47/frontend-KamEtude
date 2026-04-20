import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Star, ShoppingBag, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMyGigs, useToggleGig, useDeleteGig } from "@/hooks/useSupabaseData";

const MyGigs = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: gigs, isLoading } = useMyGigs();
  const toggleGig = useToggleGig();
  const deleteGig = useDeleteGig();

  const handleToggle = (id: string, currentActive: boolean) => {
    toggleGig.mutate({ id, active: !currentActive }, { onSuccess: () => toast({ title: "Statut mis à jour" }) });
  };

  const handleDelete = (id: string) => {
    deleteGig.mutate(id, { onSuccess: () => toast({ title: "Gig supprimé" }) });
  };

  if (isLoading) return <Layout><div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></Layout>;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-display font-bold text-foreground">Mes Gigs</h1>
          <Button className="bg-gradient-hero hover:opacity-90" onClick={() => navigate("/mes-gigs/creer")}><Plus className="w-4 h-4 mr-1" /> Créer un gig</Button>
        </div>
        <div className="space-y-4">
          {(!gigs || gigs.length === 0) ? (
            <Card className="shadow-card border-border/50 p-8 text-center">
              <p className="text-muted-foreground mb-4">Vous n'avez aucun gig. Créez votre premier service !</p>
              <Button className="bg-gradient-hero" onClick={() => navigate("/mes-gigs/creer")}><Plus className="w-4 h-4 mr-1" /> Créer un gig</Button>
            </Card>
          ) : gigs.map((gig) => (
            <motion.div key={gig.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className={`shadow-card border-border/50 ${!gig.active ? "opacity-60" : ""}`}>
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display font-bold text-foreground">{gig.title}</h3>
                        <Badge variant={gig.active ? "default" : "outline"} className={gig.active ? "bg-primary/10 text-primary" : ""}>{gig.active ? "Actif" : "Inactif"}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <Badge variant="outline">{gig.category}</Badge>
                        <span className="flex items-center gap-1"><Star className="w-3 h-3 text-secondary fill-secondary" /> {gig.rating}</span>
                        <span className="flex items-center gap-1"><ShoppingBag className="w-3 h-3" /> {gig.orderCount} commandes</span>
                      </div>
                      <div className="mt-2 flex gap-4 text-sm">
                        <span className="text-muted-foreground">Basique: <span className="font-medium text-foreground">{gig.tiers.basique.price.toLocaleString()}</span></span>
                        <span className="text-muted-foreground">Standard: <span className="font-medium text-foreground">{gig.tiers.standard.price.toLocaleString()}</span></span>
                        <span className="text-muted-foreground">Premium: <span className="font-medium text-foreground">{gig.tiers.premium.price.toLocaleString()}</span></span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => handleToggle(gig.id, gig.active)}>{gig.active ? <ToggleRight className="w-4 h-4 text-primary" /> : <ToggleLeft className="w-4 h-4" />}</Button>
                      <Button size="sm" variant="ghost"><Edit className="w-4 h-4" /></Button>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(gig.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default MyGigs;
