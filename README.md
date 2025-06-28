# Bug Reproduction: Next.js Dynamic Parameter Error with Sentry `sendDefaultPii`

## Bug Description

When `sendDefaultPii: true` is added to the Sentry server configuration, Next.js throws a dynamic parameter error in the console.

**Related Issue**: https://github.com/getsentry/sentry-javascript/issues/16542

## Error Message

```
Error: Route "/" used `...params` or similar expression. `params` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at Function.entries (<anonymous>)
    at Object.apply (webpack-internal:/(rsc)/src/app/sentry-wrapper-module:47:9)
  45 |         baggageHeader,
  46 |         headers,
> 47 |       }).apply(thisArg, args);
     |         ^
  48 |     },
  49 |   });
  50 | } else {
```

## Environment

- **Next.js**: 15.3.4
- **React**: 19.1.0
- **Sentry**: @sentry/nextjs@9.33.0
- **TypeScript**: 5.8.3

## Steps to Reproduce

1. **Clone the repository**
   ```bash
   git clone https://github.com/daanvosdewael/next-sentry-async-params.git
   cd next-sentry-async-params
   npm install
   ```

2. **Reproduce the working state** (without the bug)
   ```bash
   git checkout a3271b6  # "feat: add Sentry config" commit
   npm run dev
   ```
   - Navigate to http://localhost:3000
   - Check console - no errors should appear

3. **Reproduce the broken state** (with the bug)
   ```bash
   git checkout b2a401a  # "feat: add `sendDefaultPii` on server config" commit
   npm run dev
   ```
   - Navigate to http://localhost:3000
   - Check console - the dynamic parameter error should appear

## Configuration Difference

The bug is triggered by adding `sendDefaultPii: true` to the Sentry server configuration:

**Working configuration** (commit a3271b6):
```typescript
// sentry.server.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "",
  debug: false,
});
```

**Broken configuration** (commit b2a401a):
```typescript
// sentry.server.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "",
  debug: false,
  sendDefaultPii: true,  // This line triggers the bug
});
```

## Expected Behavior

Adding `sendDefaultPii: true` should not cause Next.js dynamic parameter errors.

## Actual Behavior

The error suggests that Sentry's integration is accessing `params` synchronously when it should be awaited, violating Next.js 15's async parameter requirements.

## Additional Notes

- The error appears to originate from Sentry's wrapper module at line 47
- The error specifically mentions Route "/" but may affect other routes as well
- This appears to be related to Next.js 15's new async parameter handling requirements
