import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Clock, CheckCircle, AlertTriangle, Star, MessageSquare, Package,
  ThumbsUp, RotateCcw, Flag, XCircle, Loader2,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useMyOrders, useUpdateOrder, useChatMessages, useSendMessage, useCreateReview, subscribeToChatMessages } from "@/hooks/useSupabaseData";

import type { Order, OrderStatus } from "@/types";

const statusConfig: Record<OrderStatus, { label: string; className: string; icon: any }> = {
  pending: { label: "En attente", className: "bg-muted text-muted-foreground", icon: Clock },
  accepted: { label: "Accepté", className: "bg-primary/10 text-primary", icon: CheckCircle },
  in_progress: { label: "En cours", className: "bg-secondary/20 text-secondary-foreground", icon: Clock },
  delivered: { label: "Livré", className: "bg-primary/10 text-primary", icon: Package },
  revision_requested: { label: "Révision", className: "bg-accent/10 text-accent", icon: RotateCcw },
  completed: { label: "Terminé", className: "bg-primary/10 text-primary", icon: CheckCircle },
  disputed: { label: "Litige", className: "bg-destructive/10 text-destructive", icon: AlertTriangle },
  cancelled: { label: "Annulé", className: "bg-muted text-muted-foreground", icon: XCircle },
  refunded: { label: "Remboursé", className: "bg-muted text-muted-foreground", icon: RotateCcw },
};

const MyOrders = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: dbOrders, isLoading } = useMyOrders();
  const updateOrder = useUpdateOrder();
  const sendMessage = useSendMessage();
  const createReview = useCreateReview();
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [chatInput, setChatInput] = useState("");
  const [activeChat, setActiveChat] = useState<string | null>(null);

  const orders = dbOrders || [];
  const activeOrders = orders.filter((o) => !["completed", "cancelled", "refunded"].includes(o.status));
  const pastOrders = orders.filter((o) => ["completed", "cancelled", "refunded"].includes(o.status));

  const { data: chatMessages } = useChatMessages(activeChat);

  const handleAcceptDeliverable = (orderId: string) => {
    updateOrder.mutate({ id: orderId, status: 'completed' }, { onSuccess: () => toast({ title: "Livrable accepté !", description: "Paiement débloqué sous 24h." }) });
  };

  const handleRequestRevision = (order: Order) => {
    if (order.revisionsLeft > 0) {
      updateOrder.mutate({ id: order.id, status: 'revision_requested', revisions_left: order.revisionsLeft - 1 }, { onSuccess: () => toast({ title: "Révision demandée" }) });
    }
  };

  const handleDispute = (orderId: string) => {
    updateOrder.mutate({ id: orderId, status: 'disputed' }, { onSuccess: () => toast({ title: "Litige ouvert" }) });
  };

  const handleSendMessage = (orderId: string) => {
    if (!chatInput.trim()) return;
    sendMessage.mutate({ orderId, content: chatInput }, { onSuccess: () => setChatInput("") });
  };

  const handleSubmitReview = (order: Order) => {
    createReview.mutate({
      orderId: order.id, gigId: order.gigId, studentId: order.studentId,
      rating: reviewRating, text: reviewText,
    }, { onSuccess: () => { toast({ title: "Merci !" }); setReviewText(""); setReviewRating(5); } });
  };

  if (isLoading) return <Layout><div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></Layout>;

  const renderOrderCard = (order: Order) => {
    const config = statusConfig[order.status];
    return (
      <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="shadow-card border-border/50">
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-display font-bold text-foreground">{order.gigTitle}</h3>
                <p className="text-sm text-muted-foreground">Par {order.studentName} · Formule {order.tier}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={config.className}><config.icon className="w-3 h-3 mr-1" /> {config.label}</Badge>
                <span className="font-display font-bold text-primary">{order.budget.toLocaleString()} FCFA</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{order.description}</p>

            {order.status === "delivered" && (
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 mb-4">
                <p className="text-sm font-medium text-foreground mb-1">📦 Livrable soumis</p>
                <p className="text-sm text-muted-foreground">{order.deliverableNote || "L'étudiant a soumis le livrable."}</p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" onClick={() => handleAcceptDeliverable(order.id)} className="bg-gradient-hero hover:opacity-90"><ThumbsUp className="w-4 h-4 mr-1" /> Valider</Button>
                  {order.revisionsLeft > 0 && <Button size="sm" variant="outline" onClick={() => handleRequestRevision(order)}><RotateCcw className="w-4 h-4 mr-1" /> Révision ({order.revisionsLeft})</Button>}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Dialog>
                <DialogTrigger asChild><Button size="sm" variant="outline" onClick={() => setActiveChat(order.id)}><MessageSquare className="w-4 h-4 mr-1" /> Chat</Button></DialogTrigger>
                <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
                  <DialogHeader><DialogTitle className="font-display">Chat — {order.gigTitle}</DialogTitle></DialogHeader>
                  <div className="flex-1 overflow-y-auto space-y-3 py-4 min-h-[300px]">
                    {(chatMessages || []).map((msg) => (
                      <div key={msg.id} className={`flex ${msg.senderId === user?.id ? "justify-end" : "justify-start"}`}>
                        {msg.type === "system" ? (
                          <p className="text-xs text-muted-foreground text-center w-full">{msg.content}</p>
                        ) : (
                          <div className={`max-w-[75%] p-3 rounded-xl text-sm ${msg.senderId === user?.id ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                            <p className="text-xs font-medium mb-1 opacity-70">{msg.senderName}</p>{msg.content}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-border">
                    <Textarea placeholder="Votre message..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} className="min-h-[60px]" onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(order.id); }}} />
                    <Button size="sm" onClick={() => handleSendMessage(order.id)} className="bg-gradient-hero">Envoyer</Button>
                  </div>
                </DialogContent>
              </Dialog>
              {["in_progress", "delivered", "revision_requested"].includes(order.status) && (
                <Button size="sm" variant="outline" className="text-destructive" onClick={() => handleDispute(order.id)}><Flag className="w-4 h-4 mr-1" /> Contester</Button>
              )}
              {order.status === "completed" && (
                <Dialog>
                  <DialogTrigger asChild><Button size="sm" variant="outline"><Star className="w-4 h-4 mr-1" /> Noter</Button></DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle className="font-display">Noter {order.studentName}</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="flex gap-1 justify-center">{[1,2,3,4,5].map((s) => <button key={s} onClick={() => setReviewRating(s)}><Star className={`w-8 h-8 ${s <= reviewRating ? "text-secondary fill-secondary" : "text-muted"}`} /></button>)}</div>
                      <Textarea placeholder="Votre avis..." value={reviewText} onChange={(e) => setReviewText(e.target.value)} />
                      <Button className="w-full bg-gradient-hero" onClick={() => handleSubmitReview(order)}>Publier</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-display font-bold text-foreground mb-6">Mes commandes</h1>
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">En cours ({activeOrders.length})</TabsTrigger>
            <TabsTrigger value="past">Terminées ({pastOrders.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="space-y-4 mt-4">
            {activeOrders.length === 0 ? (
              <Card className="shadow-card border-border/50 p-8 text-center"><p className="text-muted-foreground">Aucune commande en cours</p><Button asChild className="mt-4 bg-gradient-hero"><Link to="/services">Explorer</Link></Button></Card>
            ) : activeOrders.map(renderOrderCard)}
          </TabsContent>
          <TabsContent value="past" className="space-y-4 mt-4">
            {pastOrders.length === 0 ? <p className="text-center text-muted-foreground py-8">Aucune commande passée</p> : pastOrders.map(renderOrderCard)}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MyOrders;
