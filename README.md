# Math Revision Planner 📚

Une application complète de planification de révisions mathématiques, 100% client-side avec localStorage.

## 🚀 Démarrage rapide

```bash
npm install
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 🏗️ Stack technique

- **Frontend:** Vite + React 18 + TypeScript
- **Styling:** Tailwind CSS v3 (thème indigo/bleu)
- **Stockage:** localStorage uniquement (pas d'API)
- **Librairies:**
  - `react-dropzone` - Upload de fichiers PDF
  - `canvas-confetti` - Animation de célébration
  - `date-fns` - Gestion des dates (locale française)
  - `lucide-react` - Icônes

## ✨ Fonctionnalités

### 📖 Bibliothèque (Library Tab)
- Arborescence complète : Sujets → Chapitres → Cours
- Créer des dossiers et sous-dossiers à volonté
- Ajouter des cours avec titre, contenu et PDFs
- Upload de PDFs (stockage des métadonnées)
- Visualisation des cours avec leur contenu
- Tout sauvegardé en localStorage

### 📅 Planning (Planning Tab)
- Affiche le planning de révision actif (7 jours)
- Cards élégants pour chaque jour avec dates en français
- Checkboxes pour marquer les jours comme terminés
- Barre de progression visuelle
- 🎉 Animation confetti quand tous les jours sont cochés !
- Bouton pour réinitialiser le planning

### 🤖 Assistant (Assistant Tab)
- Interface de chat client-side
- Détecte automatiquement les demandes de planning
- Tapez "contrôle chapitre 1" → charge le planning correspondant
- Réponses instantanées (pas d'API)
- Historique sauvegardé en localStorage

## 📦 Structure du projet

```
src/
├── components/
│   ├── LibraryTab.tsx      # Gestion de la bibliothèque
│   ├── PlanningTab.tsx     # Affichage du planning
│   └── AssistantTab.tsx    # Chat assistant
├── data/
│   └── plans.ts            # Plannings pré-définis (ÉDITABLE)
├── hooks/
│   └── useLocalStorage.ts  # Hook personnalisé localStorage
├── types.ts                # Types TypeScript
├── App.tsx                 # Composant principal
├── main.tsx                # Point d'entrée
└── index.css               # Styles Tailwind
```

## 🎨 Personnalisation

### Ajouter de nouveaux plannings

Éditez `src/data/plans.ts` pour ajouter vos propres plannings :

```typescript
export const predefinedPlans: Record<string, Planning> = {
  'mon-nouveau-chapitre': {
    chapterId: 'mon-nouveau-chapitre',
    chapterName: 'Mon Chapitre',
    days: [
      {
        dayNum: 1,
        date: new Date().toISOString(),
        tasks: ['Tâche 1', 'Tâche 2'],
        completed: false,
      },
      // ... 6 autres jours
    ],
  },
}
```

Ensuite, mettez à jour la détection dans `AssistantTab.tsx` pour reconnaître votre nouveau chapitre.

## 🚢 Déploiement

### Vercel (recommandé)

```bash
npm run build
```

Puis déployez le dossier `dist` sur Vercel. Le fichier `vercel.json` est déjà configuré pour le routage SPA.

### Autres plateformes

L'application est une SPA statique. Compilez avec `npm run build` et déployez le dossier `dist` sur n'importe quelle plateforme de hosting statique (Netlify, GitHub Pages, etc.).

## 🛠️ Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Compile pour la production
- `npm run preview` - Prévisualise le build de production
- `npm run lint` - Lance ESLint

## 📱 Responsive Design

L'application est entièrement responsive et mobile-first. Elle s'adapte automatiquement aux écrans :
- 📱 Mobile (< 640px)
- 📱 Tablet (640px - 1024px)
- 💻 Desktop (> 1024px)

## 💾 Données pré-chargées

L'application est livrée avec des données d'exemple :
- **Sujet :** Mathématiques
- **Chapitre :** Chapitre 1 – Nombres et calculs
- **Cours :** Introduction aux nombres (avec contenu détaillé)
- **Planning :** Plan de révision sur 7 jours

## 🔒 Confidentialité

Toutes les données restent sur votre appareil (localStorage). Aucune donnée n'est envoyée à un serveur externe.

## 📄 Licence

Ce projet est open source et disponible pour tous.

---

**Bon courage pour vos révisions ! 🎓**
