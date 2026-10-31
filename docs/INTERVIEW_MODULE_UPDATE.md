# Mise à Jour du Module Interview - Frontend

## 🎉 Module Interview Mis à Jour avec Succès

Le module interview frontend a été mis à jour pour supporter les changements apportés au backend, notamment l'ajout du champ `type` d'interview et la relation avec `VideoRoom`.

## 📋 Modifications Apportées

### 1. Types et Interfaces (`interview.types.ts`)

#### ✅ Ajout de l'interface VideoRoom

```typescript
export interface VideoRoom {
  id: string;
  interviewId: string;
  roomName: string;
  roomUrl: string;
  expiresAt: string;
  provider: string;
  maxParticipants: number;
  enableScreenshare: boolean;
  enableChat: boolean;
  enableRecording: boolean;
  createdAt?: string;
  updatedAt?: string;
}
```

#### ✅ Ajout du champ `type` dans les interfaces

**Interview** :

```typescript
export interface Interview {
  // ... autres champs
  type: InterviewType; // ← NOUVEAU
  meetUrl: string;
  videoRoom?: VideoRoom; // ← NOUVEAU (relation optionnelle)
}
```

**CreateInterviewDto** :

```typescript
export interface CreateInterviewDto {
  // ... autres champs
  type: InterviewType; // ← NOUVEAU
  meetUrl: string;
}
```

**InterviewFormData** :

```typescript
export interface InterviewFormData {
  // ... autres champs
  type: InterviewType; // ← NOUVEAU
  meetUrl: string;
}
```

**UpdateInterviewDto** :

```typescript
export interface UpdateInterviewDto {
  scheduledAt?: string;
  durationMin?: number;
  type?: InterviewType; // ← NOUVEAU
  meetUrl?: string;
  // ...
}
```

#### ✅ Enum InterviewType (déjà existant)

```typescript
export enum InterviewType {
  GOOGLE_MEET = "GOOGLE_MEET",
  DAILY_VIDEO_CALL = "DAILY_VIDEO_CALL",
}
```

### 2. Formulaire d'Interview (`interview-form.component.ts`)

#### ✅ Import de InterviewType

```typescript
import {
  InterviewFormData as ModuleFormData,
  InterviewType, // ← NOUVEAU
} from "@modules/interview/interview.types";
```

#### ✅ Ajout du champ dans la configuration du formulaire

```typescript
{
  name: "type",
  label: "form.type.label",
  type: "select",
  required: true,
  defaultValue: InterviewType.GOOGLE_MEET,  // ← Valeur par défaut
  size: { xs: 12, md: 6 },
  options: [
    {
      label: "form.type.options.googleMeet",
      value: InterviewType.GOOGLE_MEET,
    },
    {
      label: "form.type.options.dailyVideoCall",
      value: InterviewType.DAILY_VIDEO_CALL,
    },
  ],
  validation: [Validators.required],
  errorMessages: {
    required: "errors.type.required",
  },
}
```

**Position dans le formulaire** : Entre `durationMin` et `meetUrl`

#### ✅ Validation meetUrl simplifiée

La validation stricte de l'URL Google Meet a été retirée pour permettre l'utilisation d'URLs Daily.co :

```typescript
{
  name: "meetUrl",
  label: "form.meetUrl.label",
  placeholder: "https://meet.google.com/xxx-xxxx-xxx",
  type: "url",
  required: true,
  size: { xs: 12, md: 6 },
  validation: [Validators.required],  // ← Simplifié
  errorMessages: {
    required: "errors.meetUrl.required",
  },
}
```

### 3. Traductions

#### ✅ Français (`i18n/fr.json`)

```json
{
  "form": {
    "durationMin": {
      "label": "Durée (minutes)",
      "options": {
        "15min": "15 minutes",
        "30min": "30 minutes",
        "45min": "45 minutes",
        "1h": "1 heure",
        "1h30": "1h30",
        "2h": "2 heures"
      }
    },
    "type": {
      "label": "Type d'entretien",
      "options": {
        "googleMeet": "Google Meet",
        "dailyVideoCall": "Appel vidéo intégré (Daily.co)"
      }
    },
    "timezone": {
      "label": "Fuseau horaire",
      "options": {
        "africaDouala": "Afrique/Douala (GMT+1)",
        "europeParis": "Europe/Paris (GMT+1)",
        "americaNewYork": "Amérique/New York (GMT-5)",
        "asiaTokyo": "Asie/Tokyo (GMT+9)",
        "utc": "UTC"
      }
    }
  },
  "errors": {
    "type": {
      "required": "Le type d'entretien est obligatoire"
    }
  }
}
```

#### ✅ Anglais (`i18n/en.json`)

```json
{
  "form": {
    "durationMin": {
      "label": "Duration (minutes)",
      "options": {
        "15min": "15 minutes",
        "30min": "30 minutes",
        "45min": "45 minutes",
        "1h": "1 hour",
        "1h30": "1h30",
        "2h": "2 hours"
      }
    },
    "type": {
      "label": "Interview type",
      "options": {
        "googleMeet": "Google Meet",
        "dailyVideoCall": "Integrated Video Call (Daily.co)"
      }
    },
    "timezone": {
      "label": "Time zone",
      "options": {
        "africaDouala": "Africa/Douala (GMT+1)",
        "europeParis": "Europe/Paris (GMT+1)",
        "americaNewYork": "America/New York (GMT-5)",
        "asiaTokyo": "Asia/Tokyo (GMT+9)",
        "utc": "UTC"
      }
    }
  },
  "errors": {
    "type": {
      "required": "The interview type is required"
    }
  }
}
```

## 🎯 Utilisation

### Créer un Interview avec Google Meet

```typescript
const interview: CreateInterviewDto = {
  applicationId: "app-uuid",
  recruiterId: "rec-uuid",
  candidateId: "can-uuid",
  scheduledAt: "2025-08-15T14:00:00Z",
  durationMin: 45,
  type: InterviewType.GOOGLE_MEET, // ← Sélectionner Google Meet
  meetUrl: "https://meet.google.com/abc-defg-hij",
  timezone: "Africa/Douala",
  notes: "Premier entretien technique",
};
```

### Créer un Interview avec Daily.co

```typescript
const interview: CreateInterviewDto = {
  applicationId: "app-uuid",
  recruiterId: "rec-uuid",
  candidateId: "can-uuid",
  scheduledAt: "2025-08-15T14:00:00Z",
  durationMin: 45,
  type: InterviewType.DAILY_VIDEO_CALL, // ← Sélectionner Daily.co
  meetUrl: "", // Sera généré automatiquement par le backend
  timezone: "Africa/Douala",
  notes: "Premier entretien technique",
};
```

**Note** : Quand `type = DAILY_VIDEO_CALL`, le backend crée automatiquement une `VideoRoom` et génère l'URL Daily.co.

## 📊 Flux de Données

### 1. Création d'un Interview

```
Formulaire Frontend
    ↓
CreateInterviewDto (avec type)
    ↓
Backend API POST /interviews
    ↓
Si type = DAILY_VIDEO_CALL :
    - Créer VideoRoom
    - Générer URL Daily.co
    - Mettre à jour meetUrl
    ↓
Interview créé (avec videoRoom si Daily.co)
```

### 2. Affichage d'un Interview

```
Backend API GET /interviews/:id
    ↓
Interview {
  type: InterviewType
  meetUrl: string
  videoRoom?: VideoRoom  (si Daily.co)
}
    ↓
Frontend affiche selon le type
```

## 🔄 Compatibilité Backend

Le module frontend est maintenant 100% compatible avec les changements backend :

### Backend

- ✅ Enum `InterviewType` (GOOGLE_MEET | DAILY_VIDEO_CALL)
- ✅ Table `VideoRoom` séparée
- ✅ Champ `type` dans Interview
- ✅ Relation Interview ↔ VideoRoom
- ✅ Module Daily.co complet
- ✅ API endpoints fonctionnels

### Frontend

- ✅ Enum `InterviewType` correspondant
- ✅ Interface `VideoRoom` correspondante
- ✅ Champ `type` dans toutes les interfaces
- ✅ Formulaire avec sélecteur de type
- ✅ Traductions FR/EN complètes
- ✅ Validation simplifiée pour supporter les deux types d'URL

## 🎨 Interface Utilisateur

Le formulaire d'interview affiche maintenant :

1. **Date et heure** (datetime picker)
2. **Durée** (select avec options prédéfinies)
3. **Type d'entretien** ← NOUVEAU
   - Google Meet
   - Appel vidéo intégré (Daily.co)
4. **Lien de réunion** (URL input)
5. **Fuseau horaire** (select avec options)
6. **Notes** (textarea)

## 📝 Remarques Importantes

### 1. Validation de l'URL

La validation stricte de l'URL Google Meet a été supprimée pour permettre :

- URLs Google Meet : `https://meet.google.com/xxx-xxxx-xxx`
- URLs Daily.co : `https://your-domain.daily.co/room-name`
- Toute autre URL valide

### 2. Valeur par Défaut

Le type par défaut est `GOOGLE_MEET` pour maintenir la compatibilité avec le workflow existant.

### 3. Backend Auto-génération

Quand le type est `DAILY_VIDEO_CALL` :

- Le backend crée automatiquement la VideoRoom
- L'URL Daily.co est générée côté backend
- Le champ `meetUrl` peut être laissé vide dans le formulaire (sera rempli par le backend)

## ✅ Checklist de Mise à Jour

### Types et Interfaces

- [x] Ajout interface `VideoRoom`
- [x] Ajout champ `type` dans `Interview`
- [x] Ajout champ `type` dans `CreateInterviewDto`
- [x] Ajout champ `type` dans `InterviewFormData`
- [x] Ajout champ `type` dans `UpdateInterviewDto`
- [x] Ajout relation `videoRoom` dans `Interview`

### Formulaire

- [x] Import `InterviewType` enum
- [x] Ajout champ `type` dans la configuration
- [x] Position correcte du champ (après duration)
- [x] Validation requise
- [x] Valeur par défaut définie

### Traductions

- [x]
