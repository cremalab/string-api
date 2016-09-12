const Analyzer = require('../analyzer')

const tags = [
  {
    tag: 'cocktail',
    keywords: [
      'cocktail', 'mixed drink'
    ]
  },
  {
    tag: 'beer',
    keywords: [
      'beer', 'suds', 'brewski', 'pint', 'microbrew', 'IPA', 'pale ale', 'ale',
      'stout', 'porter', 'whit', 'whitbeer', 'witbier', 'bier', 'wheat', 'ESB',
      'kolsch', 'lager', 'blonde', 'barleywine', 'pilsner', 'bock', 'dopplebock',
      'kellerbier', 'Zwickelbier', 'helles', 'dunkel', 'schwarzbier', 'Happoshu',
      'oktoberfest', 'rauchbier', 'sahti', 'gose', 'hefeweizen', 'roggenbier',
      'coors', 'budweiser', 'hamms', 'pbr', 'guinness'
    ]
  },
  {
    tag: 'coffee',
    keywords: [
      'coffee', 'pour-over', 'pout over', 'drip', 'grinds', 'grounds',
      'espresso', 'macchiato', 'latte', 'americano', 'crema', 'Guillermo',
      'Antoccino', 'Breve', 'Cappuccino', 'cortado', 'Espressino', 'frappe'
    ]
  },
  {
    tag: 'wine',
    keywords: [
      'wine','Albariño','Aligoté','Amarone','Arneis','Asti Spumante','Auslese',
      'Banylus','Barbaresco','Bardolino','Barolo','Beaujolais',
      'Blanc de Blancs','Blanc de Noirs','Blush','Boal or Bual','Brunello',
      'Cabernet Franc','Cabernet Sauvignon','Carignan','Carmenere','Cava',
      'Charbono','Champagne','Chardonnay','Châteauneuf-du-Pape','Chenin Blanc',
      'Chianti','Chianti Classico','Claret','Colombard (French Colombard)',
      'Constantia','Cortese','Dolcetto','Eiswein','Frascati','Fumé Blanc',
      'Gamay','Gamay Beaujolais','Gattinara','Gewürztraminer','Grappa',
      'Grenache','Johannisberg Riesling','Kir','Lambrusco','Liebfraumilch',
      'Madeira','Malbec','Marc','Marsala','Marsanne','Mead','Meritage','Merlot',
      'Montepulciano','Moscato','Mourvedre','Müller-Thurgau','Muscat','Nebbiolo',
      'Petit Verdot','Petite Sirah','Pinot Blanc','Pinot Grigio/Pinot Gris',
      'Pinot Meunier','Pinot Noir','Pinotage','Port','Retsina','Rosé',
      'Roussanne','Sangiovese','Sauterns','Sauvignon Blanc','Sémillon','Sherry',
      'Soave','Tokay','Traminer','Trebbiano','Ugni Blanc','Valpolicella',
      'Verdicchio','Viognier','Zinfandel'
    ]
  },
  {
    tag: 'tea',
    keywords: [
      'tea', 'chai', 'Oolong', 'Rooibos', 'early grey', 'early gray'
    ]
  },
  {
    tag: 'whiskey',
    keywords: [
      'whiskey', 'whisky', 'bourbon', 'scotch', 'single-malt', 'single malt',
      'sour mash', 'irish whiskey', 'jim beam','rye',
      'booker', 'basil hayden', 'knob creek', 'old crow', 'Old Grand-Dad',
      `maker's mark`, 'makers mark', 'Old Forester', 'woodford reserve',
      'Elijah Craig', 'Evan Williams', 'Heaven Hill', 'Fighting Cock',
      'Old Fitzgerald', 'Old Heaven Hill', `Johnny Drum, Bardstown`,
      `Kentucky Vintage`, `Noah's Mill`, `Rowan's Creek`, `Ancient Age`,
      `Blanton's`, `Buffalo Trace`, `Eagle Rare (single barrel)`,
      `George T. Stagg (barrel proof, uncut, unfiltered)`,
      `Hancock's President's Reserve (single barrel)`, `McAfee's Benchmark`,
      `Old Charter`, `Old Rip Van Winkle`, `Pappy Van Winkle`,
      `W. L. Weller`, `Russell's Reserve`, `Wild Turkey`, `Four Roses`,
      `Angel's Envy`, 'Bulleit', 'Jack Daniel', 'jack and coke', 'high west',
      `Crown Royal`, `Pendleton`, `Wiser's`
    ]
  }
]

class DrinkAnalyzer extends Analyzer {
  constructor() {
    super()
    this.tags = tags
  }
}

module.exports = DrinkAnalyzer
