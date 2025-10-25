# Telemetry App - React Native

Um aplicativo de telemetria em tempo real desenvolvido em **React Native + Expo**, mostrando dados de localização, velocidade, aceleração e direção do usuário.

O projeto foi criado como um **technical challenge** para demonstrar habilidades de desenvolvimento mobile, gerenciamento de estado e integração com sensores do dispositivo.

---

## 📝 Funcionalidades

- Mostrar a **localização atual** no mapa (Google Maps)
- Exibir **velocidade** baseada no GPS
- Exibir **aceleração** baseada no acelerômetro
- Mostrar a **direção aproximada** (heading/bússola)
- Botão para **iniciar e parar a coleta de dados**

---

## ⚙ Tecnologias e Bibliotecas

- **React Native** + **Expo**
- **TypeScript**
- **expo-maps** (Mapa)
- **expo-location** (GPS e heading)
- **expo-sensors** (acelerômetro)
- **React Context API** (gerenciamento centralizado de estado)
- **ESLint** + **Prettier** (lint e formatação)

---

## 📦 Estrutura do Projeto

```
src/
├─ components/          # Componentes reutilizáveis (Map, SpeedDisplay, HeadingDisplay, etc.)
├─ context/             # TelemetryContext
├─ screens/             # Telas do app
```

---

## 🚀 Como rodar o projeto

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/telemetry-app.git
cd telemetry-app
```

2. Instale as dependências:

```bash
yarn install
# ou
npm install
```

3. Rode o app no Expo:

```bash
yarn start
# ou
npm start
```

4. Abra no emulador ou dispositivo físico via QR code do Expo Go.

> ⚠️ É necessário conceder **permissões de localização e sensores** para o app funcionar corretamente.

## 🔑 Variáveis de ambiente

Crie um arquivo `.env` baseado em `.env.example`:

```
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

---

## 💡 Observações

- Todo o estado de telemetria (GPS e acelerômetro) é gerenciado pelo **TelemetryContext**, permitindo que qualquer componente acesse os dados em tempo real.
- O design é minimalista para focar na **funcionalidade e arquitetura limpa**.
- O app demonstra boas práticas de **separação de responsabilidades**, **hooks personalizados** e **Context API**.

---

## 📄 License

MIT License
