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

  const userUuid = '21a9ec5b-5d00-42c6-a383-9fd2b4eda7a2';


  if (req.method === 'POST') {
    const { error } = await insertFavorite(supabase, req.body.car_id, userUuid)

    if (error) {
      res.status(400).send({ message: 'Failed to insert data' })
    }
  }

  if (req.method === 'DELETE') {
    const { error } = await removeFavorite(supabase, req.body.car_id, userUuid)

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
