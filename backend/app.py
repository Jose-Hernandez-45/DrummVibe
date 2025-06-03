from flask import Flask, request, redirect, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.security import generate_password_hash
import os

app = Flask(__name__)
CORS(app)  # Para permitir peticiones desde frontend si están en otro dominio/puerto

# URI de conexión (usa variable de entorno o cambia aquí)
uri = "mongodb+srv://jh733325:TuPasswordAqui@dbdrumm.zrqaas5.mongodb.net/dbDrumm?retryWrites=true&w=majority"

client = MongoClient(uri)
db = client['dbDrumm']
users_collection = db['users']

@app.route('../templates/register', methods=['POST'])
def register():
    data = request.json  # Recibimos JSON desde el frontend

    usuario = data.get('usuario')
    correo = data.get('correo')
    contrasena = data.get('contrasena')

    if not usuario or not correo or not contrasena:
        return jsonify({"error": "Faltan datos"}), 400

    if users_collection.find_one({"usuario": usuario}) or users_collection.find_one({"correo": correo}):
        return jsonify({"error": "Usuario o correo ya registrado"}), 400

    hashed_password = generate_password_hash(contrasena)

    user_doc = {
        "usuario": usuario,
        "correo": correo,
        "contrasena": hashed_password
    }

    users_collection.insert_one(user_doc)

    return jsonify({"message": "Usuario registrado exitosamente"}), 201

if __name__ == '__main__':
    app.run(debug=True)
