import { useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { supabase } from '../lib/supabase'

export function SyncSignin() {
  const { user, isLoaded } = useUser()

  useEffect(() => {
    const syncUserToSupabase = async () => {
      console.log('SyncSignin: Starting sync process...')
      console.log('SyncSignin: isLoaded:', isLoaded)
      console.log('SyncSignin: user:', user)
      console.log('SyncSignin: supabase client:', !!supabase)

      if (!isLoaded || !user || !supabase) {
        console.log('SyncSignin: Early return - missing requirements')
        return
      }

      try {
        console.log('SyncSignin: Preparing user data...')
        const userData = {
          clerk_id: user.id,
          email: user.primaryEmailAddress?.emailAddress || '',
          full_name: user.fullName || null,
          image_url: user.imageUrl || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        console.log('SyncSignin: User data to sync:', userData)

        // First, let's check if the table exists and we can query it
        console.log('SyncSignin: Testing table access...')
        const { data: testData, error: testError } = await supabase
          .from('signins')
          .select('count')
          .limit(1)

        if (testError) {
          console.error('SyncSignin: Table access test failed:', testError)
          return
        }

        console.log('SyncSignin: Table access successful, proceeding with upsert...')

        const { data, error } = await supabase
          .from('signins')
          .upsert(userData, {
            onConflict: 'clerk_id',
            ignoreDuplicates: false
          })
          .select()

        if (error) {
          console.error('SyncSignin: Upsert error:', error)
          console.error('SyncSignin: Error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          })
        } else {
          console.log('SyncSignin: Successfully synced user to Supabase:', data)
        }
      } catch (error) {
        console.error('SyncSignin: Unexpected error:', error)
      }
    }

    console.log('SyncSignin: useEffect triggered')
    syncUserToSupabase()
  }, [user, isLoaded])

  // This component renders nothing
  return null
}