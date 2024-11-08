import { pool } from '../helper/db.js';
import e, { Router } from 'express';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
const { sign } = jwt;

const router = Router();

router.post('/register', (req, res, next) => {
    hash(req.body.password, 10, (error, hashedpassword) => {
        if (error) return next(error);

        pool.query(
            'INSERT INTO account (email, password) VALUES ($1, $2) RETURNING *',
            [req.body.email, hashedpassword],
            (error, results) => {
                if (error) return next(error); // Handles SQL errors
                if (!results || results.rows.length === 0) {
                    // Handle case where no rows are returned
                    return res.status(500).json({ error: "User registration failed." });
                }
                res.status(201).json({ id: results.rows[0].id, email: results.rows[0].email });
            }
        );
    });
});


router.post('/login', (req, res, next) => {
    const invalid_message = 'Invalid email or password'
    try {
        pool.query('SELECT * FROM account WHERE email = $1', [req.body.email], (error, result) => {
            if (error) next(error)
            if (result.rowCount === 0) return next(new Error(invalid_message))
            compare(req.body.password, result.rows[0].password, (error, match) => {
                if (error) return next(error)
                if (!match) return next(new Error(invalid_message))
                const token = sign({ user: req.body.email }, process.env.JWT_SECRET_KEY)
                const user = result.rows[0]
                return res.status(200).json(
                    {
                        'id': user.id,
                        'email': user.email,
                        'token': token
                    }
                )
            })
        })
    } catch (error) {
        return next(error)

    }
})

export default router;