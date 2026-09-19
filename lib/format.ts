export function formatNaira(kobo: number): string {
  const naira = kobo / 100;
  return '₦' + naira.toLocaleString('en-NG', { maximumFractionDigits: 0 });
}

export const CONDITION_LABELS: Record<string, string> = {
  brand_new: 'Brand new',
  uk_used: 'UK used',
  nigerian_used: 'Nigerian used',
  refurbished: 'Refurbished',
  open_box: 'Open box',
};

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}
