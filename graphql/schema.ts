import { createSchema } from "graphql-yoga";
import { resolvers } from "./resolvers";
import { typeDefs } from "./type-defs";

export const schema = createSchema({
  typeDefs,
  resolvers,
});