const weekdayNames = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

function text(value) {
  return String(value || "").trim();
}

function dayIndex(value) {
  const normalized = text(value).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const aliases = [
    ["lundi", "monday", "mon", "lun"], ["mardi", "tuesday", "tue", "mar"],
    ["mercredi", "wednesday", "wed", "mer"], ["jeudi", "thursday", "thu", "jeu"],
    ["vendredi", "friday", "fri", "ven"], ["samedi", "saturday", "sat", "sam"],
    ["dimanche", "sunday", "sun", "dim"],
  ];
  return aliases.findIndex((keys) => keys.includes(normalized));
}

export function formatRestaurantAddress(address) {
  if (!address) return "";
  return [text(address.line1), [text(address.zipCode), text(address.city)].filter(Boolean).join(" ")]
    .filter(Boolean).join(", ");
}

export function getRestaurantContact(restaurant) {
  return {
    name: text(restaurant?.name),
    address: restaurant?.address || {},
    addressText: formatRestaurantAddress(restaurant?.address),
    phone: text(restaurant?.phone),
    email: text(restaurant?.email),
    openingHours: Array.isArray(restaurant?.opening_hours) ? restaurant.opening_hours : [],
    socialMedia: restaurant?.social_media || {},
  };
}

export function normalizeSocialHref(value) {
  const href = text(value);
  if (!href) return "";
  return /^(https?:)?\/\//i.test(href) ? href : `https://${href}`;
}

export function formatOpeningDay(day) {
  if (!day || day.isClosed || !Array.isArray(day.hours) || !day.hours.length) return "Fermé";
  return day.hours
    .map((range) => [text(range?.open), text(range?.close)].filter(Boolean).join(" – "))
    .filter(Boolean).join(" · ") || "Fermé";
}

export function getOrderedOpeningHours(hours = []) {
  const indexed = new Map(hours.map((day) => [dayIndex(day?.day), day]));
  return weekdayNames.map((label, index) => ({
    label,
    value: formatOpeningDay(indexed.get(index)),
    isClosed: !indexed.has(index) || Boolean(indexed.get(index)?.isClosed),
  })).filter((day, index) => indexed.has(index));
}

export function getOpeningHoursGroups(hours = []) {
  if (!Array.isArray(hours) || !hours.length) return [];
  const ordered = getOrderedOpeningHours(hours);
  const groups = [];
  ordered.forEach((day) => {
    const previous = groups[groups.length - 1];
    if (previous && previous.value === day.value) previous.days.push(day.label);
    else groups.push({ days: [day.label], value: day.value });
  });
  return groups.map((group) => ({
    label: group.days.length > 1
      ? `${group.days[0]} – ${group.days[group.days.length - 1]}`
      : group.days[0],
    value: group.value,
  }));
}

const contactWeekdays = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

function formatContactOpeningDay(day) {
  if (!day || day.isClosed || !Array.isArray(day.hours) || !day.hours.length) return "Fermé";
  const ranges = day.hours.map((range) => {
    const open = text(range?.open);
    const close = text(range?.close);
    return open && close ? `${open} – ${close}` : "";
  }).filter(Boolean);
  return ranges.length ? ranges.join(" • ") : "Fermé";
}

export function getContactOpeningHours(hours = []) {
  if (!Array.isArray(hours) || !hours.length) return [];

  const schedulesByIndex = new Map();
  hours.forEach((day, index) => {
    const mappedIndex = dayIndex(day?.day);
    // Some API records use translated keys such as "hours.days.monday".
    // Match L’Ambassade and fall back to the API's existing weekday order.
    const targetIndex = mappedIndex >= 0 ? mappedIndex : index < 7 ? index : -1;
    if (targetIndex >= 0 && !schedulesByIndex.has(targetIndex)) {
      schedulesByIndex.set(targetIndex, day);
    }
  });

  return contactWeekdays.flatMap((label, index) => {
    const day = schedulesByIndex.get(index);
    if (!day) return [];
    const value = formatContactOpeningDay(day);
    return [{ label, value, isClosed: value === "Fermé" }];
  });
}

function menuItemName(dish) {
  return text(typeof dish === "string" ? dish : dish?.name);
}

function mapMenuDish(dish, index) {
  const name = menuItemName(dish);
  if (!name) return null;
  return {
    id: String(dish?._id || `${name}-${index}`),
    name,
    description: text(dish?.description),
    price: Number(dish?.price) > 0 ? Number(dish.price) : null,
  };
}

function splitDescription(value) {
  return text(value).split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

export function normalizeMenus(restaurant) {
  const visualKeys = ["plat-poisson", "dessert"];
  return (Array.isArray(restaurant?.menus) ? restaurant.menus : [])
    .filter((menu) => menu && menu.visible !== false)
    .map((menu, index) => {
      const customGroups = Array.isArray(menu.customGroups) ? menu.customGroups : [];
      const combinations = Array.isArray(menu.combinations) ? menu.combinations : [];
      const sections = menu.type === "custom"
        ? customGroups.map((group, groupIndex) => ({
            id: `${menu._id || index}-group-${groupIndex}`,
            title: text(group.categoryName) || `Choix ${groupIndex + 1}`,
            items: (Array.isArray(group.dishes) ? group.dishes : []).map(mapMenuDish).filter(Boolean).map((dish, dishIndex, dishes) => ({
              ...dish,
              relationAfter: dishIndex < dishes.length - 1
                ? ((group.relations || [])[dishIndex] || group.relation) === "and" ? "Et" : "Ou"
                : "",
            })),
          })).filter((section) => section.items.length)
        : combinations.map((combination, combinationIndex) => ({
            id: `${menu._id || index}-combination-${combinationIndex}`,
            title: (Array.isArray(combination.categories) ? combination.categories : [])
              .map(text).filter(Boolean).join(" · ") || `Proposition ${combinationIndex + 1}`,
            price: Number(combination.price) > 0 ? Number(combination.price) : null,
            items: splitDescription(combination.description),
          })).filter((section) => section.title || section.items.length);

      if (menu.type === "custom" && !sections.length) {
        const items = (Array.isArray(menu.dishes) ? menu.dishes : []).map(menuItemName).filter(Boolean);
        if (items.length) sections.push({ id: `${menu._id || index}-selection`, title: "Sélection", items });
      }

      return {
        id: String(menu._id || `menu-${index + 1}`),
        title: text(menu.name) || `Menu ${index + 1}`,
        description: text(menu.description),
        price: Number(menu.price) > 0 ? Number(menu.price) : null,
        sections,
        image: visualKeys[index] || visualKeys[0],
        imageAlt: "Une proposition de saison du Ventadour",
        imageLabel: index === 0 ? "DES PRODUITS DE SAISON" : "LE GOÛT DU FAIT MAISON",
        showAllergens: false,
      };
    });
}

export function normalizeDishCategories(restaurant) {
  return (Array.isArray(restaurant?.dish_categories) ? restaurant.dish_categories : [])
    .filter((category) => category?.visible !== false)
    .map((category, index) => ({
      id: String(category?._id || `category-${index}`),
      title: text(category?.name),
      description: text(category?.description),
      items: [
        ...(Array.isArray(category?.dishes) ? category.dishes : []),
        ...(Array.isArray(category?.subCategories) ? category.subCategories.filter((subCategory) => subCategory?.visible !== false).flatMap((subCategory) => subCategory.dishes || []) : []),
      ]
        .filter((dish) => dish?.showOnWebsite)
        .map((dish, dishIndex) => ({
          id: String(dish?._id || `${index}-${dishIndex}`),
          name: text(dish?.name),
          description: text(dish?.description),
          price: Number(dish?.price) > 0 ? Number(dish.price) : null,
        })).filter((dish) => dish.name),
    }))
    .filter((category) => category.title && category.items.length);
}
