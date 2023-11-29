import Stores from "../../models/storeModel.js";

const _getStoreDetails = async ({ req, res }) => {
  console.log("hit");
  try {
    const store = await Stores.findOne({
      store_domain: res.locals.shopify.session.shop,
    });

    res.status(200).send(store?._doc || {});
  } catch (error) {
    res.status(200).send({
      error: error.message || "RoadCube store details not found",
    });
  }
};

export default _getStoreDetails;
