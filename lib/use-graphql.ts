"use client";

import { useCallback, useEffect, useState } from "react";
import { graphqlRequest } from "@/lib/graphql-client";

export function useGraphQL<TData, TVariables extends Record<string, unknown>>(
  query: string,
  variables: TVariables,
  deps: unknown[] = [],
) {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);

    graphqlRequest<TData, TVariables>(query, variables)
      .then((result) => setData(result))
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Something went wrong"),
      )
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}
