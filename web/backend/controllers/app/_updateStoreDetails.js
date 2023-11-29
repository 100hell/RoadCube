import Stores from "../../models/storeModel.js";

const _updateStoreDetails = async (req, res) => {
  try {
    const store = await Stores.findOne({
      store_domain: res.locals.shopify.session.shop,
    });

    let _keys_for_update = Object.keys(req.body || {}).filter((x) =>
      Object.keys(store?._doc || {}).includes(x)
    );

    let finalObj = {};
    for (var i = 0; i < _keys_for_update.length; i++) {
      Object.assign(finalObj, {
        [_keys_for_update[i]]: req.body[_keys_for_update[i]],
      });
    }

    await Stores.updateOne({ _id: store._id }, finalObj);

    const updatedStore = await Stores.findOne({
      _id: store._id,
    });

    res.status(200).send({
      ...updatedStore?._doc,
      message: "Updated",
    });
  } catch (error) {
    res
      .status(200)
      .send({ error: error.message || "Something is wrong. Try again later" });
  }
};

export default _updateStoreDetails;
