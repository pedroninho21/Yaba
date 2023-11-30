import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import CategoryList from '../../components/CategoryList';
import CreateCategoryButton from '../../components/CreateCategoryButton';
import './style.scss';

function CategoriesPage() {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>YABA - {t('categoriesPage.title')}</title>
      </Helmet>
      <div className="categories-page">
        <header>
          <h1>{t('categoriesPage.title')}</h1>
          <CreateCategoryButton />
        </header>

        <CategoryList />
      </div>
    </>
  );
}
export default CategoriesPage;
