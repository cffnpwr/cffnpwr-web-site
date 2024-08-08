import { type AppLoadContext, RequestHandler } from "@remix-run/cloudflare";
import { Hono } from "hono";
import { staticAssets } from "remix-hono/cloudflare";
import { remix } from "remix-hono/handler";

let handler: RequestHandler | undefined;
const app = new Hono();

app.use(
  async (c, next) => {
    if (process.env.NODE_ENV !== "development" || import.meta.env.PROD) {
      return staticAssets()(c, next);
    }
    await next();
  },
  async (c, next) => {
    if (process.env.NODE_ENV !== "development" || import.meta.env.PROD) {
      // @ts-expect-error no typed
      const serverBuild = await import("./build/server");
      return remix({
        build: serverBuild,
        mode: "production",
        getLoadContext(c) {
          return {
            cloudflare: {
              env: c.env,
            },
          };
        },
      })(c, next);
    } else {
      if (!handler) {
        // @ts-expect-error it's not typed
        const build = await import("virtual:remix/server-build");
        const { createRequestHandler } = await import("@remix-run/cloudflare");
        handler = createRequestHandler(build, "development");
      }
      const remixContext = {
        cloudflare: {
          env: c.env,
        },
      } as unknown as AppLoadContext;
      return handler(c.req.raw, remixContext);
    }
  },
);

export default app;
