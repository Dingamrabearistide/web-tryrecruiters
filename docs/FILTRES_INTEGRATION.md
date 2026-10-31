# Intégration du composant TopFiltersComponent

## Résumé des modifications

Le composant `TopFiltersComponent` a été intégré dans les trois pages de listing principales :

1. **Page des candidats** (`candidates-list-page`)
2. **Page des compagnies** (`companies-list-page`)
3. **Page des offres d'emploi** (`job-offers-list-page`)

## Fonctionnalités ajoutées

### Filtres disponibles

- **Catégorie** : IT, Finance
- **Date de publication** : Anytime, Past month, Past week, Past 24 hours
- **Niveau d'expérience** : Entry level, Mid level, Senior level
- **Localisation** : Remote, Paris, London, New York
- **Recherche textuelle** : Champ de recherche libre

### Fonctionnement

- Les filtres sont appliqués en temps réel lors des changements
- La pagination est réinitialisée à la page 1 lors de l'application de nouveaux filtres
- Un bouton "Reset" permet de réinitialiser tous les filtres
- Les paramètres de filtrage sont transmis aux services backend via les paramètres de requête

## Modifications techniques

### 1. Composant TopFiltersComponent

- **Fichier** : `src/app/modules/home/components/top-filters/top-filters.component.ts`
- **Interface** : `FilterCriteria` et `JobFilterCriteria` pour la compatibilité
- **Événement** : `filterChange` émis à chaque modification des filtres

### 2. Pages de listing modifiées

#### Candidates List Page

- **Fichiers modifiés** :
    - `src/app/modules/home/pages/candidates/candidates-list-page/candidates-list-page.component.ts`
    - `src/app/modules/home/pages/candidates/candidates-list-page/candidates-list-page.component.html`
- **Nouvelles propriétés** : `currentFilters: JobFilterCriteria`
- **Nouvelle méthode** : `onFiltersChanged(filters: JobFilterCriteria)`

#### Companies List Page

- **Fichiers modifiés** :
    - `src/app/modules/home/pages/companies/companies-list-page/dashboard-candidates-companies-list-page.component.ts`
    - `src/app/modules/home/pages/companies/companies-list-page/dashboard-candidates-companies-list-page.component.html`
- **Nouvelles propriétés** : `currentFilters: JobFilterCriteria`
- **Nouvelle méthode** : `onFiltersChanged(filters: JobFilterCriteria)`

#### Job Offers List Page

- **Fichiers modifiés** :
    - `src/app/modules/home/pages/job-offers/job-offers-list-page/dashboard-candidates-favorites-list-page.component.ts`
    - `src/app/modules/home/pages/job-offers/job-offers-list-page/dashboard-candidates-favorites-list-page.component.html`
- **Nouvelles propriétés** : `currentFilters: JobFilterCriteria`
- **Nouvelle méthode** : `onFiltersChanged(filters: JobFilterCriteria)`

### 3. Module Home

- **Fichier** : `src/app/modules/home/home.module.ts`
- **Ajout** : `TopFiltersComponent` dans les déclarations et imports

## Paramètres de requête transmis au backend

Les filtres sont convertis en paramètres de requête HTTP :

- `category` : Catégorie sélectionnée
- `location` : Localisation sélectionnée
- `experienceLevel` : Niveau d'expérience sélectionné
- `postedDate` : Période de publication sélectionnée
- `search` : Terme de recherche saisi

## Utilisation

1. **Navigation** : Accédez à l'une des pages de listing (candidats, compagnies, ou offres d'emploi)
2. **Filtrage** : Utilisez les filtres en haut de la page pour affiner les résultats
3. **Recherche** : Saisissez un terme dans le champ de recherche et cliquez sur "Search"
4. **Réinitialisation** : Cliquez sur "Reset" pour effacer tous les filtres

## Notes techniques

- Les services backend doivent être configurés pour accepter et traiter ces paramètres de filtrage
- La pagination est automatiquement réinitialisée lors de l'application de nouveaux filtres
- Le composant est réutilisable et peut être facilement étendu avec de nouveaux types de filtres
- L'interface `FilterCriteria` peut être étendue pour supporter d'autres types de filtres spécifiques
