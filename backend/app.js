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
.catch(err => console.log(err));

// Definir esquema y modelo de usuario
const userSchema = new mongoose.Schema({
    usuario: { type: String, required: true, unique: true },
    correo: { type: String, required: true, unique: true },
    contrasena: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Ruta para registrar usuario
app.post('/register', async (req, res) => {
    const { usuario, correo, contrasena } = req.body;

    if (!usuario || !correo || !contrasena) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    try {
        // Verificar si usuario o correo ya existe
        const existingUser = await User.findOne({ $or: [{ usuario }, { correo }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Usuario o correo ya registrado' });
        }

        // Hashear contraseña
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        // Crear nuevo usuario
        const newUser = new User({
            usuario,
            correo,
            contrasena: hashedPassword
        });

        await newUser.save();

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
