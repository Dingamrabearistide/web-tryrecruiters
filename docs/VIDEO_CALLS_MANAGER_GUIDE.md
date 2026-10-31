# Module de Gestion des Meetings Vidéo - Guide

## 🎉 Module Meetings Manager Créé avec Succès

Un module complet de gestion des meetings Daily.co a été créé pour le dashboard du recruteur, permettant de créer, gérer et partager des liens de meetings vidéo.

## 📁 Structure des Fichiers

```
web-tryrecruiters/src/app/modules/video-calls/
├── daily.service.ts                                    # Service Daily.co
├── video-calls.types.ts                                # Types
├── components/
│   └── video-call/                                     # Composant vidéo call
│       ├── video-call.component.ts
│       ├── video-call.component.html
│       └── video-call.component.scss
└── pages/
    └── meetings-manager/                               # ✅ NOUVEAU
        ├── meetings-manager.component.ts
        ├── meetings-manager.component.html
        └── meetings-manager.component.scss
```

## 🎯 Fonctionnalités du Meetings Manager

### 1. Création de Meetings

- ✅ Créer des rooms Daily.co en un clic
- ✅ Configuration automatique (privé, 10 participants max, partage d'écran, chat)
- ✅ Génération automatique d'URL unique

### 2. Liste des Meetings

- ✅ Affichage en grille responsive (1/2/3 colonnes)
- ✅ Informations complètes pour chaque meeting
- ✅ États de chargement et vide gérés

### 3. Actions sur les Meetings

- ✅ **Copier le lien** : Copie dans le presse-papiers avec notification
- ✅ **Rejoindre** : Ouvre le meeting dans un nouvel onglet
- ✅ **Supprimer** : Supprime la room avec confirmation

### 4. Interface Utilisateur

- ✅ Design moderne avec Tailwind CSS
- ✅ Material Icons pour les icônes
- ✅ Toasts de notification (succès/erreur)
- ✅ Responsive (mobile, tablet, desktop)

## 🚀 Utilisation

### Intégration dans le Dashboard

**1. Ajouter la route dans `app.routes.ts`** :

```typescript
import { Routes } from "@angular/router";
import { MeetingsManagerComponent } from "./modules/video-calls/pages/meetings-manager/meetings-manager.component";

export const routes: Routes = [
  // ... autres routes
  {
    path: "dashboard/meetings",
    component: MeetingsManagerComponent,
    canActivate: [AuthGuard],
  },
];
```

**2. Ajouter un lien dans le menu du dashboard** :

```html
<!-- Dans le sidebar du dashboard recruiter -->
<a routerLink="/dashboard/meetings" class="menu-item">
  <span class="material-icons">video_call</span>
  <span>Meetings Vidéo</span>
</a>
```

### Utilisation du Composant

**Composant Standalone** :

```typescript
import { MeetingsManagerComponent } from './modules/video-calls/pages/meetings-manager/meetings-manager.component';

@Component({
  standalone: true,
  imports: [MeetingsManagerComponent],
  template: `<app-meetings-manager></app-meetings-manager>`
})
```

## 💡 Exemples d'Utilisation

### Workflow Complet

1. **Le recruteur crée un meeting** :

   ```
   Clic sur "Créer un nouveau meeting"
   → API Daily.co crée la room
   → Meeting ajouté à la liste
   → Toast de succès affiché
   ```

2. **Le recruteur copie le lien** :

   ```
   Clic sur l'icône "content_copy"
   → Lien copié dans le presse-papiers
   → Toast de confirmation
   → Le recruteur peut coller le lien (email, chat, etc.)
   ```

3. **Le recruteur rejoint le meeting** :

   ```
   Clic sur "Rejoindre" ou sur la card
   → Ouverture dans un nouvel onglet
   → Meeting Daily.co démarré
   ```

4. **Le recruteur supprime un meeting** :
   ```
   Clic sur l'icône "delete"
   → Confirmation demandée
   → API Daily.co supprime la room
   → Meeting retiré de la liste
   ```

## 📊 Interface Utilisateur

### Header

```
┌──────────────────────────────────────────┐
│  Gestion des Meetings Vidéo             │
│  Créez et gérez vos meetings Daily.co   │
│  pour vos entretiens                     │
│                                          │
│  [➕ Créer un nouveau meeting]          │
└──────────────────────────────────────────┘
```

### Card Meeting

```
┌────────────────────────────┐
│  [📹] meeting-1730370000000│
│  Créé le 31/10/2025 08:00  │
├────────────────────────────┤
│  Lien du meeting           │
│  [https://...] [📋]        │
│                            │
│  [🔒 Privé]  [👥 Max 10]   │
│  [📺 Partage] [💬 Chat]    │
├────────────────────────────┤
│  [Rejoindre ↗] [🗑️]       │
└────────────────────────────┘
```

## 🎨 Personnalisation

### Modifier la Configuration par Défaut

Dans `meetings-manager.component.ts` :

```typescript
roomConfig = {
  privacy: "private" as "public" | "private", // 'public' ou 'private'
  maxParticipants: 10, // Nombre max de participants
  enableScreenshare: true, // Partage d'écran
  enableChat: true, // Chat
};
```

### Personnaliser les Couleurs

Dans le template HTML, modifier les classes Tailwind :

```html
<!-- Bouton principal -->
<button class="bg-blue-600 hover:bg-blue-700">
  <!-- Changer en -->
  <button class="bg-green-600 hover:bg-green-700">
    <!-- Toast succès -->
    <div class="bg-green-500">
      <!-- Changer en -->
      <div class="bg-blue-500"></div>
    </div>
  </button>
</button>
```

## 🔧 Configuration Requise

### Backend

- ✅ Module Daily.co installé
- ✅ API endpoints `/daily/rooms` fonctionnels
- ✅ Variables d'environnement configurées :
  ```env
  DAILY_API_KEY=your_api_key
  DAILY_DOMAIN=your-domain.daily.co
  ```

### Frontend

- ✅ Service `DailyService` disponible
- ✅ Tailwind CSS configuré
- ✅ Material Icons inclus dans `index.html` :
  ```html
  <link
    href="https://fonts.googleapis.com/icon?family=Material+Icons"
    rel="stylesheet"
  />
  ```

## 📱 Responsive Design

### Mobile (< 768px)

- 1 colonne
- Cards pleine largeur
- Contrôles optimisés

### Tablet (768px - 1024px)

- 2 colonnes
- Espacement ajusté

### Desktop (> 1024px)

- 3 colonnes
- Espacement optimal
- Hover effects complets

## 🔐 Sécurité

### Rooms Privées par Défaut

- Seuls les utilisateurs avec le lien peuvent rejoindre
- Configuration : `privacy: 'private'`

### Tokens JWT

- Générés côté backend pour chaque participant
- Expiration automatique après l'interview

### Suppression Sécurisée

- Confirmation avant suppression
- Suppression effective sur Daily.co

## 🐛 Débogage

### Console Logs

Le composant log les événements importants :

```typescript
- "Error loading meetings:" - Erreur lors du chargement
- "Error creating meeting:" - Erreur lors de la création
- "Error deleting meeting:" - Erreur lors de la suppression
- "Could not copy text:" - Erreur lors de la copie
```

### Erreurs Courantes

1. **"Erreur lors du chargement des meetings"**

   - Solution : Vérifier que le backend est démarré
   - Vérifier les variables d'environnement Daily.co

2. **"Erreur lors de la création du meeting"**

   - Solution : Vérifier la clé API Daily.co
   - Vérifier le domaine Daily.co

3. **Meetings ne s'affichent pas**
   - Solution : Vérifier que `dailyService.listRooms()` retourne bien `{ data: [...] }`

## 📈 Améliorations Futures

### Fonctionnalités Suggérées

1. **Planification** :

   - Ajouter date/heure de début
   - Durée du meeting
   - Expiration automatique

2. **Participants** :

   - Inviter des participants par email
   - Gérer les permissions (hôte, invité)

3. **Historique** :

   - Voir les meetings passés
   - Statistics d'utilisation

4. **Personnalisation** :

   - Branding personnalisé
   - Logo de l'entreprise
   - Couleurs personnalisées

5. **Intégration** :
   - Lier aux interviews existants
   - Créer automatiquement lors de la planification d'interview

## ✅ Checklist d'Intégration

### Configuration

- [x] Module video-calls créé
- [x] Service Daily.co fonctionnel
- [x] Composant MeetingsManager créé
- [ ] Routes ajoutées dans app.routes.ts
- [ ] Lien ajouté dans le menu dashboard
- [ ] Tests effectués

### Fonctionnalités

- [x] Création de meetings ✅
- [x] Liste des meetings ✅
- [x] Copie de liens ✅
- [x] Rejoindre meetings ✅
- [x] Suppression meetings ✅
- [x] Toasts de notification ✅
- [x] États (loading, empty, error) ✅

### UI/UX

- [x] Design Tailwind CSS ✅
- [x] Material Icons ✅
- [x] Responsive ✅
- [x] Animations ✅
- [x] Hover effects ✅

## 🎓 Ressources

- [Daily.co Documentation](https://docs.daily.co/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Material Icons](https://fonts.google.com/icons)
- [Guide Backend Daily.co](../backend-tryrecruiters/DAILY_CO_INTEGRATION_GUIDE.md)

## 🤝 Support

Pour toute question :

1. Consulter ce guide
2. Vérifier les logs de la console
3. Tester les endpoints API
4. Contacter l'équipe de développement

---

**Status** : ✅ Module Meetings Manager complet et prêt à l'emploi!

**Prochaines étapes** :

1. Ajouter les routes dans l'application
2. Intégrer au menu du dashboard
3. Tester le workflow complet
4. Ajouter des fonctionnalités supplémentaires si nécessaire
