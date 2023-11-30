import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useQuery } from 'react-query';
import api from '../../utils/api.utils';
import TransactionList from '../../components/TransactionList';
import CreateTransactionButton from '../../components/CreateTransactionButton';
import './style.scss';

function BudgetPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [budgetAmount, setBudgetAmount] = useState(null);

  const {
    isLoading,
    isError,
    error,
    data: budget,
  } = useQuery('budget', {
    queryFn: async () => {
      const { data } = await api.get(`/budgets/${id}`);
      return data;
    },
    onSuccess: (data) => {
      setBudgetAmount(data.amount);
    },
  });

  if (isLoading) {
    return 'Loading...';
  }
  if (isError) {
    if (error.response.status === 404) {
      navigate('/');
    } else {
      return 'Une erreur est survenue';
    }
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>YABA - {budget.name}</title>
      </Helmet>
      <div className="budget-page">
        <header>
          <div>
            <h1>{budget.name}</h1>
            <span className={budget.amount > 0 ? 'positive' : 'negative'}>
              {budgetAmount}€
            </span>
          </div>
          <div>
            <CreateTransactionButton budgetId={budget.id} />
          </div>
        </header>

        <TransactionList budgetId={budget.id} />
      </div>
    </>
  );
}

export default BudgetPage;
