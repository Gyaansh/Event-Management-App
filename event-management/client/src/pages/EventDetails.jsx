import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  Share2,
  Building2,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import ErrorState from '@/components/ErrorState';
import RegistrationDialog from '@/components/events/RegistrationDialog';
import { formatDateRange, formatTime, formatCurrency } from '@/lib/format';
import { getCategoryMeta } from '@/data/categories';

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 h-4 w-24 rounded bg-muted" />
      <div className="aspect-[21/9] w-full rounded-lg bg-muted" />
      <div className="mt-6 h-8 w-2/3 rounded bg-muted" />
      <div className="mt-3 h-4 w-1/3 rounded bg-muted" />
    </div>
  );
}

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const load = () => {
    setError(null);
    setEvent(null);
    api.getEvent(id).then(setEvent).catch((err) => setError(err.message));
  };

  useEffect(load, [id]);

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <ErrorState message={error} onRetry={load} />
      </div>
    );
  }

  if (!event) return <DetailSkeleton />;

  const meta = getCategoryMeta(event.category);
  const Icon = meta.icon;
  const fillPercent = Math.min(100, Math.round((event.registered / event.capacity) * 100));
  const remaining = Math.max(0, event.capacity - event.registered);
  const isPast = event.eventStatus === 'past';
  const isSoldOut = event.eventStatus === 'sold-out';

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to events
      </Link>

      <div className="overflow-hidden rounded-lg border border-border">
        <img src={event.image} alt={event.title} className="aspect-[21/9] w-full object-cover" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${meta.className}`}>
                <Icon className="h-3.5 w-3.5" />
                {event.category}
              </div>
              {isPast && <Badge variant="secondary">Past event</Badge>}
              {!isPast && isSoldOut && <Badge variant="destructive">Sold out</Badge>}
              {!isPast && !isSoldOut && <Badge variant="success">Registration open</Badge>}
            </div>
            <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {event.title}
            </h1>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              Hosted by {event.organizer}
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">About this event</h2>
            <p className="leading-relaxed text-muted-foreground">{event.description}</p>
          </div>

          {event.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="space-y-5 p-5">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-0.5 h-4.5 w-4.5 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">
                      {formatDateRange(event.date, event.endDate)}
                    </p>
                    <p className="text-muted-foreground">
                      {formatTime(event.startTime)} – {formatTime(event.endTime)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4.5 w-4.5 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">{event.venue}</p>
                    <p className="text-muted-foreground">{event.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4.5 w-4.5 shrink-0 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    {isPast ? 'This event has ended' : `${remaining} spot${remaining === 1 ? '' : 's'} remaining`}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {event.registered}/{event.capacity} registered
                  </span>
                  <span>{fillPercent}%</span>
                </div>
                <Progress value={fillPercent} />
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Price</span>
                <span className="text-xl font-semibold text-foreground">
                  {formatCurrency(event.price)}
                </span>
              </div>

              <Button
                className="w-full"
                size="lg"
                disabled={isPast || isSoldOut}
                onClick={() => setDialogOpen(true)}
              >
                {isPast ? 'Event ended' : isSoldOut ? 'Sold out' : 'Register now'}
              </Button>

              <Button variant="outline" className="w-full gap-2" size="sm">
                <Share2 className="h-3.5 w-3.5" />
                Share event
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <RegistrationDialog
        event={event}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onRegistered={(updated) => setEvent((prev) => ({ ...prev, ...updated }))}
      />
    </div>
  );
}
