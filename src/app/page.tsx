"use client";

import Hero from "@/components/home/Hero";
import styles from "./page.module.css";
import Link from "next/link";
import { Apple, ShoppingBasket, Leaf, ArrowRight, CupSoda, Heart, Zap } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  {
    id: 1,
    name: "Fruits de Saison",
    Icon: Apple,
    description: "Des fruits frais, mûris au soleil et sélectionnés chaque matin pour leur saveur exceptionnelle.",
    color: "#2E7D32"
  },
  {
    id: 2,
    name: "Jus Naturels",
    Icon: CupSoda,
    description: "Jus 100% pur fruit, sans sucre ajouté ni conservateurs. Pressés à froid pour garder toutes les vitamines.",
    color: "#E65100"
  },
  {
    id: 3,
    name: "Paniers Mixtes",
    Icon: ShoppingBasket,
    description: "Des assortiments équilibrés pour toute la semaine. Idéal pour les familles et les bureaux.",
    color: "#A2CF6E"
  },
  {
    id: 4,
    name: "Exotiques & Rares",
    Icon: Zap,
    description: "Voyagez avec nos fruits exotiques : mangues, ananas, et fruits de la passion d'exception.",
    color: "#FFD600"
  },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <Hero />

      <section className={styles.categories}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className={styles.sectionTitle}>Nos Univers Fruités</h2>
          </motion.div>

          <div className={styles.grid}>
            {categories.map((cat, index) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link href={`/shop?category=${cat.id}`} className={styles.categoryCard}>
                  <div className={styles.iconCircle} style={{ '--icon-color': cat.color } as any}>
                    <cat.Icon size={32} />
                  </div>
                  <h3>{cat.name}</h3>
                  <p>{cat.description}</p>
                  <span className={styles.cardCta}>
                    Découvrir <ArrowRight size={14} />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.engagement}>
        <div className="container">
          <motion.div
            className={styles.engagementContent}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className={styles.engagementText}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div className={styles.label}>
                <Leaf size={14} fill="currentColor" /> Qualité & Fraîcheur
              </div>
              <h3>De l'arbre à votre table, sans détour</h3>
              <p>
                Chez Fresh Fruit, nous croyons que la qualité commence par le respect du cycle naturel. C'est pourquoi nous travaillons directement avec des producteurs passionnés.
              </p>
              <p>
                Chaque fruit est contrôlé individuellement pour vous garantir une expérience gustative parfaite et un apport nutritionnel optimal.
              </p>
              <Link href="/shop" className={styles.readMore}>
                Découvrir nos produits <ArrowRight size={18} />
              </Link>
            </motion.div>
            <motion.div
              className={styles.engagementImage}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800" alt="Étal de fruits frais" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className={styles.ctaBanner}>
        <div className="container">
          <motion.div
            className={styles.bannerContent}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2>Besoin d'une livraison régulière ?</h2>
            <p>Notre équipe est à votre disposition pour organiser vos livraisons de fruits frais à domicile ou au bureau.</p>
            <Link href="/contact" className="btn btn-white">
              Contactez-nous
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
