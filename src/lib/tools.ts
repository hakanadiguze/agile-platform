// src/lib/tools.ts
// 7 aracın kayıt defteri — URL, icon, açıklama, renk

export interface AgileToolDef {
  id:            string
  name:          string
  description:   string
  icon:          string          // emoji
  color:         string          // tailwind bg class
  accent:        string          // tailwind text class
  githubRepo:    string          // github.com/hakanadiguzel/<repo>
  liveUrl:       string          // GitHub Pages URL (araç burada yaşıyor)
  category:      'team' | 'pi' | 'inspect'
  contextParams: ('teamId' | 'artId' | 'sprintId' | 'piId')[]
}

export const TOOLS: AgileToolDef[] = [
  {
    id:            'retroboard',
    name:          'Retro Board',
    description:   'Sprint retrospektif toplantılarını kolaylaştır. What went well, what didn\'t, what to improve.',
    icon:          '🔁',
    color:         'bg-brand-50',
    accent:        'text-brand-700',
    githubRepo:    'retroboard',
    liveUrl:       'https://hakanadiguzel.github.io/retroboard',
    category:      'team',
    contextParams: ['teamId', 'sprintId'],
  },
  {
    id:            'health',
    name:          'Team Health Check',
    description:   'Takımın sağlık durumunu ölç. Spotify Squad Health Check modeli ile radar görünümü.',
    icon:          '❤️',
    color:         'bg-red-50',
    accent:        'text-red-700',
    githubRepo:    'health',
    liveUrl:       '/tools/health/',
    category:      'team',
    contextParams: ['teamId'],
  },
  {
    id:            'lean-cafe',
    name:          'Lean Café',
    description:   'Yapılandırılmış toplantı formatı. Katılımcılar konu önerir, oylama yapar, zamanlı tartışır.',
    icon:          '☕',
    color:         'bg-amber-50',
    accent:        'text-amber-800',
    githubRepo:    'lean-cafe',
    liveUrl:       'https://hakanadiguzel.github.io/lean-cafe',
    category:      'team',
    contextParams: ['teamId'],
  },
  {
    id:            'feedpost',
    name:          'Feed Post',
    description:   'Gerçek zamanlı görsel geri bildirim aracı. Post-it\'ler, emoji puanlaması ve upvote ile anlık geri bildirim topla.',
    icon:          '📢',
    color:         'bg-teal-50',
    accent:        'text-teal-700',
    githubRepo:    'feedpost',
    liveUrl:       'https://hakanadiguzel.github.io/feedpost',
    category:      'team',
    contextParams: ['teamId'],
  },
  {
    id:            'planning-poker',
    name:          'Planning Poker',
    description:   'Takımınla gerçek zamanlı Scrum estimasyonu. Story point belirleme sürecini eğlenceli hale getir.',
    icon:          '🃏',
    color:         'bg-indigo-50',
    accent:        'text-indigo-700',
    githubRepo:    'planning-poker',
    liveUrl:       'https://hakanadiguzel.github.io/planning-poker',
    category:      'team',
    contextParams: ['teamId', 'sprintId'],
  },
  {
    id:            'pi-confidence-vote',
    name:          'PI Confidence Vote',
    description:   'SAFe PI Planning\'in sonunda ART güven oylaması yap. Anlık sonuçları görsel olarak göster.',
    icon:          '🗳️',
    color:         'bg-purple-50',
    accent:        'text-purple-700',
    githubRepo:    'pi-confidence-vote',
    liveUrl:       'https://hakanadiguzel.github.io/pi-confidence-vote',
    category:      'pi',
    contextParams: ['artId', 'piId'],
  },
  {
    id:            'psm-exam-simulator',
    name:          'PSM Exam Simulator',
    description:   'Professional Scrum Master sınav hazırlığı. 300 soru bankası ve anlık geri bildirim.',
    icon:          '📝',
    color:         'bg-blue-50',
    accent:        'text-blue-700',
    githubRepo:    'psm-exam-simulator',
    liveUrl:       'https://hakanadiguzel.github.io/psm-exam-simulator',
    category:      'inspect',
    contextParams: [],
  },
]

export const TOOL_BY_ID = Object.fromEntries(TOOLS.map(t => [t.id, t]))
