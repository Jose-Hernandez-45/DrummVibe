const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB Atlas
const uri = "mongodb+srv://jh733325:12345@dbdrumm.zrqaas5.mongodb.net/dbDrumm?retryWrites=true&w=majority";

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB conectado'))
.catch(err => console.error('Error al conectar con MongoDB:', err));

// Esquema con campo "rol"
const userSchema = new mongoose.Schema({
    usuario: { type: String, required: true, unique: true },
    correo: { type: String, required: true, unique: true },
    contrasena: { type: String, required: true },
    rol: { type: String, default: 'usuario' } // ← Campo de rol
});

const User = mongoose.model('User', userSchema);

// Registro de usuario
app.post('/register', async (req, res) => {
    const { usuario, correo, contrasena, rol } = req.body;

    if (!usuario || !correo || !contrasena) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    try {
        const existingUser = await User.findOne({ $or: [{ usuario }, { correo }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Usuario o correo ya registrado' });
        }

        const hashedPassword = await bcrypt.hash(contrasena, 10);
        const newUser = new User({
            usuario,
            correo,
            contrasena: hashedPassword,
            rol: rol || 'usuario' // ← Asignar rol, o 'usuario' por defecto
        });

        await newUser.save();
        res.status(201).json({ message: 'Usuario registrado exitosamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Login
app.post('/login', async (req, res) => {
    const { usuario, contrasena } = req.body;

    if (!usuario || !contrasena) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    try {
        const user = await User.findOne({ usuario });
        if (!user) {
            return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
        }

        const isMatch = await bcrypt.compare(contrasena, user.contrasena);
        if (!isMatch) {
            return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
        }

        res.json({
            message: 'Login exitoso',
            usuario: user.usuario,
            rol: user.rol // ← Devolver rol
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
