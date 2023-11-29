import shopify from "../../../shopify.js";
import Customers from "../../models/customerModel.js";

const _getCustomersSyncCount = async (req, res) => {
  try {
    let unsyncCustomers = [];

    // get Shopify Count
    const customerCount = await shopify.api.rest.Customer.count({
      session: res.locals.shopify.session,
    });

    // Get DB count
    const customerSynced = await Customers.find({
      $and: [
        {
          store_domain: res.locals.shopify.session.shop,
        },
        {
          synced: true,
        },
        {
          customer_deleted: false,
        },
      ],
    });

    // Get products for synced
    let since_id = 0;
    while (since_id !== null) {
      let customers = await shopify.api.rest.Customer.all({
        session: res.locals.shopify.session,
        since_id,
      });

      for (var i = 0; i < customers.data.length; i++) {
        let findProduct = customerSynced.filter(
          (x) => x.email === customers.data[i].email
        )[0];

        if (!findProduct) {
          unsyncCustomers.push(customers.data[i].admin_graphql_api_id);
        }
      }

      if (customers.data.length === 0) {
        since_id = null;
      } else {
        since_id = customers.data[customers.data.length - 1]?.id;
      }
    }

    let remainingCount = customerCount?.count - customerSynced.length || 0;

    res.status(200).json({
      total: customerCount?.count,
      remaining: remainingCount > 0 ? remainingCount : 0,
      unsyncCustomers,
    });
  } catch (error) {
    res
      .status(200)
      .json({ error: error.message || "Customers not found for sync" });
  }
};

export default _getCustomersSyncCount;
