import shopify from "../../../shopify.js";
import Helper_createCustomerRoadcube from "../../helpers-roadcube/Helper_createCustomerRoadcube.js";

const _syncCustomers = async (req, res) => {
  try {
    if (!req.body.token) {
      res.status(400);
      throw new Error("RoadCube token not found");
    }

    let ids = req.body.customerIDs || [];
    let errors = [];

    for (var i = 0; i < ids.length; i++) {
      const customer = await shopify.api.rest.Customer.find({
        session: res.locals.shopify.session,
        id: Number(ids[i].replace("gid://shopify/Customer/", "")),
      });

      // Create Custoemer on RoadCube
      const { error } = await Helper_createCustomerRoadcube({
        token: req.body.token,
        customer,
        shop_domain: res.locals.shopify.session.shop,
      });

      if (error) {
        errors.push(error);
      }
    }

    res.status(200).json({
      message: errors?.length === 0 ? "Customers synced" : null,
      errors: errors?.length === 0 ? null : errors,
    });
  } catch (error) {
    res.status(200).json({
      error: error.message || "Customers not sync",
    });
  }
};

export default _syncCustomers;
