import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/format';

const initialForm = { name: '', email: '', phone: '', ticketCount: 1 };

export default function RegistrationDialog({ event, open, onOpenChange, onRegistered }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState(null);

  const reset = () => {
    setForm(initialForm);
    setErrors({});
    setSuccess(false);
    setApiError(null);
    setSubmitting(false);
  };

  const handleOpenChange = (next) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email';
    const remaining = event.capacity - event.registered;
    if (form.ticketCount < 1) next.ticketCount = 'At least 1 ticket';
    else if (form.ticketCount > remaining) next.ticketCount = `Only ${remaining} spot(s) left`;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setApiError(null);
    try {
      const result = await api.registerForEvent(event.id, {
        ...form,
        ticketCount: Number(form.ticketCount),
      });
      setSuccess(true);
      onRegistered?.(result.event);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const total = form.ticketCount ? Number(form.ticketCount) * (event.price || 0) : 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        {success ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <DialogTitle>You're registered!</DialogTitle>
            <DialogDescription>
              A confirmation for <span className="font-medium text-foreground">{event.title}</span>{' '}
              has been sent to {form.email}. See you there!
            </DialogDescription>
            <Button className="mt-2 w-full" onClick={() => handleOpenChange(false)}>
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Register for this event</DialogTitle>
              <DialogDescription>{event.title}</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="reg-name">Full name</Label>
                <Input
                  id="reg-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ananya Sharma"
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reg-email">Email address</Label>
                <Input
                  id="reg-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="ananya@example.com"
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reg-phone">Phone (optional)</Label>
                <Input
                  id="reg-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reg-tickets">Number of tickets</Label>
                <Input
                  id="reg-tickets"
                  type="number"
                  min={1}
                  max={event.capacity - event.registered}
                  value={form.ticketCount}
                  onChange={(e) => setForm({ ...form, ticketCount: e.target.value })}
                />
                {errors.ticketCount && (
                  <p className="text-xs text-destructive">{errors.ticketCount}</p>
                )}
              </div>

              <div className="flex items-center justify-between rounded-md bg-secondary px-3.5 py-2.5 text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="font-semibold text-foreground">{formatCurrency(total)}</span>
              </div>

              {apiError && <p className="text-sm text-destructive">{apiError}</p>}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Confirm registration
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
