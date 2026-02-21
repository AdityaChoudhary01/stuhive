import DonatePageClient from "./DonatePageClient";

// ✅ 1. HIGH-OCTANE SEO METADATA
const APP_URL = process.env.NEXTAUTH_URL || "https://peerlox.in";

export const metadata = {
    title: "Support PeerLox | Fuel Independent Academic Learning",
    description: "Help keep PeerLox independent and ad-free. Your donations directly fund high-speed hosting and secure storage for free academic resources.",
    keywords: ["Support PeerLox", "Donate to Education", "Student Led Initiative", "Independent Academic Resources", "PeerLox Server Fund"],
    alternates: {
        canonical: `${APP_URL}/donate`,
    },
    openGraph: {
        title: "Keep PeerLox Independent | Donate Now",
        description: "Zero profit. 100% infrastructure. Help us provide free knowledge to students worldwide.",
        url: `${APP_URL}/donate`,
        type: "website",
    },
};

export default function DonatePage() {
    // 2. JSON-LD for Donation Page (Helps Google identify this as a fundraising entity)
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "DonatePage",
        "name": "PeerLox Donation Hub",
        "description": "Donation page to support the infrastructure of PeerLox.",
        "mainEntity": {
            "@type": "Organization",
            "name": "PeerLox",
            "url": APP_URL
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <DonatePageClient />
        </>
    );
}