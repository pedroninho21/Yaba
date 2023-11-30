import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useQueryClient, useMutation } from 'react-query';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api.utils';

function CreateBudgetButton() {
  const { t } = useTranslation();
  const [newBudgetName, setNewBudgetName] = useState(null);
  const [showModal, setShowModal] = useState(false);

  /**
   * Gestion de requêtes de création d'un budget
   */

  // on récupère le queryClient avec le hook useQueryClient (react-query)
  const queryClient = useQueryClient();

  /**
   * Utilisation du hook useMutation de react-query
   * Ici on destructure isLoading et mutate
   * isLoading est un booléen qui nous permet de savoir si la requête est en cours ou non
   * mutate est une fonction qui permet d'exécuter la requête de création d'un budget
   */
  const { isLoading, mutate } = useMutation({
    // on définit la fonction de mutation, qui sera appelée avec mutate()
    // On utilise notre instance axios définie précédemment pour effectuer une requête POST sur l'endpoint /budgets
    mutationFn: (data) => api.post('/budgets', data),

    // on définit ici ce qu'il se passe en cas de succès de la requête
    onSuccess: () => {
      setShowModal(false);

      // on invalide la query 'budgets', gérée par react-query
      // React-query va refaire la requête nommée 'budgets' et mettre à jour le cache
      queryClient.invalidateQueries('budgets');
    },
  });

  return (
    <>
      <Dialog
        open={showModal}
        fullWidth
        maxWidth="sm"
        onClose={() => setShowModal(false)}>
        <DialogTitle>{t('budget.create.title')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="normal"
            id="name"
            label={t('budget.create.name.field')}
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setNewBudgetName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)}>
            {t('budget.create.cancelButton')}
          </Button>
          <LoadingButton
            variant="contained"
            loading={isLoading} // on utilise isLoading pour afficher le loader
            onClick={() =>
              // on déclenche la requête de création de budget
              // en passant les données à envoyer, à savoir le nom du nouveau budget
              mutate({
                name: newBudgetName,
              })
            }>
            {t('budget.create.button')}
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <Button variant="contained" onClick={() => setShowModal(true)}>
        {t('budget.create.title')}
      </Button>
    </>
  );
}

export default CreateBudgetButton;
