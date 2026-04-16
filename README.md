# Desafio Automação de Testes Mobile - Carrefour Banco

Projeto de automação de testes mobile para o aplicativo **native-demo-app** do WebDriverIO, utilizando **Appium** com foco em dispositivos **Android**.

## Tecnologias e Ferramentas

| Tecnologia | Versão | Finalidade |
|---|---|---|
| JavaScript (ES2021) | - | Linguagem de programação |
| WebDriverIO | v9 | Framework de automação |
| Appium | v2 | Automação mobile |
| UiAutomator2 | v3 | Driver Android |
| Mocha | - | Gerenciador de testes (BDD) |
| Chai | v4 | Biblioteca de assertions |
| Allure Report | - | Relatórios detalhados |
| GitLab CI/CD | - | Integração contínua |

## Estrutura do Projeto

```
├── config/
│   ├── wdio.shared.conf.js       # Configuração compartilhada
│   └── wdio.android.conf.js      # Configuração Android
├── test/
│   ├── data/
│   │   ├── credentials.csv       # Dados de login (data-driven CSV)
│   │   └── formData.json         # Dados de formulários e cadastro
│   ├── helpers/
│   │   ├── Gestures.js           # Gestos mobile (swipe, scroll, drag)
│   │   ├── WaitHelper.js         # Esperas explícitas (sem pause)
│   │   └── DataLoader.js         # Carregador de dados CSV/JSON
│   ├── pages/
│   │   ├── BasePage.js           # Classe base Page Object
│   │   ├── HomePage.js           # Tela inicial
│   │   ├── LoginPage.js          # Tela de login
│   │   ├── SignUpPage.js         # Tela de cadastro
│   │   ├── FormsPage.js          # Tela de formulários
│   │   ├── SwipePage.js          # Tela de swipe/carrossel
│   │   ├── DragPage.js           # Tela de drag and drop
│   │   ├── WebViewPage.js        # Tela WebView
│   │   └── components/
│   │       ├── BottomNav.js      # Navegação inferior
│   │       └── AlertDialog.js    # Alertas nativos
│   └── specs/
│       ├── login.spec.js         # Testes de login
│       ├── signup.spec.js        # Testes de cadastro
│       ├── navigation.spec.js    # Testes de navegação
│       ├── forms.spec.js         # Testes de formulários
│       ├── swipe.spec.js         # Testes de swipe
│       ├── drag.spec.js          # Testes de drag and drop
│       ├── webview.spec.js       # Testes de WebView
│       └── e2e.spec.js           # Testes end-to-end
├── apps/                         # APK do aplicativo
├── screenshots/                  # Capturas de tela automáticas
├── .gitlab-ci.yml                # Pipeline CI/CD
└── package.json
```

## Pré-requisitos

1. **Node.js** v18 ou superior
2. **Java JDK** 11 ou superior (para Android SDK)
3. **Android Studio** com:
   - Android SDK instalado
   - AVD (Android Virtual Device) configurado
   - Variáveis de ambiente: `ANDROID_HOME`, `JAVA_HOME`
4. **Appium** v2 (instalado via dependência do projeto)

### Configuração do Emulador

Crie um AVD com as seguintes especificações (ou ajuste via variável de ambiente):

- **Device**: Pixel 7
- **API Level**: 34 (Android 14)
- **System Image**: Google APIs x86_64

Para usar um dispositivo diferente, defina a variável `DEVICE_NAME`:
```bash
export DEVICE_NAME="Pixel_6_API_33"
```

## Instalação

```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd carrefour-desafio-automacao-mobile

# Instalar dependências
npm install

# Baixar o APK para a pasta apps/
# Colocar o arquivo android.wdio.native.app.v2.2.0.apk em ./apps/
```

## Execução dos Testes

```bash
# Executar todos os testes
npm run android

# Executar apenas testes de smoke
npm run android:smoke

# Executar testes de regressão
npm run android:regression

# Executar testes end-to-end
npm run android:e2e
```

## Relatórios

O projeto utiliza **Allure Report** com captura automática de screenshots em falhas.

```bash
# Gerar e abrir o relatório
npm run report

# Ou separadamente:
npm run report:generate
npm run report:open
```

O relatório inclui:
- Resumo dos testes executados (passed/failed/skipped)
- Screenshots automáticos de falhas
- Logs de execução por etapa
- Informações do ambiente de teste (plataforma, device, app)

## Cenários de Teste

O projeto cobre **10+ cenários** organizados em 8 suítes:

| # | Cenário | Tipo | Área |
|---|---------|------|------|
| 1 | Login com credenciais válidas | @smoke | Login |
| 2 | Validação do alerta de sucesso no login | @regression | Login |
| 3 | Login com email inválido (data-driven CSV) | @regression | Erro |
| 4 | Login com senha inválida (data-driven CSV) | @regression | Erro |
| 5 | Cadastro com dados válidos | @smoke | Cadastro |
| 6 | Cadastro com validações de erro (data-driven JSON) | @regression | Erro |
| 7 | Verificação da Home Screen ao iniciar | @smoke | Navegação |
| 8 | Navegação entre todas as abas | @smoke | Navegação |
| 9 | Preenchimento de formulário (data-driven JSON) | @regression | Formulário |
| 10 | Toggle do switch ON/OFF | @smoke | Formulário |
| 11 | Swipe horizontal no carrossel | @smoke | Swipe |
| 12 | Scroll vertical até conteúdo oculto | @regression | Swipe |
| 13 | Drag and drop de peças do puzzle | @smoke | Drag |
| 14 | WebView - carregamento e título | @smoke | WebView |
| 15 | Jornada completa E2E | @e2e | E2E |

## Abordagem Técnica

### Page Object Pattern
Cada tela do app é representada por uma classe que herda de `BasePage`, encapsulando seletores e ações.

### Esperas Explícitas (Zero `pause`)
O projeto utiliza exclusivamente `waitForDisplayed`, `waitForExist` e `waitUntil` com condições reais. Nenhum `driver.pause()` é utilizado, garantindo testes mais rápidos e confiáveis.

### Gestos via Appium Mobile Commands
Swipe, scroll e drag utilizam os comandos nativos do Appium (`mobile: swipeGesture`, `mobile: scrollGesture`, `mobile: dragGesture`) ao invés de W3C Actions, proporcionando maior confiabilidade no UiAutomator2.

### WebView com Polling
A troca de contexto para WebView utiliza `waitUntil` para verificar a disponibilidade do contexto WEBVIEW, sem delays fixos.

### Data-Driven Testing
- **CSV** (`credentials.csv`) para cenários de login parametrizados
- **JSON** (`formData.json`) para dados de formulários e cadastro

## CI/CD (GitLab)

O pipeline `.gitlab-ci.yml` executa automaticamente:

1. **Install** → Instala dependências
2. **Lint** → Validação de código
3. **Smoke Tests** → Testes críticos em emulador Android
4. **Regression Tests** → Suite completa
5. **Report** → Geração do Allure Report como artefato

O pipeline é disparado em **merge requests** e **pushes para main**.

## Limpeza

```bash
# Limpar relatórios e screenshots
npm run clean
```
