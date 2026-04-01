'use strict';

const delayAleatorio = (min, max) => Math.floor(min + Math.random() * (max - min));

async function digitarComoHumano(page, texto, config) {
    for (const caractere of texto) {
        await page.keyboard.type(caractere, { 
            delay: delayAleatorio(config.minDelay, config.maxDelay) 
        });
    }
}

const aguardar = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = { digitarComoHumano, aguardar };
