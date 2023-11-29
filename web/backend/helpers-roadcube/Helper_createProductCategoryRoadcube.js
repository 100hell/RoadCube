import dotenv from "dotenv";
dotenv.config({});

import axios from "axios";
import Collections from "../models/collectionModel.js";

const Helper_createProductCategoryRoadcube = async ({
  session,
  category,
  storeID,
  token,
}) => {
  try {
    // console.log("Category: ", category);
    let _collection_db = await Collections.findOne({
      $and: [
        {
          store_domain: session.shop,
        },
        {
          title: category.title,
        },
      ],
    });

    let host = `${
      process.env.ROADCUBE_HOST || "https://api.roadcube.io/v1/p"
    }/stores/${storeID}/product-categories`;

    let body = {
      name: {
        en: category.title,
        el: category.title,
        it: category.title,
      },
    };
    // console.log("body: ", body);
    let headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Api-Token": token,
    };

    const { data } = await axios.post(host, body, { headers });

    // create in my data base
    if (_collection_db) {
      await Collections.updateOne(
        {
          _id: _collection_db._id,
        },
        {
          collection_id: category.admin_graphql_api_id,
          title: category.title,
          roadcube_id: data.data.product_category.product_category_id,
        }
      );
    } else {
      await Collections.create({
        store_domain: session.shop,
        collection_id: category.id,
        title: category.title,
        roadcube_id: data.data.product_category.product_category_id,
      });
    }

    // console.log(data)

    return data;
  } catch (error) {
    // console.log(error.response?.data || error);
    return {
      error:
        error?.response?.data?.message ||
        error.message ||
        "Category not created on RoadCube",
    };
  }
};

export default Helper_createProductCategoryRoadcube;
