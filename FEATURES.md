# Math Revision Planner - Guide des Fonctionnalités 🎓

## Vue d'ensemble

Math Revision Planner est une application complète de planification de révisions mathématiques, construite avec React + TypeScript. Elle permet aux étudiants d'organiser leurs cours, de suivre des plannings de révision structurés, et d'obtenir de l'aide via un assistant intelligent.

## 📖 Onglet Bibliothèque (Library)

### Fonctionnalités principales

1. **Arborescence hiérarchique**
   - Créez des sujets (ex: Mathématiques)
   - Organisez par chapitres et sous-chapitres
   - Hiérarchie libre à plusieurs niveaux
   - Navigation intuitive avec expand/collapse

2. **Gestion des dossiers**
   - Créer des dossiers à la racine
   - Ajouter des sous-dossiers dans n'importe quel dossier
   - Icônes différenciées (dossiers vs cours)
   - Boutons d'action rapide sur chaque dossier

3. **Gestion des cours**
   - Créer un cours avec titre et contenu
   - Éditeur de texte multi-lignes
   - Visualisation du contenu formaté
   - Sélection d'un cours pour voir ses détails

4. **Upload de PDFs**
   - Drag & drop de fichiers PDF
   - Stockage des métadonnées (nom, taille, date)
   - Liste des PDFs attachés à chaque cours
   - Suppression de PDFs
   - Note: extraction automatique du texte à venir

5. **Persistance**
   - Tout sauvegardé automatiquement en localStorage
   - Aucune perte de données au rafraîchissement
   - Synchronisation en temps réel

### Données pré-chargées

Au premier lancement, l'application contient :
- **Sujet:** Mathématiques
- **Chapitre:** Chapitre 1 – Nombres et calculs
- **Cours:** Introduction aux nombres (avec contenu détaillé sur les nombres entiers, décimaux, rationnels, opérations, etc.)

## 📅 Onglet Planning

### Fonctionnalités principales

1. **Affichage du planning**
   - Vue des 7 jours de révision
   - Dates formatées en français (ex: "lundi 27 novembre 2024")
   - Cards élégants et responsive
   - Distinction visuelle jour complété vs à faire

2. **Suivi de progression**
   - Checkbox pour marquer chaque jour comme terminé
   - Barre de progression visuelle
   - Pourcentage d'avancement
   - Effet visuel sur les jours complétés

3. **Tâches quotidiennes**
   - Liste des tâches à accomplir chaque jour
   - Format bullet point
   - Text struck-through quand jour terminé
   - Nombre variable de tâches par jour

4. **Célébration**
   - 🎉 Animation confetti automatique quand tous les jours sont cochés
   - Message de félicitation
   - Effet visuel avec canvas-confetti

5. **Réinitialisation**
   - Bouton pour décocher tous les jours
   - Recommencer un planning depuis zéro

### Plan de révision pré-défini

Le planning pour "Chapitre 1 – Nombres et calculs" inclut :

**Jour 1:** Révision des bases (nombres, opérations, exercices 1-5)  
**Jour 2:** Nombres premiers et décomposition (exercices 10-15)  
**Jour 3:** Fractions et simplification (exercices 20-25)  
**Jour 4:** Nombres décimaux et puissances de 10 (exercices 30-35)  
**Jour 5:** Contrôle blanc chronométré + correction  
**Jour 6:** Révision des points faibles + exercices supplémentaires  
**Jour 7:** Relecture finale et repos avant le contrôle

## 🤖 Onglet Assistant

### Fonctionnalités principales

1. **Interface de chat**
   - Messages utilisateur (bleu) et assistant (blanc)
   - Horodatage de chaque message
   - Scroll automatique vers le dernier message
   - Historique persistant en localStorage

2. **Détection intelligente**
   - Reconnaissance des mots-clés ("contrôle", "chapitre")
   - Parsing du message utilisateur
   - Réponses instantanées (pas d'API)
   - Chargement automatique du planning correspondant

3. **Exemples de commandes**
   - "J'ai un contrôle sur le chapitre 1"
   - "Contrôle nombres et calculs"
   - "Je dois réviser le ch1"
   - Toutes ces variantes chargent le planning du Chapitre 1

4. **Messages d'aide**
   - Réponse à "aide" ou "help"
   - Réponse à "bonjour" avec instructions
   - Message par défaut si commande non reconnue
   - Suggestions de syntaxe

5. **Intégration avec Planning**
   - Bascule automatique vers l'onglet Planning
   - Chargement du planning détecté
   - Message de confirmation avec détails

### Extensibilité

Pour ajouter de nouveaux chapitres détectables :

1. Éditez `src/data/plans.ts` pour ajouter un nouveau planning
2. Modifiez `detectPlanningRequest()` dans `AssistantTab.tsx`
3. Ajoutez les mots-clés de détection (ex: "chapitre 2", "équations")

## 🎨 Design et UX

### Thème visuel
- **Couleurs principales:** Indigo/Bleu (#6366f1 - #4338ca)
- **Palette complète:** primary-50 à primary-950
- **Accents:** Bleu pour les éléments secondaires
- **Succès:** Vert pour la progression
- **Attention:** Rouge pour suppression

### Responsive Design
- **Mobile:** Stack vertical, navigation en tabs
- **Tablet:** Adaptation automatique de la largeur
- **Desktop:** Layout optimal avec sidebar (bibliothèque)
- **Touch-friendly:** Boutons et zones de clic généreuses

### Composants réutilisables
- `btn-primary`: Bouton principal (indigo)
- `btn-secondary`: Bouton secondaire (gris)
- `card`: Card avec ombre et bordure
- `input-field`: Champ de saisie avec focus ring
- `tab-button`: Bouton de navigation

## 🔧 Personnalisation

### Ajouter un nouveau planning

1. **Créer le planning dans `src/data/plans.ts`:**

```typescript
export const predefinedPlans: Record<string, Planning> = {
  'mon-chapitre': {
    chapterId: 'mon-chapitre',
    chapterName: 'Mon Nouveau Chapitre',
    days: [
      {
        dayNum: 1,
        date: new Date().toISOString(),
        tasks: ['Tâche 1', 'Tâche 2', 'Tâche 3'],
        completed: false,
      },
      // ... jours 2 à 7
    ],
  },
}
```

2. **Mettre à jour la détection dans `AssistantTab.tsx`:**

```typescript
const detectPlanningRequest = (message: string): Planning | null => {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('contrôle') || lowerMessage.includes('controle')) {
    if (lowerMessage.includes('chapitre 2') || lowerMessage.includes('mon chapitre')) {
      return predefinedPlans['mon-chapitre']
    }
  }
  
  return null
}
```

### Modifier le thème de couleurs

Éditez `tailwind.config.js` pour changer la palette :

```javascript
colors: {
  primary: {
    500: '#votre-couleur',
    // ... autres nuances
  },
}
```

## 💾 Stockage des données

Toutes les données sont stockées en localStorage avec les clés suivantes :
- `math-planner-library`: Structure complète de la bibliothèque
- `math-planner-active-planning`: Planning actuellement affiché
- `math-planner-chat-history`: Historique des conversations

### Réinitialiser l'application

Pour repartir de zéro, ouvrez la console du navigateur et tapez :

```javascript
localStorage.clear()
location.reload()
```

## 🚀 Prochaines fonctionnalités possibles

- [ ] Extraction automatique du texte des PDFs (pdf-parse)
- [ ] Export du planning en PDF
- [ ] Notifications/rappels pour les tâches
- [ ] Statistiques de progression
- [ ] Thème sombre
- [ ] Partage de plannings entre utilisateurs
- [ ] Quiz/exercices interactifs
- [ ] Calendrier avec vue mensuelle
- [ ] Import/export de la bibliothèque

## 📱 Compatibilité

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Appareils mobiles iOS/Android

## 🆘 Support

Pour toute question ou problème :
1. Consultez le README.md
2. Vérifiez la console du navigateur pour les erreurs
3. Assurez-vous que localStorage est activé
4. Essayez de vider le cache et recharger

---

**Bon courage pour vos révisions ! 📚✨**
