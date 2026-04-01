'use strict';
const CryptoJS = require('crypto-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const CREDENTIALS_PATH = path.join(__dirname, '../credentials.enc');

function getSecretKey() {
    const key = process.env.SECRET_KEY;
    if (!key || key.length < 20) {
        throw new Error('Defina uma SECRET_KEY forte no arquivo .env');
    }
    return key;
}

class CredentialsManager {
    encrypt(text) {
        return CryptoJS.AES.encrypt(text, getSecretKey()).toString();
    }
    decrypt(encrypted) {
        const bytes = CryptoJS.AES.decrypt(encrypted, getSecretKey());
        const text = bytes.toString(CryptoJS.enc.Utf8);
        if (!text) throw new Error('Falha na descriptografia. Verifique a SECRET_KEY.');
        return text;
    }
    save(cpf, senha) {
        const data = { cpf: this.encrypt(cpf), senha: this.encrypt(senha), updatedAt: new Date().toISOString() };
        fs.writeFileSync(CREDENTIALS_PATH, JSON.stringify(data, null, 2));
        console.log('Credenciais salvas com sucesso!');
    }
    load() {
        if (!fs.existsSync(CREDENTIALS_PATH)) throw new Error('credentials.enc nao encontrado.');
        const data = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'));
        return { cpf: this.decrypt(data.cpf), senha: this.decrypt(data.senha) };
    }
}

module.exports = { CredentialsManager };
