// Package Imports
import { getAuth } from 'firebase/auth';

// Local Imports
import app from '../firebaseInit';

const auth = getAuth(app);
export default auth;
