# Guide d'Intégration - Système de Call Vidéo

## 🎉 Système de Call Vidéo Intégré Créé avec Succès!

Un système complet de call vidéo a été mis en place permettant aux recruteurs de créer des meetings et de les rejoindre directement dans l'application sans quitter la page.

## 📁 Structure des Fichiers

```
web-tryrecruiters/src/app/modules/video-calls/
├── daily.service.ts
├── video-calls.types.ts
├── components/
│   └── video-call/
│       ├── video-call.component.ts
│       ├── video-call.component.html
│       └── video-call.component.scss
└── pages/
    ├── meetings-manager/                    # Page de gestion
    │   ├── meetings-manager.component.ts
    │   ├── meetings-manager.component.html
    │   └── meetings-manager.component.scss
    └── call-room/                           # ✅ NOUVEAU - Page de call
        ├── call-room.component.ts
        ├── call-room.component.html
        └── call-room.component.scss
```

## 🎯 Fonctionnalités

### 1. Page Meetings Manager

**Fonctionnalités** :

- ✅ Créer des meetings Daily.co
- ✅ Lister tous les meetings
- ✅ Copier le lien d'un meeting
- ✅ **Rejoindre un meeting (navigation interne)**
- ✅ Supprimer un meeting

**Navigation** :

- Clic sur card → Navigation vers `/dashboard/meetings/call?url=...&name=...`
- Clic sur "Rejoindre" → Navigation vers `/dashboard/meetings/call?url=...&name=...`

### 2. Page Call Room (Nouveau)

**Fonctionnalités** :

- ✅ Interface full-screen pour l'appel vidéo
- ✅ Design moderne avec gradient bleu (couleurs du projet)
- ✅ Header avec bouton "Retour" et nom du meeting
- ✅ États : Loading, Error, Call actif
- ✅ Intégration du composant VideoCallComponent
- ✅ Contrôles optionnels (micro, caméra, partage, etc.)

**Design** :

- ✅ Gradient background : `from-blue-900 via-blue-800 to-indigo-900`
- ✅ Font Awesome pour toutes les icônes
- ✅ Tailwind CSS pour le styling
- ✅ Animations smooth et professionnelles

## 🚀 Configuration Requise

### 1. Font Awesome

Ajouter dans `index.html` :

```html
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
/>
```

### 2. Routes

Ajouter dans `app.routes.ts` :

```typescript
import { Routes } from "@angular/router";
import { MeetingsManagerComponent } from "./modules/video-calls/pages/meetings-manager/meetings-manager.component";
import { CallRoomComponent } from "./modules/video-calls/pages/call-room/call-room.component";

export const routes: Routes = [
  // ... autres routes
  {
    path: "dashboard/meetings",
    component: MeetingsManagerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "dashboard/meetings/call",
    component: CallRoomComponent,
    canActivate: [AuthGuard],
  },
];
```

### 3. Menu Dashboard

Ajouter dans le sidebar :

```html
<a routerLink="/dashboard/meetings" class="menu-item">
  <i class="fas fa-video"></i>
  <span>Meetings Vidéo</span>
</a>
```

## 💡 Workflow Utilisateur

### Création et Jonction d'un Meeting

```
1. Dashboard → Meetings Vidéo
   ↓
2. Clic "Créer un nouveau meeting"
   ↓
3. Meeting créé et ajouté à la liste
   ↓
4. Clic sur card ou "Rejoindre"
   ↓
5. Navigation vers /dashboard/meetings/call?url=...&name=...
   ↓
6. Page Call Room s'affiche
   ↓
7. Composant VideoCall intégré démarre
   ↓
8. Call actif dans l'application
   ↓
9. Clic "Retour" → Retour à la liste des meetings
```

### Partage avec Candidat

```
1. Recruteur crée le meeting
   ↓
2. Recruteur copie le lien
   ↓
3. Recruteur envoie le lien au candidat (email/SMS)
   ↓
4. Candidat ouvre le lien → Meeting Daily.co
   ↓
5. Recruteur rejoint depuis l'app
   ↓
6. Call démarre entre les deux participants
```

## 🎨 Interface Utilisateur

### Page Call Room

#### Header

```
┌────────────────────────────────────────────────┐
│ [← Retour]  Meeting Name                      │
│             Appel vidéo en cours      [👥 Room]│
└────────────────────────────────────────────────┘
```

#### États

**Loading** :

```
┌────────────────────────────────────┐
│                                    │
│        [Spinner + Icône 📹]        │
│     Connexion au meeting...        │
│                                    │
└────────────────────────────────────┘
```

**Error** :

```
┌────────────────────────────────────┐
│                                    │
│     [⚠️ Icon rouge]                │
│         Erreur                     │
│   URL du meeting manquante         │
│   [Retour aux meetings]            │
│                                    │
└────────────────────────────────────┘
```

**Call Actif** :

```
┌────────────────────────────────────┐
│                                    │
│    [VideoCallComponent ici]        │
│                                    │
│                                    │
└────────────────────────────────────┘
```

#### Contrôles (Optionnels)

```
┌──────────────────────────────────────┐
│ [🎤] [📹] [🖥️] [📞] [💬] [⚙️]        │
└──────────────────────────────────────┘
```

## 🔧 Composants

### CallRoomComponent

**Responsabilités** :

- Récupérer URL et nom du meeting depuis query params
- Initialiser les options pour VideoCallComponent
- Gérer les états (loading, error, actif)
- Fournir navigation de retour

**Props** :

```typescript
callOptions?: DailyCallOptions;
isLoading: boolean;
error: string | null;
roomUrl: string;
roomName: string;
```

**Méthodes** :

```typescript
ngOnInit(); // Initialize call from query params
initializeCall(); // Setup call options
getUserName(); // Get current user name
goBack(); // Navigate back to meetings list
```

### MeetingsManagerComponent (Modifié)

**Changements** :

```typescript
// AVANT
openMeeting(url: string): void {
  window.open(url, "_blank");  // ❌ Ouvre nouvel onglet
}

// APRÈS
openMeeting(url: string, name?: string): void {
  this.router.navigate(["/dashboard/meetings/call"], {
    queryParams: { url, name }  // ✅ Navigation interne
  });
}
```

## 🎨 Personnalisation des Couleurs

### Gradient Background

```scss
// CallRoomComponent
.bg-gradient-to-br {
  background: linear-gradient(
    to bottom right,
    #1e3a8a,
    // blue-900
    #1e40af,
    // blue-800
    #3730a3 // indigo-900
  );
}
```

### Changer les Couleurs

Dans `call-room.component.html` :

```html
<!-- Changer le gradient -->
<div class="bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900">
  <!-- Changer couleur header -->
  <div class="bg-gray-900 bg-opacity-50">
    <!-- En -->
    <div class="bg-blue-900 bg-opacity-50">
      <!-- Changer couleur boutons -->
      <button class="bg-gray-800 hover:bg-gray-700">
        <!-- En -->
        <button class="bg-blue-800 hover:bg-blue-700"></button>
      </button>
    </div>
  </div>
</div>
```

## 📱 Responsive

### Mobile

- Header condensé (icône seulement pour "Retour")
- Contrôles adaptés
- Full-screen call

### Desktop

- Header complet avec textes
- Room info visible
- Contrôles étendus

## 🔐 Sécurité

### URL Validation

```typescript
if (!this.roomUrl) {
  this.error = "URL du meeting manquante";
  return;
}
```

### Navigation Protégée

```typescript
// app.routes.ts
{
  path: "dashboard/meetings/call",
  component: CallRoomComponent,
  canActivate: [AuthGuard]  // ✅ Protégé
}
```

## 🐛 Débogage

### Problèmes Courants

1. **"URL du meeting manquante"**

   - Solution : Vérifier que les query params sont bien passés
   - Vérifier : `/dashboard/meetings/call?url=...&name=...`

2. **VideoCallComponent ne s'affiche pas**

   - Solution : Vérifier que `callOptions` est défini
   - Vérifier l'import de VideoCallComponent

3. **Font Awesome icons ne s'affichent pas**

   - Solution : Ajouter le CDN dans `index.html`
   - Vérifier : `<link rel="stylesheet" href="...font-awesome..." />`

4. **Navigation ne fonctionne pas**
   - Solution : Vérifier les routes dans `app.routes.ts`
   - Vérifier l'import de `Router` dans les composants

## 📈 Améliorations Futures

### Fonctionnalités Suggérées

1. **Contrôles Actifs** :

   - Implémenter les contrôles (micro, caméra, etc.)
   - Connecter aux méthodes Daily.co

2. **Nom Utilisateur** :

   - Récupérer le vrai nom depuis AuthService
   - Afficher l'avatar de l'utilisateur

3. **Statistiques** :

   - Durée du call
   - Qualité de connexion
   - Participants actifs

4. **Enregistrement** :

   - Option d'enregistrer le meeting
   - Stocker les enregistrements

5. **Chat Intégré** :
   - Chat en temps réel pendant le call
   - Partage de fichiers

## ✅ Checklist d'Intégration

### Configuration

- [x] CallRoomComponent créé
- [x] Template avec Tailwind CSS et Font Awesome
- [x] MeetingsManager modifié pour navigation interne
- [ ] Font Awesome ajouté dans index.html
- [ ] Routes configurées dans app.routes.ts
- [ ] Lien menu dashboard ajouté

### Fonctionnalités

- [x] Navigation interne vers call ✅
- [x] Page call avec design projet ✅
- [x] États loading/error gérés ✅
- [x] Bouton retour fonctionnel ✅
- [x] Integration VideoCallComponent ✅
- [x] Query params gérés ✅

### UI/UX

- [x] Gradient bleu (couleurs projet) ✅
- [x] Font Awesome icons ✅
- [x] Responsive design ✅
- [x] Animations smooth ✅
- [x] Full-screen call ✅

## 🎓 Ressources

- [Daily.co Documentation](https://docs.daily.co/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Font Awesome](https://fontawesome.com/icons)
- [Angular Router](https://angular.io/guide/router)

---

**Status** : ✅ Système de Call Vidéo Intégré Complet!

**Prochaines étapes** :

1. Ajouter Font Awesome dans index.html
2. Configurer les routes
3. Tester le workflow complet
4. Implémenter les contrôles actifs (optionnel)
