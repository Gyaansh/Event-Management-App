import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { CATEGORY_META } from '@/data/categories';

const emptyForm = {
  title: '',
  description: '',
  category: 'Technology',
  date: '',
  endDate: '',
  startTime: '10:00',
  endTime: '18:00',
  venue: '',
  city: '',
  address: '',
  capacity: 100,
  price: 0,
  organizer: '',
  image: '',
};

export default function EventFormDialog({ open, onOpenChange, initialEvent, onSubmit }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    if (open) {
      setForm(initialEvent ? { ...emptyForm, ...initialEvent } : emptyForm);
      setErrors({});
      setApiError(null);
    }
  }, [open, initialEvent]);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = 'Title is required';
    if (!form.description.trim()) next.description = 'Description is required';
    if (!form.date) next.date = 'Start date is required';
    if (!form.venue.trim()) next.venue = 'Venue is required';
    if (!form.city.trim()) next.city = 'City is required';
    if (!form.capacity || Number(form.capacity) < 1) next.capacity = 'Capacity must be at least 1';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setApiError(null);
    try {
      await onSubmit({
        ...form,
        endDate: form.endDate || form.date,
        capacity: Number(form.capacity),
        price: Number(form.price) || 0,
        tags: form.tags || [],
      });
      onOpenChange(false);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{initialEvent ? 'Edit event' : 'Create new event'}</DialogTitle>
          <DialogDescription>
            {initialEvent
              ? 'Update the details below and save your changes.'
              : 'Fill in the details to publish a new event.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="ev-title">Event title</Label>
            <Input id="ev-title" value={form.title} onChange={set('title')} placeholder="Annual Design Conference" />
            {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ev-desc">Description</Label>
            <Textarea
              id="ev-desc"
              value={form.description}
              onChange={set('description')}
              placeholder="What is this event about?"
              rows={3}
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="ev-category">Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger id="ev-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(CATEGORY_META).map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ev-organizer">Organizer</Label>
              <Input id="ev-organizer" value={form.organizer} onChange={set('organizer')} placeholder="Your organization" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="ev-date">Start date</Label>
              <Input id="ev-date" type="date" value={form.date} onChange={set('date')} />
              {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ev-end-date">End date</Label>
              <Input id="ev-end-date" type="date" value={form.endDate} onChange={set('endDate')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="ev-start-time">Start time</Label>
              <Input id="ev-start-time" type="time" value={form.startTime} onChange={set('startTime')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ev-end-time">End time</Label>
              <Input id="ev-end-time" type="time" value={form.endTime} onChange={set('endTime')} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ev-venue">Venue</Label>
            <Input id="ev-venue" value={form.venue} onChange={set('venue')} placeholder="Convention Center" />
            {errors.venue && <p className="text-xs text-destructive">{errors.venue}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="ev-city">City</Label>
              <Input id="ev-city" value={form.city} onChange={set('city')} placeholder="Bengaluru" />
              {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ev-address">Address</Label>
              <Input id="ev-address" value={form.address} onChange={set('address')} placeholder="Street, area" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="ev-capacity">Capacity</Label>
              <Input id="ev-capacity" type="number" min={1} value={form.capacity} onChange={set('capacity')} />
              {errors.capacity && <p className="text-xs text-destructive">{errors.capacity}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ev-price">Price (₹, 0 for free)</Label>
              <Input id="ev-price" type="number" min={0} value={form.price} onChange={set('price')} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ev-image">Cover image URL (optional)</Label>
            <Input id="ev-image" value={form.image} onChange={set('image')} placeholder="https://..." />
          </div>

          {apiError && <p className="text-sm text-destructive">{apiError}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {initialEvent ? 'Save changes' : 'Create event'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
