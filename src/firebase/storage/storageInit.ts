import app from '../firebaseInit';
import { getStorage } from 'firebase/storage';

const storage = getStorage(app);

export default storage;
