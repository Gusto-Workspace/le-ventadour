# Le Ventadour

Homepage Next.js du restaurant Le Ventadour, en JavaScript et Pages Router. Les autres pages sont à créer ultérieurement.

Organisation : `src/pages/*.page.js` pour les routes, `src/components/home/sections` pour les sections, `src/components/_shared` pour les éléments communs, `src/contexts` pour les données Gusto, `src/_assets/utils` pour les helpers et `src/styles/style.scss` pour le style.

```bash
npm install
npm run dev -- -H 127.0.0.1
```

Copier `.env.example` vers `.env.local` quand le restaurant Le Ventadour aura son identifiant Gusto. Sans ces variables, la homepage affiche les informations validées du site public.
