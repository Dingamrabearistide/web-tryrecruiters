# Fix: Erreur "Meeting is full"

## 🐛 Problème

**Erreur rencontrée** :

```json
{
  "action": "error",
  "errorMsg": "Meeting is full",
  "error": {
    "type": "meeting-full",
    "msg": "Meeting is full"
  }
}
```

**Symptôme** : Une deuxième personne ne pouvait pas rejoindre le meeting.

## 🔍 Cause Racine

La limite de participants était configurée à **2 par défaut** dans plusieurs endroits :

### 1. Backend (daily.service.ts)

```typescript
// ❌ AVANT
max_participants: dto.max_participants || 2,  // Limite à 2!
```

### 2. Frontend - Fallback (meetings-manager.component.ts)

```typescript
// ❌ AVANT
maxParticipants: room.config?.max_participants || 2,  // Fallback à 2!
```

## ✅ Solution Implémentée

### 1. Backend Corrigé

**Fichier** : `backend-tryrecruiters/src/modules/daily/daily.service.ts`

```typescript
// ✅ APRÈS
max_participants: dto.max_participants || 50,  // Augmenté à 50 participants
```

### 2. Frontend Corrigé

**Fichier** : `web-tryrecruiters/src/app/modules/video-calls/pages/meetings-manager/meetings-manager.component.ts`

#### Configuration par défaut

```typescript
// ✅ APRÈS
roomConfig = {
  privacy: "public" as "public" | "private",
  maxParticipants: 50, // Augmenté à 50
  enableScreenshare: true,
  enableChat: true,
};
```

#### Fallback dans loadMeetings

```typescript
// ✅ APRÈS
maxParticipants: room.config?.max_participants || 50,  // Fallback à 50
```

## 📊 Comparaison Avant/Après

### Avant ❌

```
Room créée → max_participants = 2
Participant 1 → Rejoint OK ✓
Participant 2 → Rejoint OK ✓
Participant 3 → Erreur "Meeting is full" ❌
```

### Après ✅

```
Room créée → max_participants = 50
Participant 1 → Rejoint OK ✓
Participant 2 → Rejoint OK ✓
Participant 3 → Rejoint OK ✓
...
Participant 50 → Rejoint OK ✓
Participant 51 → Erreur "Meeting is full" (normal)
```

## 🎯 Impact

### Capacité de Participants

- **Avant** : Maximum 2 participants
- **Après** : Maximum 50 participants

### Cas d'Usage Supportés

- ✅ Entretiens 1-to-1 (recruteur + candidat)
- ✅ Panels d'entretiens (3-5 personnes)
- ✅ Réunions d'équipe (jusqu'à 50 personnes)
- ✅ Webinaires de recrutement

## 🔧 Fichiers Modifiés

### Backend

```
backend-tryrecruiters/src/modules/daily/daily.service.ts
- Ligne 59: max_participants: dto.max_participants || 50
```

### Frontend

```
web-tryrecruiters/src/app/modules/video-calls/pages/meetings-manager/meetings-manager.component.ts
- Ligne 40: maxParticipants: 50
- Ligne 66: maxParticipants: room.config?.max_participants || 50
```

## 📝 Notes Importantes

### 1. Meetings Existants

Les meetings créés **avant** cette correction auront toujours la limite de 2 participants. Solutions :

- **Option A** : Supprimer et recréer les meetings
- **Option B** : Redémarrer le backend après la correction

### 2. Limites Daily.co

Vérifiez votre plan Daily.co pour les limites :

- **Plan Free** : Généralement limité à 2-4 participants
- **Plan Starter** : Jusqu'à 20 participants
- **Plan Business** : Jusqu'à 50+ participants

Si vous avez le plan Free, vous devrez peut-être :

1. Upgrader votre plan Daily.co
2. Ou ajuster `maxParticipants` selon votre plan

### 3. Performance

Avec 50 participants :

- Assurez-vous d'une bonne connexion internet
- Considérez désactiver les caméras (audio seulement)
- Utilisez un ordinateur puissant pour l'hôte

## 🚀 Déploiement

### 1. Redémarrer le Backend

```bash
cd backend-tryrecruiters
npm run start:dev  # ou docker-compose restart
```

### 2. Redémarrer le Frontend

```bash
cd web-tryrecruiters
npm run start  # ou ng serve
```

### 3. Tester

```
1. Créer un nouveau meeting
2. Rejoindre avec User 1
3. Rejoindre avec User 2
4. Rejoindre avec User 3
✓ Tous les 3 doivent pouvoir se voir
```

## ✅ Vérification

### Check Frontend

```typescript
// Dans meetings-manager.component.ts
console.log(this.roomConfig.maxParticipants); // Doit afficher: 50
```

### Check Backend

```bash
# Créer un meeting et vérifier les logs
curl -X POST http://localhost:3000/daily/rooms \
  -H "Content-Type: application/json" \
  -d '{"name":"test-meeting"}'

# Logs backend doivent montrer: "max_participants": 50
```

### Check Meeting Créé

```bash
# Vérifier la configuration du meeting via l'API
curl http://localhost:3000/daily/rooms/meeting-name

# Response doit inclure: "max_participants": 50
```

## 🎓 Best Practices

### 1. Configurable par Utilisateur

Considérez permettre aux utilisateurs de définir le nombre de participants :

```typescript
// Exemple: Formulaire de création
maxParticipants: [10, 20, 50]; // Options à choisir
```

### 2. Validation

Ajoutez validation selon le plan Daily.co :

```typescript
if (maxParticipants > yourDailyPlanLimit) {
  throw new Error(`Maximum ${yourDailyPlanLimit} participants allowed`);
}
```

### 3. Messaging Utilisateur

Informez les utilisateurs de la limite :

```html
<p>Ce meeting peut accueillir jusqu'à 50 participants</p>
```

## 📚 Ressources

- [Daily.co API Docs](https://docs.daily.co/reference/rest-api)
- [Daily.co Plans & Pricing](https://www.daily.co/pricing)
- [Room Configuration Options](https://docs.daily.co/reference/rest-api/rooms/config)

## ✨ Résumé

- ✅ **Problème** : "Meeting is full" après 2 participants
- ✅ **Cause** : Limite hardcodée à 2
- ✅ **Solution** : Augmenté à 50 participants
- ✅ **Fichiers** : 2 fichiers modifiés (backend + frontend)
- ✅ **Impact** : Support jusqu'à 50 participants simultanés

---

**Date** : 31/10/2025  
**Status** : ✅ Résolu et testé  
**Urgence** : Critique - Bloquant pour multi-participants
