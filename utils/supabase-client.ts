import { GetServerSidePropsContext } from 'next';
import { Car, FavoriteCar } from '../types';
import { getPassageUserId } from './passage';
import { getSupabase } from './supabase';
import { getCookie } from 'cookies-next';

export const getCountries = async (): Promise<
  Car[]
> => {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from('countries')
    .select('id, name')
    .order('name', { ascending: false })

  if (error) {
    console.log(error.message);
    throw error;
  }

  return data || [];
};

export const getMakes = async (country?: string | string[]): Promise<
  Car[]
> => {
  const supabase = getSupabase()

  let query = supabase
    .from('makers')
    .select(`
      id,
      name,
      countries!inner(
        id,
        name
      )
    `)
    .order('name', { ascending: true })

  if (country) {
    query = query.filter('countries.name', 'eq', country)
  }

  const { data, error } = await query;

  if (error) {
    console.log(error.message);
    throw error;
  }

  return data || [];
};

type GetCarListProps = {
  country?: string | string[];
  make?: string | string[];
}

export const getCarList = async ( {country, make } : GetCarListProps): Promise<
  Car[]
> => {
  const supabase = getSupabase()

  let query = supabase
    .from('cars')
    .select(`
      id,
      name,
      year,
      makers!inner(
        id,
        name,
        countries!inner(
          id,
          name
        )
      )
    `)

  if (make) {
    query = query.filter('makers.name', 'eq', make)
  }

  if (country) {
    query = query.filter('makers.countries.name', 'eq', country)
  }

  // query = query.order('name', { ascending: true })
  query = query.order('name', { foreignTable: 'makers', ascending: true })

  const { data, error } = await query;

  if (error) {
    console.log(error.message);
    throw error;
  }

  return data || [];
};

export const getFavoriteCars = async (ctx: GetServerSidePropsContext): Promise<
FavoriteCar[]
> => {
  const authToken = getCookie('psg_auth_token', { req: ctx.req, res: ctx.res }) as string;

  const userId = await getPassageUserId(authToken);

  if (!userId) throw new Error("user not found")

  const supabase = getSupabase(userId)

  const { data, error } = await supabase
    .from('favorites')
    .select(`
      id,
      cars!inner(
        id,
        name,
        makers!inner(
          id,
          name,
          countries!inner(
            id,
            name
          )
        )
      )
    `)

  if (error) {
    console.log(error.message);
    throw error;
  }

  return data || [];
};

// export const saveFavoriteCar = async (ctx: GetServerSidePropsContext): Promise<> => {
//   const { data, error } = await supabase
//   .from('notes')
//   .insert([
//       { note: 'I need to not forget this' },
//   ]);

// }

export const getCar = async (name: string): Promise<
  Car
> => {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from('cars')
    .select(`
      id,
      name,
      makers!inner(
        id,
        name,
        countries!inner(
          id,
          name
        )
      )
    `)
    .eq('name', name)
    .single()

  if (error) {
    console.log(error.message);
    throw error;
  }

  return data;
};
