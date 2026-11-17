# GTG · Grease the Groove

**Força todos os dias, sem equipamento e sem chegar à falha.**

GTG é um app Android que transforma o método *Grease the Groove* em um plano diário de 30 dias. Em vez de um treino longo, você faz várias séries curtas de flexão e agachamento ao longo do dia, sempre com folga, e o app avisa a hora de cada uma. Junto vem um bloco de core de 6 minutos à noite e uma progressão de corrida que leva de 5 minutos a 25 minutos contínuos.

O plano conversa com a sua academia: siga a sua divisão (costas, peito, pernas, braços, ombros) e o GTG reduz a flexão no dia de peito, tira o agachamento no dia de perna e reorganiza tudo quando você pula um dia.

## Recursos
- **Hoje**: o treino do dia, com uma bolinha para marcar cada série
- **Exercícios animados**: passo a passo, erros comuns e versões mais fácil e mais difícil de cada movimento
- **Plano de 30 dias**: grade completa e retestes nos dias 15 e 30, que recalculam as séries
- **Lembretes**: notificações no horário de cada série, do bloco da noite e da corrida, com horários editáveis
- **Funciona offline**: tudo fica salvo no celular

## Instalar
1. No celular, abra a aba **Releases** deste repositório.
2. Baixe o arquivo `GTG-vN.apk` mais recente.
3. Toque no arquivo e permita "instalar apps desconhecidos", se o Android pedir.
4. Abra o app, vá em **Lembretes** e toque em **Ativar lembretes**.

Cada alteração na branch `main` gera um APK novo automaticamente.

## Desenvolvimento
Feito com [Capacitor](https://capacitorjs.com). `src/data.js` tem os exercícios e o plano, `src/app.js` as telas e os lembretes, e `www/` o HTML e o CSS. `npm run build` gera o app web e `npx cap sync android` copia para o projeto Android.

> O GTG não substitui orientação médica. Se você usa medicação para perda de peso ou tem alguma condição de saúde, converse com seu médico antes de aumentar a carga de treino.
