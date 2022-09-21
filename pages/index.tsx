import React from 'react';

import { useQueryState, queryTypes, useQueryStates } from 'next-usequerystate'

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';


import { Car, Country, Make } from '../types';
import { getCarList, getCountries, getMakes } from '../utils/supabase-client';
import withPageAuth from '../utils/withPageAuth';
import getUser from '../utils/getUser';
import { ParsedUrlQuery } from 'querystring';
import CarCard from '../components/CarCard';

type Props = {
  cars: Car[]
  countries: Country[],
  makes: Make[],
  query: ParsedUrlQuery,
}

const IndexPage = ({ cars, countries, makes, query }: Props) => {
  const [selectedCountryMake, setSelectedCountryMake] = useQueryStates(
    {
      country: queryTypes.string.withDefault(query?.country),
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

  let carList = cars.map((car, index) => {
    console.log('car', car);
    return (
      <Grid xs="auto" key={index}>
        <CarCard name={car.name} make={car.makers.name} />
      </Grid>
    )
  })

  return (
    <>
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

    return {
      props: {
        query: ctx.query,
        user,
        countries,
        makes,
        cars: carList,
      }
    }
  }
});

export default IndexPage
