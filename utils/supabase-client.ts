import { GetServerSidePropsContext } from 'next';
import { Car, Wishlist } from '../types';
import { getPassageUserId } from './passage';
import { getSupabase } from './supabase';

export const getCarList = async (): Promise<
  Car[]
> => {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from('cars')

  if (error) {
    console.log(error.message);
    throw error;
  }

  return data || [];
};

export const getWishLists = async (ctx: GetServerSidePropsContext): Promise<
  Wishlist[]
> => {
  const userId = await getPassageUserId(ctx);

  if (!userId) throw new Error("user not found")

  const supabase = getSupabase(userId)

  const { data, error } = await supabase
    .from('wishlists')

  if (error) {
    console.log(error.message);
    throw error;
  }

  return data || [];
};
