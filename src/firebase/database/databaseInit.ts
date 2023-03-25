import { getDatabase } from 'firebase/database';
import app from '../firebaseInit';

const database = getDatabase(app);
export default database;
