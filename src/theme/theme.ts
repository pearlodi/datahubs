import { createTheme } from '@mui/material/styles';
import type {} from '@mui/x-data-grid/themeAugmentation';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import typography from './typography';
import MonthCalendar from './components/date-picker/MonthCalendar';
import YearCalendar from './components/date-picker/YearCalendar';
import TextField from './components/inputs/TextField';
import FilledInput from './components/inputs/FilledInput';
import OutlinedInput from './components/inputs/OutlinedInput';
import InputAdornment from './components/inputs/InputAdornment';
import FormControlLabel from './components/inputs/FormControlLabel';
import Stack from './components/layout/Stack';
import List from './components/list/List';
import ListItemText from './components/list/ListItemText';
import ListItemIcon from './components/list/ListItemIcon';
import ListItemButton from './components/list/ListItemButton';
import Collapse from './components/list/Collapse';
import MenuItem from './components/list/MenuItem';
import Link from './components/navigation/Link';
import Drawer from './components/navigation/Drawer';
import Paper from './components/surfaces/Paper';

export const theme = createTheme({
  typography,
  components: {
    MuiMonthCalendar: MonthCalendar,
    MuiYearCalendar: YearCalendar,
    MuiTextField: TextField,
    MuiFilledInput: FilledInput,
    MuiOutlinedInput: OutlinedInput,
    MuiInputAdornment: InputAdornment,
    MuiFormControlLabel: FormControlLabel,
    MuiStack: Stack,
    MuiList: List,
    MuiMenuItem: MenuItem,
    MuiListItemText: ListItemText,
    MuiListItemIcon: ListItemIcon,
    MuiListItemButton: ListItemButton,
    MuiCollapse: Collapse,
    MuiLink: Link,
    MuiDrawer: Drawer,
    MuiPaper: Paper,
  },
  spacing: 8,
});
