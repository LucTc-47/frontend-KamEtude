import Layout from "@/components/layout/Layout";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import TrustSection from "@/components/home/TrustSection";
import CTASection from "@/components/home/CTASection";
import { motion } from "framer-motion";
import { Shield, Wallet, RefreshCw } from "lucide-react";

const HowItWorks = () => {
  return (
    <Layout>
      <section className="py-10 md:py-16 bg-gradient-warm">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground">
              Comment fonctionne <span className="text-gradient-primary">Kam'Etud</span> ?
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Une plateforme pensée pour les étudiants camerounais et adaptée aux réalités locales.
            </p>
          </motion.div>
        </div>
      </section>

      <HowItWorksSection />

      {/* Escrow explanation */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Paiement <span className="text-gradient-gold">sécurisé par séquestre</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              { icon: Wallet, title: "Le client paie à la commande", desc: "Les fonds sont envoyés via MTN MoMo ou Orange Money et bloqués par Kam'Etud." },
              { icon: RefreshCw, title: "L'étudiant réalise la mission", desc: "Pour les grandes missions (>10 000 FCFA), le paiement se fait en 3 tranches : 30% / 30% / 40%." },
              { icon: Shield, title: "Validation et déblocage", desc: "Le client valide le livrable, les fonds sont libérés vers le compte Mobile Money de l'étudiant sous 24h." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-5 p-6 rounded-2xl border border-border bg-background"
              >
                <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <TrustSection />
      <CTASection />
    </Layout>
  );
};

export default HowItWorks;
