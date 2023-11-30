import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Alert,
  Link,
  FormControl,
  InputLabel,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api.utils';

function CreateTransactionButton({ budgetId }) {
  const { t } = useTranslation();
  const transactionNameInput = useRef(null);
  const transactionAmountInput = useRef(null);
  const [categoryId, setCategoryId] = useState(null);

  const { id: userId } = useSelector((state) => state.auth.userData);

  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();
  const { isLoading: isLoadingCategories, data: categoriesList } = useQuery(
    'categories',
    {
      queryFn: async () => {
        const { data } = await api.get('/categories', {
          params: { user_id: userId },
        });
        return data;
      },
    }
  );
  const { isLoading, mutate } = useMutation({
    mutationFn: (data) => api.post('/transactions', data),
    onSuccess: () => {
      queryClient.invalidateQueries('transactions');
      queryClient.invalidateQueries('budget');
      setShowModal(false);
    },
  });

  return (
    <>
      <Dialog
        open={showModal}
        fullWidth
        maxWidth="sm"
        onClose={() => setShowModal(false)}>
        <DialogTitle />
        <DialogContent>
          {isLoadingCategories && (
            <Alert severity="info">Loading categories...</Alert>
          )}
          {!(categoriesList && categoriesList.length > 0) && (
            <Alert severity="error">
              {t('transaction.createForm.loading.noCategories')}{' '}
              <Link component={RouterLink} to="/categories">
                {t('transaction.createForm.loading.noCategoriesButton')}
              </Link>{' '}
              {t('transaction.createForm.loading.noCategoriesEnd')}
            </Alert>
          )}

          <TextField
            autoFocus
            margin="none"
            id="name"
            label={t('transaction.createForm.fields.name.title')}
            type="text"
            fullWidth
            disabled={!(categoriesList && categoriesList.length > 0)}
            autoComplete="off"
            variant="standard"
            inputRef={transactionNameInput}
          />

          <TextField
            autoFocus
            margin="none"
            id="name"
            label={t('transaction.createForm.fields.amount.title')}
            type="number"
            inputMode="numeric"
            autoComplete="off"
            fullWidth
            variant="standard"
            disabled={!(categoriesList && categoriesList.length > 0)}
            inputRef={transactionAmountInput}
          />

          <FormControl
            fullWidth
            margin="none"
            variant="standard"
            disabled={!(categoriesList && categoriesList.length > 0)}>
            <InputLabel id="demo-simple-select-label">
              {t('transaction.createForm.titleCategory')}
            </InputLabel>
            <Select
              value={categoryId || ''}
              onChange={(e) => {
                setCategoryId(e.target.value);
              }}>
              {categoriesList &&
                categoriesList.length > 0 &&
                categoriesList.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)}>
            {t('transaction.createForm.buttons.cancel')}
          </Button>
          <LoadingButton
            variant="contained"
            loading={isLoading}
            disabled={!(categoriesList && categoriesList.length > 0)}
            onClick={() => {
              mutate({
                name: transactionNameInput.current.value,
                amount: transactionAmountInput.current.value,
                categoryId,
                budgetId,
              });
            }}>
            {t('transaction.createForm.buttons.create')}
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <Button variant="contained" onClick={() => setShowModal(true)}>
        {t('transaction.createForm.title')}
      </Button>
    </>
  );
}

CreateTransactionButton.propTypes = {
  budgetId: PropTypes.number.isRequired,
};

export default CreateTransactionButton;
