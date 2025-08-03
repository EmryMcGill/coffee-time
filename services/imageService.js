import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';
import { supabaseUrl } from '../constants';
import { supabase } from '../lib/supabase';

export const getAvatar = imagePath => {
    if (imagePath !== null && typeof imagePath !== 'object') {
        return getFileUrl(imagePath);
    }
    else if (typeof imagePath === 'object') {
        return {uri: imagePath?.uri}
    }
    else {
        return {uri: require('../assets/images/default-avatar.jpg')};
    }
}

export const getFileUrl = filePath => {
    if (filePath)
        return {uri: `${supabaseUrl}/storage/v1/object/public/uploads/${filePath}`}
    else 
        return null;
}

export const uploadFile = async (folderName, fileUri, isImage=true) => {
    try {
        console.log('fileuri', fileUri)
        const filename = getFilePath(folderName, isImage);
        const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.Base64
        });
        const arrayBuffer = decode(fileBase64);
        const {data, error} = await supabase
            .storage
            .from('uploads')
            .upload(filename, arrayBuffer, {
                cacheControl: '3600',
                upsert: false,
                contentType: isImage ? 'image/*' : 'video/*'
            });

        if (error) {
            console.log(err);
            return {success: false, msg: 'file upload failed'};
        }

        console.log('data', data);

        return {success: true, data: data.path};
    }
    catch (err) {
        console.log(err);
        return {success: false, msg: 'file upload failed'};
    }
}

export const getFilePath  = (folderName, isImage) => {
    return `/${folderName}/${(new Date()).getTime()}${isImage ? '.png' : '.mp4'}`
}