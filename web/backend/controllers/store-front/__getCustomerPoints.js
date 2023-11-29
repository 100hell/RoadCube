import Helper_getCustomerPointsByIdRoadcube from "../../helpers-roadcube/Helper_getCustomerPointsByIdRoadcube.js";
import Customers from "../../models/customerModel.js";
import Stores from "../../models/storeModel.js";

const __getCustomerPoints = async (req, res) => {
  try {
    const _store_db = await Stores.findOne({
      $and: [
        {
          store_domain: req.query.shop,
        },
      ],
    });

    const _db_customer_ = await Customers.findOne({
      $and: [
        {
          store_domain: req.query.shop,
        },
        ...[
          req.query.customer_email
            ? { email: req.query.customer_email }
            : {
                customer_id: `gid://shopify/Customer/${req.query.customer_id}`,
              },
        ],
      ],
    });

    if (!_db_customer_) {
      throw new Error("Customer not found");
    }

    // find customer pints
    const { data, error } = await Helper_getCustomerPointsByIdRoadcube({
      customer_email: _db_customer_.email,
      token: _store_db.roadcube_token,
    });

    if (error) {
      throw new Error(error);
    }

    return res.status(200).json({
      points: data.remaining_points || 0,
      balance: data.current_balance || 0,
      flag: _store_db?.customers_flag,
      last_order_earn_points:
        _db_customer_.customer_latest_order_details?.total_points || 0,
      last_order_earn_balance:
        _db_customer_.customer_latest_order_details?.total_price || 0,
    });
  } catch (error) {
    res.status(200).json({ error: error.message || "Points not found " });
  }
};

export default __getCustomerPoints;
