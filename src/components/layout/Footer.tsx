import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-gold flex items-center justify-center">
                <span className="font-display font-bold text-lg text-foreground">K</span>
              </div>
              <span className="font-display font-bold text-xl">Kam'Etud</span>
            </div>
            <p className="text-sm opacity-70 leading-relaxed">
              Transformer le talent étudiant en levier d'autonomie financière et d'expérience professionnelle.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Plateforme</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><Link to="/services" className="hover:opacity-100 transition-opacity">Services</Link></li>
              <li><Link to="/comment-ca-marche" className="hover:opacity-100 transition-opacity">Comment ça marche</Link></li>
              <li><Link to="/inscription" className="hover:opacity-100 transition-opacity">Devenir prestataire</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><a href="#" className="hover:opacity-100 transition-opacity">Centre d'aide</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Contact</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Conditions d'utilisation</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Villes</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li>Dschang</li>
              <li>Yaoundé</li>
              <li>Douala</li>
              <li>Bafoussam</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm opacity-50">© 2026 Kam'Etud — Université de Dschang. Tous droits réservés.</p>
          <div className="flex gap-4 text-sm opacity-50">
            <a href="#" className="hover:opacity-100">Confidentialité</a>
            <a href="#" className="hover:opacity-100">CGU</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
