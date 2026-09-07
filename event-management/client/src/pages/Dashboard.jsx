import { useEffect, useState } from 'react';
import {
  CalendarCheck2,
  Users2,
  TrendingUp,
  Wallet,
  Flame,
  AlertCircle,
} from 'lucide-react';
import { api } from '@/lib/api';
import StatCard from '@/components/StatCard';
import EventCard from '@/components/events/EventCard';
import EventCardSkeleton from '@/components/events/EventCardSkeleton';
import ErrorState from '@/components/ErrorState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatCompactNumber } from '@/lib/format';
import { getCategoryMeta } from '@/data/categories';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState(null);
  const [error, setError] = useState(null);

  const load = () => {
    setError(null);
    setStats(null);
    setEvents(null);
    Promise.all([api.getStats(), api.getEvents({ status: 'upcoming', sort: 'popular' })])
      .then(([statsData, eventsData]) => {
        setStats(statsData);
        setEvents(eventsData.slice(0, 3));
      })
      .catch((err) => setError(err.message));
  };

  useEffect(load, []);

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ErrorState message={error} onRetry={load} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          An overview of everything happening across your events.
        </p>
      </div>

      {!stats ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[104px] animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={CalendarCheck2}
            label="Upcoming events"
            value={stats.upcomingEvents}
            hint={`${stats.totalEvents} total events`}
            accent="bg-blue-50 text-blue-600"
          />
          <StatCard
            icon={Users2}
            label="Total registrations"
            value={formatCompactNumber(stats.totalRegistrations)}
            hint={`of ${formatCompactNumber(stats.totalCapacity)} capacity`}
            accent="bg-violet-50 text-violet-600"
          />
          <StatCard
            icon={TrendingUp}
            label="Avg. fill rate"
            value={`${stats.avgFillRate}%`}
            hint={`${stats.soldOut} sold out`}
            accent="bg-emerald-50 text-emerald-600"
          />
          <StatCard
            icon={Wallet}
            label="Est. revenue"
            value={formatCurrency(stats.revenue)}
            hint="Across all registrations"
            accent="bg-amber-50 text-amber-600"
          />
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Events by category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!stats && (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-5 w-full animate-pulse rounded bg-muted" />
                ))}
              </div>
            )}
            {stats &&
              Object.entries(stats.byCategory)
                .sort((a, b) => b[1] - a[1])
                .map(([cat, count]) => {
                  const meta = getCategoryMeta(cat);
                  const Icon = meta.icon;
                  return (
                    <div key={cat} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-foreground">
                        <span className={`flex h-6 w-6 items-center justify-center rounded ${meta.className}`}>
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        {cat}
                      </span>
                      <span className="font-medium text-muted-foreground">{count}</span>
                    </div>
                  );
                })}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Attention needed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats && (
              <>
                <div className="flex items-center justify-between rounded-md border border-border p-3 text-sm">
                  <span className="flex items-center gap-2 text-foreground">
                    <Flame className="h-4 w-4 text-orange-500" />
                    Almost full (85%+ capacity)
                  </span>
                  <span className="font-semibold text-foreground">{stats.almostFull}</span>
                </div>
                <div className="flex items-center justify-between rounded-md border border-border p-3 text-sm">
                  <span className="flex items-center gap-2 text-foreground">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    Sold out events
                  </span>
                  <span className="font-semibold text-foreground">{stats.soldOut}</span>
                </div>
              </>
            )}
            {!stats && (
              <div className="space-y-3">
                <div className="h-12 w-full animate-pulse rounded-md bg-muted" />
                <div className="h-12 w-full animate-pulse rounded-md bg-muted" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-lg font-semibold text-foreground">Most popular right now</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events === null &&
            Array.from({ length: 3 }).map((_, i) => <EventCardSkeleton key={i} />)}
          {events?.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}
