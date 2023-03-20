// Package Imports
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Local Imports
import app from '../firebaseInit';

const auth = getAuth(app);
export default auth;
