import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';


const Checkbox: Components<Omit<Theme, 'components'>>['MuiCheckbox'] = {
  
  styleOverrides: {
    root: ({ theme }) => ({
      color: theme.palette.text.secondary,
    }),
    sizeMedium: ({ theme }) => ({
      '& .MuiSvgIcon-root': {
        fontSize: theme.typography.button.fontSize,
      },
    }),
    sizeSmall: ({ theme }) => ({
      '& .MuiSvgIcon-root': {
        fontSize: theme.typography.caption.fontSize,
      },
    }),
  },
};

export default Checkbox;
