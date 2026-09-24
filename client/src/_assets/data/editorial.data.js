// Transcription des menus photographiés. Le Bistrot change régulièrement.
export const bistrotMenu = {
  id: "menu-bistrot",
  title: "Menu Bistrot",
  eyebrow: "LA TABLE DU MIDI",
  price: 22,
  period: "Du lundi 21 au vendredi 25 septembre",
  description: "Une cuisine de saison, généreuse et authentique, élaborée à partir de produits frais.",
  image: "plat-poisson",
  imageAlt: "Assiette de poisson de saison",
  imageLabel: "DES PRODUITS DE SAISON",
  showAllergens: false,
  sections: [
    {
      title: "Entrées",
      items: [
        { name: "Le tartare de bœuf Charolais° assaisonné par nos soins, roquette et buisson de légumes", allergens: [5, 10, 3] },
        { name: "Le velouté de courgettes, gambas panées à la Panko, sauce vierge", allergens: [7, 5, 1, 3, 2] },
      ],
    },
    {
      title: "Plats",
      items: [
        { name: "L’araignée de porc° cuite en basse température, marinée au thym et basilic, lentilles noires Beluga au petit salé", allergens: [5, 7] },
        { name: "Le filet de dorade royale cuit à la plancha, fumé de poisson, frites de patate douce, nem de champignons", allergens: [4, 7, 5, 1, 3] },
      ],
    },
    {
      title: "Desserts",
      items: [
        { name: "La tarte, crème à l’amande, prunes du Tarn et Garonne rôties au romarin, copeaux de meringue", allergens: [1, 3, 7, 8] },
        { name: "La coque au chocolat noir, praliné, crème mascarpone au miel, noix caramélisées", allergens: [7, 3, 8] },
      ],
    },
  ],
  notes: [],
};

export const ventadourMenu = {
  id: "menu-ventadour",
  title: "Menu Ventadour",
  eyebrow: "AUTRES PROPOSITIONS",
  price: 39,
  subtitle: "Entrées, plats et desserts au choix",
  image: "dessert",
  imageAlt: "Dessert préparé par la cuisine du Ventadour",
  imageLabel: "LE GOÛT DU FAIT MAISON",
  showAllergens: false,
  sections: [
    {
      title: "Entrées",
      items: [
        { name: "Le foie gras de canard mi-cuit de la ferme des Palmes" },
        { name: "La cassolette d’œufs de caille au foie gras de canard et champignons", allergens: [3, 5, 7] },
        { name: "Le foie gras poêlé et fricassée de cèpes", allergens: [5] },
        { name: "Le saumon Gravlax, salpicon de légumes", allergens: [4, 5] },
        { name: "Le tartare de thon rouge, huile d’olive, échalotes, citron vert", allergens: [5, 4] },
      ],
    },
    {
      title: "Plats",
      items: [
        { name: "La fricassée de ris de veau° aux morilles", allergens: [5, 7] },
        { name: "Les noix de Saint-Jacques à la plancha, escabèche", allergens: [14, 5] },
        { name: "Le filet de bœuf°, jus légèrement truffé", allergens: [5] },
        { name: "Le demi-magret de canard°, sauce aux cèpes", allergens: [5, 7] },
      ],
    },
    {
      title: "Desserts",
      items: [
        { name: "L’assiette de fromages", allergens: [7] },
        { name: "Le macaron, ganache pistache et framboises", allergens: [8, 3, 7] },
        { name: "Le moelleux au chocolat cœur coulant", allergens: [1, 3, 7, 8] },
        { name: "Les cannelés parfumés au Rhum, crème et caramel au beurre salé", allergens: [1, 3, 7] },
        { name: "Le biscuit, mousse au chocolat blanc insert café, crème Tonka", allergens: [1, 3, 7, 8] },
        { name: "Nos sorbets maison" },
        { name: "Le baba au Rhum Negrita et raisin infusé au Rhum", allergens: [1, 7, 3] },
        { name: "La tarte, crème à l’amande, prunes du Tarn et Garonne rôties au romarin, meringue" },
        { name: "Le nuage meringué, crème diplomate mangue, sorbet du moment, mangue avion", allergens: [7, 3] },
      ],
    },
  ],
};

export const menus = [bistrotMenu, ventadourMenu];

export const aLaCarte = [
  { name: "Le foie gras poêlé et fricassée de cèpes", price: 22 },
  { name: "Le foie gras de canard mi-cuit de la ferme des Palmes", price: 21 },
  { name: "La cassolette d’œufs de caille au foie gras de canard et champignons", price: 18 },
  { name: "Le saumon Gravlax, salpicon de légumes", price: 20 },
  { name: "Le tartare de thon rouge, échalotes, citron vert", price: 20 },
  { name: "Les noix de Saint-Jacques à la plancha, escabèche", price: 27 },
  { name: "La fricassée de ris de veau° aux morilles", price: 27 },
  { name: "Le filet de bœuf°, jus truffé", price: 27 },
  { name: "Le demi-magret de canard°, sauce aux cèpes", price: 26 },
  { name: "Nos desserts à la carte", price: 7 },
];

export const cateringServices = [
  { number: "01", title: "Cocktail dînatoire", detail: "Des mises en bouche salées à composer au fil des envies.", href: "#cocktail" },
  { number: "02", title: "Mariage", detail: "Du premier verre au dessert, une réception à votre mesure.", href: "#mariage" },
  { number: "03", title: "Réceptions privées", detail: "Anniversaires, repas de famille et moments à partager.", href: "#devis" },
  { number: "04", title: "Événements professionnels", detail: "Séminaires, inaugurations et rendez-vous d'entreprise.", href: "#professionnels" },
];

export const cocktailBites = [
  "Tataki de thon rouge, soja et sésame",
  "Gambas croustillante à la menthe ou aux agrumes",
  "Crémeux de burrata, tomates et pesto vert",
  "Sablé au parmesan, oignons confits et jambon Serrano",
  "Ceviche de dorade, avocat et gingembre",
  "Tarte fine aux cèpes",
];

export const weddingMoments = [
  { number: "01", title: "L'apéritif", detail: "Pièces salées, verrines et ateliers gourmands à définir ensemble." },
  { number: "02", title: "Le repas", detail: "Un menu construit autour des produits de saison et de vos envies." },
  { number: "03", title: "Le service", detail: "Vaisselle, nappage et service peuvent faire partie de la prestation." },
];

export const professionalEvents = [
  "Séminaires et repas d'équipe",
  "Inaugurations et portes ouvertes",
  "Lancements de produits",
  "Cocktails et buffets d'entreprise",
];
