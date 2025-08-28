import { useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { supabase } from '../lib/supabase'

export function SyncSignin() {
  const { user, isLoaded } = useUser()

  useEffect(() => {
    const syncUserToSupabase = async () => {
      if (!isLoaded || !user || !supabase) {
        return
      }

      try {
        const userData = {
          clerk_id: user.id,
          email: user.primaryEmailAddress?.emailAddress || '',
          full_name: user.fullName || '',
          image_url: user.imageUrl || '',
          updated_at: new Date().toISOString()
        }

        const { data, error } = await supabase
          .from('signins')
          .upsert(userData, {
            onConflict: 'clerk_id',
            ignoreDuplicates: false
          })
          .select()

        if (error) {
          console.error('Error syncing user to Supabase:', error)
        } else {
          console.log('Successfully synced user to Supabase:', data)
        }
      } catch (error) {
        console.error('Unexpected error syncing user:', error)
      }
    }

    syncUserToSupabase()
  }, [user, isLoaded])

  // This component renders nothing
  return null
}