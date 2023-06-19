import * as SQLite from 'expo-sqlite';
import { DATABASE_FILE } from '../config/constants';

const database = SQLite.openDatabase(DATABASE_FILE);
