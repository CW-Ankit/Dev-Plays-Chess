# Internal Functions

## Purpose
Functions that should NOT be exposed to the client. Used for sensitive logic or as building blocks for public functions.

## Implementation
Use `internalQuery`, `internalMutation`, or `internalAction`.

## Calling Internal Functions
- Use the `internal` object from `./_generated/api`.
- Example: `ctx.runMutation(internal.myModule.myPrivateFunction, args)`.

## Security
Internal functions mitigate risk by reducing the public API surface area.
