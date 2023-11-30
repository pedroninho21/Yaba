import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { Alert, AlertTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Category from '../Category';
import api from '../../utils/api.utils';
import './style.scss';

function CategoryList() {
  const { id } = useSelector((state) => state.auth.userData);
  const { t } = useTranslation();
  const {
    isLoading,
    isError,
    data: categories,
  } = useQuery('categories', {
    queryFn: async () => {
      const { data } = await api.get('/categories', {
        params: { sort: '-created_at,id', user_id: id },
      });
      return data;
    },
  });

  if (isLoading) {
    return <div>{t('category.loading.loading')}</div>;
  }
  if (isError) {
    return <div>{t('errors.unknown')}</div>;
  }

  return (
    <div className="category-list">
      {!categories || categories.length === 0 ? (
        <Alert className="alert" severity="warning" variant="standard">
          <AlertTitle>{t('category.loading.errorTitle')}</AlertTitle>
          {t('category.loading.noCategory')}
        </Alert>
      ) : (
        categories.map((category) => (
          <Category key={category.id} category={category} enableControls />
        ))
      )}
    </div>
  );
}

export default CategoryList;
