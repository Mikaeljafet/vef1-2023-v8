import { formatNumber } from './helpers.js';
import { updateCartTotal } from '../main.js';

export function createCartLine(product, quantity) {
  // TODO útfæra þannig að búin sé til lína í körfu á forminu:


  /*
  <tr data-cart-product-id="1">
    <td>HTML húfa</td>
    <td>1</td>
    <td><span class="price">5.000 kr.-</span></td>
    <td><span class="price">5.000 kr.-</span></td>
    <td>
      <form class="remove" method="post">
        <button>Eyða</button>
      </form>
    </td>
  </tr>
  */

  // Vörulína
  const tr = document.createElement('tr');
  tr.setAttribute('data-cart-product-id', product.id);

  // Heiti vörunnar
  const tdTitle = document.createElement('td');
  tdTitle.textContent = product.title;
  tr.appendChild(tdTitle);

  // Fjöldi
  const tdQuantity = document.createElement('td');
  tdQuantity.textContent = quantity;
  tdQuantity.className = 'quantity';
  tr.appendChild(tdQuantity);

  // Verð hlutsins
  const tdPrice = document.createElement('td');
  tdPrice.innerHTML = `<span class="price">${formatNumber(product.price)}</span>`;
  tr.appendChild(tdPrice);

  // Heildarverð
  const tdTotal = document.createElement('td');
  tdTotal.innerHTML = `<span class="price">${formatNumber(product.price * quantity)}</span>`;
  tdTotal.className = 'total';
  tr.appendChild(tdTotal);


 

  // TODO hér þarf að búa til eventListener sem leyfir að eyða línu úr körfu
  const tdRemove = document.createElement('td');
  const formRemove = document.createElement('form');
  formRemove.className = 'remove';
  formRemove.method = 'post';
  const buttonRemove = document.createElement('button');
  buttonRemove.textContent = 'Eyða';
  buttonRemove.type = 'button'; // Þetta kemur í veg fyrir að formið submiti þegar hnappurinn er ýttur
  buttonRemove.addEventListener('click', (e) => {
    e.preventDefault();
    tr.remove(); // Fjarlægir þessa línu úr DOM
    // Hér þarf að bæta við kóða til að uppfæra samtölu körfunnar
    updateCartTotal();
  });
  formRemove.appendChild(buttonRemove);
  tdRemove.appendChild(formRemove);
  tr.appendChild(tdRemove);

  return tr;
}

/**
 * Sýna efni körfu eða ekki.
 * @param {boolean} show Sýna körfu eða ekki
 */
export function showCartContent(show = true) {
  // Finnum element sem inniheldur körfuna
  const cartElement = document.querySelector('.cart');

  if (!cartElement) {
    console.warn('fann ekki .cart');
    return;
  }

  const emptyMessage = cartElement.querySelector('.empty-message');
  const cartContent = cartElement.querySelector('.table');

  if (!emptyMessage || !cartContent) {
    console.warn('fann ekki element');
    return;
  }

  if (show) {
    emptyMessage.classList.add('hidden');
    cartContent.classList.remove('hidden');
  } else {
    emptyMessage.classList.remove('hidden');
    cartContent.classList.add('hidden');
  }
}
