import shopify from "../../../shopify.js";
import Helper_createProductCategoryRoadcube from "../../helpers-roadcube/Helper_createProductCategoryRoadcube.js";
import Helper_getProductCategoryRoadcube from "../../helpers-roadcube/Helper_getProductCategoryRoadcube.js";
import Helper_getCollectionsUsingGraphql from "../../helpers/Helper_getCollectionsUsingGraphql.js";
import Collections from "../../models/collectionModel.js";
import Products from "../../models/productModel.js";

const _getProductsSyncCount = async (req, res) => {
  try {
    let unsyncProducts = [];

    // get Shopify Count
    const productsCount = await shopify.api.rest.Product.count({
      session: res.locals.shopify.session,
    });

    // Get DB count
    const productsSynced = await Products.find({
      $and: [
        {
          store_domain: res.locals.shopify.session.shop,
        },
        {
          synced: true,
        },
        {
          product_deleted: false,
        },
      ],
    });

    // Get products for synced
    let since_id = 0;
    while (since_id !== null) {
      let products = await shopify.api.rest.Product.all({
        session: res.locals.shopify.session,
        since_id,
      });

      for (var i = 0; i < products.data.length; i++) {
        let findProduct = productsSynced.filter(
          (x) => x.product_id === products.data[i].admin_graphql_api_id
        )[0];

        if (!findProduct) {
          unsyncProducts.push(products.data[i].admin_graphql_api_id);
        }
      }

      if (products.data.length === 0) {
        since_id = null;
      } else {
        since_id = products.data[products.data.length - 1]?.id;
      }
    }

    // Create collections as a Category on RoadCube
    if (req.body.storeID && req.body.token) {
      // Get Store All Categories
      let _db_collections = await Collections.find({
        store_domain: res.locals.shopify.session.shop,
      });
      let page = 1;
      do {
        const { data, error } = await Helper_getProductCategoryRoadcube({
          page,
          store_id: req.body.storeID,
          token: req.body.token,
        });

        page = data?.pagination.next_page;

        let _data = data?.product_categories || [];

        for (var i = 0; i < _data.length; i++) {
          let _db_collection = _db_collections.filter(
            (x) =>
              x.title === _data[i].name.en ||
              x.roadcube_id === _data[i].product_category_id
          )[0];

          if (_db_collection) {
            await Collections.updateOne(
              {
                _id: _db_collection._id,
              },
              {
                roadcube_id: _data[i].product_category_id,
                title: _data[i].name.en,
              }
            );
          } else {
            await Collections.create({
              store_domain: res.locals.shopify.session.shop,
              title: _data[i].name.en,
              roadcube_id: _data[i].product_category_id,
            });
          }
        }
      } while (page);

      // Get All Category
      const { edges, pageInfo } = await Helper_getCollectionsUsingGraphql({
        session: res.locals.shopify.session,
      });

      let collections = edges || [];

      _db_collections = await Collections.find({
        store_domain: res.locals.shopify.session.shop,
      });

      for (var i = 0; i < collections.length; i++) {
        let _db_collection = _db_collections.filter(
          (x) => x.title === collections[i].node.title
        )[0];
        // console.log("this is db coll ", _db_collection);
        if (_db_collection) {
          await Collections.updateOne(
            {
              _id: _db_collection._id,
            },
            {
              collection_id: collections[i].node.id,
            }
          );
        } else {
          // "Home page" = "2226"

          await Helper_createProductCategoryRoadcube({
            category: {
              id: collections[i].node.id,
              title: collections[i].node.title,
            },
            session: res.locals.shopify.session,
            storeID: req.body.storeID,
            token: req.body.token,
          });
        }
      }
    }

    let remainingCount = productsCount?.count - productsSynced.length || 0;

    res.status(200).json({
      total: productsCount?.count,
      remaining: remainingCount > 0 ? remainingCount : 0,
      unsyncProducts,
    });
  } catch (error) {
    res
      .status(200)
      .json({ error: error.message || "Products not found for sync" });
  }
};

export default _getProductsSyncCount;
