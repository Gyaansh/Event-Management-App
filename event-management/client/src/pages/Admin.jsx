import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Users, ClipboardList } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import EmptyState from '@/components/EmptyState';
import ErrorState from '@/components/ErrorState';
import EventFormDialog from '@/components/events/EventFormDialog';
import ConfirmDeleteDialog from '@/components/events/ConfirmDeleteDialog';
import RegistrationsDialog from '@/components/events/RegistrationsDialog';
import { formatDateRange, formatCurrency } from '@/lib/format';
import { getCategoryMeta } from '@/data/categories';

export default function Admin() {
  const [events, setEvents] = useState(null);
  const [error, setError] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [regEvent, setRegEvent] = useState(null);
  const [regOpen, setRegOpen] = useState(false);

  const load = () => {
    setError(null);
    setEvents(null);
    api.getEvents().then(setEvents).catch((err) => setError(err.message));
  };

  useEffect(load, []);

  const handleCreate = () => {
    setEditingEvent(null);
    setFormOpen(true);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormOpen(true);
  };

  const handleSubmit = async (payload) => {
    if (editingEvent) {
      const updated = await api.updateEvent(editingEvent.id, payload);
      setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    } else {
      const created = await api.createEvent(payload);
      setEvents((prev) => [created, ...prev]);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.deleteEvent(deleteTarget.id);
      setEvents((prev) => prev.filter((e) => e.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Manage events</h1>
          <p className="text-sm text-muted-foreground">
            Create, edit, and track registrations for all your events.
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          New event
        </Button>
      </div>

      {error && <ErrorState message={error} onRetry={load} />}

      {!error && events === null && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 w-full animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      )}

      {!error && events?.length === 0 && (
        <EmptyState
          icon={ClipboardList}
          title="No events yet"
          description="Create your first event to start accepting registrations."
          actionLabel="Create event"
          onAction={handleCreate}
        />
      )}

      {!error && events?.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Event</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Date</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Category</th>
                <th className="px-4 py-3 font-medium">Registrations</th>
                <th className="hidden px-4 py-3 font-medium lg:table-cell">Price</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {events.map((event) => {
                const meta = getCategoryMeta(event.category);
                const isFull = event.registered >= event.capacity;
                return (
                  <tr key={event.id} className="transition-colors hover:bg-secondary/40">
                    <td className="max-w-[220px] px-4 py-3">
                      <p className="line-clamp-1 font-medium text-foreground">{event.title}</p>
                      <p className="line-clamp-1 text-xs text-muted-foreground">
                        {event.venue}, {event.city}
                      </p>
                    </td>
                    <td className="hidden whitespace-nowrap px-4 py-3 text-muted-foreground sm:table-cell">
                      {formatDateRange(event.date, event.endDate)}
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${meta.className}`}>
                        {event.category}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <button
                        onClick={() => {
                          setRegEvent(event);
                          setRegOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 text-foreground hover:underline"
                      >
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        {event.registered}/{event.capacity}
                        {isFull && (
                          <Badge variant="destructive" className="ml-1">
                            Full
                          </Badge>
                        )}
                      </button>
                    </td>
                    <td className="hidden whitespace-nowrap px-4 py-3 text-muted-foreground lg:table-cell">
                      {formatCurrency(event.price)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(event)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => setDeleteTarget(event)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <EventFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initialEvent={editingEvent}
        onSubmit={handleSubmit}
      />

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        eventTitle={deleteTarget?.title}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
      />

      <RegistrationsDialog open={regOpen} onOpenChange={setRegOpen} event={regEvent} />
    </div>
  );
}
