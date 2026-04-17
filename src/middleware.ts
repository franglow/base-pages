import { defineMiddleware } from 'astro:middleware';
import * as fs from 'fs';

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.request.method === 'POST') {
    try {
      const clonedRequest = context.request.clone();
      const formData = await clonedRequest.formData();
      const formPayload: Record<string, string> = {};
      for (const [key, value] of formData.entries()) {
        formPayload[key] = value.toString();
      }
      context.locals.formPayload = formPayload;
      fs.appendFileSync('middleware-debug.txt', `SUCCESS: parsed payload: ${JSON.stringify(formPayload)}\n`);
    } catch (err: any) {
      fs.appendFileSync('middleware-debug.txt', `ERROR: ${err.message}\n`);
    }
  }
  return next();
});
