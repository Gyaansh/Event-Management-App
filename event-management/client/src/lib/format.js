export function formatDate(dateStr, opts = {}) {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString('en-IN', {
    weekday: opts.weekday ?? 'short',
    day: 'numeric',
    month: 'short',
    year: opts.year ?? 'numeric',
  });
}

export function formatDateRange(start, end) {
  if (!end || start === end) return formatDate(start);
  const s = new Date(`${start}T00:00:00`);
  const e = new Date(`${end}T00:00:00`);
  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  if (sameMonth) {
    return `${s.toLocaleDateString('en-IN', { day: 'numeric' })}–${e.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })}`;
  }
  return `${formatDate(start, { weekday: undefined })} – ${formatDate(end, { weekday: undefined })}`;
}

export function formatTime(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

export function formatCurrency(amount) {
  if (!amount) return 'Free';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactNumber(n) {
  return new Intl.NumberFormat('en-IN', { notation: 'compact' }).format(n);
}
