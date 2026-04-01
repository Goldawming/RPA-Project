#!/usr/bin/env node
'use strict';

const { CredentialsManager } = require('./src/credentials');
const readline = require('readline');

function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => {
        rl.question(query, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

function askPassword(query) {
    return new Promise((resolve) => {
        process.stdout.write(query);
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.setEncoding('utf8');

        let password = '';

        process.stdin.on('data', (char) => {
            char = char + '';

            switch(char) {
                case '\n':
                case '\r':
                case '\u0004':
                    process.stdin.setRawMode(false);
                    process.stdin.pause();
                    process.stdout.write('\n');
                    resolve(password);
                    break;
                case '\u0003':
                    process.stdout.write('\n');
                    process.exit();
                    break;
                default:
                    process.stdout.write('*');
                    password += char;
                    break;
            }
        });
    });
}

async function main() {
    const cpf = await askQuestion('Digite seu CPF (apenas números): ');
    const senha = await askPassword('Digite sua senha: ');

    const credManager = new CredentialsManager();
    credManager.save(cpf, senha);
    console.log('✅ Credenciais salvas com sucesso!');
}

main();