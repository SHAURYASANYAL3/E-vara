import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  image?: string;
}

export function useSEO({
  title,
  description,
  canonicalUrl,
  image = "https://image2url.com/r2/default/images/1773156349601-5fbf9f70-b342-4f44-b48d-32b3f38ba59f.png",
}: SEOProps) {
  useEffect(() => {
    // 1. Update Title
    document.title = `${title} | E-VARA Security`;

    // 2. Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute("content", description);

    // 3. Update Open Graph Title & Description
    const setMetaTag = (
      property: string,
      content: string,
      attr: "property" | "name" = "property",
    ) => {
      let tag = document.querySelector(`meta[${attr}="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    setMetaTag("og:title", `${title} | E-VARA`);
    setMetaTag("og:description", description);
    setMetaTag("og:image", image);
    if (canonicalUrl) setMetaTag("og:url", canonicalUrl);

    // 4. Update Twitter Cards
    setMetaTag("twitter:card", "summary_large_image", "name");
    setMetaTag("twitter:title", `${title} | E-VARA`, "name");
    setMetaTag("twitter:description", description, "name");
    setMetaTag("twitter:image", image, "name");

    // 5. Update Canonical URL
    if (canonicalUrl) {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement("link");
        canonicalLink.setAttribute("rel", "canonical");
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute("href", canonicalUrl);
    }
  }, [title, description, canonicalUrl, image]);
}
