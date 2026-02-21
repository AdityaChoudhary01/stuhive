import ContactPageClient from "./ContactPageClient";

// ✅ 1. HIGH-OCTANE SEO METADATA
const APP_URL = process.env.NEXTAUTH_URL || "https://peerlox.in";

export const metadata = {
    title: "Contact Us | Support & Partnerships",
    description: "Get in touch with PeerLox. Contact our team for technical support, bug reports, or partnership proposals. We are here to help you succeed academically.",
    keywords: ["Contact PeerLox", "Support", "University Partnerships", "Academic Collaboration", "PeerLox Help"],
    alternates: {
        canonical: `${APP_URL}/contact`,
    },
    openGraph: {
        title: "Connect with PeerLox | Communication Terminal",
        description: "Direct lines for technical support and student collaboration.",
        url: `${APP_URL}/contact`,
        type: "website",
    },
};

export default function ContactPage() {
    // 2. JSON-LD Structured Data for Contact Page
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "PeerLox Contact",
        "description": "The communication terminal for PeerLox academic community.",
        "contactPoint": {
            "@type": "ContactPoint",
            "email": "aadiwrld01@gmail.com",
            "contactType": "customer support",
            "areaServed": "Global",
            "availableLanguage": "English"
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ContactPageClient />
        </>
    );
}