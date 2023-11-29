import Helper_claimCouponRoadcube from "../../helpers-roadcube/Helper_claimCouponRoadcube.js";
import Helper_createPriceRuleForDiscount from "../../helpers/Helper_createPriceRuleForDiscount.js";
import Helper_getSessionByShopName from "../../helpers/Helper_getSessionByShopName.js";
import Customers from "../../models/customerModel.js";

const __claimCoupon = async (req, res) => {
  try {
    // Get Session
    const { session } = await Helper_getSessionByShopName({
      shop: req.query.shop,
    });

    if (!session) {
      throw new Error("Something's wrong. Try again later");
    }

    // Find User in Database
    const _db_customer_ = await Customers.findOne({
      $and: [
        {
          store_domain: req.query.shop,
        },
        ...[
          req.query.customer_email
            ? { email: req.query.customer_email }
            : {
                customer_id: `gid://shopify/Customer/${req.query.customer_id}`,
              },
        ],
      ],
    });

    if (!_db_customer_) {
      throw new Error("Customer not found");
    }

    // Claim new Coupon
    const newClaimedCoupon = await Helper_claimCouponRoadcube({
      coupon_id: req.query.coupon_id,
      customer_email: _db_customer_?.email || "sapients55@gmail.com",
      token: req.body.token,
    });

    if (newClaimedCoupon.error) {
      throw new Error(newClaimedCoupon.error);
    }

    // Create New Product or Order Discount
    const { discount, price_rule, error } =
      await Helper_createPriceRuleForDiscount({
        session,
        customers: [
          Number(
            _db_customer_?.customer_id?.replace(
              "gid://shopify/Customer/",
              ""
            ) || req.query.customer_id
          ),
        ],
        discount_type: {
          fixed_amount: true,
        },
        discount_value: {
          fixed_amount_value: 45,
        },
        coupon_id: newClaimedCoupon.coupon_id,
      });

    if (error) {
      throw new Error(error);
    }

    // save claim_id, and price_rule_id
    await Customers.updateOne(
      {
        _id: _db_customer_._id,
      },
      {
        coupons_claims: [
          ...(_db_customer_?.coupons_claims || []),
          {
            price_rule_id: price_rule.id,
            coupon_id_roadcube: newClaimedCoupon.coupon_id || "",
            code: discount.code || "",
          },
        ],
      }
    );

    res.status(200).json({ code: discount.code });
  } catch (error) {
    // console.log(error)
    res.status(200).json({ error: error.message || "Invalid coupon to claim" });
  }
};

export default __claimCoupon;
