# Alistamento Bot - Certificado Militar EB

Bot automatizado em Node.js + Playwright para acessar o portal de Alistamento Militar do Exército Brasileiro, realizar login via Gov.br e baixar o **Certificado de Alistamento Militar** automaticamente.

---

## ✨ Funcionalidades

- Login seguro via Gov.br (CPF + Senha)
- Credenciais **criptografadas** (nunca ficam em texto plano)
- Digitação humana (com delays aleatórios)
- Navegador persistente (mantém cookies e sessão)
- Captura automática do certificado como imagem PNG
- Tratamento de erros e logs claros

---

## 📁 Estrutura do Projeto

```
.
├── src/
│   ├── bot.js              ← Arquivo principal
│   ├── browserManager.js
│   ├── credentials.js      ← Gerencia criptografia
│   └── utils.js
├── config/
│   └── config.json
├── data/                   ← Certificados salvos aqui
├── .env                    ← (não subir no Git)
├── credentials.enc         ← Credenciais criptografadas (não subir no Git)
├── .gitignore
├── .env.example
├── README.md
├── package.json
├── run-multiple.js
└── node_modules/
```

---

## 🚀 Como Instalar e Usar

### 1. Clone ou baixe o projeto

```bash
git clone https://github.com/Goldawming/RPA-Project.git
cd RPA-Project
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o arquivo de ambiente

```bash
cp .env.example .env
```

Edite o `.env` com uma chave secreta forte (mínimo 32 caracteres). Exemplo:

```
SECRET_KEY=alistamento-bot-2026-super-chave-criptografia-force-32chars-ABC123xyz!
```

### 4. Salve suas credenciais (execute apenas 1 vez)

**Opção 1: Script interativo (recomendado para evitar erros)**

Crie um arquivo `setup-credentials.js` na raiz do projeto com o seguinte código exato:

```javascript
#!/usr/bin/env node
'use strict';

const { CredentialsManager } = require('./src/credentials');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Digite seu CPF (apenas números): ', (cpf) => {
    rl.question('Digite sua senha: ', (senha) => {
        const credManager = new CredentialsManager();
        credManager.save(cpf, senha);
        console.log('✅ Credenciais salvas com sucesso!');
        rl.close();
    });
});
```

Torne o arquivo executável e execute:

```bash
chmod +x setup-credentials.js
node setup-credentials.js
```

Digite seu CPF (ex: `12345678901`) e senha quando solicitado.

**Opção 2: Comando direto (use aspas se necessário)**

```bash
npm run save-cred "SEU_CPF_SEM_PONTOS" "SUA_SENHA"
```

**Exemplo real:**
```bash
npm run save-cred "12345678901" "MinhaSenha!25"
```

> ⚠️ **IMPORTANTE:**
> - Use CPF **SEM pontos nem hífen** (Ex: `12345678901`)
> - Se a senha tiver caracteres especiais (`!`, `$`, etc), use aspas duplas `"..."` no comando direto
> - O comando executa **apenas 1 vez** - as credenciais são criptografadas e salvas
> - **Nunca compartilhe** os arquivos `.env` ou `credentials.enc`
> - Se der erro de descriptografia, verifique se a `SECRET_KEY` no `.env` está correta

### 5. Execute o bot

```bash
npm start
```

---

## 🔄 Executar com Múltiplos Logins

Se você precisa executar o bot **várias vezes** com **CPFs/senhas diferentes**, use o script `run-multiple.js`:

### 1. Configure os logins

Edite `run-multiple.js` e adicione seus logins na variável `LOGINS`:

```javascript
const LOGINS = [
    { cpf: '49160972890', senha: 'KeMerwon!25' },
    { cpf: '12345678901', senha: 'outra_senha' },
    { cpf: '11122233344', senha: 'mais_uma_senha' }
];
```

### 2. Execute o script

```bash
npm run run-multiple
```

Ou:

```bash
node run-multiple.js
```

**O que acontece automaticamente:**
- ✅ Altera o login para cada CPF
- ✅ Executa o bot uma vez
- ✅ Aguarda 5 segundos
- ✅ Muda para o próximo login
- ✅ Repete até terminar todos
- ✅ Salva todos os certificados em `/data/`

**Exemplo de saída:**
```
🚀 INICIANDO EXECUÇÃO MÚLTIPLA DO BOT

📊 Total de logins: 3

============================================================
⏱️  EXECUÇÃO 1/3
============================================================
📋 CPF: 491.609.728-90
🔐 Salvando credenciais...

✅ Credenciais salvas

🤖 Iniciando bot...
[... bot rodando ...]
✅ Certificado salvo: data/certificado_8890.png

⏳ Aguardando 5s antes da próxima execução...

[REPETINDO PARA O PRÓXIMO LOGIN...]

🎉 TODAS AS EXECUÇÕES COMPLETADAS COM SUCESSO!
```

---

## 📸 Onde os certificados são salvos?

Os certificados são salvos automaticamente na pasta `/data/`:

```
data/
├── certificado_8890.png   (últimos 4 dígitos do CPF)
├── certificado_6901.png
└── certificado_3344.png
```

Cada execução gera um arquivo com o nome baseado nos **últimos 4 dígitos do CPF**.

---

## 💾 Onde os Perfis de Navegador são salvos?

O Playwright cria um perfil persistente para cada execução (mantém cookies, sessão, histórico):

```
~/.gov-perfil-perfil-TIMESTAMP
```

**Exemplos:**
```
~/.gov-perfil-perfil-1711964400000
~/.gov-perfil-perfil-1711964405000
~/.gov-perfil-perfil-1711964410000
```

Cada perfil:
- ✅ Mantém cookies separados
- ✅ Guarda histórico de navegação
- ✅ Armazena dados da sessão
- ✅ Permite múltiplas execuções **em paralelo** (sem conflitos)

> 💡 **Dica:** Se quiser limpar os perfis antigos, execute:
> ```bash
> rm -rf ~/.gov-perfil-perfil-*
> ```

---

## ⚙️ Configurações

Edite `config/config.json` para ajustar:

- Tempo de timeout
- Velocidade de digitação (human-like)
- Caminho do Chrome
- URLs do portal

---

## 🛡️ Segurança

- Credenciais criptografadas com AES (CryptoJS)
- Arquivos sensíveis no `.gitignore`
- Perfil de navegador separado
- Nenhuma senha em texto plano

---

## ⚠️ Avisos Importantes

- Este bot é para **uso pessoal e educacional**
- O portal do Governo pode mudar a qualquer momento

---

## 🛠️ Tecnologias

- [Node.js](https://nodejs.org/)
- [Playwright](https://playwright.dev/)
- [CryptoJS](https://cryptojs.gitbook.io/)
- [dotenv](https://github.com/motdotla/dotenv)

---

## 📄 Licença

Projeto para fins educacionais e uso pessoal.

