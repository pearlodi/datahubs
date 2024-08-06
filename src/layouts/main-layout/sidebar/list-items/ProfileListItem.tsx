import { MenuItem } from 'routes/sitemap';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';

const ProfileListItem = ({ subheader, path }: MenuItem) => {
  return (
    <ListItemButton component={Link} href={path}>
      <Stack spacing={1} alignItems="center">
        
        <Stack direction="column">
          <Typography variant="subtitle2" color="text.primary" letterSpacing={0.5}>
            {subheader}
          </Typography>
          <Typography variant="caption" color="text.secondary" fontWeight={400}>
            Account Settings
          </Typography>
        </Stack>
      </Stack>
    </ListItemButton>
  );
};

export default ProfileListItem;
