import { useState } from 'react';

import { GetServerSidePropsContext } from 'next';

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import CarCard from '../components/CarCard';

import { FavoriteCar } from '../types';
import { getFavoriteCars } from '../utils/supabase-client';
import withPageAuth from '../utils/withPageAuth';
import getUser from '../utils/getUser';

type Props = {
  favorites: FavoriteCar[]
}

function Favorites({ favorites }: Props) {
  const [localFavorites, setLocalFavorites] = useState(favorites);

  const handleFavoriteAction = ((_favorited: boolean, carId: string) => {
    fetch('/api/favorite', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ car_id: carId }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLocalFavorites(data)
      })
  })

  let carList = localFavorites.map((favorite, index) => {
    return (
      <Grid xs="auto" key={index}>
        <CarCard car={favorite.cars} favorited handleFavoriteAction={handleFavoriteAction} />
      </Grid>
    )
  })

  return (
    <>
      <Typography variant='h2'>
        Favorites
      </Typography>

      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 1, lg: 3 }}>
        {carList}
      </Grid>
    </>
  )
};

export const getServerSideProps = withPageAuth({
  redirectTo: '/login',
  async getServerSideProps(ctx: GetServerSidePropsContext) {
    const { user } = await getUser(ctx);
    const favorites = await getFavoriteCars(ctx);

    return {
      props: {
        user,
        favorites,
      }
    }
  }
});

export default Favorites;
