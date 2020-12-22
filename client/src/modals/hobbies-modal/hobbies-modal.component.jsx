import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Fab
} from '@material-ui/core';
import { Favorite, FavoriteBorder } from '@material-ui/icons';

import { toggleHobbiesModalOpened } from '../../redux/modal/modal.actions';

const HobbiesModal = () => {
  const { isHobbiesModalOpened } = useSelector(state => state.modal);

  const dispatch = useDispatch();

  const handleClose = () => dispatch(toggleHobbiesModalOpened());

  const handleSubmit = () => {
    console.log('submit');
    dispatch(toggleHobbiesModalOpened());
  };
  const hobbiesList = [
    'gaming',
    'liturature',
    'puzzle',
    'movie',
    'art',
    'photograph'
  ];

  return (
    <Dialog open={isHobbiesModalOpened} onClose={handleClose}>
      <DialogTitle>Choose your hobbies</DialogTitle>
      <DialogContent>
        {hobbiesList.map(hobby => (
          <FormControlLabel
            control={
              <Checkbox
                icon={<FavoriteBorder />}
                checkedIcon={<Favorite />}
                name={hobby}
              />
            }
            label={hobby
              .toLowerCase()
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.substring(1))
              .join(' ')}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Fab onClick={handleSubmit} color='primary' variant='extended'>
          Save
        </Fab>
        <Fab onClick={handleClose} variant='extended'>
          Cancel
        </Fab>
      </DialogActions>
    </Dialog>
  );
};

export default HobbiesModal;
