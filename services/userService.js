import { supabase } from '../lib/supabase';

export const getUserById = async (id) => {
    try {
        const {data, error} = await supabase
        .from('users')
        .select()
        .eq('id', id)
        .single();

        if (error) {
            return {success: false, msg: error.message}
        }
        else {
            return {success: true, data};
        }
    }
    catch (err) {
        console.log(err);
        return {success: false, msg: err.message}
    }
}

export const updateUser = async (id, data) => {
    const {error} = await supabase.from('users').update(data).eq('id', id);

    if (error) {
        return {success: false, msg: error.message}
    }
    else {
        return {success: true, data};
    }
}