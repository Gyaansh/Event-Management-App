import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarSearch, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';
import EventCard from '@/components/events/EventCard';
import EventCardSkeleton from '@/components/events/EventCardSkeleton';
import EventFilters from '@/components/events/EventFilters';
import EmptyState from '@/components/EmptyState';
import ErrorState from '@/components/ErrorState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const [events, setEvents] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('soonest');

  const load = () => {
    setError(null);
    setEvents(null);
    Promise.all([
      api.getEvents({ status: 'upcoming', search, category, sort }),
      api.getCategories(),
    ])
      .then(([eventsData, categoriesData]) => {
        setEvents(eventsData);
        setCategories(categoriesData);
      })
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    const timeout = setTimeout(load, search ? 250 : 0);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, sort]);

  const featured = useMemo(
    () => (events || []).filter((e) => e.featured).slice(0, 3),
    [events]
  );

  return (
    <div className="flex flex-col">
      <section className="border-b border-border bg-gradient-to-b from-secondary/60 to-background">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-4 gap-1.5 bg-background">
              <Sparkles className="h-3 w-3" />
              12 curated events this season
            </Badge>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Find your next event, effortlessly.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Discover conferences, concerts, workshops, and gatherings near you — then register
              in seconds.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <a href="#discover">
                  Explore events
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/admin">Host an event</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Featured this month
              </h2>
              <p className="text-sm text-muted-foreground">Hand-picked events you shouldn't miss</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      <section id="discover" className="mx-auto w-full max-w-7xl scroll-mt-20 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">All events</h2>
          <p className="text-sm text-muted-foreground">Browse and filter upcoming events</p>
        </div>

        <div className="mb-6">
          <EventFilters
            categories={categories}
            search={search}
            onSearchChange={setSearch}
            category={category}
            onCategoryChange={setCategory}
            sort={sort}
            onSortChange={setSort}
            resultCount={events?.length}
          />
        </div>

        {error && <ErrorState message={error} onRetry={load} />}

        {!error && events === null && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!error && events !== null && events.length === 0 && (
          <EmptyState
            icon={CalendarSearch}
            title="No events match your search"
            description="Try adjusting your filters or search terms to find what you're looking for."
            actionLabel="Clear filters"
            onAction={() => {
              setSearch('');
              setCategory('All');
            }}
          />
        )}

        {!error && events !== null && events.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
