import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import {
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import './style.scss';

import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { useTranslation } from 'react-i18next';
import api from '../../utils/api.utils';

function Transaction({ transaction, enableControls }) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const updateNameInput = useRef(null);
  const updateAmountInput = useRef(null);

  const updateTransaction = useMutation({
    mutationFn: async (data) => {
      await api.patch(`/transactions/${transaction.id}`, {
        name: data.name,
        amount: data.amount,
      });
    },
    onSuccess: () => {
      setIsEditing(false);
      queryClient.invalidateQueries('transactions');
      queryClient.invalidateQueries('budget');
    },
  });

  const deleteTransaction = useMutation({
    mutationFn: () => api.delete(`/transactions/${transaction.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries('transactions');
      queryClient.invalidateQueries('budget');
    },
  });

  return (
    <>
      <Dialog
        open={isEditing}
        fullWidth
        maxWidth="sm"
        onClose={() => setIsEditing(false)}>
        <DialogTitle>{t('transaction.updateForm.title')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="normal"
            id="name"
            label={t('transaction.updateForm.fields.name.title')}
            type="text"
            fullWidth
            variant="standard"
            autoComplete="off"
            defaultValue={transaction.name}
            inputRef={updateNameInput}
          />
          <TextField
            autoFocus
            margin="normal"
            id="name"
            label={t('transaction.updateForm.fields.amount.title')}
            type="number"
            inputMode="numeric"
            fullWidth
            variant="standard"
            autoComplete="off"
            defaultValue={transaction.amount}
            inputRef={updateAmountInput}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditing(false)}>
            {t('transaction.updateForm.buttons.cancel')}
          </Button>
          <LoadingButton
            variant="contained"
            loading={updateTransaction.isLoading}
            onClick={() =>
              updateTransaction.mutate({
                name: updateNameInput.current.value,
                amount: updateAmountInput.current.value,
              })
            }>
            {t('transaction.updateForm.buttons.update')}
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <div className="transaction">
        <div className="informations">
          <div className="header">
            <h2>{transaction.name || t('transaction.defaultName')}</h2>
          </div>
          <p className={transaction.amount > 0 ? 'positive' : 'negative'}>
            {transaction.amount} €
          </p>
        </div>

        {enableControls && (
          <div className="controls">
            <EditIcon className="icon" onClick={() => setIsEditing(true)} />
            <DeleteForeverIcon
              className="icon"
              onClick={() => deleteTransaction.mutate()}
            />
          </div>
        )}
      </div>
    </>
  );
}

Transaction.propTypes = {
  transaction: PropTypes.shape({
    id: PropTypes.number.isRequired,
    budget_id: PropTypes.number.isRequired,
    category_id: PropTypes.number.isRequired,
    name: PropTypes.string,
    amount: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    updated_at: PropTypes.string,
  }).isRequired,
  enableControls: PropTypes.bool,
};

Transaction.defaultProps = {
  enableControls: false,
};

export default Transaction;
