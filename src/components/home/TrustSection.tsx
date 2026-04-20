import { motion } from "framer-motion";
import { Shield, Smartphone, Award, Clock } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Identité vérifiée",
    description: "Chaque étudiant est vérifié avec sa carte d'étudiant et sa CNI. Badge de confiance garanti.",
  },
  {
    icon: Smartphone,
    title: "Paiement Mobile Money",
    description: "Payez via MTN MoMo ou Orange Money. Fonds sécurisés par séquestre jusqu'à validation.",
  },
  {
    icon: Award,
    title: "CV numérique",
    description: "Chaque mission réalisée enrichit le profil de l'étudiant. Générez un CV PDF professionnel.",
  },
  {
    icon: Clock,
    title: "Matching intelligent",
    description: "Notre algorithme trouve le prestataire idéal selon vos besoins, la proximité et les notes.",
  },
];

const TrustSection = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Pourquoi choisir <span className="text-gradient-primary">Kam'Etud</span> ?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-4 p-6 rounded-2xl bg-card border border-border shadow-card"
            >
              <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
