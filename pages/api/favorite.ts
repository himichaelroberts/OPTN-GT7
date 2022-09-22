// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getPassageUserId } from '../../utils/passage'
import { getCookie } from 'cookies-next';
import { getSupabase } from '../../utils/supabase';
import { SupabaseClient } from '@supabase/supabase-js'

type Data = {
  message: string
}

async function insertFavorite(supabase: SupabaseClient, carId: string, userId: string) {
  return supabase
    .from('favorites')
    .insert({
      car_id: carId,
      user_id: userId,
    })
}

async function removeFavorite(supabase: SupabaseClient, carId: string, userId: string) {
  return supabase
    .from('favorites')
    .delete()
    .match({ car_id: carId, user_id: userId })
}

async function getUser(supabase: SupabaseClient, userId: string) {
  return supabase
    .from('users')
    .select('id')
    .eq('passage_id', userId)
    .single()
}

type SupabaseUser = {
  id: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST' && req.method !== 'DELETE') {
    res.status(405).send({ message: 'Only POST and DELETE requests allowed' })
    return
  }

  const authToken = getCookie('psg_auth_token', { req, res }) as string;
  const userId = await getPassageUserId(authToken);
  if (!userId) {
    res.status(405).send({ message: 'User Not found' })
    return
  }

  const supabase = getSupabase(userId)

  const { data: user, error: userError }:{ data: any; error: any; } = await getUser(supabase, userId)

  if (userError || !user) {
    res.status(405).send({ message: 'User Not found' })
    return
  }

  if (req.method === 'POST') {
    const { error } = await insertFavorite(supabase, req.body.car_id, user.id)

    if (error) {
      res.status(400).send({ message: 'Failed to insert data' })
    }
  }

  if (req.method === 'DELETE') {
    const { error } = await removeFavorite(supabase, req.body.car_id, user.id)

    if (error) {
      res.status(400).send({ message: 'Failed to remove favorite' })
    }
  }

  const { data: readData, error: readError } = await supabase
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

    if (readError) {
      res.status(400).send({ message: 'Failed to insert data' })
    }

  // @ts-ignore
  res.status(200).json(readData)
}
