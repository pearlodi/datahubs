import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const CssBaseline: Components<Omit<Theme, 'components'>>['MuiCssBaseline'] = {
  defaultProps: {},
  styleOverrides: () => ({
    '*, *::before, *::after': {
      margin: 0,
      padding: 0,
    },
    html: {
      scrollBehavior: 'smooth',
    },
    body: {
      fontVariantLigatures: 'none',
      // backgroundColor: theme.palette.info.darker,
    },
  }),
};

export default CssBaseline;
