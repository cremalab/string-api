
const keystone = require('keystone')
const Tagger   = keystone.list('Tagger'), async = require('async')

exports = module.exports = function(done) {
  let cocktail = new Tagger.model({
    tag: 'cocktail', activity_types: [`drink`, `eat`], active: true, keywords: [
      'cocktail', 'mixed drink', 'tom collins', 'horsefeather', 'horse feather',
      'martini', 'gimlet', 'Greyhound', 'Negroni', 'pimm', 'Blue Hawaii',
      'Bahama Mama', 'Daiquiri', 'dark and stormy', 'Hot Buttered Rum',
      'Mojito', 'pina colada', 'Bloody Maria', 'juan collins',
      'Margarita', 'Tequila Sunrise', 'Bloody Mary', 'cape cod', 'Cosmopolitan',
      'cosmo', 'Screwdriver', 'Sex on the Beach', 'Tonic', 'White Russian',
      'hot toddy', 'irish coffee', 'manhattan', 'julep', 'old fashioned',
      'Amaretto', 'Brandy Alexander', 'fuzzy navel'
    ]
  }).save
  let beer = new Tagger.model({
    tag: 'beer', activity_types: [`drink`, `eat`], active: true, keywords: [
      'beer', 'suds', 'brewski', 'pint', 'microbrew', 'IPA', 'pale ale', 'ale',
      'stout', 'porter', 'whit', 'whitbeer', 'witbier', 'bier', 'wheat', 'ESB',
      'kolsch', 'lager', 'blonde', 'barleywine', 'pilsner', 'bock', 'dopplebock',
      'kellerbier', 'Zwickelbier', 'helles', 'dunkel', 'schwarzbier', 'Happoshu',
      'oktoberfest', 'rauchbier', 'sahti', 'gose', 'hefeweizen', 'roggenbier',
      'coors', 'budweiser', 'hamms', 'pbr', 'guinness'
    ]
  }).save
  let coffee = new Tagger.model({
    tag: 'coffee', activity_types: [`drink`, `eat`], active: true, keywords: [
      'coffee', 'pour-over', 'pout over', 'drip', 'grinds', 'grounds',
      'espresso', 'macchiato', 'latte', 'americano', 'crema', 'Guillermo',
      'Antoccino', 'Breve', 'Cappuccino', 'cortado', 'Espressino', 'frappe'
    ]
  }).save
  let wine = new Tagger.model({
    tag: 'wine', activity_types: [`drink`, `eat`], active: true, keywords: [
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
  }).save
  let tea = new Tagger.model({
    tag: 'tea', activity_types: [`drink`, `eat`], active: true, keywords: [
      'tea', 'chai', 'Oolong', 'Rooibos', 'early grey', 'early gray'
    ]
  }).save
  let whiskey = new Tagger.model({
    tag: 'whiskey', activity_types: [`drink`, `eat`], active: true, keywords: [
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
      `Old Charter`, `Old Rip Van Winkle`, `Pappy Van Winkle`, `w.l. wellwer`,
      `w l weller`, `wl weller`,
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
      `Glenglassaugh`,`Glenlivet`,`Glenlochy`,`Glenlossie`,`Glenrothes`,
      `Glentauchers`,`Glenury Royal`,`Highland Axe`,`Inchgower`,
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
      `Vat 69`,`Whyte & Mackay`
    ]
  }).save
  let gin = new Tagger.model({
    tag: 'gin', activity_types: [`drink`, `eat`], active: true, keywords: [
      `gin`, `The Botanist`, `Tanqueray`, `Beefeater`, `Bombay Sapphire`, `Gordon's`,
      `gordons`, `Hendrick's`, `hendricks`, `Broker's`, `brokers`, `Magellan`
    ]
  }).save
  let vodka = new Tagger.model({
    tag: 'vodka', activity_types: [`drink`, `eat`], active: true, keywords: [
      `vodka`, `Bombora`, `Cooranbong`, `Downunder`, `Monopolowa`, `Platinka`,
      `Crystal Head`, `Polar Ice`, `Grey Goose`, `absolut`, `Tito's`, `titos`
    ]
  }).save
  let happy_hour = new Tagger.model({
    tag: 'happy hour', activity_types: [`drink`, `eat`], active: true, keywords: [
      'happy hour', '#happyhour', 'happyhour'
    ]
  }).save
  let vegetarian = new Tagger.model({
    tag: 'vegetarian', activity_types: [`eat`], active: true, keywords: [
      'veggie', 'vegetarian', 'meatless', 'meat-free', 'vegan', 'veg', 'bocca',
      'tofu'
    ]
  }).save
  let vegan = new Tagger.model({
    tag: 'vegan', activity_types: [`eat`], active: true, keywords: [
      'vegan'
    ]
  }).save
  let spicy = new Tagger.model({
    tag: 'spicy', activity_types: [`eat`], active: true, keywords: [
      'spicy', 'hot', 'blazing', 'scoval'
    ]
  }).save
  let paleo = new Tagger.model({
    tag: 'paleo', activity_types: [`eat`], active: true, keywords: [
      'paleo', 'raw', 'whole30'
    ]
  }).save
  let breakfast = new Tagger.model({
    tag: 'breakfast', activity_types: [`eat`, `drink`], active: true, keywords: [
      'breakfast', 'brunch', 'pancakes', 'waffles', 'eggs benedict', 'omlette',
      'omelette', 'scramble', 'bagel', 'donut', 'cereal', 'oatmeal', 'scone',
      'huevos', 'lox', 'muffin', 'nihari', 'pop-tart', 'pop tart', 'poptart',
      'quiche', 'biscuits and gravy', 'biscuits & gravy', 'B&G', 'mimosa',
      'bloody mary', 'bloody maria'
    ]
  }).save

  async.parallel([
    cocktail, beer, coffee, wine, tea, whiskey, gin, vodka,
    happy_hour, vegetarian, vegan, spicy, paleo, breakfast
  ], done)

}
