import type { PartialMessages } from '../index';

// Português (Portuguese). Resolvido a partir de pt, pt-BR, pt-PT, etc.
const pt: PartialMessages = {
  common: {
    start: 'Começar',
    ok: 'OK',
    cancel: 'Cancelar',
    back: 'Voltar',
    resetConfirm:
      'Apagar todo o progresso (carimbos, cadastro, histórico de trocas) e recomeçar do zero?',
    resetButton: '(Teste) Redefinir o progresso e recomeçar',
  },
  header: {
    line1: 'Festival',
    line2: 'Rali de carimbos',
  },
  notice: {
    iconAlt: 'Ícone do rali de carimbos do festival',
    title: 'Avisos',
    safetyHeading: 'Recomendação de segurança',
    safetyBody:
      'O recinto do santuário costuma ficar cheio. Preste atenção ao redor, não corra e não esbarre em outros visitantes. Andar olhando o celular é muito perigoso: pare antes de usar o aplicativo.',
    privacyHeading: 'Sobre os dados pessoais',
    privacyBody:
      'As informações cadastradas são usadas apenas para a organização deste evento, a confirmação da troca de brindes e para fins estatísticos. Não são usadas para outros fins nem compartilhadas com terceiros.',
    otherHeading: 'Outros',
    otherBody:
      'Os brindes são limitados e a troca pode terminar assim que acabarem. Agradecemos a compreensão.',
  },
  howto: {
    title: 'Como jogar',
    imagePlaceholder: 'Imagem',
    steps: [
      {
        title: 'Encontre os QR codes no recinto!',
        body: 'Há QR codes do rali escondidos por todo o recinto do santuário. Vá procurá-los!',
      },
      {
        title: 'Escaneie com a câmera!',
        body: 'Basta apontar a câmera do aplicativo para o QR code. Depois de lido, a verificação é automática.',
      },
      {
        title: 'Junte os caracteres!',
        body: 'Cada leitura dá um caractere. Junte 7 para completar a frase secreta.',
      },
      {
        title: 'Complete a frase e troque!',
        body: 'Com os 7, vá ao pavilhão principal. Mostre a tela do aplicativo à equipe para receber seu brinde!',
      },
    ],
  },
  register: {
    title: 'Cadastro de participante',
    nicknameLabel: 'Apelido (opcional)',
    nicknamePlaceholder: 'ex.: Festeiro',
    genderLabel: 'Gênero',
    ageLabel: 'Faixa etária',
    required: 'Obrigatório',
    selectPlaceholder: 'Selecione',
    genderError: 'Selecione o gênero',
    ageError: 'Selecione a faixa etária',
    submit: 'Participar',
    gender: { male: 'Masculino', female: 'Feminino', other: 'Outro' },
    age: {
      student: 'Estudante',
      '10s': 'Adolescente',
      '20s': '20-29',
      '30s': '30-39',
      '40s': '40-49',
      '50s': '50-59',
      '60plus': '60 ou mais',
    },
  },
  rally: {
    countLabel: 'Carimbos obtidos',
    completeBanner1: 'Você juntou os 7 carimbos!',
    completeBanner2: 'Pense na ordem certa e encare o desafio da frase.',
    phraseSolvedBanner: 'Frase completada! Troque no pavilhão principal',
    exchangedBanner: 'A troca do brinde foi concluída',
    challengeCta: 'Encarar o desafio',
    exchangeCta: 'Ir para a troca de brinde',
    cameraCta: '📷 Ativar a câmera',
  },
  camera: {
    instruction: 'Coloque o QR code dentro do quadro',
    permissionDenied:
      'Sem acesso à câmera. Permita a câmera nas configurações do navegador.',
    duplicate: 'Você já tem este QR code',
    invalid: 'Este QR code não faz parte do rali',
    demoScanButton: 'Carregar QR de demonstração',
    debugLabel: 'Depuração (oculto em produção): conceder um carimbo sem a câmera',
  },
  reveal: {
    title: 'Caractere obtido!',
    stampGet: 'CARIMBO OBTIDO!',
    close: 'Fechar',
  },
  challenge: {
    title: 'Desafio da frase',
    instruction: 'Reordene os 7 caracteres para formar a frase correta!',
    wrong: 'Que pena, não é a resposta certa. Tente de novo!',
    available: 'Seus caracteres (toque para posicionar)',
    checkCta: 'Verificar esta ordem',
    exchangeCta: 'Ir para a troca de brinde',
    correctTitle: 'Correto! Completo!',
    correctBody: 'Parabéns! Você completou a frase.',
  },
  exchange: {
    phraseLabel: 'Frase completada',
    title1: 'Rali de carimbos',
    title2: 'Prêmio de conclusão — Balcão de troca',
    staffNotice1: 'A troca do brinde deve ser feita pela equipe.',
    staffNotice2: 'Entregue seu telefone a um membro da equipe.',
    exchangeButton: 'Trocar',
    done: 'Trocado',
    confirmQuestion: 'Tem certeza de que deseja trocar?',
    staffHeading: 'Somente para a equipe',
    staffPasscodePlaceholder: 'Senha da equipe',
    staffPasscodeError: 'Senha incorreta',
  },
};

export default pt;
