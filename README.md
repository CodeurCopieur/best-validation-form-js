# Formulaire d'inscription — validation déclarative

Formulaire d'inscription complet construit avec Nuxt 4, où les contraintes de
chaque champ sont décrites dans un **schéma typé** plutôt que dispersées dans des
`if` de composants. Un moteur de règles générique lit ce schéma et produit les
messages d'erreur, côté navigateur comme côté serveur.

Le projet est une reconstruction de
[best-validation-form-js](https://github.com/CodeurCopieur/best-validation-form-js/tree/backup-vanilla),
qui appliquait la même idée en JavaScript vanilla à partir des attributs de
validation HTML. Le code d'origine reste disponible sur la branche
`backup-vanilla`.

## Fonctionnalités

- **Validation déclarative** : une seule source de vérité pour les contraintes,
  partagée entre le client et l'API.
- **Revalidation serveur** : l'API rejoue exactement les mêmes règles et ne fait
  jamais confiance à l'entrée reçue.
- **Feedback progressif** : rien ne s'affiche avant que l'utilisateur ait quitté
  un champ, puis l'erreur disparaît dès la frappe qui la corrige.
- **Indicateur de robustesse** du mot de passe, sur cinq niveaux.
- **Erreurs serveur réinjectées** dans les champs concernés (adresse email déjà
  utilisée, par exemple).
- **Accessibilité** : liaisons ARIA, annonces `role="alert"`, focus automatique
  sur le premier champ invalide, focus visible cohérent.
- **Animations GSAP** désactivées d'office si le système demande de réduire les
  animations.
- **Thème clair / sombre** automatique, sans JavaScript.

## Stack technique

| Outil | Version | Rôle |
| --- | --- | --- |
| [Nuxt](https://nuxt.com) | 4 | Framework full-stack, rendu serveur et routes API |
| [Vue](https://vuejs.org) | 3.5 | Composants en `<script setup>` |
| [Pinia](https://pinia.vuejs.org) | 3 | Store de soumission (`setup store`) |
| [Tailwind CSS](https://tailwindcss.com) | 4 | Styles, via le plugin Vite officiel |
| [GSAP](https://gsap.com) | 3 | Animations, avec ScrollTrigger |
| [TypeScript](https://www.typescriptlang.org) | 5.9 | Typage de bout en bout |
| [Nitro](https://nitro.build) | — | Serveur de l'API, fourni par Nuxt |

Aucune bibliothèque de validation externe (ni Zod, ni Vee-Validate, ni Yup) :
le moteur fait une centaine de lignes et sert de démonstration.

## Démarrage

Prérequis : **Node.js 20 ou plus**.

```bash
npm install
npm run dev
```

L'application est alors disponible sur http://localhost:3000.

Pour tester le refus serveur, soumets le formulaire avec l'adresse
`deja@exemple.fr` ou `test@exemple.fr` : elles sont traitées comme déjà
enregistrées.

### Scripts

| Commande | Effet |
| --- | --- |
| `npm run dev` | Serveur de développement avec rechargement à chaud |
| `npm run build` | Build de production dans `.output/` |
| `npm run preview` | Sert le build de production localement |
| `npm run generate` | Export statique (l'API ne fonctionnera pas) |
| `npm run typecheck` | Vérification des types avec `vue-tsc` |

## Architecture

```
app/
  components/       Interface : formulaire, champ, indicateurs, décor
  composables/      Logique réutilisable : validation, animations
  stores/           État de la soumission (Pinia)
  pages/index.vue   Page unique
  assets/css/       Thème et base Tailwind
server/
  api/register.post.ts   Endpoint d'inscription
shared/
  validation.ts     Moteur de règles générique
  registration.ts   Schéma du formulaire d'inscription
```

Le dossier `shared/` est une convention Nuxt 4 : son contenu est accessible via
l'alias `#shared` depuis le client **et** depuis le serveur. C'est ce qui permet
de n'écrire les contraintes qu'une seule fois.

## Le moteur de validation

Un champ se décrit par un objet. Les contraintes disponibles sont `required`,
`minLength`, `maxLength`, `email`, `pattern`, `match` (égalité avec un autre
champ) et `validate` pour une règle sur mesure.

```ts
email: {
  label: 'L\'adresse email',
  feminine: true,
  required: true,
  email: true,
  maxLength: 254,
},
confirmPassword: {
  label: 'La confirmation',
  feminine: true,
  required: true,
  match: 'password',
},
```

Le moteur parcourt ses règles du plus général au plus précis et retourne le
premier message applicable, de façon à ne jamais afficher deux reproches à la
fois. Les messages sont générés à partir du `label`, et l'indicateur `feminine`
sert à l'accord grammatical — « L'adresse email est requise » plutôt que
« requis ».

Deux détails de comportement méritent d'être signalés. Un champ optionnel laissé
vide est considéré comme valide : ses autres contraintes ne s'activent qu'à
partir du moment où l'utilisateur a saisi quelque chose. Et la fonction
`dependentFields` permet de revalider automatiquement « Confirmer le mot de
passe » quand le mot de passe source change.

### Règles du formulaire

| Champ | Contraintes |
| --- | --- |
| Prénom | Requis, 2 à 40 caractères, lettres Unicode, espaces, `-` et `'` |
| Adresse email | Requise, format valide, 254 caractères maximum |
| Mot de passe | Requis, 8 à 72 caractères, une minuscule, une majuscule, un chiffre |
| Confirmation | Requise, identique au mot de passe |

## Stratégie de feedback

Le composable `useFormValidation` distingue trois notions : la valeur du champ,
l'erreur réelle et l'erreur *affichée*. Un champ n'affiche son message qu'une
fois `touched` (l'utilisateur l'a quitté) ou après une tentative de soumission.
Cela évite de réprimander quelqu'un qui est encore en train de taper, tout en
corrigeant immédiatement l'affichage dès que la saisie devient valide.

À la soumission d'un formulaire invalide, trois choses se produisent : tous les
messages sont révélés, le formulaire est secoué latéralement, et le focus part
sur le premier champ en faute.

## Accessibilité

Le formulaire porte `novalidate` pour désactiver les bulles natives du
navigateur, remplacées par les messages du schéma. Chaque champ associe son
libellé par `for` / `id`, expose `aria-invalid` et pointe via `aria-describedby`
vers son message d'erreur ou, à défaut, son indication. Les messages d'erreur
sont annoncés par `role="alert"`. Le bouton d'affichage du mot de passe expose
`aria-pressed` et un `aria-label` qui décrit l'action à venir.

## Animations

GSAP est enregistré dans un plugin client (`app/plugins/gsap.client.ts`) et
exposé par `useGsap()`. Les animations passent par `useGsapContext`, qui les
enferme dans un `gsap.context` nettoyé automatiquement au démontage du
composant.

La préférence système `prefers-reduced-motion` est respectée partout : les
révélations en cascade, les secousses et les dépliages de messages sont
simplement ignorés, et l'interface reste entièrement fonctionnelle.

Les éléments à révéler sont masqués en CSS par `.reveal-hidden`, mais uniquement
si la classe `js` est présente sur `<html>`. Cette classe est posée par un
script inline avant le premier rendu, ce qui garantit que le contenu reste
visible si JavaScript ne s'exécute pas.

## Thème

Les couleurs sont définies en `oklch` sous forme de variables sémantiques
(`--surface`, `--ink-soft`, `--negative`…) puis exposées à Tailwind via
`@theme inline`. Les composants n'utilisent donc que des classes comme
`bg-surface` ou `text-ink-soft`, et le thème sombre se limite à redéfinir les
variables dans un bloc `prefers-color-scheme`.

## API

### `POST /api/register`

Corps attendu : `firstName`, `email`, `password`, `confirmPassword`.

| Statut | Cas |
| --- | --- |
| `200` | Inscription acceptée, retourne `{ email, firstName }` |
| `422` | Champs invalides, détail dans `data.fields` |
| `409` | Adresse email déjà utilisée |

Les erreurs `422` et `409` renvoient un objet `fields` que le store réinjecte
directement dans les champs concernés. Une latence de 700 ms est simulée en cas
de succès pour rendre l'état de chargement observable.

Il n'y a **pas de base de données** : les adresses déjà prises sont un `Set` en
dur dans le fichier de la route, et aucun compte n'est réellement créé.

## Déploiement

Le projet se déploie sans configuration sur toute plateforme supportée par
Nitro. Sur [Vercel](https://vercel.com/new), il suffit d'importer le dépôt : le
framework est détecté automatiquement et la route `/api/register` devient une
fonction serverless.

`npm run generate` produit un site statique, mais l'inscription cesse alors de
fonctionner, faute de code exécuté à la demande.
