import dotenv from "dotenv";
dotenv.config({});

import axios from "axios";

const Helper_createTransactionUsingAmountAndProductsRoadcube = async ({
  order,
  token,
  storeID,
  amountTransaction,
  productsTransaction,
}) => {
  try {
    let host = `${
      process.env.ROADCUBE_HOST || "https://api.roadcube.io/v1/p"
    }/stores/${storeID}/transactions/new`;

    let inputs =
      (productsTransaction && {
        user: order.customer.email,
        ...(order.customer?.custom_points_flag
          ? {
              custom_points_provided: true,
              custom_points:
                (order.customer?.custom_points &&
                  (order.customer?.custom_points > 5 ||
                  order.customer?.custom_points < 0
                    ? 0
                    : 5 - order.customer?.custom_points)) ||
                0,
            }
          : {
              custom_points_provided: false,
            }),
        products: order.line_items
          .filter((x) => x.roadcube_id)
          .map((x) => ({
            product_id: x.roadcube_id,
            retail_price: x.price,
            quantity: Number(x.quantity),
          })),
      }) ||
      (amountTransaction && {
        user: order.customer.email,
        amount: order.total_price,
      }) ||
      {};

      // console.log(inputs)

    let headers = {
      "Content-Type": "application/json",
      "X-Api-Token": token,
      Accept: "application/json",
    };

    const { data } = await axios.post(host, inputs, { headers });
    // console.log(data);

    return data;
  } catch (error) {
    // console.log(error.response?.data || error);
    return {
      error: `Customer ${order.customer.email} - ${
        error?.response?.data?.message ||
        error.message ||
        "not found on roadcube"
      }`,
    };
  }
};

export default Helper_createTransactionUsingAmountAndProductsRoadcube;
