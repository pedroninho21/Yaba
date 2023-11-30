import { useState, useRef } from 'react';
import './style.scss';

import PropTypes from 'prop-types';
import { useMutation, useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import { Input, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SaveIcon from '@mui/icons-material/Save';

import api from '../../utils/api.utils';
import ColorBadge from '../ColorBadge';

function CategoryTitleEditor({ name, isSaving, onSave }) {
  const nameInput = useRef(null);
  return (
    <>
      <Input
        type="text"
        className="name-editor"
        defaultValue={name}
        inputRef={nameInput}
      />
      {isSaving ? (
        <CircularProgress />
      ) : (
        <SaveIcon onClick={() => onSave(nameInput.current.value)} />
      )}
      {}
    </>
  );
}

CategoryTitleEditor.propTypes = {
  name: PropTypes.string.isRequired,
  isSaving: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
};

function Category({ category, enableControls }) {
  const { t } = useTranslation();
  const [categoryName, setCategoryName] = useState(
    category.name || t('category.defaultName')
  );
  const [isEditing, setIsEditing] = useState(false);

  const queryClient = useQueryClient();
  const updateCategory = useMutation({
    mutationFn: (data) =>
      api.patch(`/categories/${category.id}`, { name: data.name }),
    onSuccess: (response) => {
      queryClient.invalidateQueries('categories');
      setCategoryName(response.data.name);
      setIsEditing(false);
    },
  });

  const deleteCategory = useMutation({
    mutationFn: () => api.delete(`/categories/${category.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries('categories');
    },
  });

  return (
    <div className="category">
      <div className="informations">
        <div className="header">
          <div className="color-badge">
            <ColorBadge color={category.color} />
          </div>

          {isEditing ? (
            <CategoryTitleEditor
              name={categoryName}
              isSaving={updateCategory.isLoading}
              onSave={(newCategoryName) => {
                updateCategory.mutate({ name: newCategoryName });
              }}
            />
          ) : (
            <>
              <div>
                <h2
                  onDoubleClick={() =>
                    enableControls ? setIsEditing(true) : null
                  }>
                  {categoryName}
                </h2>
                <p className={category.amount > 0 ? 'positive' : 'negative'}>
                  {category.amount}€
                </p>
              </div>
              {enableControls && (
                <EditIcon className="icon" onClick={() => setIsEditing(true)} />
              )}
            </>
          )}
        </div>
      </div>

      {enableControls && (
        <div className="controls">
          <DeleteForeverIcon
            className="icon"
            onClick={() => deleteCategory.mutate()}
          />
        </div>
      )}
    </div>
  );
}

Category.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
    color: PropTypes.string,
    amount: PropTypes.string,
  }).isRequired,

  enableControls: PropTypes.bool,
};

Category.defaultProps = {
  enableControls: false,
};

export default Category;
