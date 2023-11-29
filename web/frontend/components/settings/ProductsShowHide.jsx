import { Button, LegacyCard, LegacyStack } from "@shopify/polaris";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { _dispatch_UPDATE_SETTINGS_DETAILS } from "../../redux/actions/roadcubeActions";

const ProductsShowHide = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const fetch = useAuthenticatedFetch();

  const { settingsData, settingsDataLoading, updateSettingsDataLoading } =
    useSelector((states) => states.roadcube);

  return (
    <LegacyCard title={t("settings.productsFlagCard.title")} sectioned>
      <LegacyStack vertical>
        <p>{t("settings.productsFlagCard.subheading")}</p>
        <LegacyStack distribution="trailing">
          <Button
            primary={settingsData?.products_flag ? false : true}
            destructive={settingsData?.products_flag ? true : false}
            loading={updateSettingsDataLoading?.update_products_flag_loading}
            disabled={settingsDataLoading}
            onClick={() => {
              dispatch(
                _dispatch_UPDATE_SETTINGS_DETAILS({
                  fetchFn: fetch,
                  inputs: {
                    loadingKey: "update_products_flag_loading",
                    products_flag: settingsData?.products_flag ? false : true,
                  },
                })
              );
            }}
          >
            {settingsData?.products_flag
              ? t("settings.productsFlagCard.hideBtnTitle")
              : t("settings.productsFlagCard.showBtnTitle")}
          </Button>
        </LegacyStack>
      </LegacyStack>
    </LegacyCard>
  );
};

export default ProductsShowHide;
