'use strict';
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { CredentialsManager } = require('./credentials');
const BrowserManager = require('./browserManager');
const { digitarComoHumano } = require('./utils');

const cfgPath = path.join(__dirname, '../config/config.json');
if (!fs.existsSync(cfgPath)) {
    console.error('❌ config/config.json não encontrado!');
    process.exit(1);
}

const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf-8'));
const CONFIG = {
    navegador: cfg.navegador,
    urls: cfg.urls,
    timeout: cfg.timeout,
    digitacao: cfg.digitacao,
};

const credManager = new CredentialsManager();
let credenciais;
try {
    credenciais = credManager.load();
} catch (e) {
    console.error('❌', e.message);
    process.exit(1);
}

async function acessarPaginaInicial(page) {
    console.log('🌐 Acessando portal...');
    await page.goto(CONFIG.urls.inicial, { waitUntil: 'networkidle', timeout: CONFIG.timeout.navegacao });
    const botao = page.getByRole('link', { name: 'Requerer Certificado' }).first();
    await botao.waitFor({ state: 'visible', timeout: CONFIG.timeout.seletor });
    await botao.click();
    console.log('✅ Portal carregado.');
}

async function realizarLogin(page) {
    console.log('🔑 Digitando CPF...');
    await page.waitForSelector('#accountId', { timeout: CONFIG.timeout.seletor });
    await page.fill('#accountId', '');
    await digitarComoHumano(page, credenciais.cpf, CONFIG.digitacao);
    await page.click('#enter-account-id');

    const erroCPF = await page.locator('.error-text, #error-message-id').isVisible().catch(() => false);
    if (erroCPF) throw new Error('CPF inválido ou não cadastrado');

    console.log('🔒 Digitando senha...');
    await page.waitForSelector('#password', { state: 'visible', timeout: 15000 });
    await page.fill('#password', credenciais.senha);
    await page.click('#submit-button');

    await page.waitForTimeout(2000);
    const loginInvalido = await page.locator('text=Usuário ou senha inválidos').isVisible().catch(() => false);
    if (loginInvalido) throw new Error('Senha incorreta!');

    await page.waitForLoadState('networkidle');
    console.log('🎉 Login realizado com sucesso.');
}

async function capturarResultado(page) {
    console.log('📄 Capturando certificado...');
    const linkCert = page.locator(`a[href*="${CONFIG.urls.certificado}"]`);
    await linkCert.waitFor({ state: 'visible', timeout: CONFIG.timeout.seletor });
    await linkCert.click();

    const imgDoc = page.locator('#docImg');
    await imgDoc.waitFor({ state: 'visible', timeout: 20000 });

    const src = await imgDoc.getAttribute('src');
    if (!src || !src.includes('base64')) throw new Error('Imagem não gerada');

    const base64Data = src.replace(/^data:image\/\w+;base64,/, "");
    const fileName = `certificado_${credenciais.cpf.slice(-4)}.png`;
    fs.writeFileSync(path.join(__dirname, '../data', fileName), base64Data, 'base64');

    console.log(`✅ Certificado salvo: data/${fileName}`);
}

async function main() {
    console.log('🚀 Iniciando Alistamento Bot...');
    const manager = new BrowserManager();
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

    try {
        await manager.iniciar(`perfil-${Date.now()}`, CONFIG);
        const page = await manager.novaAba();

        await acessarPaginaInicial(page);
        await realizarLogin(page);
        await capturarResultado(page);

        console.log('🎯 Processo concluído com sucesso!');
    } catch (erro) {
        console.error('\n🛑 FALHA:', erro.message);
    } finally {
        await manager.fechar();
        console.log('🏁 Navegador fechado.');
    }
}

main().catch(console.error);
