type StackStatusProps = {
  ConvexUrl: string | undefined;
  ConvexSiteUrl: string | undefined;
  DodoProductId: string | undefined;
};

const StatusRow = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex items-center justify-between rounded-md border border-zinc-200 bg-white px-3 py-2">
      <span className="text-sm font-medium text-zinc-700">{label}</span>
      <span className="text-sm text-zinc-500">{value}</span>
    </div>
  );
};

export const StackStatus = ({ ConvexUrl, ConvexSiteUrl, DodoProductId }: StackStatusProps) => {
  return (
    <section className="grid gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
      <h2 className="text-lg font-semibold">Stack Status</h2>
      <StatusRow label="Convex URL" value={ConvexUrl ? "Configured" : "Missing"} />
      <StatusRow label="Convex Site URL" value={ConvexSiteUrl ? "Configured" : "Missing"} />
      <StatusRow label="Dodo Product" value={DodoProductId ? "Configured" : "Missing"} />
      <StatusRow label="Stack Check API" value="/api/stack/status" />
    </section>
  );
};
