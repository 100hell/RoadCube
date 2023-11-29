import React, { useEffect } from "react";
import { Button, Icon, LegacyCard, LegacyStack } from "@shopify/polaris";
import { useTranslation } from "react-i18next";
import { RefreshMajor } from "@shopify/polaris-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  _dispatch_GET_SYNC_PRODUCTS_COUNT,
  _dispatch_SYNC_PRODUCTS,
} from "../../redux/actions/roadcubeActions";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";

const ProductsSyncCard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const fetch = useAuthenticatedFetch();

  const {
    syncProductsLoading,
    getProductsSyncCount,
    getProductsSyncCountLoading,
  } = useSelector((states) => states.roadcube);

  useEffect(() => {
    if (getProductsSyncCountLoading === undefined) {
      dispatch(
        _dispatch_GET_SYNC_PRODUCTS_COUNT({
          fetchFn: fetch,
        })
      );
    }
  }, []);

  return (
    <LegacyCard title={t("dashboard.productsSyncCard.title")} sectioned>
      <LegacyStack vertical>
        <LegacyStack distribution="trailing" alignment="center">
          <Button
            primary
            loading={syncProductsLoading}
            disabled={getProductsSyncCountLoading}
            onClick={() => {
              dispatch(
                _dispatch_SYNC_PRODUCTS({
                  fetchFn: fetch,
                  inputs: {
                    productsIDs: getProductsSyncCount?.unsyncProducts || [],
                  },
                })
              );
            }}
          >
            {t("dashboard.productsSyncCard.primaryBtnLabel")}
          </Button>
          <span
            className={`sync-icon ${
              !syncProductsLoading && !getProductsSyncCountLoading
                ? "sync-icon-enable"
                : ""
            } ${getProductsSyncCountLoading ? "sync-icon-disabled" : ""}`}
            onClick={
              !syncProductsLoading && !getProductsSyncCountLoading
                ? () => {
                    dispatch(
                      _dispatch_GET_SYNC_PRODUCTS_COUNT({
                        fetchFn: fetch,
                      })
                    );
                  }
                : () => {}
            }
          >
            <Icon source={RefreshMajor} />
          </span>
        </LegacyStack>
        {getProductsSyncCountLoading !== undefined && (
          <LegacyStack distribution="trailing">
            <p
              dangerouslySetInnerHTML={{
                __html:
                  (getProductsSyncCount?.remaining === 0 &&
                    `${t("dashboard.productsSyncCard.synedText")
                      .replace(
                        "<remaining>",
                        `<span style="font-weight:bold">${
                          getProductsSyncCount?.total || 0
                        }</span>`
                      )
                      .replace(
                        "<total>",
                        `<span style="font-weight:bold">${
                          getProductsSyncCount?.total || 0
                        }</span>`
                      )}`) ||
                  `${t("dashboard.productsSyncCard.synText")
                    .replace(
                      "<remaining>",
                      `<span style="font-weight:bold">${
                        getProductsSyncCount?.remaining || 0
                      }</span>`
                    )
                    .replace(
                      "<total>",
                      `<span style="font-weight:bold">${
                        getProductsSyncCount?.total || 0
                      }</span>`
                    )}`,
              }}
            ></p>
          </LegacyStack>
        )}
      </LegacyStack>
    </LegacyCard>
  );
};

export default ProductsSyncCard;
