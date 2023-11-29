import Helper_getCouponsRoadcube from "../../helpers-roadcube/Helper_getCouponsRoadcube.js";
import Customers from "../../models/customerModel.js";

const __getAvailableCoupons = async (req, res) => {
  try {
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

    // let coupons = [
    //   {
    //     coupon_id: 0,
    //     title: "test expire",
    //     description: "test expire",
    //     points: 9,
    //     cost: "9.00",
    //     image:
    //       "https://roadcube-stage-files.s3.eu-central-1.amazonaws.com/images/info/rc/no-image.png",
    //   },
    //   {
    //     coupon_id: 1,
    //     title: "test expire",
    //     description: "test expire",
    //     points: 9,
    //     cost: "9.00",
    //     image:
    //       "https://roadcube-stage-files.s3.eu-central-1.amazonaws.com/images/info/rc/no-image.png",
    //   },
    //   {
    //     coupon_id: 2,
    //     title: "test expire",
    //     description: "test expire",
    //     points: 9,
    //     cost: "9.00",
    //     image:
    //       "https://roadcube-stage-files.s3.eu-central-1.amazonaws.com/images/info/rc/no-image.png",
    //   },
    //   {
    //     coupon_id: 3,
    //     title: "test expire",
    //     description: "test expire",
    //     points: 9,
    //     cost: "9.00",
    //     image:
    //       "https://roadcube-stage-files.s3.eu-central-1.amazonaws.com/images/info/rc/no-image.png",
    //   },
    //   {
    //     coupon_id: 4,
    //     title: "test expire",
    //     description: "test expire",
    //     points: 9,
    //     cost: "9.00",
    //     image:
    //       "https://roadcube-stage-files.s3.eu-central-1.amazonaws.com/images/info/rc/no-image.png",
    //   },
    //   {
    //     coupon_id: 5,
    //     title: "test expire",
    //     description: "test expire",
    //     points: 9,
    //     cost: "9.00",
    //     image:
    //       "https://roadcube-stage-files.s3.eu-central-1.amazonaws.com/images/info/rc/no-image.png",
    //   },
    //   {
    //     coupon_id: 6,
    //     title: "test expire",
    //     description: "test expire",
    //     points: 9,
    //     cost: "9.00",
    //     image:
    //       "https://roadcube-stage-files.s3.eu-central-1.amazonaws.com/images/info/rc/no-image.png",
    //   },
    //   {
    //     coupon_id: 7,
    //     title: "test expire",
    //     description: "test expire",
    //     points: 9,
    //     cost: "9.00",
    //     image:
    //       "https://roadcube-stage-files.s3.eu-central-1.amazonaws.com/images/info/rc/no-image.png",
    //   },
    //   {
    //     coupon_id: 8,
    //     title: "test expire",
    //     description: "test expire",
    //     points: 9,
    //     cost: "9.00",
    //     image:
    //       "https://roadcube-stage-files.s3.eu-central-1.amazonaws.com/images/info/rc/no-image.png",
    //   },
    //   {
    //     coupon_id: 9,
    //     title: "test expire",
    //     description: "test expire",
    //     points: 9,
    //     cost: "9.00",
    //     image:
    //       "https://roadcube-stage-files.s3.eu-central-1.amazonaws.com/images/info/rc/no-image.png",
    //   },
    //   {
    //     coupon_id: 10,
    //     title: "test expire",
    //     description: "test expire",
    //     points: 9,
    //     cost: "9.00",
    //     image:
    //       "https://roadcube-stage-files.s3.eu-central-1.amazonaws.com/images/info/rc/no-image.png",
    //   },
    // ];

    let coupons = [];

    // let coupons = [];
    let page = 1;

    if (req.body.token && _db_customer_) {
      do {
        const { data, error } = await Helper_getCouponsRoadcube({
          customer_email: _db_customer_.email,
          page: 1,
          token: req.body.token,
        });

        let _tempCoupons = data.coupons || [];
        for (var i = 0; i < _tempCoupons.length; i++) {
          coupons.push(_tempCoupons[i]);
        }

        if (error || !data || !data.pagination.next_page) {
          page = null;
        }
      } while (page);
    }

    res.status(200).json({
      coupons,
    });
  } catch (error) {
    res.status(200).json({ error: error.message || "Coupons not found " });
  }
};

export default __getAvailableCoupons;
