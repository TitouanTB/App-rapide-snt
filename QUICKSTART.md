# Guide de Démarrage Rapide ⚡

## Installation et lancement (30 secondes)

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer l'application
npm run dev
```

Ouvrez votre navigateur sur `http://localhost:5173` 🚀

## Premier usage

### 1️⃣ Explorez la Bibliothèque
- Cliquez sur l'onglet **Bibliothèque**
- Dépliez "Mathématiques" → "Chapitre 1"
- Cliquez sur "Introduction aux nombres"
- Testez l'upload de PDF en glissant-déposant un fichier

### 2️⃣ Obtenez un planning de révision
- Cliquez sur l'onglet **Assistant**
- Tapez : `contrôle sur le chapitre 1`
- Appuyez sur Entrée
- Vous êtes automatiquement redirigé vers l'onglet Planning !

### 3️⃣ Suivez votre progression
- Dans l'onglet **Planning**, voyez vos 7 jours de révision
- Cochez la checkbox d'un jour pour le marquer comme terminé
- Regardez la barre de progression augmenter
- Complétez tous les jours pour voir les confettis ! 🎉

## Ajouter du contenu

### Créer un dossier
1. Allez dans **Bibliothèque**
2. Cliquez sur le bouton "+ Dossier"
3. Entrez le nom et validez

### Créer un cours
1. Dépliez un dossier
2. Cliquez sur l'icône "+" à côté du dossier
3. Entrez titre et contenu
4. Validez

### Ajouter un PDF à un cours
1. Sélectionnez un cours
2. Glissez-déposez un PDF dans la zone prévue
3. Le PDF est automatiquement attaché

## Commandes utiles

```bash
# Développement
npm run dev          # Lance le serveur de développement

# Production
npm run build        # Compile l'application
npm run preview      # Prévisualise le build

# Qualité du code
npm run lint         # Vérifie le code avec ESLint
```

## Déploiement sur Vercel

```bash
# Option 1: Interface web
# 1. Pushez votre code sur GitHub
# 2. Importez le projet sur vercel.com
# 3. Déployez (configuration auto-détectée)

# Option 2: CLI Vercel
npm i -g vercel
vercel
```

## Personnalisation rapide

### Ajouter un nouveau planning

Éditez `src/data/plans.ts` :

```typescript
'chapitre-2': {
  chapterId: 'chapitre-2',
  chapterName: 'Chapitre 2 – Votre titre',
  days: [
    {
      dayNum: 1,
      date: new Date().toISOString(),
      tasks: ['Tâche 1', 'Tâche 2'],
      completed: false,
    },
    // ... répétez pour 7 jours
  ],
}
```

Puis mettez à jour la détection dans `src/components/AssistantTab.tsx` ligne ~30.

## Structure du projet

```
src/
├── components/          # Composants React
│   ├── LibraryTab.tsx  # Gestion bibliothèque
│   ├── PlanningTab.tsx # Affichage planning
│   └── AssistantTab.tsx # Chat assistant
├── data/
│   └── plans.ts        # Plannings pré-définis
├── hooks/
│   └── useLocalStorage.ts # Hook localStorage
├── types.ts            # Types TypeScript
├── App.tsx             # Composant principal
└── main.tsx            # Point d'entrée
```

## Résolution de problèmes

**L'app ne démarre pas :**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Les données ne se sauvegardent pas :**
- Vérifiez que localStorage n'est pas désactivé
- Ouvrez la console pour voir les erreurs

**Le build échoue :**
```bash
npm run lint  # Vérifiez les erreurs
npm run build # Relancez le build
```

## Ressources

- 📖 Documentation complète : `README.md`
- 🎯 Guide des fonctionnalités : `FEATURES.md`
- 🐛 Issues : Créez une issue GitHub

---

**C'est tout ! Vous êtes prêt à réviser efficacement ! 📚✨**
