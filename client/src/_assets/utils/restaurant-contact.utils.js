export const restaurantContact = {
  name: "Le Ventadour — David Aranda",
  address: { line1: "23 quai Villebourbon", zipCode: "82000", city: "Montauban" },
  phone: "05 63 63 34 58",
  email: "le.ventadour82@orange.fr",
  openingHoursText: ["Du lundi au vendredi", "12h – 14h"],
};

export function getRestaurantContact() {
  return restaurantContact;
}
