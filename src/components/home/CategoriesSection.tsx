import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Monitor,
  Home,
  Truck,
  Wrench,
  PartyPopper,
  Sparkles,
} from "lucide-react";

const categories = [
  {
    icon: GraduationCap,
    title: "Académique",
    description: "Cours, répétition, rédaction de mémoire, traduction",
    color: "bg-primary/10 text-primary",
    count: 120,
  },
  {
    icon: Monitor,
    title: "Numérique",
    description: "Dev web, design graphique, montage vidéo, réseaux sociaux",
    color: "bg-secondary/20 text-secondary-foreground",
    count: 85,
  },
  {
    icon: Home,
    title: "Aide à domicile",
    description: "Ménage, cuisine, garde d'enfants, assistance",
    color: "bg-accent/10 text-accent",
    count: 64,
  },
  {
    icon: Truck,
    title: "Livraison & Courses",
    description: "Livraison de colis, courses supermarché, commissions",
    color: "bg-primary/10 text-primary",
    count: 43,
  },
  {
    icon: Wrench,
    title: "Bricolage",
    description: "Montage meuble, peinture, petite plomberie, électricité",
    color: "bg-secondary/20 text-secondary-foreground",
    count: 31,
  },
  {
    icon: PartyPopper,
    title: "Événementiel",
    description: "Accueil, animation, décoration, service traiteur",
    color: "bg-accent/10 text-accent",
    count: 27,
  },
  {
    icon: Sparkles,
    title: "Beauté & Bien-être",
    description: "Coiffure à domicile, maquillage, soins ongles",
    color: "bg-primary/10 text-primary",
    count: 38,
  },
];

const CategoriesSection = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Des services pour <span className="text-gradient-primary">chaque besoin</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
            7 catégories de services proposés par des étudiants vérifiés de l'Université de Dschang.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <Link
                to={`/services?categorie=${encodeURIComponent(cat.title)}`}
                className="group block p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center mb-4`}>
                  <cat.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                  {cat.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{cat.description}</p>
                <p className="mt-3 text-xs font-medium text-primary">{cat.count} prestataires</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
