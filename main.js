import { createCartLine, showCartContent } from './lib/ui.js';
import { formatNumber } from './lib/helpers.js';



const products = [
  {
    id: 1,
    title: 'HTML húfa',
    description:
      'Húfa sem heldur hausnum heitum og hvíslar hugsanlega að þér hvaða element væri best að nota.',
    price: 5_000,
  },
  {
    id: 2,
    title: 'CSS sokkar',
    description: 'Sokkar sem skalast vel með hvaða fótum sem er.',
    price: 3_000,
  },
  {
    id: 3,
    title: 'JavaScript jakki',
    description: 'Mjög töff jakki fyrir öll sem skrifa JavaScript reglulega.',
    price: 20_000,
  },
];

// Þessi fall mun vera kallað þegar pöntunarformið er sent inn
function handleCheckout(event) {
  event.preventDefault(); 

  // Náum í gögnin úr formi
  const name = document.querySelector('#name').value;
  const address = document.querySelector('#address').value;

  // Hér gætirðu viljað bæta við frekari staðfestingu á gögnunum
  if (!name || !address) {
    alert('Vinsamlegast fylltu út nafn og heimilisfang.');
    return;
  }
  // Sýna kvittun
  const receiptSection = document.querySelector('.receipt');
  receiptSection.querySelector('h2').textContent = 'Kvittun';
  receiptSection.querySelector('p').textContent = `Takk fyrir að versla hjá okkur, ${name}! Vörurnar verða sendar á heimilisfangið ${address}.`;
  
  // Hér gætirðu viljað bæta við kóða til að senda gögnin á bakenda eða vista þau á einhvern hátt

  // Hreinsa körfuna
  const cartContent = document.querySelector('.table tbody');
  while (cartContent.firstChild) {
    cartContent.removeChild(cartContent.firstChild);
  }
  updateCartTotal(); // Uppfæra heildarverðið í körfunni

  // Fela körfu og sýna kvittun
  showCartContent(false);
  receiptSection.classList.remove('hidden');

  // Endurstilla formið
  event.target.reset();
}

// Bæta við event listener á pöntunarformið
document.addEventListener('DOMContentLoaded', (event) => {
  
  const checkoutForm = document.querySelector('#checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', handleCheckout);
  } else {
    console.error('Pöntunarform fannst ekki!');
  }
});


/** Bæta vöru í körfu */
function addProductToCart(product, quantity) {
  // Hér þarf að finna `<tbody>` í töflu og setja `cartLine` inn í það
  const cart = document.querySelector('.cart-items');

  if (!cart) {
    console.warn('fann ekki .table tbody');
    return;
  }
  
  // TODO hér þarf að athuga hvort lína fyrir vöruna sé þegar til
  let cartLine = cart.querySelector(`tr[data-cart-product-id="${product.id}"]`);
  if (cartLine) {
    // Ef vöru er nú þegar í körfunni, uppfæra fjöldann og heildarverðið
    let quantityElement = cartLine.querySelector('.quantity');
    let totalElement = cartLine.querySelector('.total .price'); // Bæta við þessari línu
    let currentQuantity = parseInt(quantityElement.textContent);
    let newQuantity = currentQuantity + quantity;
    quantityElement.textContent = newQuantity;
    totalElement.textContent = `${formatNumber(product.price * newQuantity)} kr.-`; // Uppfæra heildarverðið
    updateCartTotal();
  } else {
    // Ef ekki, bæta við nýrri línu
    const newCartLine = createCartLine(product, quantity);
    cart.appendChild(newCartLine);
    updateCartTotal();
  }

  // Sýna efni körfu
  showCartContent(true);

  // TODO sýna/uppfæra samtölu körfu
  updateCartTotal();
}

export function updateCartTotal() {
  // Finna allar línur í körfunni
  const cartLines = document.querySelectorAll('tr[data-cart-product-id]');
  let total = 0;

  // Reikna heildarverðið
  cartLines.forEach(line => {
    const priceElement = line.querySelector('.total .price');
    // Fjarlægja 'ISK' og ' kr.-', breyta punktum í ekkert og kommum í punkta
    const priceText = priceElement.textContent.replace('ISK', '').replace(' kr.-', '').trim().replace(/\./g, '').replace(',', '');
    const price = parseFloat(priceText);
    if (!isNaN(price)) {
      total += price;
    } else {
      console.error('Price is NaN for line:', line);
    }
  });

  // Uppfæra heildarverðið í DOM
  const totalElement = document.querySelector('.cart-total .price');
  if (totalElement) {
    // Nota formatNumber fallið til að sýna heildarverðið með réttu sniði
    totalElement.textContent = formatNumber(total); // Ekki þörf á að bæta við " kr.-" hér
  }
  // Athuga hvort körfan er tóm og sýna/hylja skilaboðin "Ekkert í körfu"
  showCartContent(cartLines.length > 0);
  
}




function submitHandler(event) {
  event.preventDefault();

  const parent = event.target.closest('tr');
  const productId = Number.parseInt(parent.dataset.productId);

  console.log('productId:', productId); // Skoða productId

  const product = products.find((p) => p.id === productId);

  console.log('product:', product); // Skoða fundna vöru

  const quantityInput = parent.querySelector('input[type="number"]');
  const quantity = parseInt(quantityInput.value, 10);

  console.log('quantityInput value:', quantityInput.value); // Skoða inntaksgildið
  console.log('quantity:', quantity); // Skoða umbreytt fjölda

  if (isNaN(quantity) || quantity <= 0) {
    console.error('Fjöldi er ekki gildur');
    return;
  }

  addProductToCart(product, quantity);
}


// Finna öll form með class="add"
const addToCartForms = document.querySelectorAll('.add')

// Ítra í gegnum þau sem fylki (`querySelectorAll` skilar NodeList)
for (const form of Array.from(addToCartForms)) {
  // Bæta submit event listener við hvert
  form.addEventListener('submit', submitHandler);
}


