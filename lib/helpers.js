export function formatNumber(price) {
  const formatter = new Intl.NumberFormat('is-IS', {
    style: 'currency',
    currency: 'ISK',
    // Bæta við þessari línu til að fjarlægja gjaldmiðilskóðann úr strengnum
    currencyDisplay: 'code'
  });

  // Skila formatted streng án "ISK" og bæta við " kr.-" í endann
  return formatter.format(price).replace('ISK', '') + ' kr.-';
}

