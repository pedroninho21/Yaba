import { useQuery } from 'react-query';
import PropTypes from 'prop-types';
import { Alert, AlertTitle } from '@mui/material';
import './style.scss';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api.utils';
import Transaction from '../Transaction';

function TransactionList({ budgetId }) {
  const { t } = useTranslation();
  const { isLoading, isError, data } = useQuery('transactions', {
    queryFn: async () => {
      const { data: transactions } = await api.get('/transactions', {
        params: { budget_id: budgetId, sort: '-created_at,id' },
      });
      return transactions;
    },
  });

  if (isLoading) {
    return <div>{t('transaction.loading.loading')}</div>;
  }
  if (isError) {
    return <div>{t('errors.unknown')}</div>;
  }

  return (
    <div className="transaction-list">
      {data.length === 0 ? (
        <Alert className="alert" severity="warning" variant="standard">
          <AlertTitle>{t('transaction.loading.errorTitle')}</AlertTitle>
          {t('transaction.loading.noTransaction')}
        </Alert>
      ) : (
        data.map((category) => (
          <Transaction
            key={category.id}
            transaction={category}
            enableControls
          />
        ))
      )}
    </div>
  );
}

TransactionList.propTypes = {
  budgetId: PropTypes.number.isRequired,
};

export default TransactionList;
