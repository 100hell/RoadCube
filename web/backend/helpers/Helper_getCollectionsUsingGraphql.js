import shopify from "../../shopify.js";
import { GET_COLLECTIONS } from "../graphql/app.js";

const Helper_getCollectionsUsingGraphql = async ({ session, query }) => {
  try {
    const graphqlClient = new shopify.api.clients.Graphql({
      session,
    });

    const graphqlData = await graphqlClient.query({
      data: GET_COLLECTIONS(query),
    });

    return graphqlData.body?.data?.collections;
  } catch (error) {
    return {
      error: error.message || "Collections not found",
    };
  }
};

export default Helper_getCollectionsUsingGraphql;
