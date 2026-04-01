#!/usr/bin/env node
'use strict';

const { CredentialsManager } = require('./src/credentials');
const { exec } = require('child_process');
const path = require('path');

// 📝 CONFIGURE SEUS LOGINS AQUI
const LOGINS = [
    { cpf: '49160972890', senha: 'KeMerwon!25' },
    // { cpf: '12345678901', senha: 'outra_senha' },
    // { cpf: '11122233344', senha: 'mais_uma_senha' }
];

const DELAY_ENTRE_EXECUCOES = 5000; // 5 segundos

async function executarComDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function executarBot() {
    return new Promise((resolve, reject) => {
        exec('npm start', (error, stdout, stderr) => {
            if (error) {
                console.error('❌ Erro ao executar bot:', error.message);
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

async function executarSequencialmente() {
    const credManager = new CredentialsManager();
    
    console.log('🚀 INICIANDO EXECUÇÃO MÚLTIPLA DO BOT\n');
    console.log(`📊 Total de logins: ${LOGINS.length}\n`);
    
    for (let i = 0; i < LOGINS.length; i++) {
        const login = LOGINS[i];
        const numero = i + 1;
        
        console.log(`\n${'='.repeat(60)}`);
        console.log(`⏱️  EXECUÇÃO ${numero}/${LOGINS.length}`);
        console.log(`${'='.repeat(60)}`);
        console.log(`📋 CPF: ${login.cpf.slice(0, 3)}.${login.cpf.slice(3, 6)}.${login.cpf.slice(6, 9)}-${login.cpf.slice(9)}`);
        console.log(`🔐 Salvando credenciais...\n`);
        
        try {
            // Salva as credenciais
            credManager.save(login.cpf, login.senha);
            console.log(`✅ Credenciais salvas\n`);
            
            // Executa o bot
            console.log(`🤖 Iniciando bot...\n`);
            await executarBot();
            
            // Aguarda antes da próxima execução
            if (i < LOGINS.length - 1) {
                console.log(`\n⏳ Aguardando ${DELAY_ENTRE_EXECUCOES / 1000}s antes da próxima execução...`);
                await executarComDelay(DELAY_ENTRE_EXECUCOES);
            }
        } catch (erro) {
            console.error(`\n❌ FALHA NA EXECUÇÃO ${numero}:`, erro.message);
            process.exit(1);
        }
    }
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`\n🎉 TODAS AS EXECUÇÕES COMPLETADAS COM SUCESSO!\n`);
    console.log(`📁 Certificados salvos em: ./data/\n`);
}

// Validação
if (LOGINS.length === 0) {
    console.error('❌ ERRO: Nenhum login configurado em run-multiple.js');
    console.error('   Edite o arquivo e adicione logins na variável LOGINS');
    process.exit(1);
}

executarSequencialmente().catch(erro => {
    console.error('\n❌ ERRO FATAL:', erro);
    process.exit(1);
});
