// Exercícios: poses A e B com a mesma estrutura de caminho, para a animação em loop.
export const EX = [
  {
    id: 'flexao', name: 'Flexão', dur: 2.4,
    ground: true,
    A: { h: [46, 50], d: 'M56 57 L182 100 M62 61 L62 82 L62 104' },
    B: { h: [44, 80], d: 'M54 86 L182 100 M62 88 L46 98 L62 104' },
    muscles: 'Peito, tríceps, ombro anterior e abdômen',
    desc: 'O exercício principal do seu Grease the Groove. Séries curtas, perfeitas, várias vezes ao dia.',
    steps: ['Mãos um pouco mais abertas que os ombros, dedos para a frente', 'Corpo reto da cabeça ao calcanhar: aperte glúteo e abdômen', 'Desça até o peito quase encostar no chão, cotovelos a cerca de 45° do corpo', 'Empurre o chão até estender os braços'],
    errors: ['Quadril caindo ou empinado', 'Cotovelos abertos a 90° (sobrecarrega o ombro)', 'Descer só a cabeça, sem levar o peito'],
    easier: 'Mãos no sofá ou na cadeira (flexão inclinada)',
    harder: 'Pés no sofá (flexão declinada) ou descida em 3 segundos'
  },
  {
    id: 'agachamento', name: 'Agachamento', dur: 2.6,
    ground: true,
    A: { h: [112, 18], d: 'M112 28 L112 64 L114 84 L116 104 M112 38 L114 62' },
    B: { h: [114, 40], d: 'M110 50 L94 76 L128 80 L116 104 M110 56 L150 58' },
    muscles: 'Quadríceps, glúteos e posterior de coxa',
    desc: 'Feito junto com as séries de flexão. Nos dias de perna na academia, fica de fora.',
    steps: ['Pés na largura dos ombros, pontas levemente para fora', 'Leve o quadril para trás como se fosse sentar numa cadeira', 'Desça até a coxa ficar paralela ao chão, braços à frente para equilibrar', 'Suba empurrando o chão com o pé inteiro'],
    errors: ['Calcanhar saindo do chão', 'Joelhos entrando para dentro', 'Costas arredondadas na descida'],
    easier: 'Sentar e levantar de uma cadeira',
    harder: 'Agachamento búlgaro (pé de trás no sofá) ou pausa de 2 s embaixo'
  },
  {
    id: 'panturrilha', name: 'Panturrilha no degrau', dur: 2.2,
    step: true,
    A: { h: [110, 22], d: 'M110 32 L110 60 L110 84 L100 90 M110 84 L124 92 M110 40 L100 60' },
    B: { h: [110, 12], d: 'M110 22 L110 50 L110 74 L104 82 M110 74 L124 92 M110 30 L100 50' },
    muscles: 'Panturrilha e tendão de Aquiles',
    desc: 'Protege canela e tendão para aguentar a progressão da corrida.',
    steps: ['Ponta dos pés na borda de um degrau, segure na parede ou corrimão', 'Suba o máximo na ponta dos pés', 'Desça devagar, em 3 segundos, até o calcanhar ficar abaixo do degrau', 'Repita sem pressa'],
    errors: ['Descer rápido demais', 'Dobrar os joelhos para ajudar'],
    easier: 'No chão plano, sem degrau',
    harder: 'Uma perna de cada vez'
  },
  {
    id: 'prancha', name: 'Prancha', dur: 3,
    ground: true,
    A: { h: [42, 68], d: 'M52 72 L188 100 M60 76 L60 100 L88 100' },
    B: { h: [42, 66], d: 'M52 70 L188 100 M60 74 L60 100 L88 100' },
    muscles: 'Abdômen, lombar e ombros',
    desc: 'Isometria para o core. Faz parte do bloco da noite.',
    steps: ['Antebraços no chão, cotovelos logo abaixo dos ombros', 'Pernas estendidas, apoio na ponta dos pés', 'Aperte glúteo e abdômen, quadril alinhado com o tronco', 'Respire normalmente e segure o tempo pedido'],
    errors: ['Quadril alto demais ou caindo', 'Prender a respiração', 'Olhar para a frente (tensiona o pescoço)'],
    easier: 'Joelhos no chão',
    harder: 'Tirar um pé do chão alternando'
  },
  {
    id: 'deadbug', name: 'Dead bug', dur: 3,
    ground: true,
    A: { h: [48, 90], d: 'M58 94 L132 94 M72 94 L72 50 M72 94 L74 50 M132 94 L132 62 L158 62 M132 94 L134 62 L160 62' },
    B: { h: [48, 90], d: 'M58 94 L132 94 M72 94 L72 50 M72 94 L32 74 M132 94 L132 62 L158 62 M132 94 L156 90 L182 86' },
    muscles: 'Abdômen profundo e estabilidade da lombar',
    desc: 'Ensina o abdômen a proteger a coluna. Ótimo para quem corre.',
    steps: ['Deitado de costas, braços apontando para o teto', 'Joelhos dobrados a 90°, canelas paralelas ao chão', 'Estique devagar um braço para trás e a perna oposta para a frente', 'Volte ao centro e troque o lado'],
    errors: ['Lombar descolando do chão', 'Fazer rápido, sem controle'],
    easier: 'Mover só as pernas',
    harder: 'Movimento mais lento, 4 segundos para cada lado'
  },
  {
    id: 'birddog', name: 'Bird dog', dur: 3,
    ground: true,
    A: { h: [50, 64], d: 'M62 70 L122 70 M64 70 L64 104 M64 70 L66 104 M122 70 L122 104 L146 104 M122 70 L124 104 L148 104' },
    B: { h: [50, 64], d: 'M62 70 L122 70 M64 70 L64 104 M64 70 L22 60 M122 70 L122 104 L146 104 M122 70 L152 67 L182 64' },
    muscles: 'Lombar, glúteos e abdômen',
    desc: 'Estabilidade do tronco e do quadril, com pouco impacto.',
    steps: ['De quatro apoios: mãos abaixo dos ombros, joelhos abaixo do quadril', 'Estique um braço à frente e a perna oposta para trás', 'Segure 2 segundos com o quadril parado', 'Volte e troque o lado'],
    errors: ['Girar o quadril para levantar mais a perna', 'Arquear a lombar'],
    easier: 'Mover só o braço ou só a perna',
    harder: 'Encostar cotovelo e joelho embaixo do corpo entre as repetições'
  },
  {
    id: 'alongamento', name: 'Alongamento na parede', dur: 4,
    ground: true, wall: true,
    A: { h: [146, 26], d: 'M142 36 L112 70 L134 84 L136 104 M112 70 L62 104 M140 44 L176 40' },
    B: { h: [150, 30], d: 'M146 40 L116 72 L138 86 L136 104 M116 72 L62 104 M144 48 L176 42' },
    muscles: 'Panturrilha, flexor do quadril e posterior de coxa',
    desc: 'Fecha o bloco da noite. Respiração lenta, sem dor.',
    steps: ['Mãos na parede, uma perna à frente dobrada e a de trás esticada', 'Calcanhar de trás no chão: 30 s cada perna', 'Depois: afundo com joelho de trás no chão para o flexor do quadril, 30 s cada lado', 'Por fim: perna esticada num degrau, tronco à frente, 30 s cada lado'],
    errors: ['Forçar até doer', 'Balançar o corpo'],
    easier: 'Menos amplitude',
    harder: 'Segurar 45 s'
  },
  {
    id: 'corrida', name: 'Corrida leve', dur: 0.9, run: true,
    ground: true,
    A: { h: [112, 18], d: 'M110 28 L100 62 L78 80 L62 74 M100 62 L126 78 L118 104 M108 38 L126 50 L136 38 M108 38 L92 54 L82 46' },
    B: { h: [112, 15], d: 'M110 25 L100 59 L120 78 L112 102 M100 59 L84 80 L68 76 M108 35 L92 51 L82 43 M108 35 L124 48 L134 36' },
    muscles: 'Coração e pulmão, pernas inteiras',
    desc: 'Ritmo de conversa sempre. O objetivo é chegar ao dia 30 correndo 22 a 25 minutos sem parar.',
    steps: ['5 min de caminhada rápida para aquecer', 'Corra devagar: precisa conseguir falar frases inteiras', 'Passos curtos, pé aterrissando embaixo do corpo', '3 a 5 min de caminhada para desaquecer'],
    errors: ['Correr rápido demais (o erro número 1)', 'Passada longa batendo o calcanhar à frente do corpo', 'Ignorar dor na canela'],
    easier: 'Blocos de 2 min correndo e 1 min andando',
    harder: 'No dia 27: 4 acelerações de 20 s no fim'
  }
];

export const SEQ = ['Costas', 'Peito', 'Pernas', 'Braços', 'Ombros'];
export const GYM_OPTS = [...SEQ, 'Folga', 'Sem academia'];

// Corrida por dia: r = corrida (min), w = caminhada, wl = caminhada leve, x = descanso, t = teste
export const RUN = [['r',5],['w'],['r',6],['r',7],['x'],['r',8],['w'],['r',8],['w'],['r',9],['r',10],['x'],['r',11],['w'],['r',13],['w'],['r',15],['r',16],['x'],['r',12,'bem leve'],['w'],['r',17],['w'],['r',18],['r',20],['x'],['wl'],['r',15,'+ 4 acelerações de 20 s'],['wl'],['t']];

export const SQUAT = [[3,10],[3,12],[4,12],[4,15]];
export const SETS = [5,6,7,8];

export const DEFAULTS = {
  start: '2026-11-18',
  max0: 13,
  max15: null,
  max30: null,
  anchorGym: 'Costas', // treino do dia anterior ao início
  slots: [
    ['07:30',1],['09:30',1],['11:00',1],['12:30',1],['14:30',1],['16:00',1],['17:30',1],['19:00',1]
  ],
  night: ['21:00',1],
  run: ['06:30',1],
  reminders: 0
};
