import { motion } from "framer-motion";
import { Search, MessageSquare, CreditCard, Star } from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Recherchez",
    description: "Parcourez les services par catégorie ou utilisez la carte interactive pour trouver un étudiant près de chez vous.",
  },
  {
    icon: MessageSquare,
    step: "02",
    title: "Contactez",
    description: "Décrivez votre besoin et échangez avec l'étudiant pour définir les détails de la mission.",
  },
  {
    icon: CreditCard,
    step: "03",
    title: "Payez en sécurité",
    description: "Payez via Mobile Money (MTN MoMo ou Orange Money). Les fonds sont sécurisés jusqu'à la livraison.",
  },
  {
    icon: Star,
    step: "04",
    title: "Validez & notez",
    description: "Recevez le travail, validez la livraison et notez l'étudiant pour aider la communauté.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 md:py-28 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Comment ça <span className="text-gradient-gold">marche</span> ?
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
            Simple, rapide et sécurisé. Quatre étapes pour accéder au talent étudiant.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-hero mb-5">
                <step.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="absolute -top-2 -right-2 md:right-auto md:left-1/2 md:ml-6 text-6xl font-display font-bold text-primary/5">
                {step.step}
              </div>
              <h3 className="font-display font-semibold text-xl text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
