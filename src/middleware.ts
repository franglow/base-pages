import { defineMiddleware } from 'astro:middleware';

/**
 * Hydrates `Astro.locals.formPayload` from the POST body so pages can
 * re-render with user input after a validation error.
 *
 * Constraints:
 *  - Vercel serverless filesystem is read-only, so NO fs writes here.
 *  - A middleware failure must never 500 the request — we always fall
 *    through to `next()` with an empty payload on any error.
 *  - Only parse form-encoded bodies; JSON Action payloads are left alone.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  if (context.request.method === 'POST') {
    try {
      const contentType = context.request.headers.get('content-type') ?? '';
      const isFormEncoded =
        contentType.includes('multipart/form-data') ||
        contentType.includes('application/x-www-form-urlencoded');

      if (isFormEncoded) {
        const formData = await context.request.clone().formData();
        const formPayload: Record<string, string> = {};
        for (const [key, value] of formData.entries()) {
          formPayload[key] = typeof value === 'string' ? value : '';
        }
        context.locals.formPayload = formPayload;
      } else {
        context.locals.formPayload = {};
      }
    } catch (err) {
      console.warn('[middleware] formPayload hydration skipped:', err);
      context.locals.formPayload = {};
    }
  }
  return next();
});
