import Products from "../models/productModel.js";

const deleteProductWebhook = async ({ topic, shop, payload, webhookId }) => {
  try {
    await Products.deleteOne({
      $and: [
        {
          store_domain: shop,
        },
        {
          product_id:
            payload.admin_graphql_api_id ||
            `gid://shopify/Product/${payload.id}`,
        },
      ],
    });
  } catch (error) {}
};

export default deleteProductWebhook;
