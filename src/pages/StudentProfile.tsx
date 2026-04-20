import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star, MapPin, GraduationCap, Calendar, Download, Award, Shield, Clock, MessageSquare, Loader2,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfile, useGigs, useReviewsByStudent } from "@/hooks/useSupabaseData";


const levelColors: Record<string, string> = {
  Débutant: "bg-muted text-muted-foreground", Intermédiaire: "bg-primary/10 text-primary",
  Avancé: "bg-secondary/20 text-secondary-foreground", Expert: "bg-gradient-gold text-primary-foreground",
};

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: profile, isLoading } = useProfile(id);
  const { data: allGigs } = useGigs();
  const { data: dbReviews } = useReviewsByStudent(id);

  if (isLoading) return <Layout><div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></Layout>;

  const s = profile ? {
    name: `${profile.first_name} ${profile.last_name}`.trim(),
    avatar: profile.avatar_url || '',
    university: profile.university || 'Non renseigné',
    faculty: profile.faculty || '',
    level: profile.level || '',
    city: profile.city || '',
    bio: profile.bio || '',
    rating: Number(profile.rating) || 0,
    reviewCount: profile.review_count || 0,
    completedJobs: profile.completed_jobs || 0,
    responseTime: profile.response_time || '< 24h',
    memberSince: new Date(profile.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
    verified: profile.verified || false,
    levelBadge: (profile.level_badge || 'Débutant') as string,
    xp: profile.xp || 0,
    nextLevelXp: profile.next_level_xp || 100,
    skills: profile.skills || [],
  } : {
    name: 'Étudiant', avatar: '', university: '', faculty: '', level: '', city: '',
    bio: '', rating: 0, reviewCount: 0, completedJobs: 0, responseTime: '< 24h',
    memberSince: '', verified: false, levelBadge: 'Débutant', xp: 0, nextLevelXp: 100, skills: [],
  };

  const studentGigs = allGigs?.filter(g => g.studentId === id) || [];
  const studentReviews = dbReviews || [];

  const handleDownloadCV = () => {
    const cvContent = `CURRICULUM VITAE — KAM'ETUD\n============================\n\n${s.name}\n${s.university} — ${s.faculty} (${s.level})\n📍 ${s.city}\n\nPRÉSENTATION\n${s.bio}\n\nCOMPÉTENCES\n${s.skills.join(" • ")}\n\nEXPÉRIENCE\n• ${s.completedJobs} missions · ${s.rating}/5 (${s.reviewCount} avis) · ${s.levelBadge}\n\nSERVICES\n${studentGigs.map(g => `• ${g.title} — à partir de ${g.tiers.basique.price.toLocaleString()} FCFA`).join("\n")}\n\nGénéré sur Kam'Etud — ${new Date().toLocaleDateString("fr-FR")}`;
    const blob = new Blob([cvContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `CV_KamEtud_${s.name.replace(/\s/g, "_")}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="shadow-elevated border-border/50 overflow-hidden">
            <div className="h-32 bg-gradient-hero" />
            <CardContent className="relative pt-0 pb-6">
              <div className="flex flex-col sm:flex-row gap-4 -mt-12">
                <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                  <AvatarImage src={s.avatar} />
                  <AvatarFallback className="bg-gradient-hero text-primary-foreground text-2xl font-display">{s.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                </Avatar>
                <div className="flex-1 pt-2 sm:pt-4">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-2xl font-display font-bold text-foreground">{s.name}</h1>
                    {s.verified && <Badge className="bg-primary/10 text-primary border-primary/20"><Shield className="w-3 h-3 mr-1" /> Vérifié</Badge>}
                    <Badge className={levelColors[s.levelBadge] || "bg-muted text-muted-foreground"}><Award className="w-3 h-3 mr-1" /> {s.levelBadge}</Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4" /> {s.university}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {s.city}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {s.memberSince}</span>
                  </div>
                </div>
                <div className="flex gap-2 sm:self-end">
                  <Button variant="outline" size="sm" onClick={handleDownloadCV}><Download className="w-4 h-4 mr-1" /> CV</Button>
                  <Button size="sm" className="bg-gradient-hero hover:opacity-90"><MessageSquare className="w-4 h-4 mr-1" /> Contacter</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          {[
            { label: "Note", value: `${s.rating}/5`, icon: Star, color: "text-secondary" },
            { label: "Missions", value: s.completedJobs, icon: Award, color: "text-primary" },
            { label: "Avis", value: s.reviewCount, icon: MessageSquare, color: "text-accent" },
            { label: "Réponse", value: s.responseTime, icon: Clock, color: "text-muted-foreground" },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="shadow-card border-border/50 text-center p-4">
                <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
                <p className="text-xl font-display font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="shadow-card border-border/50 mt-6 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Progression</span>
            <span className="text-xs text-muted-foreground">{s.xp} / {s.nextLevelXp} XP</span>
          </div>
          <Progress value={(s.xp / s.nextLevelXp) * 100} className="h-3" />
        </Card>

        <Tabs defaultValue="services" className="mt-6">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="services">Services ({studentGigs.length})</TabsTrigger>
            <TabsTrigger value="avis">Avis ({studentReviews.length})</TabsTrigger>
            <TabsTrigger value="competences">Compétences</TabsTrigger>
          </TabsList>
          <TabsContent value="services">
            <div className="space-y-4 mt-4">
              {studentGigs.map((gig) => (
                <Card key={gig.id} className="shadow-card border-border/50 overflow-hidden">
                  <div className="h-1.5 bg-gradient-hero" />
                  <CardContent className="p-5">
                    <h3 className="font-display font-bold text-foreground text-lg mb-1">{gig.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{gig.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                      {(["basique", "standard", "premium"] as const).map((key) => {
                        const t = gig.tiers[key];
                        return (
                          <div key={key} className="p-3 rounded-lg border border-border bg-muted/30">
                            <p className="font-medium text-sm text-foreground capitalize">{t.name}</p>
                            <p className="text-lg font-display font-bold text-primary">{t.price.toLocaleString()} <span className="text-xs">FCFA</span></p>
                            <p className="text-xs text-muted-foreground">{t.deliveryDays}j · {t.features.length} inclus</p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Star className="w-3 h-3 text-secondary fill-secondary" /> {gig.rating}</span>
                        <span>{gig.orderCount} commandes</span>
                      </div>
                      <Button size="sm" className="bg-gradient-hero hover:opacity-90" onClick={() => navigate(`/commander/${gig.id}`)}>Commander</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="avis">
            <div className="space-y-4 mt-4">
              {studentReviews.map((review) => (
                <Card key={review.id} className="shadow-card border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm text-foreground">{review.reviewerName}</span>
                      <div className="flex items-center gap-1">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-3 h-3 ${i < review.rating ? "text-secondary fill-secondary" : "text-muted"}`} />)}</div>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.text}</p>
                    <p className="text-xs text-muted-foreground mt-2">{new Date(review.date).toLocaleDateString('fr-FR')}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="competences">
            <div className="mt-4">
              <div className="flex flex-wrap gap-2 mb-6">{s.skills.map((skill) => <Badge key={skill} variant="outline" className="px-3 py-1 text-sm">{skill}</Badge>)}</div>
              <Card className="shadow-card border-border/50 p-6"><h3 className="font-display font-bold text-foreground mb-2">À propos</h3><p className="text-muted-foreground text-sm leading-relaxed">{s.bio}</p></Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default StudentProfile;
