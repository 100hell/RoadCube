import Customers from "../models/customerModel.js";

const deleteCustomerWebhook = async ({ topic, shop, payload, webhookId }) => {
  try {
    await Customers.updateOne(
      {
        $and: [
          {
            store_domain: shop,
          },
          {
            customer_id: payload.admin_graphql_api_id,
          },
        ],
      },
      {
        customer_deleted: true,
      }
    );
  } catch (error) {}
};

export default deleteCustomerWebhook;
