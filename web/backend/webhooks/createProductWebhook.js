import Helper_createProductRoadcube from "../helpers-roadcube/Helper_createProductRoadcube.js";
import Collections from "../models/collectionModel.js";
import Stores from "../models/storeModel.js";

const createProductWebhook = async ({ topic, shop, payload, webhookId }) => {
  try {
    const store = await Stores.findOne({
      store_domain: shop,
    });
    const collection = await Collections.findOne({
      store_domain: shop,
      title: "Home page",
    });
    await Helper_createProductRoadcube({
      product: { ...payload, category_id: collection?.roadcube_id || "2226" },
      storeID: store?.roadcube_store_id,
      token: store?.roadcube_token,
      shop_domain: shop,
    });
  } catch (error) {}
};

export default createProductWebhook;
