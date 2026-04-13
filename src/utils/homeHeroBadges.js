const formatBadge = (value) => {
  if (value === null || value === undefined) return '';
  return String(value).trim();
};

const formatBedroomsBadge = (value) => {
  const text = formatBadge(value);
  if (!text) return '';
  return /bedroom/i.test(text) ? text : `${text} Bedrooms`;
};

export const buildHomeHeroBadges = (homeData, fallbackBadges = []) => {
  const badges = [];

  const bedroomsBadge = formatBedroomsBadge(homeData?.statsBedrooms);
  if (bedroomsBadge) {
    badges.push(bedroomsBadge);
  }

  const premierBadge = formatBadge(homeData?.statsPremier);
  if (premierBadge) {
    badges.push(premierBadge);
  }

  const homeBadge = formatBadge(homeData?.homeBadge);
  if (homeBadge) {
    badges.push(homeBadge);
  }

  fallbackBadges
    .map(formatBadge)
    .filter(Boolean)
    .forEach((badge) => badges.push(badge));

  if (homeData?.ciwReportUrl) {
    badges.push('CIW Report');
  }

  if (homeData?.newsletterUrl) {
    badges.push('Newsletter');
  }

  return [...new Set(badges)].slice(0, 10);
};
