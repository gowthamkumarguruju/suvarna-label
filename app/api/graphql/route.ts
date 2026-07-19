import { createYoga } from "graphql-yoga";
import type { NextRequest } from "next/server";
import { schema } from "@/graphql/schema";

export const runtime = "nodejs";

const { handleRequest } = createYoga({
  schema,
  graphqlEndpoint: "/api/graphql",
  fetchAPI: {
    Response,
  },
});

type RouteContext = { params: Promise<Record<string, never>> };

function handler(request: NextRequest, _context: RouteContext) {
  return handleRequest(request, {});
}

export { handler as GET, handler as POST, handler as OPTIONS };