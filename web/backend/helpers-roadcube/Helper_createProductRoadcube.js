import dotenv from "dotenv";
dotenv.config({});

import axios from "axios";
import Products from "../models/productModel.js";

const Helper_createProductRoadcube = async ({
  product,
  token,
  storeID,
  shop_domain,
}) => {
  // Get RoadCube token and RoadCube store ID
  try {
    let count = 0;
    let datas = [];

    let host = `${
      process.env.ROADCUBE_HOST || "https://api.roadcube.io/v1/p"
    }/stores/${storeID}/products`;

    let headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Api-Token": token,
    };

    for (var i = 0; i < product.variants.length; i++) {
      const products_db = await Products.findOne({
        $and: [
          {
            store_domain: shop_domain,
          },
          {
            product_id: product.admin_graphql_api_id,
          },
        ],
      });

      let roadcubeProductTitle =
        product.variants[i].title.toLowerCase() === "default title"
          ? product.title
          : `${product.title} - ${product.variants[i].title}`;

      let body = {
        name: {
          en: roadcubeProductTitle,
          el: roadcubeProductTitle,
          it: roadcubeProductTitle,
        },
        description: {
          en: product.body_html || "No Description",
          el: product.body_html || "No Description",
          it: product.body_html || "No Description",
        },
        published: product.published_at ? true : false,
        retail_price: Number(product.variants[i].price) || 1,
        wholesale_price: Number(product.variants[i].compare_at_price) || 1,
        group_product: false,
        availability_days: [1, 2, 3, 4, 5],
        product_category_id: product.category_id,
      };

      if (products_db) {
        const product_varinat_db = products_db.variants.filter(
          (x) => x.variant_id === product.variants[i].admin_graphql_api_id
        )[0]?.roadcube_id;

        if (product_varinat_db) {
          count += 1;

          await Products.updateOne(
            { _id: products_db._id },
            {
              synced: count === product.variants.length ? true : false,
            }
          );
        } else {
          const { data } = await axios.post(host, body, { headers });

          count += 1;

          datas.push(data);

          await Products.updateOne(
            { _id: products_db._id },
            {
              title: product.title,
              variants: [
                ...products_db.variants,
                {
                  variant_id: product.variants[i].admin_graphql_api_id,
                  title: product.variants[i].title,
                  roadcube_id: data.data.product.product_id,
                },
              ],
              synced: count === product.variants.length ? true : false,
            }
          );
        }
      } else {
        // console.log("helper roadcube prod body: ", body);
        const { data } = await axios.post(host, body, { headers });

        count += 1;

        datas.push(data);

        await Products.create({
          store_domain: shop_domain,
          product_id: product.admin_graphql_api_id,
          title: product.title,
          variants: product.variants.map((x) => ({
            variant_id: x.admin_graphql_api_id,
            title: x.title,
            roadcube_id: data.data.product.product_id,
          })),
          synced: count === product.variants.length ? true : false,
        });
      }
    }

    return datas;
  } catch (error) {
    // console.log("error in create helper:  ", error.response?.data || error);
    return {
      error: `${product.title} - ${
        error?.response?.data?.message ||
        error.message ||
        "Product not created on roadcube"
      }`,
    };
  }
};

export default Helper_createProductRoadcube;
