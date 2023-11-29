import Helper_currentAppInstallationId from "../helpers/Helper_currentAppInstallationId.js";
import Stores from "../models/storeModel.js";

const Middleware_saveStoreAppID = async (req, res, next) => {
  try {
    // find store in database
    let store = await Stores.findOne({
      store_domain: res.locals.shopify.session.shop,
    });

    const { id } = await Helper_currentAppInstallationId(
      res.locals.shopify.session
    );

    if (store) {
      // update store app id
      await Stores.updateOne(
        {
          _id: store._id,
        },
        {
          app_id: id,
        }
      );
    } else if (!store && id) {
      // create new store
      await Stores.create({
        store_domain: res.locals.shopify.session.shop,
        app_id: id,
      });
    }
  } catch (error) {}

  next();
};

export default Middleware_saveStoreAppID;
