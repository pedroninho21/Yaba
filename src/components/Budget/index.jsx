import { useState } from 'react';
import './style.scss';

import PropTypes from 'prop-types';
import { useMutation, useQueryClient } from 'react-query';
import { Input, CircularProgress, Link } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SaveIcon from '@mui/icons-material/Save';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api.utils';

function BudgetTitleEditor({ name, isSaving, onSave }) {
  const [newBudgetName, setNewBudgetName] = useState(name);
  return (
    <>
      <Input
        type="text"
        className="name-editor"
        defaultValue={name}
        onChange={(e) => setNewBudgetName(e.target.value)}
      />
      {isSaving ? (
        <CircularProgress />
      ) : (
        <SaveIcon onClick={() => onSave(newBudgetName)} />
      )}
      {}
    </>
  );
}

BudgetTitleEditor.propTypes = {
  name: PropTypes.string.isRequired,
  isSaving: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
};

function Budget(props) {
  const { budget, enableControls } = props;
  const { t } = useTranslation();
  const [budgetName, setBudgetName] = useState(
    budget.name || t('budget.defaultName')
  );
  const [isEditing, setIsEditing] = useState(false);

  const queryClient = useQueryClient();
  const updateBudget = useMutation({
    mutationFn: (data) =>
      api.patch(`/budgets/${budget.id}`, { name: data.name }),
    onSuccess: (data) => {
      setBudgetName(data.data.name);
      setIsEditing(false);
    },
  });

  const deleteBudget = useMutation({
    mutationFn: () => api.delete(`/budgets/${budget.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries('budgets');
    },
  });

  return (
    <div className="budget">
      <div className="informations">
        <div className="header">
          {isEditing ? (
            <BudgetTitleEditor
              name={budgetName}
              isSaving={updateBudget.isLoading}
              onSave={(newBudgetName) => {
                updateBudget.mutate({ name: newBudgetName });
              }}
            />
          ) : (
            <>
              <Link
                component={RouterLink}
                color="inherit"
                underline="none"
                to={`/budget/${budget.id}`}>
                <h2
                  onDoubleClick={() =>
                    enableControls ? setIsEditing(true) : null
                  }>
                  {budgetName}
                </h2>
              </Link>
              {enableControls && (
                <EditIcon className="icon" onClick={() => setIsEditing(true)} />
              )}
            </>
          )}
        </div>
        <p className={budget.amount > 0 ? 'positive' : 'negative'}>
          {budget.amount || 0.0} €
        </p>
      </div>

      {enableControls && (
        <div className="controls">
          <DeleteForeverIcon
            className="icon"
            onClick={() => deleteBudget.mutate()}
          />
        </div>
      )}
    </div>
  );
}

Budget.propTypes = {
  budget: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
    amount: PropTypes.string,
  }).isRequired,

  enableControls: PropTypes.bool,
};

Budget.defaultProps = {
  enableControls: false,
};

export default Budget;
