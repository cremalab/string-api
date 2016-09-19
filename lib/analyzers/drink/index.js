const Analyzer = require('../analyzer')

const tags = [
  {
    tag: 'cocktail',
    keywords: [
      'cocktail', 'mixed drink', 'tom collins', 'horsefeather', 'horse feather',
      'martini', 'gimlet', 'Greyhound', 'Negroni', 'pimm', 'Blue Hawaii',
      'Bahama Mama', 'Daiquiri', 'dark and stormy', 'dark & stormy',
      'Hot Buttered Rum',
      'Mojito', 'Piña Colada', 'pina colada', 'Bloody Maria', 'juan collins',
      'Margarita', 'Tequila Sunrise', 'Bloody Mary', 'cape cod', 'Cosmopolitan',
      'cosmo', 'Screwdriver', 'Sex on the Beach', 'Tonic', 'White Russian',
      'hot toddy', 'irish coffee', 'manhattan', 'julep', 'old fashioned',
      'Amaretto', 'Brandy Alexander', 'fuzzy navel', 'Harvey Wallbanger',
      'Long Island Iced Tea', 'sidecar', 'Sazerac', 'mule', 'jager', 'Jäger'
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
      'Pinot Meunier','Pinot Noir','Pinotage','Retsina','Rosé',
      'Roussanne','Sangiovese','Sauterns','Sauvignon Blanc','Sémillon','Sherry',
      'Soave','Tokay','Traminer','Trebbiano','Ugni Blanc','Valpolicella',
      'Verdicchio','Viognier','Zinfandel', 'pinot', 'cabernet'
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
      `Blanton's`, `Buffalo Trace`, `Eagle Rare`,
      `George T. Stagg`, `cask strength`,
      `Hancock's President's Reserve`, `McAfee's Benchmark`,
      `Old Charter`, `Old Rip Van Winkle`, `Pappy Van Winkle`,
      `W. L. Weller`, `Russell's Reserve`, `Wild Turkey`, `Four Roses`,
      `Angel's Envy`, 'Bulleit', 'Jack Daniel', 'jack and coke', 'high west',
      `Crown Royal`, `Pendleton`, `Wiser's`, 'McCallan', 'Glennfiddich', 'Oban',
      `Campbeltown`, `Glen Scotia`, `Hazelburn`, `Kilkerran`, `Longrow`,
      `Springbank`, `Aberfeldy`,`Balblair`,`Ben Nevis`,`Clynelish`,`The Dalmore`,
      `Dalwhinnie`,`Deanston`,`Edradour`,`Fettercairn`,`Glen Garioch`,`Glen Ord`,
      `Glencadam`,`Glendronach`,`Glengoyne`,`Glenmorangie`,
      `Glenturret`,`Glenugie`,`Knockdhu`,`Loch Lomond`,`The Macallan`,
      `McClelland`,`Millburn`,`North Port`,`Oban`,`Old Pulteney`,
      `Royal Brackla`,`Royal Lochnagar`,`Tomatin`,`Tullibardine`,
      `Arran`,`Highland Park`,`Isle of Jura`,`Ledaig`,`Scapa`,`Talisker`,`Tobermory`,
      `Ardbeg`,`Bowmore`,`Bruichladdich`,`Bunnahabhain`,`Caol Ila`,`Finlaggan`,
      `Islay Storm`,`Kilchoman`,`Lagavulin`,`Laphroaig`,`Octomore`,`Port Askaig`,
      `Port Charlotte`,`Port Ellen`,`The Ileach`,
      `Ailsa Bay`,`Annandale`,`Auchentoshan`,`Bladnoch`,`Daftmill`,`Glenkinchie`,
      `Inverleven`,`Kinclaith`,`Ladyburn`,`Rosebank`,`St Magdalene`,
      `Aberfeldy`,`Aberlour`,`Allt-A-Bhainne`,`AnCnoc`,`Ardmore`,`Auchroisk`,
      `Aultmore`,`Balmenach`,`The Balvenie`,`Banff`,`Bell's & Sons`,`BenRiach`,
      `Benrinnes`,`Benromach`,`Brackla`,`Braeval`,`Brora`,`Caperdonich`,`Cardhu`,
      `Coleburn`,`Convalmore`,`Cragganmore`,`Craigellachie[65]`,`Dailuaine`,
      `Dallas Dhu`,`Dufftown`,`Fettercairn`,`Glen Albyn`,`Glen Deveron`,
      `Glen Elgin`,`Glen Flagler`,`Glen Grant`,`Glen Keith`,`Glen Mhor`,
      `Glen Moray`,`Glen Spey`,`Glen Turner`,`Glenallachie`,`Glenburgie`,
      `Glendronach`,`Glendullan`,`Glenesk`,`Glenfarclas`,`Glenfiddich`,
      `Glenglassaugh`,`The Glenlivet`,`Glenlochy`,`Glenlossie`,`Glenrothes`,
      `Glentauchers`,`Glenury Royal`,`Highland Axe`,`Imperial`,`Inchgower`,
      `Knockando`,`Linkwood`,`Littlemill`,`Longmorn`,`The Macallan`,`Mannochmore`,
      `Miltonduff`,`Mortlach`,`Pattison's Whisky`,`Pittyvaich`,`Smith Sinclair`,
      `Speyburn`,`Strathisla`,`Strathmill`,`Tamdhu`,`Tamnavulin`,`Tomintoul`,
      `Tormore`,`William Grant & Sons`, `The Cooper's Choice`, `Cameron Brig`,
      `Girvan`,`Invergordon Grain Distillery`,`North British`,
      `Starlaw Distillery`,`Strathclyde`,
      `Angels' Nectar`,`Big Peat`,`Monkey Shoulder`,`Poit Dhubh`,`Rock Oyster`,
      `Scallywag`,`Sheep Dip`,`Timorous Beastie`,`Glenalmond Everyday`,
      `100 Pipers`,`Antiquary`,`Bailie Nicol Jarvie`,`Ballantine's`,`Bell's`,
      `Beneagles`,`Black & White`,`Black Bottle`,`Black Dog`,`Buchanan's`,
      `Chivas Regal`,`Clan MacGregor`,`Cutty Sark`,`Dewar's`,`Dimple`,
      `The Famous Grouse`,`Grand Old Parr`,`Grant's`,`Haig`,`Hankey Bannister`,
      `J&B`,`Johnnie Walker`,`Passport Scotch`,`Pinch`,`Royal Salute`,
      `Samuel Dow`,`SIA Scotch Whisky`,`Tè Bheag`,`Teacher's Highland Cream`,
      `Vat 69`,`White Horse`,`Whyte & Mackay`
    ]
  },
  {
    tag: 'happy hour',
    keywords: [
      'happy hour', '#happyhour', 'happyhour'
    ]
  }
]


class DrinkAnalyzer extends Analyzer {
  constructor() {
    super()
    this.tags = tags
  }
}


module.exports      = DrinkAnalyzer
module.exports.tags = tags
