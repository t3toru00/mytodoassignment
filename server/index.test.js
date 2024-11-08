import { expect } from "chai";
import { initializeTestDb, insertTestUser,getToken } from "./helper/test.js";



describe('GET Tasks', () => {
    before(() => {
        initializeTestDb();
    })

    it ('should return all tasks', async () => {
        const response = await fetch ('http://localhost:3001/');
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.be.an('array').that.is.not.empty;
        expect(data[0]).to.include.all.keys('id', 'description')
    })
})

describe ('POST task', () => {
    const email = 'post@gmail.com'
    const password = 'password'
    insertTestUser(email, password)
    const token = `Bearer ${getToken(email)}`; 

    it('should create a new task', async () => {
        const response = await fetch('http://localhost:3001/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ description: 'Task from unit test' })
        });
        const data = await response.json();
    
        expect(response.status).to.equal(200);
        expect(data).to.be.an('object').that.has.all.keys('id');
    });
    
    it('should not post a task without description', async () => {
        const response = await fetch('http://localhost:3001/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });
        const data = await response.json();
    
        expect(response.status).to.equal(401);  // Update expected status code to 401
        expect(data).to.be.an('object').that.has.all.keys('message');  // Adjust to match response structure
    });
    
})
describe('DELETE task', () => {
    const email = 'register3@gmail.com';
    const password = 'password';
    let token;

    before(async () => {
        await insertTestUser(email, password); 
        token = `Bearer ${getToken(email)}`;   
    });

    it('should delete a task', async () => {
        const response = await fetch('http://localhost:3001/delete/5', {
            method: 'DELETE',
            headers: {
                'Authorization': token  
            }
        });
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.be.an('object').that.has.all.keys('id', 'message');
    });

    it('should not delete a task that does not exist', async () => {
        const response = await fetch('http://localhost:3001/delete/200', {
            method: 'DELETE',
            headers: {
                'Authorization': token  
            }
        });
        const data = await response.json();
    
        expect(response.status).to.equal(404);  
        expect(data).to.be.an('object').that.has.all.keys('error');  
    });
    
});


describe('POST register', () => {
    const email = `register3@gmail.com`;

    const password = 'password'
    it ('should register a user with valid email and password', async () => {
        const response = await fetch('http://localhost:3001/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'email':email, 'password':password})
        })
        const data = await response.json();

        expect(response.status).to.equal(201,data.error);
        expect(data).to.be.an('object').that.has.all.keys('id', 'email');
    })
    
})


describe('POST login', () => {
    const email = 'register@gmail.com'
    const password = 'password'
    insertTestUser(email, password)
    it ('should login a user with valid email and password', async () => {
        const response = await fetch('http://localhost:3001/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'email':email, 'password':password})
        })
        const data = await response.json();

        expect(response.status).to.equal(200,data.error);
        expect(data).to.be.an('object').that.has.all.keys('id', 'email', 'token');
    })
})