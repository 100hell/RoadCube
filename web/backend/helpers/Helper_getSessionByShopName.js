import shopify from "../../shopify.js";

const Helper_getSessionByShopName = async ({ shop }) => {
  try {
    let sessions = await shopify.config.sessionStorage.findSessionsByShop(shop);

    let storeSession;

    for (const session of sessions) {
      if (shop === session.shop) {
        storeSession = session;
        break;
      }
    }

    return {
      session: storeSession,
    };
  } catch (error) {
    return {
      error: error.message || "Session not found",
    };
  }
};

export default Helper_getSessionByShopName;
