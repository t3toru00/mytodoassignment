import fs from 'fs';
import path from 'path';
import { pool } from './db.js';
import { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
const { sign } = jwt;

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const initializeTestDb = async () => {
    const sql = fs.readFileSync(path.resolve(__dirname, '../todo.sql'), "utf8").toString();
    await pool.query(sql);
};

const insertTestUser = async (email, password) => {
    const hashedpassword = await new Promise((resolve, reject) => {
        hash(password, 10, (error, hashed) => {
            if (error) return reject(error);
            resolve(hashed);
        });
    });
    await pool.query('INSERT INTO account (email, password) VALUES ($1, $2)', [email, hashedpassword]);
};


const getToken = (email) => {
    return sign({ user: email }, process.env.JWT_SECRET_KEY)
}

export { initializeTestDb, insertTestUser, getToken }