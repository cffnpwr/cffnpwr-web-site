import type { MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix Appaaaa" },
    { name: "description", content: "Welcome to Remixaaaaa!" },
  ];
};

export default () => {
  return (
    <h1>かふぇいんぱわぁのさいとです</h1>
  );
};
