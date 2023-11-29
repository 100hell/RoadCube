import Helper_createCustomerRoadcube from "../helpers-roadcube/Helper_createCustomerRoadcube.js";
import Customers from "../models/customerModel.js";
import Stores from "../models/storeModel.js";

const createCustomerWebhook = async ({ topic, shop, payload, webhookId }) => {
  try {
    const store = await Stores.findOne({
      store_domain: shop,
    });
    // find customer in Database
    const customer = await Customers.findOne({
      $and: [
        {
          store_domain: shop,
        },
        {
          email: payload.email,
        },
      ],
    });
    if (customer) {
      // update database and roadcube api
      await Customers.updateOne(
        {
          _id: customer._id,
        },
        {
          customer_id: customer.admin_graphql_api_id,
          first_name: customer.first_name,
          last_name: customer.last_name,
          customer_deleted: false,
        }
      );
    } else {
      // send customer to roadcube
      await Helper_createCustomerRoadcube({
        customer: payload,
        token: store?.roadcube_token,
        shop_domain: shop,
      });
    }
  } catch (error) {}
};

export default createCustomerWebhook;
