const giveMonthNumber = (month) => {
    let number;
    switch (month) {
        case "januari":
            number = 0;
            break;
        case "februari":
            number = 1;
            break;
        case "maart":
            number = 2;
            break;
        case "april":
            number = 3;
            break;
        case "mei":
            number = 4;
            break;
        case "juni":
            number = 5;
            break;
        case "juli":
            number = 6;
            break;
        case "augustus":
            number = 7;
            break;
        case "september":
            number = 8;
            break;
        case "oktober":
            number = 9;
            break;
        case "november":
            number = 10;
            break;
        case "december":
            number = 11;
            break;
        default:
            number = 0;
    }
    return number;
}


//Put the text after , at the front
const reverseText = (string) => {
    if (string.indexOf(',') != -1) {
        let array = string.split(',');
        string = array[1] + ' ' + array[0];
    }

    return string;
}

//to add and remove from the shoppingCart object, and get data from the localstorage
//also shows the total price of all the purchased filmss
let shoppingcart = {
    items: [],

    getItems: function () {
        let purchase;
        if (localStorage.getItem('purchasedfilmss') == null) {
            purchase = [];
        } else {
            purchase = JSON.parse(localStorage.getItem('purchasedfilmss'));
        }
        purchase.forEach(item => {
            this.items.push(item);
        })
        return purchase;
    },

    deleteItems: function (ean) {
        this.items.forEach((item, index) => {
            if (item.ean == ean) {
                this.items.splice(index, 1);
                ean = 4;
            }
        })
        //update local storage
        localStorage.setItem('purchasedfilmss', JSON.stringify(this.items));
        if (this.items.length > 0) {
            document.querySelector('.shoppingcart__quantity').innerHTML = this.items.length;
        } else {
            document.querySelector('.shoppingcart__quantity').innerHTML = "";
        }
        this.uitvoeren();
    },

    countTotalPrice: function () {
        let totalPrice = 0;
        this.items.forEach(films => {
            totalPrice += films.prijs;
        });
        return totalPrice;
    },

    uitvoeren: function () {
        //first empty the id = 'uitvoer'
        document.getElementById('purchase').innerHTML = "";

        this.items.forEach(films => {
            let section = document.createElement('section');
            section.className = 'purchasedfilms';

            //main element with all the info except the price and cover
            let main = document.createElement('main');
            main.className = 'purchasedfilms__main';

            //create films cover
            let image = document.createElement('img');
            image.className = 'purchasedfilms__cover';
            image.setAttribute('src', films.cover);
            image.setAttribute('alt', reverseText(films.titel));

            //create films title
            let title = document.createElement('h3');
            title.className = 'purchasedfilms__title';
            title.textContent = reverseText(films.titel);

            //add the prices
            let price = document.createElement('div');
            price.className = 'purchasedfilms__price';
            // https://freeformatter.com/netherlands-standards-code-snippets.html
            price.textContent = films.prijs.toLocaleString('nl-NL', {
                currency: 'EUR',
                style: 'currency'
            });

            //add delete butotn
            let deleteButton = document.createElement('div');
            deleteButton.className = 'purchasedfilms__delete';
            deleteButton.addEventListener('click', () => {
                this.deleteItems(films.ean);
            })

            //Add the element
            section.appendChild(image);
            main.appendChild(title);
            section.appendChild(main);
            section.appendChild(price);
            section.appendChild(deleteButton);
            document.getElementById('purchase').appendChild(section);
        });

        //show total price
        let section = document.createElement('section');
        section.className = 'purchasedfilms';

        let totalText = document.createElement('div');
        totalText.className = 'purchasedfilms__totalText';
        totalText.innerHTML = 'Total: ';

        let showTotalPrice = document.createElement('div');
        showTotalPrice.className = 'purchasedfilms__showTotalPrice';
        showTotalPrice.textContent = this.countTotalPrice().toLocaleString('nl-NL', {
            currency: 'EUR',
            style: 'currency'

        });

        section.appendChild(totalText);
        section.appendChild(showTotalPrice);
        document.getElementById('purchase').appendChild(section);

        //shoppingcart quantity
        if (this.items.length > 0) {
            document.querySelector('.shoppingcart__quantity').innerHTML = this.items.length;
        } else {
            document.querySelector('.shoppingcart__quantity').innerHTML = "";
        }
    }

}

shoppingcart.getItems();
shoppingcart.uitvoeren();
