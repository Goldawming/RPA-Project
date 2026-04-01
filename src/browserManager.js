'use strict';
const { chromium } = require('playwright');
const os = require('os');
const path = require('path');

class BrowserManager {
    #context = null;

    async iniciar(perfilNome, config) {
        const diretorioPerfil = path.join(os.homedir(), `gov-perfil-${perfilNome}`);
        const nav = config.navegador;

        console.log(`🚀 Iniciando navegador com perfil: ${perfilNome}`);

        this.#context = await chromium.launchPersistentContext(diretorioPerfil, {
            executablePath: nav.executablePath[os.platform()] ?? nav.executablePath.linux,
            headless: nav.headless,
            args: nav.args,
            viewport: nav.viewport,
            ignoreDefaultArgs: ['--enable-automation'],
        });
    }

    async novaAba() {
        if (!this.#context) throw new Error('Chame iniciar() primeiro');
        return await this.#context.newPage();
    }

    async fechar() {
        if (this.#context) {
            await this.#context.close().catch(() => {});
            this.#context = null;
        }
    }
}

module.exports = BrowserManager;
