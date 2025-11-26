import { Planning } from '../types'

export const predefinedPlans: Record<string, Planning> = {
  'chapitre-1-nombres-et-calculs': {
    id: 'chapitre-1-nombres-et-calculs',
    chapterId: 'chapitre-1-nombres-et-calculs',
    chapterName: 'Chapitre 1 – Nombres et calculs',
    linkedCourseIds: [],
    linkedImages: [],
    createdAt: new Date().toISOString(),
    days: [
      {
        dayNum: 1,
        date: new Date().toISOString(),
        tasks: [
          'Revoir les définitions de base : nombres entiers, décimaux, fractions',
          'Relire le cours sur les opérations fondamentales (+, -, ×, ÷)',
          'Faire les exercices 1 à 5 page 23',
        ],
        completed: false,
      },
      {
        dayNum: 2,
        date: new Date(Date.now() + 86400000).toISOString(),
        tasks: [
          'Approfondir les propriétés des nombres premiers',
          'Réviser la décomposition en facteurs premiers',
          'Exercices 10 à 15 page 25',
          'Quiz en ligne sur les nombres premiers',
        ],
        completed: false,
      },
      {
        dayNum: 3,
        date: new Date(Date.now() + 86400000 * 2).toISOString(),
        tasks: [
          'Réviser les fractions : simplification, addition, multiplication',
          'Faire les exercices 20 à 25 page 28',
          'Revoir les erreurs du dernier contrôle',
        ],
        completed: false,
      },
      {
        dayNum: 4,
        date: new Date(Date.now() + 86400000 * 3).toISOString(),
        tasks: [
          'Approfondir les nombres décimaux et arrondis',
          'Comprendre les puissances de 10',
          'Exercices 30 à 35 page 32',
          'Fiche de synthèse : récapituler toutes les règles',
        ],
        completed: false,
      },
      {
        dayNum: 5,
        date: new Date(Date.now() + 86400000 * 4).toISOString(),
        tasks: [
          'Faire un contrôle blanc chronométré (45 min)',
          'Corriger et analyser les erreurs',
          'Identifier les points faibles à revoir',
        ],
        completed: false,
      },
      {
        dayNum: 6,
        date: new Date(Date.now() + 86400000 * 5).toISOString(),
        tasks: [
          'Réviser les points faibles identifiés hier',
          'Refaire les exercices difficiles',
          'Créer des fiches aide-mémoire',
          'Exercices supplémentaires au choix',
        ],
        completed: false,
      },
      {
        dayNum: 7,
        date: new Date(Date.now() + 86400000 * 6).toISOString(),
        tasks: [
          'Relecture rapide de toutes les fiches',
          'Révision des formules clés',
          'Se reposer et rester confiant(e) !',
        ],
        completed: false,
      },
    ],
  },
}

export const initialLibrary = {
  tree: [
    {
      id: 'math-subject',
      name: 'Mathématiques',
      type: 'folder' as const,
      children: [
        {
          id: 'ch1-folder',
          name: 'Chapitre 1 – Nombres et calculs',
          type: 'folder' as const,
          children: [
            {
              id: 'course-intro-nombres',
              name: 'Introduction aux nombres',
              type: 'course' as const,
              course: {
                id: 'course-intro-nombres',
                title: 'Introduction aux nombres',
                images: [],
                content: `# Introduction aux nombres

## Les différents types de nombres

### Nombres entiers naturels (ℕ)
Les nombres entiers naturels sont les nombres positifs ou nuls : 0, 1, 2, 3, 4, 5...

**Exemples d'utilisation :**
- Compter des objets (5 pommes, 10 élèves)
- Numérotation (page 42, exercice 7)

### Nombres entiers relatifs (ℤ)
Les nombres entiers relatifs incluent les nombres positifs, négatifs et zéro : ..., -3, -2, -1, 0, 1, 2, 3, ...

**Exemples d'utilisation :**
- Températures (-5°C, +20°C)
- Altitude (montagne +2000m, mer 0m, sous-marin -100m)
- Dettes et gains (+50€, -30€)

### Nombres décimaux (𝔻)
Les nombres décimaux possèdent une partie entière et une partie décimale finie : 3.14, -0.5, 12.75

**Propriétés :**
- Peuvent s'écrire sous forme de fraction décimale
- Exemple : 2.5 = 25/10 = 5/2

### Nombres rationnels (ℚ)
Les nombres rationnels sont ceux qui peuvent s'écrire sous forme de fraction a/b où a et b sont des entiers (b ≠ 0).

**Exemples :**
- 1/2, 3/4, -5/7, 22/7

## Opérations fondamentales

### Addition et soustraction
- Commutativité : a + b = b + a
- Associativité : (a + b) + c = a + (b + c)
- Élément neutre : a + 0 = a

### Multiplication
- Commutativité : a × b = b × a
- Associativité : (a × b) × c = a × (b × c)
- Élément neutre : a × 1 = a
- Distributivité : a × (b + c) = (a × b) + (a × c)

### Division
- a ÷ b = a/b (avec b ≠ 0)
- La division par zéro est impossible !

## Nombres premiers

Un nombre premier est un nombre entier naturel qui n'a que deux diviseurs : 1 et lui-même.

**Premiers nombres premiers :** 2, 3, 5, 7, 11, 13, 17, 19, 23, 29...

**Propriété :** 2 est le seul nombre premier pair.

### Décomposition en facteurs premiers
Tout nombre entier supérieur à 1 peut se décomposer de manière unique en produit de nombres premiers.

**Exemple :**
- 60 = 2 × 2 × 3 × 5 = 2² × 3 × 5
- 180 = 2² × 3² × 5

## Exercices d'application

**Exercice 1 :** Décomposer 84 en produit de facteurs premiers.

**Exercice 2 :** Calculer : (-3) + 7 - (-5) + (-2)

**Exercice 3 :** Simplifier la fraction 48/72

**Exercice 4 :** Ranger dans l'ordre croissant : -5, 3, -1, 0, 2.5, -3.2

---

*Ce cours constitue une base essentielle pour toute la suite du programme de mathématiques.*`,
                pdfs: [],
              },
            },
          ],
        },
      ],
    },
  ],
}
