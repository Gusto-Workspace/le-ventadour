# Le Ventadour — audit frontend du 26 octobre 2026

## Bilan

| Portée npm | Avant | Après |
| --- | --- | --- |
| Complet | 3 : 1 critique, 2 hautes | 1 critique (`next`) |
| Production | 3 : 1 critique, 2 hautes | 1 critique (`next`) |

Les preuves avant/après et chaînes transitives sont dans [security-audit/2026-10-26](security-audit/2026-10-26/). La qualification commune des avis Next.js et l'inventaire dédupliqué des avis sont dans le [rapport commun](../../../docs/AUDIT_FRONTEND_CLIENTS_2026-10-26.md).

## Versions corrigées

| Paquet / chemin | Avant → après |
| --- | --- |
| Next → PostCSS | 8.4.31 → 8.5.31 |
| PostCSS → source-map-js | 1.2.1 → 1.2.2 |
| PostCSS → nanoid (dépendance nécessaire) | 3.3.19 → 3.3.20 |

Un override limité à `next → postcss` remplace la version 8.4.31 épinglée par Next, dans la même majeure 8. Next reste exactement 14.2.35 ; React, Sass et Stripe restent inchangés. Aucun outil Tailwind, ESLint, Axios ou dépendance d'un autre restaurant n'est ajouté.

## Exposition

Vercel confirmé par le propriétaire. Pages Router, absence de middleware d'autorisation et de Server Actions ; la redirection `/carte-menus → /menus` reste interne et statique. Les images locales utilisent le service géré Vercel ; aucun domaine externe d'optimisation n'est autorisé. Les avis qui excluent explicitement Vercel sont distingués des risques natifs d'images qui nécessitent une preuve fournisseur. Aucun CSS non fiable fourni par un visiteur n'est compilé.

## Validation

- `npm ci --no-audit --no-fund` réussi ; `npm ls --all --json` valide.
- `npm run build` réussi sous Node 24.22.1/npm 11.19.1 ; compilation Sass et routes SSR réussies.
- Tests Chrome desktop/mobile avec une API simulée : menus dynamiques, réservations et Gusto Print ; détail dans les preuves navigateur. Aucun test automatique préexistant déclaré dans ce dépôt.
- Formulaire de réservation complet jusqu'au récapitulatif et au POST API, erreur de préparation d'empreinte bancaire gérée, exactement une impression automatique. Aucun débordement horizontal détecté sur les pages testées à 1440/390 px. L'erreur attendue de chargement Stripe correspond au blocage volontaire du réseau Stripe réel.
- Aucun paiement Stripe, email ni mutation Render réel. Safari/Firefox et 3DS restent à vérifier en recette.

## Risque résiduel et modifications locales

Le paquet Next conserve une alerte critique agrégée. [GHSA-2464-fhr4-w9xw](https://github.com/vercel/next.js/security/advisories/GHSA-2464-fhr4-w9xw) nécessite la confirmation de la version corrigée du service Image Optimization Vercel ; l'avis n'exclut pas cette plateforme. Le rapport commun distingue chaque précondition. Aucun correctif n'est publié dans la branche 14 après 14.2.35. Prévoir une migration séparée vers Next 15.5.x corrigé au moins 15.5.28, réaudité à cette date, ou une version 16 corrigée ; aucune migration majeure forcée ici.

Les modifications locales de `_app`, `/menus`, Gusto Print et sa feuille CSS sont conservées, y compris leurs évolutions intervenues pendant la mission. Aucun composant, style, design, header ou contrat Gusto Manager n'a été édité par cet audit. Aucun commit, push ou déploiement. Les `.next` de test utilisent une API locale simulée, à reconstruire pour toute recette.
