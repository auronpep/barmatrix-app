export type SaleOffer = {
  slug: string;
  title: string;
  shortLabel: string;
  couponCode: string;
  basePriceCents: number;
  salePriceCents: number;
  savingsCents: number;
  checkoutLp: string;
  campaign: string;
  source: string;
  audience: string;
};

export type SalePageQueryInput = Record<string, string | string[] | undefined>;

export type SalePageVariant = "standard" | "legacy" | "flash";

export const STANDARD_FLAGSHIP_PRICE_CENTS = 99900;

export const PROMO_CODE_DISCOUNTS_CENTS: Record<string, number> = {
  HALFOFF499: 50000,
  WINTHETEST: 5000,
  REDZONEWIN: 10000,
  CUTCLASHCALL: 15000,
  BETHEBEST: 22200,
  BLACKLETTER: 50000,
  FORTHEWIN: 60000,
  WEGOTTHIS: 70000,
  ALMOSTDONE: 80000,
  FINALHOUR: 90000,
  LASTPUSH: 93000,
  WEWILLWIN: 96000,
  KEEPPUSHING: 35000,
  JUSTONEMORE: 50000,
  FINISHSTRONG: 70000,
  ONELASTPUSH: 80000,
  YOUVEGOTTHIS: 60000,
  KEEPGOING: 55000,
  LOCKIN: 30000,
  STAYREADY: 10000,
  NEXTQUESTION: 20000,
  ONEBYONE: 10000,
  NODAYSOFF: 45000,
  FINALSTRETCH: 65000,
  BRINGITHOME: 85000,
  STAYTHECOURSE: 75000,
  READYSETGO: 82500,
  PUSHTHROUGH: 77700,
  JUSTSTART: 87500,
  MAKEITCOUNT: 80000,
  FOCUSUP: 55000,
  LASTLAP: 60000,
  DOITNOW: 20000,
  ALLIN: 25000,
};

export const SALE_OFFERS: SaleOffer[] = [
  {
    slug: "launch-half-off-499",
    title: "BarMatrix Flagship Campaign Offer",
    shortLabel: "$499 campaign price",
    couponCode: "HALFOFF499",
    basePriceCents: STANDARD_FLAGSHIP_PRICE_CENTS,
    salePriceCents: 49900,
    savingsCents: 50000,
    checkoutLp: "campaign-offer",
    campaign: "launch_half_off_499",
    source: "campaign_offer",
    audience: "July-cycle MBE repair students",
  },
];

export const SALE_QUERY_KEYS = [
  "sale",
  "this",
  "code",
  "coupon",
  "promo",
  "coupon_code",
] as const;

export function splitSaleVariantSlug(slug: string): {
  baseSlug: string;
  variant: SalePageVariant;
} {
  if (slug.endsWith("_jly")) {
    return { baseSlug: slug.slice(0, -4), variant: "legacy" };
  }
  if (slug.endsWith("_flash")) {
    return { baseSlug: slug.slice(0, -6), variant: "flash" };
  }
  return { baseSlug: slug, variant: "standard" };
}

export function saleStaticParams() {
  return SALE_OFFERS.flatMap((offer) => [
    { slug: offer.slug },
    { slug: `${offer.slug}_jly` },
    { slug: `${offer.slug}_flash` },
  ]);
}

export function getSaleOfferBySlug(slug: string): SaleOffer | null {
  return SALE_OFFERS.find((offer) => offer.slug === slug) ?? null;
}

export function getSaleOfferByCode(
  code: string,
  slugOverride?: string,
): SaleOffer | null {
  const normalizedCode = normalizeCouponCode(code);
  if (!normalizedCode) return null;

  const registeredOffer =
    SALE_OFFERS.find(
      (offer) => offer.couponCode.toUpperCase() === normalizedCode,
    ) ?? null;
  if (registeredOffer) {
    return slugOverride && slugOverride !== registeredOffer.slug
      ? { ...registeredOffer, slug: slugOverride }
      : registeredOffer;
  }

  const savingsCents = PROMO_CODE_DISCOUNTS_CENTS[normalizedCode];
  if (!savingsCents) return null;

  const salePriceCents = Math.max(
    STANDARD_FLAGSHIP_PRICE_CENTS - savingsCents,
    0,
  );
  const price = Math.round(salePriceCents / 100);

  return {
    slug: slugOverride ?? `promo-${normalizedCode.toLowerCase()}`,
    title: "BarMatrix Flagship Campaign Offer",
    shortLabel: `$${price} campaign price`,
    couponCode: normalizedCode,
    basePriceCents: STANDARD_FLAGSHIP_PRICE_CENTS,
    salePriceCents,
    savingsCents,
    checkoutLp: "promo-code-sale",
    campaign: `promo_${normalizedCode.toLowerCase()}`,
    source: "promo_code",
    audience: "MBE repair students",
  };
}

export function getSaleOfferFromSearchParams(
  params: URLSearchParams,
): SaleOffer | null {
  const slug = params.get("sale");
  const code =
    params.get("this") ??
    params.get("code") ??
    params.get("coupon") ??
    params.get("promo") ??
    params.get("coupon_code");
  if (code) return getSaleOfferByCode(code, slug ?? undefined);

  return slug ? getSaleOfferBySlug(slug) : null;
}

export function buildSaleOfferFromQuery(
  slug: string,
  searchParams: SalePageQueryInput,
): SaleOffer | null {
  const requestedCode = normalizeCouponCode(
    firstQueryValue(searchParams.this) ??
      firstQueryValue(searchParams.code) ??
      firstQueryValue(searchParams.coupon) ??
      firstQueryValue(searchParams.promo) ??
      firstQueryValue(searchParams.coupon_code),
  );

  if (requestedCode) return getSaleOfferByCode(requestedCode, slug);

  return getSaleOfferBySlug(slug);
}

export function hasSaleIntent(params: URLSearchParams): boolean {
  return SALE_QUERY_KEYS.some((key) => params.has(key));
}

export function formatPrice(cents: number): string {
  return `$${Math.round(cents / 100).toLocaleString("en-US")}`;
}

export function checkoutHrefForSaleOffer(offer: SaleOffer): string {
  const params = new URLSearchParams({
    coupon: offer.couponCode,
  });
  return `/checkout?${params.toString()}`;
}

function firstQueryValue(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function normalizeCouponCode(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const code = raw.trim().toUpperCase();
  // Registered campaign codes can contain digits (e.g. HALFOFF499).
  return /^[A-Z0-9]{2,32}$/.test(code) ? code : null;
}
