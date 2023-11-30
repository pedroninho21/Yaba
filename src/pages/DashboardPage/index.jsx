import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import BudgetList from '../../components/BudgetList';
import CreateBudgetButton from '../../components/CreateBudgetButton';
import './style.scss';

function DashboardPage() {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>YABA - {t('dashboardPage.title')}</title>
      </Helmet>
      <div className="dashboard-page">
        <header>
          <h1>{t('dashboardPage.title')}</h1>
          <CreateBudgetButton />
        </header>

        <BudgetList />
      </div>
    </>
  );
}
export default DashboardPage;
