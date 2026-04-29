# Argument and Return Value Validation

## Importance
Essential for security. TypeScript is for dev-time; validators are for run-time.

## Validators (`v`)
- `v.string()`, `v.number()`, `v.boolean()`, `v.id(tableName)`.
- `v.optional(type)`: Marks a field as optional.
- `v.union(...types)`: Field can be one of several types.
- `v.literal(value)`: Field must be exactly this value.
- `v.object({...})`: Validates object shapes.
- `v.record(keyType, valueType)`: For dynamic maps.

## Return Values
Use the `returns` property in the constructor to validate what the function sends back to the client.
