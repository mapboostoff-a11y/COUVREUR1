import { useEffect } from 'react';
import { useConfigStore } from '../../store/use-config-store';
import { SectionRenderer } from '../../components/renderer/SectionRenderer';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const LegalPage = () => {
  const config = useConfigStore((state) => state.config);
  const { sections } = config;
  const { hash } = useLocation();

  useEffect(() => {
    // Scroll to hash if present
    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  const headerSection = sections.find((s) => s.type === 'header');
  const footerSection = sections.find((s) => s.type === 'footer');

  // Helper pour récupérer les infos légales du footer si elles existent
  const legalInfo = footerSection?.content && 'legal' in footerSection.content ? (footerSection.content as any).legal : {};
  const publisher = legalInfo?.publisher || config.meta.businessName || "L'éditeur du site";
  const contact = legalInfo?.publisherContact || "Voir coordonnées en bas de page";
  const siret = legalInfo?.siret || "Non renseigné";
  const rcs = legalInfo?.rcs || "Non renseigné";
  const capital = legalInfo?.capital || "Non renseigné";
  const tva = legalInfo?.tva || "Non renseigné";
  const host = legalInfo?.host || "Vercel Inc.";
  const hostAddress = legalInfo?.hostAddress || "340 S Lemon Ave #4133, Walnut, CA 91789, USA";
  
  return (
    <>
      <Helmet>
        <title>Mentions Légales | {config.meta.title}</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="flex flex-col min-h-screen">
        {/* Render Header if exists */}
        {headerSection && <SectionRenderer section={headerSection} />}

        <main className="flex-grow container mx-auto px-4 py-12 md:py-20 max-w-4xl">
          <Link 
            to="/" 
            className="inline-flex items-center text-sm text-primary hover:underline mb-8 group"
          >
            <ArrowLeft size={16} className="mr-2 transition-transform group-hover:-translate-x-1" />
            Retour à l'accueil
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold mb-12 border-b pb-4">Informations Légales</h1>

          {/* 1. Mentions Légales */}
          <section id="mentions-legales" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-semibold mb-6 flex items-center text-foreground">
              <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
              Mentions Légales
            </h2>
            <div className="space-y-6 text-muted-foreground">
              <div className="bg-muted/30 p-6 rounded-lg border border-muted">
                <h3 className="text-lg font-medium text-foreground mb-3">Éditeur du site</h3>
                <p className="leading-relaxed">
                  Le présent site est édité par : <strong>{publisher}</strong><br/>
                  SAS au capital de {capital}<br/>
                  RCS {rcs} - SIRET : {siret}<br/>
                  Numéro de TVA Intracommunautaire : {tva}
                </p>
                <p className="mt-4 leading-relaxed whitespace-pre-line">
                  <strong>Contact / Responsable de la publication :</strong><br/>
                  {contact}
                </p>
              </div>

              <div className="bg-muted/30 p-6 rounded-lg border border-muted">
                <h3 className="text-lg font-medium text-foreground mb-3">Hébergement</h3>
                <p className="leading-relaxed">
                  Le site est hébergé par <strong>{host}</strong><br />
                  Adresse : {hostAddress}<br />
                  {host.toLowerCase().includes('vercel') && (
                    <>Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://vercel.com</a></>
                  )}
                </p>
              </div>

              <div className="bg-muted/30 p-6 rounded-lg border border-muted">
                <h3 className="text-lg font-medium text-foreground mb-3">Propriété intellectuelle</h3>
                <p className="leading-relaxed">
                  L'ensemble des contenus (textes, images, graphismes, logo, icônes, etc.) présents sur le site sont la propriété exclusive de <strong>{publisher}</strong> ou de ses partenaires. 
                </p>
                <p className="mt-2 leading-relaxed">
                  Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de l'éditeur.
                </p>
              </div>
            </div>
          </section>

          {/* 2. Politique de Confidentialité */}
          <section id="confidentialite" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-semibold mb-6 flex items-center text-foreground">
              <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">2</span>
              Politique de Confidentialité
            </h2>
            <div className="space-y-6 text-muted-foreground">
              <p className="leading-relaxed">
                <strong>{publisher}</strong> attache une grande importance à la protection de vos données personnelles. Cette section détaille comment nous collectons et utilisons vos informations.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-muted/30 p-6 rounded-lg border border-muted">
                  <h3 className="text-lg font-medium text-foreground mb-3">Collecte des données</h3>
                  <p className="leading-relaxed">
                    Les données collectées via ce site (formulaire de contact, appels téléphoniques, WhatsApp) sont uniquement destinées à répondre à vos demandes de devis et d'informations auprès de <strong>{publisher}</strong>.
                  </p>
                </div>
                
                <div className="bg-muted/30 p-6 rounded-lg border border-muted">
                  <h3 className="text-lg font-medium text-foreground mb-3">Utilisation des données</h3>
                  <p className="leading-relaxed">
                    Vos données ne sont jamais revendues à des tiers. Elles sont conservées pendant la durée nécessaire à la gestion de la relation commerciale.
                  </p>
                </div>
              </div>

              <div className="bg-muted/30 p-6 rounded-lg border border-muted">
                <h3 className="text-lg font-medium text-foreground mb-3">Vos droits (RGPD)</h3>
                <p className="leading-relaxed">
                  Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles.
                </p>
                <p className="mt-2 leading-relaxed font-medium text-foreground">
                  Pour exercer ces droits, vous pouvez nous contacter :<br/>
                  <span className="font-normal block mt-1 whitespace-pre-line">{contact}</span>
                </p>
              </div>
            </div>
          </section>

          {/* 3. CGU */}
          <section id="cgu" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-semibold mb-6 flex items-center text-foreground">
              <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">3</span>
              Conditions Générales d'Utilisation
            </h2>
            <div className="space-y-6 text-muted-foreground">
              <p className="leading-relaxed">
                L'utilisation du site implique l'acceptation pleine et entière des conditions générales d'utilisation décrites ci-après.
              </p>
              
              <div className="bg-muted/30 p-6 rounded-lg border border-muted">
                <h3 className="text-lg font-medium text-foreground mb-3">Objet du site</h3>
                <p className="leading-relaxed">
                  Le site a pour objet de fournir une information concernant l'ensemble des activités de <strong>{publisher}</strong>. L'éditeur s'efforce de fournir des informations aussi précises que possible.
                </p>
              </div>

              <div className="bg-muted/30 p-6 rounded-lg border border-muted">
                <h3 className="text-lg font-medium text-foreground mb-3">Responsabilité</h3>
                <p className="leading-relaxed">
                  <strong>{publisher}</strong> ne pourra être tenu responsable des dommages directs et indirects causés au matériel de l'utilisateur lors de l'accès au site, ou des erreurs et omissions dans les informations diffusées.
                </p>
              </div>
            </div>
          </section>
        </main>

        {/* Render Footer if exists */}
        {footerSection && <SectionRenderer section={footerSection} />}
      </div>
    </>
  );
};
