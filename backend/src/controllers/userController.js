const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const registerUser = async(req, res) => {
    const{username, email, password} = req.body;

    if(!username || !email || !password){
        return res.status(400).json({error: 'Todos los campos son obligatorios'})
    }
    if(!email.includes('@')){
        return res.status(400).json({error: 'El email no es valido'})
    }

    try{

        const userExist = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if(userExist.rows.length > 0){
            return res.status(400).json({error: 'El email ya existe'})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *';
        const values = [username, email, hashedPassword];
        const result = await pool.query(query, values);
        res.status(201).json({message: 'Usuario registrado exitosamente', user: result.rows[0]});
    }catch(err){
        console.error(err);
        res.status(500).json({error: 'Error al registrar el usuario'})
    }
}

const loginUser = async (req, res) =>{
    const {email, password} = req.body;

    try{
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

       if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }

        const user = result.rows[0];

           const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }
        // 3. Login exitoso (por ahora devolvemos el usuario sin password)
        res.json({ 
            message: 'Login exitoso', 
            user: { id: user.id, username: user.username, email: user.email } 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al iniciar sesión' });

    }
};

module.exports = { registerUser, loginUser };