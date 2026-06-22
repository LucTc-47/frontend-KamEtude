import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle, CheckCircle, XCircle, DollarSign,
  Scale, Shield, Clock, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel,
  SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useDisputes, useUpdateDispute, subscribeToDisputes } from "@/hooks/useUiData";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";


const ModeratorDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'moderator')) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const { t, locale } = useLanguage();
  const { toast } = useToast();
  const { data: dbDisputes, isLoading } = useDisputes();
  const updateDispute = useUpdateDispute();
  const [moderatorNote, setModeratorNote] = useState("");
  const qc = useQueryClient();

  useEffect(() => {
    const unsub = subscribeToDisputes(() => {
      qc.invalidateQueries({ queryKey: ["disputes"] });
    });
    return unsub;
  }, [qc]);

  const sidebarItems = [
    { title: t.md_disputes, url: "/moderateur", icon: Scale },
    { title: t.md_reports, url: "/moderateur/signalements", icon: AlertTriangle },
  ];

  const disputes = dbDisputes || [];
  const openDisputes = disputes.filter((d) => ["open", "under_review"].includes(d.status));
  const resolvedDisputes = disputes.filter((d) => ["resolved_client", "resolved_student"].includes(d.status));

  const handleResolve = (disputeId: string, resolution: "resolved_client" | "resolved_student") => {
    updateDispute.mutate({
      id: disputeId, status: resolution, moderator_note: moderatorNote,
      moderator_id: user?.id, resolved_at: new Date().toISOString(),
    }, {
      onSuccess: () => {
        setModeratorNote("");
        toast({ title: t.md_resolved_ok, description: resolution === "resolved_client" ? t.md_refund_ordered : t.md_deliverable_validated });
      },
    });
  };

  const handleEscalate = () => {
    toast({ title: t.md_escalated });
  };

  if (isLoading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar collapsible="icon">
          <SidebarContent>
            <SidebarGroup>
              <div className="p-4"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center"><Scale className="w-4 h-4 text-primary-foreground" /></div><span className="font-display font-bold text-sm text-sidebar-foreground">{t.moderator}</span></div></div>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent><SidebarMenu>{sidebarItems.map((item) => <SidebarMenuItem key={item.title}><SidebarMenuButton asChild><NavLink to={item.url} end className="hover:bg-sidebar-accent" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"><item.icon className="mr-2 h-4 w-4" /><span>{item.title}</span></NavLink></SidebarMenuButton></SidebarMenuItem>)}</SidebarMenu></SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center justify-between border-b border-border px-4 bg-background">
            <div className="flex items-center gap-4"><SidebarTrigger /><h1 className="text-lg font-display font-bold text-foreground">{t.md_title}</h1></div>
            <Avatar className="w-8 h-8"><AvatarFallback className="bg-gradient-gold text-primary-foreground text-xs">MO</AvatarFallback></Avatar>
          </header>
          <main className="flex-1 p-6 bg-muted/30 overflow-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                { label: t.md_open, value: openDisputes.length, icon: AlertTriangle, color: "text-destructive" },
                { label: t.md_resolved, value: resolvedDisputes.length, icon: CheckCircle, color: "text-primary" },
                { label: t.md_avg_time, value: "4h", icon: Clock, color: "text-secondary" },
              ].map((stat) => (
                <Card key={stat.label} className="shadow-card border-border/50"><CardContent className="p-4 flex items-center gap-3"><stat.icon className={`w-8 h-8 ${stat.color}`} /><div><p className="text-2xl font-display font-bold text-foreground">{stat.value}</p><p className="text-xs text-muted-foreground">{stat.label}</p></div></CardContent></Card>
              ))}
            </div>
            <Tabs defaultValue="open">
              <TabsList><TabsTrigger value="open">{t.md_tab_open} ({openDisputes.length})</TabsTrigger><TabsTrigger value="resolved">{t.md_tab_resolved} ({resolvedDisputes.length})</TabsTrigger></TabsList>
              <TabsContent value="open" className="space-y-4 mt-4">
                {openDisputes.length === 0 ? (
                  <Card className="shadow-card border-border/50 p-8 text-center"><CheckCircle className="w-12 h-12 text-primary mx-auto mb-2" /><p className="text-muted-foreground">{t.md_none_open}</p></Card>
                ) : openDisputes.map((dispute) => (
                  <motion.div key={dispute.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="shadow-card border-border/50 border-l-4 border-l-destructive">
                      <CardContent className="p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                          <div><h3 className="font-display font-bold text-foreground">{dispute.gigTitle}</h3><p className="text-sm text-muted-foreground">#{dispute.orderId} · {new Date(dispute.createdAt).toLocaleDateString(locale)}</p></div>
                          <Badge className="bg-destructive/10 text-destructive"><AlertTriangle className="w-3 h-3 mr-1" /> {t.md_open_status}</Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="p-4 rounded-lg bg-muted/50 border border-border"><p className="text-xs font-medium text-muted-foreground mb-1">👤 {t.client} — {dispute.clientName}</p><p className="text-sm text-foreground">{dispute.clientStatement}</p></div>
                          <div className="p-4 rounded-lg bg-muted/50 border border-border"><p className="text-xs font-medium text-muted-foreground mb-1">🎓 {t.student} — {dispute.studentName}</p><p className="text-sm text-foreground">{dispute.studentStatement}</p></div>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild><Button size="sm" className="bg-gradient-hero hover:opacity-90"><Scale className="w-4 h-4 mr-1" /> {t.md_arbitrate}</Button></DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <DialogHeader><DialogTitle className="font-display">{t.md_arbitration}</DialogTitle></DialogHeader>
                            <div className="space-y-4 py-4">
                              <Textarea placeholder={t.md_note_ph} value={moderatorNote} onChange={(e) => setModeratorNote(e.target.value)} />
                              <div className="flex gap-2">
                                <Button className="flex-1" variant="outline" onClick={() => handleResolve(dispute.id, "resolved_client")}><DollarSign className="w-4 h-4 mr-1" /> {t.md_refund}</Button>
                                <Button className="flex-1 bg-gradient-hero hover:opacity-90" onClick={() => handleResolve(dispute.id, "resolved_student")}><CheckCircle className="w-4 h-4 mr-1" /> {t.md_validate_deliv}</Button>
                              </div>
                              <Button variant="outline" className="w-full text-destructive" onClick={handleEscalate}><Shield className="w-4 h-4 mr-1" /> {t.md_report_abuse}</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </TabsContent>
              <TabsContent value="resolved" className="space-y-4 mt-4">
                {resolvedDisputes.length === 0 ? <Card className="shadow-card border-border/50 p-8 text-center"><p className="text-muted-foreground">{t.md_none_resolved}</p></Card> : resolvedDisputes.map((d) => (
                  <Card key={d.id} className="shadow-card border-border/50"><CardContent className="p-5"><div className="flex items-center justify-between"><div><h3 className="font-display font-bold text-foreground">{d.gigTitle}</h3><p className="text-sm text-muted-foreground">{d.clientName} vs {d.studentName}</p></div><Badge className={d.status === "resolved_client" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"}>{d.status === "resolved_client" ? t.md_refunded : t.md_validated}</Badge></div>{d.moderatorNote && <p className="text-sm text-muted-foreground mt-2 italic">"{d.moderatorNote}"</p>}</CardContent></Card>
                ))}
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ModeratorDashboard;
