import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { api } from '@/lib/api';
import EmptyState from '@/components/EmptyState';

export default function RegistrationsDialog({ open, onOpenChange, event }) {
  const [regs, setRegs] = useState(null);

  useEffect(() => {
    if (open && event) {
      setRegs(null);
      api.getRegistrations(event.id).then(setRegs).catch(() => setRegs([]));
    }
  }, [open, event]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Registrations</DialogTitle>
          <DialogDescription>{event?.title}</DialogDescription>
        </DialogHeader>

        <div className="max-h-[50vh] overflow-y-auto">
          {regs === null && (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 w-full animate-pulse rounded-md bg-muted" />
              ))}
            </div>
          )}
          {regs?.length === 0 && (
            <EmptyState icon={Users} title="No registrations yet" description="Once attendees register, they'll show up here." />
          )}
          {regs && regs.length > 0 && (
            <ul className="divide-y divide-border">
              {regs.map((r) => (
                <li key={r.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <p className="font-medium text-foreground">{r.name}</p>
                    <p className="text-muted-foreground">{r.email}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {r.ticketCount} ticket{r.ticketCount > 1 ? 's' : ''}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
