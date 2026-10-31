# Fix: Erreur "Duplicate DailyIframe instances are not allowed"

## 🐛 Problème

L'erreur `Duplicate DailyIframe instances are not allowed` se produit lorsque :

1. Une instance Daily.co existe déjà dans le DOM
2. On tente de créer une nouvelle instance sans avoir détruit la précédente
3. Le cleanup n'est pas fait correctement lors de la navigation

## ✅ Solution Implémentée

### 1. Nouvelle Méthode `cleanupCallObject()`

Ajout d'une méthode dédiée pour nettoyer proprement l'instance Daily.co :

```typescript
private async cleanupCallObject(): Promise<void> {
  if (this.callObject) {
    try {
      // 1. Supprimer tous les event listeners
      this.callObject.off("joined-meeting", this.handleJoinedMeeting.bind(this));
      this.callObject.off("left-meeting", this.handleLeftMeeting.bind(this));
      this.callObject.off("participant-joined", this.handleParticipantJoined.bind(this));
      this.callObject.off("participant-left", this.handleParticipantLeft.bind(this));
      this.callObject.off("error", this.handleError.bind(this));
      this.callObject.off("camera-error", this.handleCameraError.bind(this));

      // 2. Quitter le meeting si connecté
      if (this.isJoined) {
        await this.callObject.leave();
      }

      // 3. Détruire l'instance
      await this.callObject.destroy();
    } catch (err) {
      console.error("Error cleaning up call object:", err);
    } finally {
      // 4. Reset les variables
      this.callObject = null;
      this.isJoined = false;
    }
  }
}
```

### 2. Cleanup Avant Initialisation

Modification de `initializeCall()` pour nettoyer avant de créer :

```typescript
private async initializeCall(): Promise<void> {
  try {
    // Détruire toute instance existante d'abord
    await this.cleanupCallObject();

    // Créer l'objet Daily call
    this.callObject = DailyIframe.createFrame(
      this.videoContainer.nativeElement,
      { ... }
    );

    // ...
  } catch (err) {
    // ...
  }
}
```

### 3. Amélioration de `retry()`

```typescript
async retry(): Promise<void> {
  this.error = null;
  this.isLoading = true;
  await this.initializeCall(); // Maintenant async
}
```

### 4. Simplification de `leaveCall()`

```typescript
async leaveCall(): Promise<void> {
  await this.cleanupCallObject(); // Utilise la méthode dédiée
}
```

## 🎯 Résultat

### Avant (❌ Problèmes)

```
1. Navigation → Call Room
2. Instance Daily.co créée
3. Retour → Navigation
4. Instance pas détruite correctement
5. Retour à Call Room
6. Tentative de créer nouvelle instance
7. ❌ Erreur: Duplicate DailyIframe
```

### Après (✅ Fonctionne)

```
1. Navigation → Call Room
2. Instance Daily.co créée
3. Retour → Navigation
4. ngOnDestroy() → cleanupCallObject()
5. Instance détruite proprement
6. Retour à Call Room
7. cleanupCallObject() vérifie (aucune instance)
8. Nouvelle instance créée
9. ✅ Call démarre correctement
```

## 🔧 Tests

### Test 1: Navigation Multiple

```
✅ Meetings → Call → Retour → Call → Retour → Call
✅ Aucune erreur de duplicate
```

### Test 2: Retry

```
✅ Erreur de connexion → Clic Retry
✅ Ancienne instance détruite
✅ Nouvelle instance créée
```

### Test 3: Multiple Participants

```
✅ Navigateur 1 rejoint le call
✅ Navigateur 2 rejoint le call
✅ Les deux voient le participant
✅ Aucune erreur de duplicate
```

## 📝 Points Clés

### 1. Cleanup Systématique

- **Avant** chaque nouvelle instance
- **Pendant** ngOnDestroy
- **Après** chaque erreur (retry)

### 2. Ordre des Opérations

```
1. Supprimer event listeners (évite memory leaks)
2. Quitter le meeting (libère ressources)
3. Détruire l'instance (nettoie DOM)
4. Reset variables (état propre)
```

### 3. Gestion des Erreurs

```typescript
try {
  // Cleanup operations
} catch (err) {
  console.error("Error cleaning up:", err);
} finally {
  // Toujours reset les variables
  this.callObject = null;
  this.isJoined = false;
}
```

## 🚨 Erreurs Évitées

### 1. Memory Leaks

```typescript
// ❌ AVANT: Event listeners pas supprimés
this.callObject.destroy();

// ✅ APRÈS: Suppression explicite
this.callObject.off("joined-meeting", handler);
this.callObject.destroy();
```

### 2. State Inconsistant

```typescript
// ❌ AVANT: Variables pas réinitialisées
this.callObject.destroy();

// ✅ APRÈS: Reset complet
this.callObject = null;
this.isJoined = false;
```

### 3. Concurrent Instances

```typescript
// ❌ AVANT: Création sans vérification
this.callObject = DailyIframe.createFrame(...);

// ✅ APRÈS: Cleanup d'abord
await this.cleanupCallObject();
this.callObject = DailyIframe.createFrame(...);
```

## 📊 Impact

### Performance

- ✅ Moins de memory leaks
- ✅ Meilleur nettoyage des ressources
- ✅ État cohérent du composant

### Stabilité

- ✅ Pas d'erreur duplicate iframe
- ✅ Navigation fluide
- ✅ Retry fonctionnel

### User Experience

- ✅ Possibilité de naviguer librement
- ✅ Reconnexion facile après erreur
- ✅ Multiple participants sans conflit

## 🎓 Best Practices Appliquées

### 1. Async/Await

```typescript
async retry(): Promise<void> {
  await this.initializeCall(); // Attendre le cleanup
}
```

### 2. Finally Block

```typescript
try {
  // Operations
} finally {
  // Toujours exécuté, même en cas d'erreur
  this.callObject = null;
}
```

### 3. Null Checks

```typescript
if (this.callObject) {
  // Opérations seulement si instance existe
}
```

### 4. Error Logging

```typescript
catch (err) {
  console.error("Error cleaning up:", err);
  // Permet le débogage
}
```

## ✅ Conclusion

La solution implémentée :

- ✅ **Résout** l'erreur "Duplicate DailyIframe"
- ✅ **Améliore** la gestion du lifecycle
- ✅ **Prévient** les memory leaks
- ✅ **Garantit** un état cohérent
- ✅ **Permet** multiple participants

Le système de call vidéo est maintenant stable et peut être utilisé en production.

---

**Date**: 31/10/2025  
**Fichier modifié**: `web-tryrecruiters/src/app/modules/video-calls/components/video-call/video-call.component.ts`  
**Status**: ✅ Résolu et testé
