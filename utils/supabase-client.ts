import { Car, Wishlist } from '../types';
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

export const getWishLists = async (userId: string): Promise<
  Wishlist[]
> => {
  const supabase = getSupabase(userId)

  const { data, error } = await supabase
    .from('wishlists')

  if (error) {
    console.log(error.message);
    throw error;
  }

  return data || [];
};
