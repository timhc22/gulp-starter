var $ = require('jquery');

require('./_backbone');

require('./_ajax');
require('./_menu');
require('./_frontpage');
require('./_various');

$("#headerContent").load("header.html");
$("#pageContent").load("_frontpage.html");
$("#footerContent").load("footer.html");