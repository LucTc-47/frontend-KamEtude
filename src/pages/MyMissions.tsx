import { useState } from "react";
import { motion } from "framer-motion";
import {
  Clock, CheckCircle, AlertTriangle, Package, RotateCcw, XCircle,
  Upload, DollarSign, Loader2,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useMyMissions, useUpdateOrder } from "@/hooks/useSupabaseData";

import type { Order, OrderStatus } from "@/types";

const statusConfig: Record<OrderStatus, { label: string; className: string; icon: any }> = {
  pending: { label: "En attente", className: "bg-muted text-muted-foreground", icon: Clock },
  accepted: { label: "Accepté", className: "bg-primary/10 text-primary", icon: CheckCircle },
  in_progress: { label: "En cours", className: "bg-secondary/20 text-secondary-foreground", icon: Clock },
  delivered: { label: "Livré", className: "bg-primary/10 text-primary", icon: Package },
  revision_requested: { label: "Révision demandée", className: "bg-accent/10 text-accent", icon: RotateCcw },
  completed: { label: "Terminé", className: "bg-primary/10 text-primary", icon: CheckCircle },
  disputed: { label: "Litige", className: "bg-destructive/10 text-destructive", icon: AlertTriangle },
  cancelled: { label: "Annulé", className: "bg-muted text-muted-foreground", icon: XCircle },
  refunded: { label: "Remboursé", className: "bg-muted text-muted-foreground", icon: RotateCcw },
};

const MyMissions = () => {
  const { toast } = useToast();
  const { data: dbOrders, isLoading } = useMyMissions();
  const updateOrder = useUpdateOrder();
  const [deliverableNote, setDeliverableNote] = useState("");

  const orders = dbOrders || [];
  const pendingMissions = orders.filter((o) => o.status === "pending");
  const activeMissions = orders.filter((o) => ["accepted", "in_progress", "revision_requested"].includes(o.status));
  const completedMissions = orders.filter((o) => ["completed", "delivered", "cancelled", "refunded", "disputed"].includes(o.status));

  const handleAcceptMission = (orderId: string) => {
    updateOrder.mutate({ id: orderId, status: 'in_progress' }, { onSuccess: () => toast({ title: "Mission acceptée !" }) });
  };

  const handleDeclineMission = (orderId: string) => {
    updateOrder.mutate({ id: orderId, status: 'cancelled' }, { onSuccess: () => toast({ title: "Mission refusée" }) });
  };

  const handleSubmitDeliverable = (orderId: string) => {
    updateOrder.mutate({
      id: orderId, status: 'delivered',
      deliverable_note: deliverableNote || "Livrable soumis",
      deliverable_url: "https://example.com/deliverable",
    }, { onSuccess: () => { setDeliverableNote(""); toast({ title: "Livrable soumis !" }); } });
  };

  if (isLoading) return <Layout><div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></Layout>;

  const renderMissionCard = (order: Order) => {
    const config = statusConfig[order.status];
    return (
      <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="shadow-card border-border/50">
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <h3 className="font-display font-bold text-foreground">{order.gigTitle}</h3>
                <p className="text-sm text-muted-foreground">Client : {order.clientName} · Formule {order.tier}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={config.className}><config.icon className="w-3 h-3 mr-1" /> {config.label}</Badge>
                <span className="font-display font-bold text-primary flex items-center gap-1"><DollarSign className="w-4 h-4" /> {order.budget.toLocaleString()} FCFA</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{order.description}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Livraison : {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('fr-FR') : 'N/A'}</span>
              <span>Révisions : {order.revisionsLeft}</span>
            </div>
            {order.status === "pending" && (
              <div className="flex gap-2">
                <Button size="sm" className="bg-gradient-hero hover:opacity-90" onClick={() => handleAcceptMission(order.id)}><CheckCircle className="w-4 h-4 mr-1" /> Accepter</Button>
                <Button size="sm" variant="outline" className="text-destructive" onClick={() => handleDeclineMission(order.id)}><XCircle className="w-4 h-4 mr-1" /> Refuser</Button>
              </div>
            )}
            {["in_progress", "revision_requested"].includes(order.status) && (
              <Dialog>
                <DialogTrigger asChild><Button size="sm" className="bg-gradient-hero hover:opacity-90"><Upload className="w-4 h-4 mr-1" /> Soumettre le livrable</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle className="font-display">Soumettre le livrable</DialogTitle></DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center"><Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" /><p className="text-sm text-muted-foreground">Glissez vos fichiers ici</p></div>
                    <Textarea placeholder="Note pour le client..." value={deliverableNote} onChange={(e) => setDeliverableNote(e.target.value)} />
                    <Button className="w-full bg-gradient-hero" onClick={() => handleSubmitDeliverable(order.id)}>Envoyer</Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-display font-bold text-foreground mb-6">Mes missions</h1>
        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">Demandes ({pendingMissions.length})</TabsTrigger>
            <TabsTrigger value="active">En cours ({activeMissions.length})</TabsTrigger>
            <TabsTrigger value="done">Terminées ({completedMissions.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="pending" className="space-y-4 mt-4">
            {pendingMissions.length === 0 ? <Card className="shadow-card border-border/50 p-8 text-center"><p className="text-muted-foreground">Aucune demande</p></Card> : pendingMissions.map(renderMissionCard)}
          </TabsContent>
          <TabsContent value="active" className="space-y-4 mt-4">
            {activeMissions.length === 0 ? <Card className="shadow-card border-border/50 p-8 text-center"><p className="text-muted-foreground">Aucune mission active</p></Card> : activeMissions.map(renderMissionCard)}
          </TabsContent>
          <TabsContent value="done" className="space-y-4 mt-4">
            {completedMissions.length === 0 ? <Card className="shadow-card border-border/50 p-8 text-center"><p className="text-muted-foreground">Aucune mission terminée</p></Card> : completedMissions.map(renderMissionCard)}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MyMissions;
