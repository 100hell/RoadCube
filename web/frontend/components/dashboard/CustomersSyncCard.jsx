import { Button, Icon, LegacyCard, LegacyStack } from "@shopify/polaris";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { RefreshMajor } from "@shopify/polaris-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  _dispatch_GET_SYNC_CUSTOMERS_COUNT,
  _dispatch_SYNC_CUSTOMERS,
} from "../../redux/actions/roadcubeActions";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";

const CustomersSyncCard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const fetch = useAuthenticatedFetch();

  const {
    syncCustomersLoading,
    getCustomersSyncCount,
    getCustomersSyncCountLoading,
  } = useSelector((states) => states.roadcube);

  useEffect(() => {
    if (getCustomersSyncCountLoading === undefined) {
      dispatch(
        _dispatch_GET_SYNC_CUSTOMERS_COUNT({
          fetchFn: fetch,
        })
      );
    }
  }, []);

  return (
    <LegacyCard title={t("dashboard.customersSyncCard.title")} sectioned>
      <LegacyStack vertical>
        <LegacyStack distribution="trailing" alignment="center">
          <Button
            primary
            loading={syncCustomersLoading}
            disabled={getCustomersSyncCountLoading}
            onClick={() => {
              dispatch(
                _dispatch_SYNC_CUSTOMERS({
                  fetchFn: fetch,
                  inputs: {
                    customerIDs: getCustomersSyncCount?.unsyncCustomers || [],
                  },
                })
              );
            }}
          >
            {t("dashboard.customersSyncCard.primaryBtnLabel")}
          </Button>
          <span
            className={`sync-icon ${
              !syncCustomersLoading && !getCustomersSyncCountLoading
                ? "sync-icon-enable"
                : ""
            } ${getCustomersSyncCountLoading ? "sync-icon-disabled" : ""}`}
            onClick={
              !syncCustomersLoading && !getCustomersSyncCountLoading
                ? () => {
                    dispatch(
                      _dispatch_GET_SYNC_CUSTOMERS_COUNT({
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
        {getCustomersSyncCountLoading !== undefined && (
          <LegacyStack distribution="trailing">
            <p
              dangerouslySetInnerHTML={{
                __html:
                  (getCustomersSyncCount?.remaining === 0 &&
                    `${t("dashboard.customersSyncCard.synedText")
                      .replace(
                        "<remaining>",
                        `<span style="font-weight:bold">${
                          getCustomersSyncCount?.total || 0
                        }</span>`
                      )
                      .replace(
                        "<total>",
                        `<span style="font-weight:bold">${
                          getCustomersSyncCount?.total || 0
                        }</span>`
                      )}`) ||
                  `${t("dashboard.customersSyncCard.synText")
                    .replace(
                      "<remaining>",
                      `<span style="font-weight:bold">${
                        getCustomersSyncCount?.remaining || 0
                      }</span>`
                    )
                    .replace(
                      "<total>",
                      `<span style="font-weight:bold">${
                        getCustomersSyncCount?.total || 0
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

export default CustomersSyncCard;
