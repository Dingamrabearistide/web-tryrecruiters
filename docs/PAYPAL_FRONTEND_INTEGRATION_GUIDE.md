# Guide d'intégration PayPal Frontend - TryRecruiters

## Vue d'ensemble

Ce guide explique comment utiliser le système de paiement PayPal intégré dans le frontend pour les souscriptions de forfaits employeurs.

## Architecture

L'intégration PayPal frontend se compose de:

1. **PayPal Service** (`src/app/core/services/paypal.service.ts`) - Service Angular pour gérer les interactions avec le SDK PayPal
2. **Pricing Plan Component** (`src/app/modules/payments/pricing-plan/`) - Composant de sélection de forfait avec modal de paiement
3. **Dashboard Component** (`src/app/modules/dashboard/submodules/employers/pages/subscriptions/`) - Page de gestion des souscriptions

## Configuration initiale

### 1. Configuration du PayPal Client ID

Dans `src/index.html`, remplacez `YOUR_CLIENT_ID` par votre vrai Client ID PayPal:

```html
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=USD"></script>
```

**Où obtenir le Client ID:**

- Mode Sandbox (test): [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
- Mode Production: Créez une application Live dans le même dashboard

**Important:**

- Utilisez le Client ID Sandbox pour les tests
- Utilisez le Client ID Live uniquement en production

### 2. Configuration des prix

Dans `dashboard-employers-subscriptions-list-page.component.ts`, les plans sont définis:

```typescript
plans: PricingPlan[] = [
  {
    id: 1,
    title: "1 annonce Basic",
    price: null, // Gratuit
    buttonLabel: "Publier une annonce Basic",
    features: [...]
  },
  {
    id: 2,
    title: "1 annonce Premium",
    price: 50000, // Prix en FCFA
    priceUsd: 88.6, // Prix en USD (utilisé par PayPal)
    buttonLabel: "Ajouter au panier",
    features: [...]
  },
  // ...
];
```

**Important:** Le prix `priceUsd` est utilisé pour le paiement PayPal. Assurez-vous que les conversions FCFA→USD sont correctes.

## Flux de paiement

### 1. Sélection du forfait

L'utilisateur clique sur un bouton de forfait:

- Si le forfait est **gratuit** (price: null) → Activation directe sans paiement
- Si le forfait est **payant** → Ouverture de la modal PayPal

### 2. Modal de paiement PayPal

La modal affiche:

- Le nom du forfait
- Le prix en FCFA et USD
- Un bouton PayPal dynamique

### 3. Processus de paiement

```
User clicks "Ajouter au panier"
    ↓
Modal opens with PayPal button
    ↓
User clicks PayPal button
    ↓
PayPal checkout page opens
    ↓
User completes payment
    ↓
PayPal returns to app
    ↓
onPaymentSuccess() is triggered
    ↓
Subscription is activated in backend
    ↓
Success message displayed
```

## Composants

### PayPalService

Service principal pour gérer le SDK PayPal.

**Méthodes principales:**

```typescript
// Attend que le SDK PayPal soit chargé
waitForPayPal(): Promise<boolean>

// Rend un bouton PayPal dans un conteneur HTML
renderPayPalButton(
  containerId: string,
  amount: number,
  currency: string,
  description: string,
  onSuccess: (details: any) => void,
  onError?: (error: any) => void,
  onCancel?: () => void
): Promise<void>

// Convertit FCFA en USD
convertFcfaToUsd(amountFcfa: number): number
```

### PricingPlansComponent

Composant qui affiche les forfaits et gère la modal de paiement.

**Inputs:**

- `plans`: Array de forfaits à afficher

**Outputs:**

- `paymentSuccess`: Émis quand le paiement réussit
- `paymentError`: Émis en cas d'erreur de paiement
- `selectPlan`: Émis pour les forfaits gratuits

**Exemple d'utilisation:**

```html
<app-pricing-plan
  [plans]="plans"
  (paymentSuccess)="onPaymentSuccess($event)"
  (paymentError)="onPaymentError($event)"
  (selectPlan)="onSelectFreePlan($event)"
/>
```

### DashboardComponent

Gère les callbacks de paiement et active les souscriptions.

**Méthodes principales:**

```typescript
// Callback de succès du paiement PayPal
onPaymentSuccess(event: { planId: number; details: any }) {
  // 1. Récupérer l'ID de l'entreprise
  // 2. Appeler le backend pour créer la souscription
  // 3. Afficher un message de succès
}

// Callback d'erreur de paiement
onPaymentError(event: { planId: number; error: any }) {
  // Afficher un message d'erreur
}

// Gestion des forfaits gratuits
onSelectFreePlan(planId: number) {
  // Activer directement sans paiement
}
```

## Intégration avec le backend

Après un paiement réussi, le frontend appelle:

```typescript
this.subscriptionService.createSubscription({
  companyId: companyId,
  planId: planId.toString(),
  autoRenew: false,
});
```

**Points importants:**

1. Le `companyId` doit être récupéré du contexte de l'utilisateur connecté
2. Le `planId` est l'ID du forfait sélectionné
3. `autoRenew: false` signifie que la souscription ne sera pas renouvelée automatiquement

## Gestion des erreurs

Le système gère plusieurs types d'erreurs:

### Erreurs de paiement PayPal

```typescript
onPaymentError(event: { planId: number; error: any }) {
  // Message affiché: "Une erreur est survenue lors du paiement"
  // Durée: 7 secondes
}
```

### Erreurs de création de souscription

```typescript
// Si le paiement réussit mais la création de souscription échoue
this.paymentErrorMessage =
  "Paiement réussi mais erreur lors de l'activation du forfait. Veuillez contacter le support.";
```

### Annulation par l'utilisateur

```typescript
onCancel: () => {
  console.log("Payment cancelled by user");
  this.paymentProcessing = false;
};
```

## Messages de feedback

Le système affiche des messages visuels:

### Message de succès (vert)

- Durée: 5 secondes
- Position: Top-right
- Exemple: "Forfait 'X' activé avec succès!"

### Message d'erreur (rouge)

- Durée: 7-10 secondes selon le type d'erreur
- Position: Top-right
- Exemple: "Une erreur est survenue lors du paiement"

### Overlay de chargement

- Affiché pendant le traitement
- Message: "Activation de votre forfait en cours..."

## Configuration de l'ID de l'entreprise

**TODO Important:** Dans le code actuel, l'ID de l'entreprise est hardcodé:

```typescript
const companyId = this.companyId || "company-id-from-user";
```

**À modifier pour récupérer le vrai ID:**

```typescript
// Option 1: Depuis le service d'authentification
const companyId = this.authService.getCurrentCompany()?.id;

// Option 2: Depuis le store (si vous utilisez NgRx/Akita)
const companyId = this.store.selectSnapshot(AuthState.companyId);

// Option 3: Depuis le localStorage
const companyId = localStorage.getItem("companyId");
```

## Tests

### Mode Sandbox

1. Utilisez le Client ID Sandbox dans index.html
2. Connectez-vous avec un compte PayPal Sandbox
3. Utilisez les cartes de test PayPal

**Comptes de test:**

- Créez des comptes dans [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/accounts)
- Type: Business (vendeur) et Personal (acheteur)

### Cartes de test

| Type | Numéro           | CVV | Expiration |
| ---- | ---------------- | --- | ---------- |
| Visa | 4032039554224838 | 123 | Future     |

### Cas de test à vérifier

1. ✅ Paiement d'un forfait payant réussi
2. ✅ Activation d'un forfait gratuit
3. ✅ Annulation de paiement par l'utilisateur
4. ✅ Erreur de paiement PayPal
5. ✅ Erreur de création de souscription backend
6. ✅ Fermeture de la modal de paiement

## Migration vers Production

### Checklist

- [ ] Remplacer le Client ID Sandbox par le Client ID Live
- [ ] Tester tous les flux de paiement en production
- [ ] Vérifier les taux de conversion FCFA→USD
- [ ] Configurer les webhooks PayPal (optionnel mais recommandé)
- [ ] Activer les logs de production
- [ ] Tester avec de vrais montants (petits montants d'abord)

### Conversion FCFA → USD

Le taux actuel dans le code est: **1 USD = 600 FCFA**

```typescript
convertFcfaToUsd(amountFcfa: number): number {
  const exchangeRate = 600;
  return Math.ceil((amountFcfa / exchangeRate) * 100) / 100;
}
```

**À ajuster selon le taux de change réel au moment du déploiement.**

## Sécurité

### Points de sécurité implémentés

1. ✅ Paiement traité côté PayPal (sécurisé)
2. ✅ Validation backend avant activation du forfait
3. ✅ Pas de stockage de données de carte bancaire
4. ✅ HTTPS requis en production

### Recommandations supplémentaires

1. Implémenter des webhooks PayPal pour notifications asynchrones
2. Logger tous les événements de paiement
3. Mettre en place une réconciliation des paiements
4. Surveiller les tentatives de fraude

## Dépannage

### Le bouton PayPal ne s'affiche pas

**Causes possibles:**

1. Client ID incorrect dans index.html
2. SDK PayPal non chargé (vérifier la console)
3. Container HTML introuvable

**Solution:**

```typescript
// Vérifier que le SDK est chargé
console.log("PayPal loaded:", typeof paypal !== "undefined");

// Vérifier que le container existe
const container = document.getElementById("paypal-button-container-X");
console.log("Container found:", container !== null);
```

### Le paiement est accepté mais la souscription n'est pas activée

**Causes possibles:**

1. Erreur d'API backend
2. ID d'entreprise incorrect
3. Plan ID invalide

**Solution:**

- Vérifier les logs backend
- Vérifier que `companyId` et `planId` sont corrects
- S'assurer que le service SubscriptionService fonctionne

### Erreur de conversion de devise

Si les montants ne correspondent pas, vérifier:

1. Le taux de conversion FCFA→USD
2. Que `priceUsd` est défini pour tous les forfaits payants
3. La cohérence entre prix FCFA et prix USD

## Support et Ressources

- [Documentation PayPal](https://developer.paypal.com/docs/)
- [PayPal SDK JavaScript](https://developer.paypal.com/sdk/js/)
- [Dashboard développeur PayPal](https://developer.paypal.com/dashboard/)
- [Backend PayPal Module](../backend-tryrecruiters/PAYPAL_PAYMENT_MODULE.md)

## Notes de version

### Version 1.0 (Actuelle)

- ✅ Intégration PayPal SDK
- ✅ Modal de paiement
- ✅ Gestion forfaits gratuits et payants
- ✅ Messages de feedback
- ✅ Activation automatique de la souscription

### Prochaines améliorations (TODO)

- [ ] Support des paiements récurrents
- [ ] Webhooks PayPal pour notifications
- [ ] Historique des paiements
- [ ] Téléchargement de factures
- [ ] Support multi-devises
- [ ] Système de coupons de réduction
