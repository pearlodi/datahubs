import Grid from '@mui/material/Grid';
import TopCards from 'components/sections/dashboard/top-cards';

const Dashboard = () => {
  return (
    <>
      <div className='flex flex-col justify-center items-center h-[60vh] gap-8 w-full'>
        <div className=''>
          <h1 className='text font-bold  text-center text-3xl'>WELCOME</h1>
          <p className='text font-medium  text-center text-base mt-2'>To start please click to upload an excel file or click to manually create table</p>
        </div>
         <div className='w-full'>
         <Grid className='w-full'  container spacing={{ xs: 2.5, sm: 3, lg: 3.75 }}>
            <Grid item xs={12}>
              <TopCards />
            </Grid>
          </Grid>
         </div>
      </div>
    </>
  );
};

export default Dashboard;
