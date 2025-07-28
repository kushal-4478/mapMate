import { constants } from 'fs';
import { access } from 'fs/promises';

export const checkFileExists = async (filePath) => {
    try {
        await access(filePath, constants.F_OK);
        return true;
    } catch {
        return false;
    }
};