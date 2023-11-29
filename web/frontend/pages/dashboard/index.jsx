import { Layout, Page } from "@shopify/polaris";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import CustomersSyncCard from "../../components/dashboard/CustomersSyncCard";
import DashboardErrorSuccessBanner from "../../components/dashboard/DashboardErrorSuccessBanner";
import ProductsSyncCard from "../../components/dashboard/ProductsSyncCard";
import useNavigateToHome from "../../hooks/useNavigateToHome";
import { _DASHBOARD_PAGE_BANNER } from "../../redux/reducers/roadcubeSlice";

const Dashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useNavigateToHome(); // Navigate To Home Page

  const { dashboardPageBannerSuccessErrorMessage } = useSelector(
    (states) => states.roadcube
  );

  useEffect(() => {
    window.scrollTo(0, 0);

    return () => {
      dispatch(_DASHBOARD_PAGE_BANNER(null));
    };
  }, []);

  return (
    <Page fullWidth title={t("dashboard.title")}>
      {dashboardPageBannerSuccessErrorMessage && (
        <Layout.Section>
          <DashboardErrorSuccessBanner />
        </Layout.Section>
      )}
      <Layout.Section>
        <ProductsSyncCard />
      </Layout.Section>
      <Layout.Section>
        <CustomersSyncCard />
      </Layout.Section>
    </Page>
  );
};

export default Dashboard;
