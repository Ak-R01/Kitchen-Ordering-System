export default function InvalidTablePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="mb-2 font-display text-2xl font-medium">Table not found</h1>
      <p className="max-w-xs text-sm text-menu-muted">
        This QR code doesn't seem to be valid. Please ask a staff member for help.
      </p>
    </div>
  );
}
