import { useState } from 'react';

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useQueryClient, useMutation } from 'react-query';
import { TwitterPicker as ColorPicker } from 'react-color';
import { useTranslation } from 'react-i18next';
import ColorBadge from '../ColorBadge';
import api from '../../utils/api.utils';
import './style.scss';

function CreateCategoryButton() {
  const { t } = useTranslation();
  const [newCategoryName, setNewCategoryName] = useState(null);
  const [newCategoryColor, setNewCategoryColor] = useState('#000');
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();
  const { isLoading, mutate } = useMutation({
    mutationFn: (data) => api.post('/categories', data),
    onSuccess: () => {
      setShowModal(false);
      queryClient.invalidateQueries('categories');
    },
  });

  return (
    <>
      <Dialog
        open={showModal}
        fullWidth
        maxWidth="sm"
        onClose={() => setShowModal(false)}>
        <DialogTitle>{t('category.create.title')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="normal"
            id="name"
            label={t('category.create.name.field')}
            type="text"
            fullWidth
            variant="standard"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ColorBadge color={newCategoryColor} />
                </InputAdornment>
              ),
            }}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <div className="color-picker">
            <ColorPicker
              triangle="hide"
              onChange={(color) => setNewCategoryColor(color.hex)}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)}>
            {t('category.create.cancelButton')}
          </Button>
          <LoadingButton
            variant="contained"
            loading={isLoading}
            disabled={!(newCategoryName && newCategoryName.length > 0)}
            onClick={() =>
              mutate({
                name: newCategoryName,
                color: newCategoryColor,
              })
            }>
            {t('category.create.button')}
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <Button variant="contained" onClick={() => setShowModal(true)}>
        {t('category.create.title')}
      </Button>
    </>
  );
}

export default CreateCategoryButton;
