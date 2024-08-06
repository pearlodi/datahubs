import Grid from '@mui/material/Grid';
import TopCard from './TopCard';
import excel from '../../../../assets/images/office365.png';
import table from '../../../../assets/images/tablets.png';
import UploadExcel from 'components/UploadExcel';
import { Link } from 'react-router-dom';
const cardsData = [
  {
    id: 1,
    title: '',
    rate: '28.4%',
    isUp: true,
    icon: excel,
    button: <UploadExcel />,
  },
  {
    id: 2,
    title: '',
    rate: '12.6%',
    isUp: false,
    icon: table,
    button: (
      <Link to="/create-table">
        <button className='gradient-background text-black  cursor-pointer w-full flex font-medium text-center items-center justify-center p-1'>
          Manually create table
        </button>
      </Link>
    ),

  },
];

const TopCards = () => {
  return (
    <Grid container spacing={{ xs: 2.5, sm: 3, lg: 3.75 }}>
      {cardsData.map((item) => {
        return (
          <TopCard
            key={item.id}
            title={item.title}
            rate={item.rate}
            isUp={item.isUp}
            icon={item.icon}
            button={item.button}
          />
        );
      })}
    </Grid>
  );
};

export default TopCards;
