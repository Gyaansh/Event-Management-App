import { CalendarDays } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          <span>Eventia — discover and manage events that matter.</span>
        </div>
        <p className="text-xs text-muted-foreground">© 2026 Eventia. All rights reserved.</p>
      </div>
    </footer>
  );
}
