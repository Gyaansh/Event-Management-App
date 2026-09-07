import { Link } from 'react-router-dom';
import { CalendarDays, MapPin, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatDateRange, formatTime, formatCurrency } from '@/lib/format';
import { getCategoryMeta } from '@/data/categories';
import { cn } from '@/lib/utils';

function statusBadge(event) {
  if (event.eventStatus === 'past') {
    return <Badge variant="secondary">Past event</Badge>;
  }
  if (event.eventStatus === 'sold-out') {
    return <Badge variant="destructive">Sold out</Badge>;
  }
  const remaining = event.capacity - event.registered;
  if (remaining <= event.capacity * 0.15) {
    return <Badge variant="warning">Few spots left</Badge>;
  }
  return <Badge variant="success">Open</Badge>;
}

export default function EventCard({ event }) {
  const meta = getCategoryMeta(event.category);
  const Icon = meta.icon;
  const fillPercent = Math.min(100, Math.round((event.registered / event.capacity) * 100));

  return (
    <Link
      to={`/events/${event.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <img
          src={event.image}
          alt={event.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">{statusBadge(event)}</div>
        <div className="absolute right-3 top-3 rounded-md bg-background/90 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm backdrop-blur">
          {formatCurrency(event.price)}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className={cn('inline-flex w-fit items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium', meta.className)}>
          <Icon className="h-3.5 w-3.5" />
          {event.category}
        </div>

        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground">
          {event.title}
        </h3>

        <div className="mt-auto flex flex-col gap-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
            <span>
              {formatDateRange(event.date, event.endDate)} · {formatTime(event.startTime)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-1">
              {event.venue}, {event.city}
            </span>
          </div>
        </div>

        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {event.registered}/{event.capacity} registered
            </span>
            <span>{fillPercent}%</span>
          </div>
          <Progress value={fillPercent} className="h-1.5" />
        </div>
      </div>
    </Link>
  );
}
