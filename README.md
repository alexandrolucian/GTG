# Treino 30

App Android para 30 dias de Grease the Groove (flexão + agachamento), bloco de core à noite e progressão de corrida, ajustado à sequência da academia (costas, peito, pernas, braços, ombros).

## Instalar no celular
1. Abra a aba **Releases** deste repositório no celular.
2. Baixe o arquivo `Treino30-vN.apk` da versão mais recente.
3. Toque no arquivo e permita "instalar apps desconhecidos" para o navegador, se o Android pedir.
4. Abra o app, vá em **Lembretes** e toque em **Ativar lembretes**.

Cada alteração enviada para a branch `main` gera um APK novo automaticamente (GitHub Actions).

## Desenvolvimento
- `src/` código do app (data.js = exercícios e plano, app.js = telas e lembretes)
- `www/` HTML e CSS
- `npm run build` gera `www/app.js`; `npx cap sync android` copia para o projeto Android
