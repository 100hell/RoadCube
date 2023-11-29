import shopify from "../../shopify.js";
import { GET_PRODUCTS } from "../graphql/app.js";

const Helper_getProductsUsingGraphql = async ({ session, query }) => {
  try {
    const graphqlClient = new shopify.api.clients.Graphql({
      session,
    });

    const graphqlData = await graphqlClient.query({
      data: GET_PRODUCTS(query),
    });

    return graphqlData.body?.data?.products;
  } catch (error) {
    return {
      error: error.message || "Products not found",
    };
  }
};

export default Helper_getProductsUsingGraphql;
