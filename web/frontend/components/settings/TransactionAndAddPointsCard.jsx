import { LegacyCard, LegacyStack, Select } from "@shopify/polaris";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { _dispatch_UPDATE_SETTINGS_DETAILS } from "../../redux/actions/roadcubeActions";

const TransactionAndAddPointsCard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const fetch = useAuthenticatedFetch();

  const { settingsData, settingsDataLoading, updateSettingsDataLoading } =
    useSelector((states) => states.roadcube);

  return (
    <LegacyCard title={t("settings.transactionAndPointsCard.title")} sectioned>
      <LegacyStack vertical>
        <Select
          label={t("settings.transactionAndPointsCard.onTransactionType.title")}
          disabled={
            settingsDataLoading ||
            updateSettingsDataLoading?.update_transaction_type_loading
          }
          options={[
            {
              label: t(
                "settings.transactionAndPointsCard.onTransactionType.none"
              ),
              value: "none",
            },
            {
              label: t(
                "settings.transactionAndPointsCard.onTransactionType.amount_title"
              ),
              value: "amount",
            },
            {
              label: t(
                "settings.transactionAndPointsCard.onTransactionType.products_title"
              ),
              value: "products",
            },
          ]}
          onChange={(value) => {
            dispatch(
              _dispatch_UPDATE_SETTINGS_DETAILS({
                fetchFn: fetch,
                inputs: {
                  loadingKey: "update_transaction_type_loading",
                  transaction_amount: value === "amount" ? true : false,
                  transaction_products: value === "products" ? true : false,
                },
              })
            );
          }}
          value={
            (settingsData?.transaction_amount && "amount") ||
            (settingsData?.transaction_products && "products") ||
            "none"
          }
        />
        <Select
          label={t(
            "settings.transactionAndPointsCard.onTransactionFeature.title"
          )}
          disabled={
            settingsDataLoading ||
            updateSettingsDataLoading?.update_transaction_feature_loading
          }
          options={[
            {
              label: t(
                "settings.transactionAndPointsCard.onTransactionFeature.none"
              ),
              value: "none",
            },
            {
              label: t(
                "settings.transactionAndPointsCard.onTransactionFeature.create_title"
              ),
              value: "create",
            },
            {
              label: t(
                "settings.transactionAndPointsCard.onTransactionFeature.paid_title"
              ),
              value: "paid",
            },
            {
              label: t(
                "settings.transactionAndPointsCard.onTransactionFeature.fulfilled_title"
              ),
              value: "fulfilled",
            },
          ]}
          onChange={(value) => {
            dispatch(
              _dispatch_UPDATE_SETTINGS_DETAILS({
                fetchFn: fetch,
                inputs: {
                  loadingKey: "update_transaction_feature_loading",
                  order_create_points: value === "create" ? true : false,
                  order_paid_points: value === "paid" ? true : false,
                  order_fulfilled_points: value === "fulfilled" ? true : false,
                },
              })
            );
          }}
          value={
            (settingsData?.order_create_points && "create") ||
            (settingsData?.order_paid_points && "paid") ||
            (settingsData?.order_fulfilled_points && "fulfilled") ||
            "none"
          }
        />
      </LegacyStack>
    </LegacyCard>
  );
};

export default TransactionAndAddPointsCard;
