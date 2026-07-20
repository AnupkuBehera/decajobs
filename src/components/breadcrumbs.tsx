import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

/**
 * Breadcrumb navigation component with BreadcrumbList JSON-LD structured data.
 * Google uses breadcrumbs as a quality signal for site navigation.
 */
export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const breadcrumbItems = [{ label: "Home", href: "/" }, ...items];

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-neutral-500">
          {breadcrumbItems.map((item, index) => (
            <li key={index} className="flex items-center gap-1.5">
              {index > 0 && (
                <span className="text-neutral-300" aria-hidden="true">
                  /
                </span>
              )}
              {item.href && index < breadcrumbItems.length - 1 ? (
                <Link
                  href={item.href}
                  className="hover:text-primary-600 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="text-neutral-900 font-medium"
                  aria-current="page"
                >
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* BreadcrumbList JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: breadcrumbItems.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: item.label,
              ...(item.href
                ? { item: `https://decajob.com${item.href}` }
                : {}),
            })),
          }),
        }}
      />
    </>
  );
}
