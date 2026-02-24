import DonatePageClient from "./DonatePageClient";

// ✅ 1. HIGH-OCTANE SEO METADATA
const APP_URL = process.env.NEXTAUTH_URL || "https://www.stuhive.in";

export const metadata = {
    title: "Support StuHive | Fuel Independent Academic Learning",
    description: "Help keep StuHive independent and ad-free. Your donations directly fund high-speed hosting and secure storage for free academic resources.",
    keywords: ["Support StuHive", "Donate to Education", "Student Led Initiative", "Independent Academic Resources", "StuHive Server Fund"],
    alternates: {
        canonical: `${APP_URL}/donate`,
    },
    openGraph: {
        title: "Keep StuHive Independent | Donate Now",
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
        "name": "StuHive Donation Hub",
        "description": "Donation page to support the infrastructure of StuHive.",
        "mainEntity": {
            "@type": "Organization",
            "name": "StuHive",
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