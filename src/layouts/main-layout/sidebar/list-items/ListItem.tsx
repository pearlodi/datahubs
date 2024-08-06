import Link from '@mui/material/Link';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DataSaverOffIcon from '@mui/icons-material/DataSaverOff';
import { MenuItem } from 'routes/sitemap';

interface ListItemProps extends MenuItem {
  active: boolean;
}

const ListItem = ({ subheader, path, active }: ListItemProps) => {
  return (
    <ListItemButton
      component={Link}
      href={path}
      sx={{
        opacity: active ? 1 : 0.3,
        borderBottom: active ? '1px solid #FFFFFF60' : 'none',
        backgroundColor: active ? '#80808057' : 'transparent',
        '00&:hover': {
          backgroundColor: active ? 'darkred' : 'yellow',
        }
      }}
    >
      <DataSaverOffIcon className='text-white'/>
      <ListItemText
        primary={subheader}
        sx={{
          '& .MuiListItemText-primary': {
            color: active ? 'white' : 'white',
          },
        }}
      />
    </ListItemButton>
  );
};

export default ListItem;
