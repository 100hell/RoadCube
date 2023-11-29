import React, { useEffect } from "react";
import { Frame, Layout, Loading, Page } from "@shopify/polaris";
import { useTranslation } from "react-i18next";
import TokenAndStoreID from "../../components/settings/TokenAndStoreID";
import { useSelector } from "react-redux";
import SettingsErrorSuccessBanner from "../../components/settings/SettingsErrorSuccessBanner";
import useNavigateToHome from "../../hooks/useNavigateToHome";
import ProductsShowHide from "../../components/settings/ProductsShowHide";
import TransactionAndAddPointsCard from "../../components/settings/TransactionAndAddPointsCard";
import CustomersShowHide from "../../components/settings/CustomersShowHide";

const Settings = () => {
  const { t } = useTranslation();

  useNavigateToHome(); // Navigate To Home Page

  const { settingPageBannerSuccessErrorMessage, settingsDataLoading } =
    useSelector((states) => states.roadcube);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Frame>
      {settingsDataLoading && <Loading />}
      <Page fullWidth title={t("settings.title")}>
        <Layout>
          {settingPageBannerSuccessErrorMessage && (
            <Layout.Section>
              <SettingsErrorSuccessBanner />
            </Layout.Section>
          )}
          <Layout.Section>
            <TokenAndStoreID />
          </Layout.Section>
          <Layout.Section>
            <ProductsShowHide />
          </Layout.Section>
          <Layout.Section>
            <CustomersShowHide />
          </Layout.Section>
          <Layout.Section>
            <TransactionAndAddPointsCard />
          </Layout.Section>
        </Layout>
        <br />
      </Page>
    </Frame>
  );
};

export default Settings;
