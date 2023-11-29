import Stores from "../models/storeModel.js";

const Middleware_getTokenAndStoreID = async (req, res, next) => {
  const store = await Stores.findOne({
    store_domain: req.query.shop || res.locals.shopify.session.shop,
  });

  if (req.body) {
    req.body.token = store?.roadcube_token || null;
    req.body.storeID = store?.roadcube_store_id || null;
  } else {
    req.body = {
      token: store?.roadcube_token || null,
      storeID: store?.roadcube_store_id || null,
    };
  }

  next();
};

export default Middleware_getTokenAndStoreID;
