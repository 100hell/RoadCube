import Helper_createTransactionUsingAmountAndProductsRoadcube from "../helpers-roadcube/Helper_createTransactionUsingAmountAndProductsRoadcube.js";
import Helper_reedemClaimedCouponRoadcube from "../helpers-roadcube/Helper_reedemClaimedCouponRoadcube.js";
import Customers from "../models/customerModel.js";
import Products from "../models/productModel.js";
import Stores from "../models/storeModel.js";

const createPaidFulfilledOrderWebhook = async ({
  topic,
  shop,
  payload,
  webhookId,
  webhook,
}) => {
  try {
    // Get Store
    const _db_store = await Stores.findOne({
      $and: [
        {
          store_domain: shop,
        },
      ],
    });

    // Get Customer
    const _db_customer = await Customers.findOne({
      $and: [
        {
          store_domain: shop,
        },
        {
          email: payload.customer.email,
        },
      ],
    });

    if (_db_customer) {
      await Customers.updateOne(
        {
          _id: _db_customer._id,
        },
        [
          {
            $set: {
              customer_latest_order_details: null,
            },
          },
        ]
      );
    }

    if (
      ((webhook.type === "order-create" && _db_store?.order_create_points) ||
        (webhook.type === "order-paid" && _db_store?.order_paid_points) ||
        (webhook.type === "order-fulfilled" &&
          _db_store?.order_fulfilled_points)) &&
      _db_customer &&
      (_db_store?.transaction_amount || _db_store?.transaction_products)
    ) {
      if (_db_store?.transaction_products) {
        // Products
        const _db_products = await Products.find({
          $and: [
            {
              store_domain: shop,
            },
            {
              $or: payload.line_items.map((x) => ({
                product_id: `gid://shopify/Product/${x.product_id}`,
              })),
            },
          ],
        });

        for (var i = 0; i < payload.line_items.length; i++) {
          const product = _db_products.filter(
            (x) =>
              x.product_id ===
              `gid://shopify/Product/${payload.line_items[i].product_id}`
          )[0];

          const variant = product?.variants.filter(
            (x) =>
              x.variant_id ===
              `gid://shopify/ProductVariant/${payload.line_items[i].variant_id}`
          )[0];

          if (variant) {
            payload.line_items[i].roadcube_id = variant.roadcube_id;
          }
        }
      }

      // Create Transaction based on Amount and Products
      const transaction =
        await Helper_createTransactionUsingAmountAndProductsRoadcube({
          order: payload,
          token: _db_store?.roadcube_token,
          storeID: _db_store.roadcube_store_id,
          amountTransaction: _db_store?.transaction_amount,
          productsTransaction: _db_store?.transaction_products,
        });

      // save latest transaction details from DB
      await Customers.updateOne(
        {
          _id: _db_customer._id,
        },
        [
          {
            $set: {
              customer_latest_order_details: transaction?.data || null,
            },
          },
        ]
      );

      // find price rule using disocunt code
      let discountApplied = payload.discount_applications[0];
      let customerCouponCliamID = _db_customer?.coupons_claims?.filter(
        (x) => x.code === discountApplied?.code
      )[0];

      if (
        discountApplied &&
        customerCouponCliamID &&
        customerCouponCliamID.code
      ) {
        // reedem or burn claimed coupon using cliam ID
        const { error } = await Helper_reedemClaimedCouponRoadcube({
          token: _db_store?.roadcube_token,
          storeID: _db_store.roadcube_store_id,
          coupon_id: _db_customer?.coupons_claims?.filter(
            (x) => x.code == discountApplied.code
          )[0]?.coupon_id_roadcube,
        });

        // delete from database
        if (!error) {
          await Customers.updateOne(
            {
              _id: _db_customer._id,
            },
            {
              coupons_claims:
                _db_customer?.coupons_claims?.filter(
                  (x) => x.code !== discountApplied.code
                ) || [],
            }
          );
        }
      }
    }
    //  else if (_db_customer) {
    //   // delete latest transaction details from DB
    //   await Customers.updateOne(
    //     {
    //       _id: _db_customer._id,
    //     },
    //     [
    //       {
    //         $set: {
    //           customer_latest_order_details: null,
    //         },
    //       },
    //     ]
    //   );
    // }
  } catch (error) {}
};

export default createPaidFulfilledOrderWebhook;
