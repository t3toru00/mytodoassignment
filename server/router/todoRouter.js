import {pool} from '../helper/db.js';
import { Router } from 'express';
import { emptyOrRows } from '../helper/utils.js';
import {auth } from '../helper/auth.js';

const router = Router();

router.get('/', (req, res, next) => {
   
    pool.query('SELECT * FROM task', (error, result) => {
        if (error) {
            return next(error)
        }
        return res.status(200).json(emptyOrRows(result))
    })
}); 

router.post('/create', auth, (req, res, next) => {
   
    pool.query('INSERT INTO task (description) VALUES ($1) returning *', 
    [req.body.description], (error, result) => {
        if (error) {
            return next(error)
        }
        return res.status(200).json({id: result.rows[0].id})
    })
});

router.delete('/delete/:id', auth,(req, res, next) => {
    const taskId = req.params.id;

    pool.query('DELETE FROM task WHERE id = $1 RETURNING id', [taskId], (error, result) => {
        if (error) {
            return next(error);
        }

        // If no rows were deleted, send a 404 response
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Return the deleted id and success message
        return res.status(200).json({ id: taskId, message: 'Task deleted successfully' });
    });
});

export default router;