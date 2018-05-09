
const categoryList = {
  classes: {
    animals: ['reptiles', 'rodents'],
    plants: ['flowers', 'trees'],
  },
  orders: {
    reptiles: ['rep', 'tiles'],
    rodents: ['rod', 'ents'],
    flowers: ['flow', 'ers'],
    trees: ['tre', 'es'],
  },
};

const _speciesListManager = {
  getCategory(race, category, reverse) {
    return reverse ? categoryList[`${category}Reverse`][race] : categoryList[category][race];
  },
  reverse(category) {
    const reverseCategory = {};
    Object.keys(category).forEach((parentKey) => {
      category[parentKey].forEach((subKey) => {
        reverseCategory[subKey] = parentKey;
      });
    });
    return reverseCategory;
  },
};

const speciesListManager = {
  init() {
    Object.keys(categoryList).forEach((key) => {
      categoryList[`${key}Reverse`] = _speciesListManager.reverse(categoryList[key]);
    });
  },
  getRoot() {
    return Object.keys(categoryList.classes);
  },
  getSubCategory(race, category) {
    return {
      category: _speciesListManager.getCategory(race, category, false),
    };
  },
  getParentCategory(race, category) {
    return _speciesListManager.getCategory(race, category, true);
  },
};

export default speciesListManager;
