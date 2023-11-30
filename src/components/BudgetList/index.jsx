import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { Alert, AlertTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Budget from '../Budget';
import api from '../../utils/api.utils';
import './style.scss';

function BudgetList() {
  const { id } = useSelector((state) => state.auth.userData);
  const { t } = useTranslation();

  // Ici on utilise une requête nommée 'budgets
  const { isLoading, isError, data } = useQuery('budgets', {
    queryFn: () =>
      api.get('/budgets', { params: { sort: '-created_at,id', user_id: id } }),
  });

  if (!isLoading) {
    if (isError) {
      return <div>{t('errors.unknown')}</div>;
    }

    return (
      <div className="budget-list">
        {data.data.length === 0 ? (
          <Alert className="alert" severity="warning" variant="standard">
            <AlertTitle>{t('budget.loading.errorTitle')}</AlertTitle>
            {t('budget.loading.noBudget')}
          </Alert>
        ) : (
          data.data.map((budget) => (
            <Budget key={budget.id} budget={budget} enableControls />
          ))
        )}
      </div>
    );
  }
  return <div>{t('budget.loading.loading')}</div>;
}

export default BudgetList;
