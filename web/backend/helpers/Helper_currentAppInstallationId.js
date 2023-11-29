import shopify from "../../shopify.js";
import { GET_APP_INSTALLATION_ID } from "../graphql/app.js";

const Helper_currentAppInstallationId = async (session) => {
  try {
    const graphqlClient = new shopify.api.clients.Graphql({
      session,
    });

    const graphqlData = await graphqlClient.query({
      data: GET_APP_INSTALLATION_ID(),
    });

    return graphqlData.body.data.currentAppInstallation;
  } catch (error) {
    return {
      error: error.message || "App not installed",
    };
  }
};

export default Helper_currentAppInstallationId;
