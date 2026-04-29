# Scheduling and Automation

## Scheduled Functions
Convex allows scheduling a function to run once in the future.

- **Mechanism:** Functions are stored in the database and executed at the specified time.
- **Methods:**
  - `ctx.scheduler.runAfter(ms, functionRef, args)`: Run after a specific delay.
  - `ctx.scheduler.runAt(timestamp, functionRef, args)`: Run at a specific epoch timestamp.
- **Atomicity:** When called from a mutation, scheduling is atomic. If the mutation fails, the function is not scheduled.
- **Identity:** Auth is NOT propagated. User identity must be passed as an argument if needed.
- **Monitoring:** Scheduled functions can be tracked via the `_scheduled_functions` system table.

## Cron Jobs
Recurring functions defined in `convex/crons.ts`.

- **Setup:** Use the `cronJobs()` helper to define intervals or specific cron strings.
- **Schedules:**
  - `crons.interval()`: Fixed frequency (seconds, minutes, hours).
  - `crons.cron()`: Standard crontab syntax.
  - `crons.daily()`, `crons.weekly()`, `crons.monthly()`: Common shortcuts.
- **Execution:** Only one instance of a specific cron job runs at a time. If a run takes longer than the interval, subsequent runs are skipped.

## Durable Workflows
For high-scale or complex async operations, use specialized components:
- **Workpool:** Prioritizes critical tasks via customizable queues.
- **Workflow:** Durable functions that survive crashes and support configurable retries/delays.
- **Crons Component:** Runtime-configurable scheduling via `cronspec`.
