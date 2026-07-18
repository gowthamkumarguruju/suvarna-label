type GraphQLError = {
  message: string;
};

type GraphQLResponse<TData> = {
  data?: TData;
  errors?: GraphQLError[];
};

export async function graphqlRequest<
  TData,
  TVariables extends Record<string, unknown>,
>(
  query: string,
  variables: TVariables,
): Promise<TData> {
  const response = await fetch("/api/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const result =
    (await response.json()) as GraphQLResponse<TData>;

  if (!response.ok || result.errors?.length) {
    throw new Error(
      result.errors?.map((error) => error.message).join(", ") ||
        "GraphQL request failed",
    );
  }

  if (!result.data) {
    throw new Error("GraphQL response did not contain data");
  }

  return result.data;
}