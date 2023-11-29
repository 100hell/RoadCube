import shopify from "../../../shopify.js";
import Helper_getProductByIdRoadcube from "../../helpers-roadcube/Helper_getProductByIdRoadcube.js";
import Products from "../../models/productModel.js";
import Stores from "../../models/storeModel.js";

const __getProductVariantPoints = async (req, res) => {
  try {
    const _store_db = await Stores.findOne({
      $and: [
        {
          store_domain: req.query.shop,
        },
      ],
    });

    const _product_db = await Products.findOne({
      $and: [
        {
          store_domain: req.query.shop,
        },
        {
          product_id: `gid://shopify/Product/${req.query.product_id}`,
        },
      ],
    });

    const _product_variant_db = !req.query.variant_id
      ? _product_db?.variants[0]?.roadcube_id
      : _product_db?.variants.filter((x) =>
          x.variant_id.includes(req.query.variant_id)
        )[0]?.roadcube_id;

    if (!_product_variant_db) {
      throw new Error("Variant Points not exits");
    }

    const { data, error } = await Helper_getProductByIdRoadcube({
      product_id: _product_variant_db,
      store_id: req.body.storeID,
      token: req.body.token,
    });

    if (error) {
      throw new Error(error);
    }

    res.status(200).json({
      points: data?.products[0]?.reward_points || 0,
      flag: _store_db?.products_flag,
    });
  } catch (error) {
    // console.log(error);
    res.status(200).json({ error: error.message || "Points not found " });
  }
};

export default __getProductVariantPoints;
