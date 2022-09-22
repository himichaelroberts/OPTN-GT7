import React, { useState, useEffect } from 'react';

import { queryTypes, useQueryStates } from 'next-usequerystate'

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import Confetti from 'react-confetti'


import { Car, Country, FavoriteCar, Make } from '../types';
import { getCarList, getCountries, getMakes, getFavoriteCars } from '../utils/supabase-client';
import withPageAuth from '../utils/withPageAuth';
import getUser from '../utils/getUser';
import { ParsedUrlQuery } from 'querystring';
import CarCard from '../components/CarCard';

type Props = {
  cars: Car[]
  countries: Country[],
  makes: Make[],
  query: ParsedUrlQuery,
  favorites: FavoriteCar[],
}

const IndexPage = ({ cars, countries, makes, query, favorites }: Props) => {
  const [localFavorites, setLocalFavorites] = useState(favorites);
  const [showConfetti, setShowConfetti] = useState(false);

  const [selectedCountryMake, setSelectedCountryMake] = useQueryStates(
    {
      // @ts-ignore
      country: queryTypes.string.withDefault(query?.country),
      // @ts-ignore
      make: queryTypes.string.withDefault(query?.make)
    },
    {
      history: 'push'
    }
  )

  const updateCountry = async (country: Country | null) => {
    await setSelectedCountryMake({
      country: country?.name || null,
      make: null,
    })
  }

  const updateMake = async (make: Make | null) => {
    await setSelectedCountryMake({
      make: make?.name || null,
    })
  }

  const isCarFavorited = (carName: string): boolean => {
    const found = localFavorites.find(favorite => favorite.cars.name === carName)

    if (found) return true
    return false;
  }

  const runConfetti = () => {
    setShowConfetti(true);

    setTimeout(function () {
      setShowConfetti(false);
    }, 4800);
  }

  const handleFavoriteAction = ((favorited: boolean, carId: string) => {
    fetch('/api/favorite', {
      method: favorited ? 'DELETE' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ car_id: carId }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLocalFavorites(data)
        if (!favorited) runConfetti();
      })
  })

  const carList = cars.map((car, index) => {
    const favorited = isCarFavorited(car.name)
    return (
      <Grid xs="auto" key={index}>
        <CarCard car={car} favorited={favorited} handleFavoriteAction={handleFavoriteAction} />
      </Grid>
    )
  });

  return (
    <>
      {showConfetti &&
        <Confetti
          width={2800}
          height={2000}
          numberOfPieces={800}
        />
      }

      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 1, lg: 2 }}>
        <Grid xs="auto">
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={countries}
            getOptionLabel={(option) => option.name}
            sx={{ width: 300 }}
            value={countries.find(country => country.name === selectedCountryMake.country) || null}
            isOptionEqualToValue={(option, value) => option.name === value?.name}
            onChange={(event, country: Country | null) => {
              updateCountry(country);
            }}
            renderInput={(params) => <TextField {...params} label="Country" />}
          />
        </Grid>
        <Grid xs="auto">
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={makes}
            getOptionLabel={(option) => option.name}
            sx={{ width: 300 }}
            value={makes.find(make => make.name === selectedCountryMake.make) || null}
            isOptionEqualToValue={(option, value) => option.name === value?.name}
            onChange={(event, make: Make | null) => {
              updateMake(make)
            }}
            renderInput={(params) => <TextField {...params} label="Make" />}
          />
        </Grid>
      </Grid>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 1, lg: 3 }}>
        {carList}
      </Grid>
    </>
  )
}

export const getServerSideProps = withPageAuth({
  redirectTo: '/login',
  async getServerSideProps(ctx) {
    const countries = await getCountries();
    const makes = await getMakes(ctx.query?.country);
    const { user } = await getUser(ctx);
    const carList = await getCarList({ country: ctx.query?.country, make: ctx.query?.make });
    const favorites = await getFavoriteCars(ctx);

    return {
      props: {
        query: ctx.query,
        user,
        countries,
        makes,
        cars: carList,
        favorites
      }
    }
  }
});

export default IndexPage
