import shopify from "../../../shopify.js";
import Helper_createProductRoadcube from "../../helpers-roadcube/Helper_createProductRoadcube.js";
import Collections from "../../models/collectionModel.js";

const _syncProducts = async (req, res) => {
  try {
    if (!req.body.token) {
      res.status(400);
      throw new Error("RoadCube token not found");
    }

    if (!req.body.storeID) {
      res.status(400);
      throw new Error("RoadCube store ID not found");
    }
    let ids =
      req.body.productsIDs
        ?.join(",")
        .replaceAll("gid://shopify/Product/", "") || [].join(",");

    if (!ids) {
      return res.status(200).json({
        message: "Products synced",
      });
    }

    // Get Collections from DB
    const db_collections = await Collections.find({
      store_domain: res.locals.shopify.session.shop,
    });
    if (db_collections.length === 0) {
      throw new Error("Category not found of products");
    }

    // Get Products on Collections
    let collection_products = [];

    for (var i = 0; i < db_collections.length; i++) {
      if (db_collections[i].collection_id) {
        const { products } = await shopify.api.rest.Collection.products({
          session: res.locals.shopify.session,
          id: Number(
            db_collections[i].collection_id.replace(
              "gid://shopify/Collection/",
              ""
            ) || 0
          ),
        });

        for (var j = 0; j < products.length; j++) {
          collection_products.push({
            ...products[j],
            collection: db_collections[i],
          });
        }
      }
    }
    // console.log("collection prod ", collection_products);

    // Get Products for Synced
    const { data } = await shopify.api.rest.Product.all({
      session: res.locals.shopify.session,
      ids,
    });

    let errors = [];

    // Synced Product on RoadCube
    for (var i = 0; i < data.length; i++) {
      let productInCollections = collection_products.filter(
        (x) => x.id === data[i].id
      );

      let collection_category_id =
        productInCollections.filter(
          (x) =>
            x.collection?.title?.toLowerCase() !== "home page" ||
            x.collection?.title?.toLowerCase() === "home page"
        )[0]?.collection.roadcube_id ||
        db_collections.filter((x) => x.title?.toLowerCase() === "home page")[0]
          ?.roadcube_id;

      if (!collection_category_id) {
        errors.push(`${data.title} - Category not found for product`);
      } else {
        const { error } = await Helper_createProductRoadcube({
          product: { ...data[i], category_id: collection_category_id },
          storeID: req.body.storeID,
          token: req.body.token,
          shop_domain: res.locals.shopify.session.shop,
        });

        if (error) {
          errors.push(error);
        }
      }
    }

    res.status(200).json({
      message: errors.length === 0 ? "Products synced" : null,
      errors: errors.length === 0 ? null : errors,
    });
  } catch (error) {
    // console.log("error : ", error);
    res.status(200).send({ error: error.message || "Products not sync" });
  }
};

export default _syncProducts;
