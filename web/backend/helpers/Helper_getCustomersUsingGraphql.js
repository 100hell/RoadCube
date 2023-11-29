import shopify from "../../shopify.js";
import { GET_CUSTOMERS } from "../graphql/app.js";

const Helper_getCustomersUsingGraphql = async ({ session, query }) => {
  try {
    const graphqlClient = new shopify.api.clients.Graphql({
      session,
    });

    const graphqlData = await graphqlClient.query({
      data: GET_CUSTOMERS(query),
    });

    return graphqlData.body?.data?.customers;
  } catch (error) {
    return {
      error: error.message || "Customers not found",
    };
  }
};

export default Helper_getCustomersUsingGraphql;
