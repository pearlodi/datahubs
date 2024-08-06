import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';

interface TopCardProps {
  icon: string;
  title: string;
  rate: string;
  isUp: boolean;
  button?: React.ReactNode;
}

const TopCard = (props: TopCardProps) => {
  const { icon, title,  button } = props;

  return (
    <Grid item xs={12} sm={6} xl={3}>
      <Stack
        p={2.25}
        pl={2.5}
        direction="column"
        component={Paper}
        gap={1.5}
        height={116}
        width={1}
      >
        <div className="flex flex-col items-center  ">
          <div className="w-12 flex items-center py-8 justify-center ">
            <img src={icon} alt={title} className="w-full" />
          </div>
          {button && <div className='w-full mt-5'>{button}</div>}
        </div>
      </Stack>
    </Grid>
  );
};

export default TopCard;
