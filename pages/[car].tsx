import Grid from '@mui/material/Unstable_Grid2';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material';

import getUser from '../utils/getUser';
import withPageAuth from '../utils/withPageAuth';
import { getCar } from '../utils/supabase-client';
import { Car } from '../types';


type Prop = {
  car: Car;
}

const CarInfoPage = ({ car }: Prop) => {
  return (
    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 1, lg: 2 }}>
      <CardMedia
        component="div"
        image={`https://jwwfejqbidkztahfvrlv.supabase.co/storage/v1/object/public/cars/${encodeURI(`${car.makers.name} ${car.name}`)}.webp`}
        sx={{ width: '100%', height: 300 }}
      >
        <Typography gutterBottom variant="h4" component="div" sx={{ backgroundColor: alpha("#FFFFFF", 0.25), p: 1 }}>
          {car.name}
        </Typography>
      </CardMedia>
    </Grid>
  );
}

export const getServerSideProps = withPageAuth({
  redirectTo: '/login',
  async getServerSideProps(ctx) {
    const carName = ctx.params?.car as string;

    if (!carName) return {
      redirect: {
        permanent: false,
        destination: "/",
      }
    }

    const { user } = await getUser(ctx);

    let car: Car;
    try {
      car = await getCar(carName)
    } catch (e) {
      return {
        redirect: {
          permanent: false,
          destination: "/",
        }
      }
    }

    return {
      props: {
        user,
        car,
      }
    }
  }
});

export default CarInfoPage;
