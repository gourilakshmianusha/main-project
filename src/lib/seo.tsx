import React from "react";
import { Helmet } from "react-helmet-async";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  pageId?: "home" | "courses" | "blog" | "contact";
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  image,
  url = "https://hellosurya.com",
  type = "website",
  pageId,
}) => {
  const [settings, setSettings] = React.useState<any>(null);

  React.useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "seo"), (doc) => {
      if (doc.exists()) {
        setSettings(doc.data());
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, "settings/seo"));
    return () => unsub();
  }, []);

  const pageSettings = pageId && settings?.pages?.[pageId] ? settings.pages[pageId] : {};
  const globalSettings = settings?.global || {};

  const finalTitle = title || pageSettings.title || globalSettings.title || "Hello Surya IT | Advanced Developer Training";
  const finalDescription = description || pageSettings.description || globalSettings.description || "Expert IT training in Java, Python, and Full Stack Web Development. Industry-led courses.";
  const finalImage = image || globalSettings.ogImage || "https://hellosurya.com/og-image.jpg";
  
  const siteTitle = finalTitle.includes("Hello Surya") ? finalTitle : `${finalTitle} | Hello Surya IT`;

  // Structured Data for RankMath-like SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": type === "article" ? "BlogPosting" : "EducationalOrganization",
    "name": siteTitle,
    "description": finalDescription,
    "url": url,
    "image": finalImage,
    "author": {
      "@type": "Person",
      "name": globalSettings.author || "Surya"
    },
    "telephone": "9989581311"
  };

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={globalSettings.keywords || "Java, Python, Web Development"} />
      <meta name="author" content={globalSettings.author || "Surya"} />
      <meta name="robots" content="index, follow" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Hello Surya IT" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />

      {/* Canonical Link */}
      <link rel="canonical" href={url} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};
