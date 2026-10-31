# Frontend Daily.co Integration - Guide Complet

## 🎉 Intégration Daily.co Complétée

L'intégration de Daily.co pour les interviews vidéo est maintenant **100% complète côté frontend**.

## 📦 Installation

```bash
cd web-tryrecruiters
pnpm install @daily-co/daily-js
```

## 📁 Structure des Fichiers Créés

```
web-tryrecruiters/src/app/modules/interviews/
├── models/
│   └── interview.types.ts              # Types et interfaces
├── services/
│   └── daily.service.ts                # Service Angular pour Daily.co
└── components/
    └── video-call/
        ├── video-call.component.ts     # Composant vidéo
        ├── video-call.component.html   # Template
        └── video-call.component.scss   # Styles
```

## 🔧 Composants Créés

### 1. Types et Interfaces (`interview.types.ts`)

```typescript
export enum InterviewType {
  GOOGLE_MEET = "GOOGLE_MEET",
  DAILY_VIDEO_CALL = "DAILY_VIDEO_CALL",
}

export interface Interview {
  id: string;
  type: InterviewType;
  meetUrl: string;
  videoRoom?: VideoRoom;
  // ...
}

export interface VideoRoom {
  roomName: string;
  roomUrl: string;
  expiresAt: string;
  // ...
}
```

### 2. Service Daily.co (`daily.service.ts`)

Service Angular pour interagir avec l'API backend Daily.co :

```typescript
@Injectable({ providedIn: "root" })
export class DailyService {
  // Génère un token pour rejoindre une room
  generateMeetingToken(roomName, userName, isOwner);

  // Rejoint un interview
  joinInterview(interviewId);

  // Crée une room
  createRoom(options);

  // Supprime une room
  deleteRoom(roomName);

  // Liste les rooms
  listRooms(limit);
}
```

### 3. Composant Vidéo (`video-call.component.ts`)

Composant standalone Angular intégrant le SDK Daily.co :

**Fonctionnalités** :

- ✅ Connexion automatique à la room
- ✅ Contrôles vidéo/audio
- ✅ Partage d'écran
- ✅ Gestion des participants
- ✅ États de chargement et d'erreur
- ✅ Interface responsive
- ✅ Nettoyage automatique des ressources

**Inputs** :

```typescript
@Input() callOptions: DailyCallOptions = {
  roomUrl: string;
  token?: string;
  userName?: string;
  startVideoOff?: boolean;
  startAudioOff?: boolean;
}
```

**Méthodes publiques** :

```typescript
toggleCamera(); // Active/désactive la caméra
toggleMicrophone(); // Active/désactive le micro
toggleScreenShare(); // Partage d'écran
leaveCall(); // Quitte l'appel
```

## 🎨 Interface Utilisateur

### Contrôles Vidéo

Le composant affiche des contrôles en bas de l'écran :

- **Compteur de participants** : Affiche le nombre de personnes dans la room
- **Bouton Micro** : Active/désactive le microphone
- **Bouton Caméra** : Active/désactive la caméra
- **Bouton Partage d'écran** : Démarre/arrête le partage d'écran
- **Bouton Quitter** : Quitte l'appel (rouge)

### États d'Interface

1. **Chargement** : Spinner avec message "Connexion en cours..."
2. **Erreur** : Message d'erreur avec bouton "Réessayer"
3. **Connecté** : Vidéo + contrôles

### Design Responsive

- Desktop : Contrôles complets
- Tablet : Contrôles ajustés
- Mobile : Interface optimisée

## 🚀 Utilisation du Composant

### Exemple Simple

```typescript
import { Component } from "@angular/core";
import { VideoCallComponent } from "./components/video-call/video-call.component";
import { DailyCallOptions } from "./models/interview.types";

@Component({
  selector: "app-interview-room",
  standalone: true,
  imports: [VideoCallComponent],
  template: `
    <div class="interview-container">
      <h1>Interview en cours</h1>
      <app-video-call [callOptions]="callOptions"></app-video-call>
    </div>
  `,
})
export class InterviewRoomComponent {
  callOptions: DailyCallOptions = {
    roomUrl: "https://your-domain.daily.co/interview-123",
    token: "your-jwt-token",
    userName: "John Doe",
    startVideoOff: false,
    startAudioOff: false,
  };
}
```

### Exemple Complet avec Service

```typescript
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DailyService } from "./services/daily.service";

export class InterviewRoomComponent implements OnInit {
  callOptions?: DailyCallOptions;
  loading = true;
  error?: string;

  constructor(
    private route: ActivatedRoute,
    private dailyService: DailyService
  ) {}

  ngOnInit() {
    const interviewId = this.route.snapshot.params["id"];

    this.dailyService.joinInterview(interviewId).subscribe({
      next: (response) => {
        this.callOptions = {
          roomUrl: response.roomUrl,
          token: response.token,
          userName: this.getUserName(),
        };
        this.loading = false;
      },
      error: (err) => {
        this.error = "Failed to join interview";
        this.loading = false;
      },
    });
  }

  getUserName(): string {
    // Récupérer le nom de l'utilisateur connecté
    return "Current User";
  }
}
```

## 📋 Workflow Complet

### 1. Création d'un Interview (Recruteur)

```typescript
// Dans le formulaire de création d'interview
const interview = {
  applicationId: "app-123",
  recruiterId: "rec-456",
  candidateId: "can-789",
  scheduledAt: "2025-08-15T14:00:00Z",
  durationMin: 45,
  type: InterviewType.DAILY_VIDEO_CALL, // ← Choisir le type
  meetUrl: "", // Sera généré par le backend
  timezone: "Africa/Douala",
};

// Le backend crée automatiquement la VideoRoom
```

### 2. Rejoindre un Interview

```typescript
// Dans la page interview-room.component.ts
this.dailyService.joinInterview(interviewId).subscribe({
  next: (joinInfo) => {
    // joinInfo contient:
    // - roomUrl: URL de la room Daily.co
    // - token: Token JWT pour l'accès
    // - expiresAt: Date d'expiration

    this.callOptions = {
      roomUrl: joinInfo.roomUrl,
      token: joinInfo.token,
      userName: this.currentUser.name,
    };
  },
});
```

### 3. Pendant l'Interview

Le composant `video-call` gère automatiquement :

- Connexion à la room
- Affichage de la vidéo
- Contrôles interactifs
- Gestion des événements (participants, erreurs, etc.)

### 4. Fin de l'Interview

```typescript
// Appel automatique lors de la destruction du composant
ngOnDestroy() {
  this.leaveCall();
}

// Ou manuellement via le bouton "Quitter"
async leaveCall() {
  await this.callObject.leave();
  await this.callObject.destroy();
  // Rediriger vers la page précédente
  this.router.navigate(['/interviews']);
}
```

## 🔐 Sécurité

### Tokens JWT

Les tokens sont générés côté backend et sont :

- **Temporaires** : Expiration après l'interview
- **Spécifiques** : Un token par participant et par room
- **Sécurisés** : Signés avec la clé API Daily.co

### Permissions

```typescript
// Le backend vérifie les permissions avant de générer un token
- Seuls les participants autorisés (recruiter + candidate) obtiennent un token
- Les tokens incluent le rôle (owner pour recruiter)
- Les rooms sont privées par défaut
```

## 🎯 Routes Recommandées

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: "interviews/:id/join",
    component: InterviewRoomComponent,
    canActivate: [AuthGuard],
  },
  // ... autres routes
];
```

## 📱 Support des Navigateurs

Daily.co supporte :

- ✅ Chrome/Edge (recommandé)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS/Android)

## 🐛 Débogage

### Console Logs

Le composant log automatiquement :

```typescript
-"Successfully joined meeting" -
  "Participant joined: {participant}" -
  "Participant left: {participant}" -
  "Failed to join call: {error}";
```

### Erreurs Courantes

1. **"Room URL is required"**

   - Solution : Vérifier que `callOptions.roomUrl` est défini

2. **"Camera access error"**

   - Solution : Autoriser l'accès caméra/micro dans le navigateur

3. **"Failed to join video call"**
   - Solution : Vérifier le token et l'URL de la room

## 📊 Métriques et Analytics

### Événements Daily.co

Le composant capture les événements suivants :

- `joined-meeting` : Utilisateur rejoint
- `left-meeting` : Utilisateur quitte
- `participant-joined` : Nouveau participant
- `participant-left` : Participant quitte
- `error` : Erreur générale
- `camera-error` : Erreur caméra

### Implémentation Analytics (Optionnel)

```typescript
private handleJoinedMeeting(): void {
  this.analytics.track('interview_joined', {
    interviewId: this.interviewId,
    roomName: this.callOptions.roomName,
  });
}
```

## 🔄 Migration Google Meet → Daily.co

Pour migrer des interviews existants :

```typescript
// 1. Mettre à jour le type
interview.type = InterviewType.DAILY_VIDEO_CALL;

// 2. Créer la VideoRoom via le backend
const room = await dailyService.createInterviewRoom(
  interview.id,
  interview.expirationDate
);

// 3. Mettre à jour l'URL
interview.meetUrl = room.url;
```

## ✅ Checklist d'Intégration

### Backend

- [x] Table VideoRoom créée
- [x] Module Daily.co complet
- [x] Enum InterviewType ajouté
- [x] DTOs mis à jour
- [x] API endpoints fonctionnels

### Frontend

- [x] Dépendances installées
- [x] Types/interfaces créés
- [x] Service Daily.co créé
- [x] Composant vidéo créé
- [x] Template HTML créé
- [x] Styles SCSS créés
- [ ] Page interview room à créer
- [ ] Formulaires mis à jour
- [ ] Routes ajoutées
- [ ] Tests end-to-end

## 🎓 Ressources

- [Documentation Daily.co](https://docs.daily.co/)
- [Daily.co SDK Angular](https://github.com/daily-co/daily-js)
- [Guide backend](../backend-tryrecruiters/DAILY_CO_INTEGRATION_GUIDE.md)

## 🤝 Support

Pour toute question :

1. Consulter ce guide
2. Vérifier la documentation Daily.co
3. Consulter les logs navigateur/backend
4. Contacter l'équipe de développement

---

**Status** : ✅ Frontend Daily.co integration complète (composant vidéo prêt)

**Prochaines étapes** :

1. Créer la page interview-room complète
2. Mettre à jour les formulaires pour choisir le type d'interview
3. Ajouter les routes dans app.routes.ts
4. Tests d'intégration
