import shopify from "../../shopify.js";
import Helper_getPriceRule from "./Helper_getPriceRule.js";

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const generateTitleForDiscount = (length) => {
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < (length || 12); i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

const Helper_createPriceRuleForDiscount = async ({
  session,
  customers,
  discount_type: { fixed_amount, percentage },
  discount_value: { fixed_amount_value, percentage_value },
  subTotal,
  coupon_id,
}) => {
  try {
    // Get All Price Rules
    let allPriceRules = [];
    let since_id = 0;
    while (since_id !== null) {
      const { price_rules } = await Helper_getPriceRule({
        session,
        since_id,
      });

      let tempPriceRules = price_rules || [];

      for (var i = 0; i < tempPriceRules.length; i++) {
        allPriceRules.push(tempPriceRules[i]);
      }

      if (tempPriceRules.length === 0) {
        since_id = null;
      } else {
        since_id = tempPriceRules[tempPriceRules.length - 1]?.id;
      }
    }

    // Create Title
    let title = null;

    do {
      title = generateTitleForDiscount();

      const _index = await allPriceRules.findIndex((x) => x.title === title);
      if (_index > -1) {
        title = null;
      }
    } while (!title);

    // Create Price Rule for Order Discount
    const price_rule = new shopify.api.rest.PriceRule({ session });
    price_rule.title = title;
    price_rule.value_type = fixed_amount ? "fixed_amount" : "percentage";
    price_rule.value = `-${fixed_amount_value || percentage_value || 1}`;
    price_rule.customer_selection = "prerequisite";
    price_rule.target_type = "line_item";
    price_rule.target_selection = "all";
    price_rule.allocation_method = "across";
    price_rule.once_per_customer = true;
    price_rule.prerequisite_customer_ids = customers || [7250063982874];
    price_rule.starts_at = new Date();

    await price_rule.save({
      update: true,
    });

    // Create Disocunt Code For Price Rule
    const discount_code = new shopify.api.rest.DiscountCode({
      session,
    });
    discount_code.price_rule_id = price_rule.id;
    discount_code.code = price_rule.title;
    await discount_code.save({
      update: true,
    });

    return {
      discount: discount_code,
      price_rule,
    };
  } catch (error) {
    // console.log(error)
    return {
      error: error.message || "Discount not created",
    };
  }
};

export default Helper_createPriceRuleForDiscount;
