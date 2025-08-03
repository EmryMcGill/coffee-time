import { supabase } from '../lib/supabase';

export const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
            return {success: false, msg: error.message}
        }
        else {
            return {success: true};
        }
}