# Endpoints Backend Utilisés - Intégration PayPal Frontend

## Vue d'ensemble

Ce document liste tous les endpoints backend utilisés par le composant `DashboardEmployersSubscriptionsListPageComponent` pour l'intégration PayPal frontend.

## Architecture de l'intégration

L'intégration PayPal est 100% frontend:

1. **PayPal SDK JavaScript** gère le paiement côté client
2. Une fois le paiement validé par PayPal, le frontend appelle le backend pour **activer la souscription**
3. Aucun endpoint de paiement backend n'est utilisé (pas de redirection PayPal côté serveur)

## Endpoints Backend Utilisés

### 1. SubscriptionService

#### GET `/subscriptions/plans`

**Méthode:** `getAllPlans()`  
**Utilisation:** Charger tous les plans de souscription disponibles  
**Appelé dans:** `ngOnInit()` via `loadAvailablePlans()`

```typescript
this.subscriptionService.getAllPlans().subscribe({
  next: (plans) => {
    this.availablePlans = plans;
  },
});
```

**Response:**

```json
[
  {
    "id": "plan-uuid",
    "name": "Plan Premium",
    "type": "PREMIUM",
    "price": 50000,
    "currency": "XAF",
    "maxJobOffers": 10,
    ...
  }
]
```

---

#### GET `/subscriptions/company/:companyId`

**Méthode:** `getCompanySubscription(companyId: string)`  
**Utilisation:** Récupérer la souscription active d'une entreprise  
**Appelé dans:** `ngOnInit()` via `loadCurrentSubscription()`

```typescript
this.subscriptionService.getCompanySubscription(companyId).subscribe({
  next: (subscription) => {
    this.currentSubscription = subscription;
  },
});
```

**Response:**

```json
{
  "id": "subscription-uuid",
  "companyId": "company-uuid",
  "planId": "plan-uuid",
  "status": "ACTIVE",
  "startDate": "2025-01-17T00:00:00Z",
  "endDate": null,
  "plan": {
    "name": "Plan Premium",
    "price": 50000,
    ...
  }
}
```

---

#### POST `/subscriptions`

**Méthode:** `createSubscription(data: {companyId, planId, autoRenew})`  
**Utilisation:** Créer/Activer une souscription après paiement PayPal réussi  
**Appelé dans:**

- `onPaymentSuccess()` - Après paiement PayPal validé
- `onSelectFreePlan()` - Activation directe d'un plan gratuit

```typescript
this.subscriptionService
  .createSubscription({
    companyId: companyId,
    planId: planId.toString(),
    autoRenew: false,
  })
  .subscribe({
    next: (subscription) => {
      // Souscription activée
    },
  });
```

**Request:**

```json
{
  "companyId": "company-uuid",
  "planId": "plan-uuid-or-number",
  "autoRenew": false
}
```

**Response:**

```json
{
  "id": "subscription-uuid",
  "companyId": "company-uuid",
  "planId": "plan-uuid",
  "status": "ACTIVE",
  "startDate": "2025-01-17T10:00:00Z",
  "plan": {
    "name": "Plan Premium",
    "type": "PREMIUM"
  }
}
```

---

## Endpoints Backend NON Utilisés

Les endpoints suivants du `PaymentService` ne sont **PAS utilisés** dans cette implémentation car le paiement PayPal est géré entièrement côté frontend via le SDK JavaScript:

### ❌ POST `/payments/create-order`

**Raison:** Le bouton PayPal crée l'ordre directement via le SDK JavaScript

### ❌ POST `/payments/capture-order`

**Raison:** PayPal SDK capture automatiquement le paiement après approbation

### ❌ GET `/payments/order/:orderId`

**Raison:** Pas besoin de récupérer les détails de l'ordre, PayPal SDK retourne tout

---

## Flux de Paiement Complet

### Scénario 1: Forfait Payant

```
1. User clicks "Ajouter au panier"
   └─> pricing-plan.component ouvre la modal

2. PayPal Button rendered in modal
   └─> PayPalService.renderPayPalButton()
   └─> SDK PayPal crée l'ordre (côté PayPal)

3. User completes payment on PayPal
   └─> PayPal SDK returns payment details

4. onPaymentSuccess() triggered
   └─> POST /subscriptions (createSubscription)
   └─> Subscription activated in backend

5. Success message displayed
   └─> GET /subscriptions/company/:companyId (refresh)
```

### Scénario 2: Forfait Gratuit

```
1. User clicks "Publier une annonce Basic"
   └─> pricing-plan.component emits selectPlan

2. onSelectFreePlan() triggered
   └─> POST /subscriptions (createSubscription)
   └─> Subscription activated immediately

3. Success message displayed
   └─> GET /subscriptions/company/:companyId (refresh)
```

---

## Sécurité et Validation

### Côté Frontend

- ✅ PayPal SDK gère le paiement sécurisé
- ✅ Validation des montants côté PayPal
- ✅ Pas de manipulation de données de carte bancaire

### Côté Backend

- ✅ L'endpoint `/subscriptions` doit valider:
  - Authentification JWT
  - Permission sur l'entreprise
  - Validité du plan
  - Pas de souscription active existante

---

## Configuration Requise

### Frontend (index.html)

```html
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=USD"></script>
```

### Backend

- Aucune configuration PayPal backend requise pour cette implémentation
- Le backend gère uniquement les souscriptions

---

## Avantages de cette Approche

1. **Simplicité**: Pas besoin de gérer les redirections PayPal côté serveur
2. **UX améliorée**: Paiement dans une modal, pas de redirection externe
3. **Moins de code backend**: Pas besoin d'endpoints de paiement complexes
4. **Sécurité**: PayPal gère tout le processus de paiement
5. **Maintenance**: Moins de code à maintenir

---

## Endpoints Alternatifs (Disponibles mais non utilisés)

Si vous souhaitez utiliser le flux de paiement avec redirection (comme documenté dans `SUBSCRIPTION_PAYMENT_INTEGRATION.md`), vous pouvez utiliser:

### POST `/subscriptions/purchase`

Crée un ordre PayPal ou une souscription directe

### POST `/subscriptions/confirm-payment`

Capture le paiement PayPal et active la souscription

### POST `/subscriptions/upgrade`

Change le plan d'une entreprise

**Note:** Ces endpoints sont disponibles mais l'implémentation actuelle utilise l'approche frontend uniquement qui est plus simple et offre une meilleure UX.

---

## Résumé

**Endpoints utilisés:** 3

- GET `/subscriptions/plans`
- GET `/subscriptions/company/:companyId`
- POST `/subscriptions`

**Endpoints disponibles mais non utilisés:** 5+

- POST `/payments/create-order`
- POST `/payments/capture-order`
- GET `/payments/order/:orderId`
- POST `/subscriptions/purchase`
- POST `/subscriptions/confirm-payment`
- POST `/subscriptions/upgrade`

**Approche:** Frontend PayPal SDK + Backend Subscription Management

Cette approche minimale est suffisante et recommandée pour une intégration PayPal frontend simple et efficace.
