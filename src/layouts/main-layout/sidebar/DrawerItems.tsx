import { useLocation } from 'react-router-dom';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import ButtonBase from '@mui/material/ButtonBase';
import CollapseListItem from './list-items/CollapseListItem';
import ProfileListItem from './list-items/ProfileListItem';
import ListItem from './list-items/ListItem';
import { topListData, bottomListData, profileListData } from 'data/sidebarListData';

const DrawerItems = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <>
      <Stack
        pt={5}
        pb={4}
        px={3.5}
        position={'sticky'}
        top={0}
        bgcolor="info.darker"
        alignItems="center"
        justifyContent="flex-start"
        zIndex={1000}
      >
        <ButtonBase component={Link} href="/" disableRipple>
          <p className='text font-[900] text-2xl'>Data Hub</p>
        </ButtonBase>
      </Stack>

      <List component="nav" sx={{ px: 2.5 }}>
        {topListData.map((route) => (
          <ListItem
            key={route.id}
            {...route}
            active={currentPath === route.path}
          />
        ))}
      </List>

      <Divider />

      <List component="nav" sx={{ px: 2.5 }}>
        {bottomListData.map((route) => (
          route.items ? (
            <CollapseListItem key={route.id} {...route} />
          ) : (
            <ListItem
              key={route.id}
              {...route}
              active={currentPath === route.path}
            />
          )
        ))}
      </List>

      <List component="nav" sx={{ px: 2.5 }}>
        {profileListData && <ProfileListItem {...profileListData} />}
      </List>
    </>
  );
};

export default DrawerItems;
