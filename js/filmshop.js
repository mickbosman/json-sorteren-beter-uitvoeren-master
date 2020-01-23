//Import JSON
let xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        sortfilmsObject.data = JSON.parse(this.responseText);
        sortfilmsObject.addJSdate();

        //Capital the first letter of the data and sort on that
        sortfilmsObject.data.forEach(films => {
            films.titelUpper = films.titel.toUpperCase();
            //also add the (last)name as attribute
            films.sortAuthor = films.regiseur[0];
        });
        sortfilmsObject.sort();
    }
}
xmlhttp.open('GET', "films.json", true);
xmlhttp.send();


const createTableHead = (arr) => {
    let head = "<table class='filmsSelection'><tr>";
    arr.forEach((item) => {
        head += "<th>" + item + "</th>";
    });
    head += "</tr>";
    return head;
}

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

const changeJSdate = (monthYear) => {
    let myArray = monthYear.split(" ");
    let date = new Date(myArray[1], giveMonthNumber(myArray[0]));
    return date;
}

const maakOpsomming = (array) => {
    let string = "";
    for (let i = 0; i < array.length; i++) {
        switch (i) {
            case array.length - 1:
                string += array[i];
                break;
            case array.length - 2:
                string += array[i] + " en ";
                break;
            default:
                string += array[i] + " , ";
        }
    }
    return string;
}

//Put the text after , at the front
const reverseText = (string) => {
    if (string.indexOf(',') != -1) {
        let array = string.split(',');
        string = array[1] + ' ' + array[0];
    }

    return string;
}

//to add and remove from the shoppingCart object
let shoppingcart = {
    items: [],

    getItems: function () {
        let purchase;
        if (localStorage.getItem('purchasedfilmss') == null) {
            purchase = [];
        } else {
            purchase = JSON.parse(localStorage.getItem('purchasedfilmss'));
            purchase.forEach(item => {
                this.items.push(item);
            })
            this.uitvoeren();
        }
        return purchase;
    },

    add: function (el) {
        this.items = this.getItems();
        this.items.push(el);
        localStorage.setItem('purchasedfilmss', JSON.stringify(this.items));
        this.uitvoeren();
    },

    uitvoeren: function () {
        if (this.items.length > 0) {
            document.querySelector('.shoppingcart__quantity').innerHTML = this.items.length;
        } else {
            document.querySelector('.shoppingcart__quantity').innerHTML = "";
        }
    }
}

shoppingcart.getItems();


//object films uitvoeren en sorteren en data
let sortfilmsObject = {
    data: "",

    kenmerk: "titelUpper",

    oplopend: 1,

    addJSdate: function () {
        this.data.forEach((item) => {
            item.jsDatum = changeJSdate(item.uitgave);
        });
    },

    //data sort
    sort: function () {
        this.data.sort((a, b) => a[this.kenmerk] > b[this.kenmerk] ? 1 * this.oplopend : -1 * this.oplopend);
        this.uitvoeren(this.data);
    },

    uitvoeren: function (data) {
        //first empty the id = 'uitvoer'
        document.getElementById('uitvoer').innerHTML = "";

        data.forEach(films => {
            let section = document.createElement('section');
            section.className = 'filmsSelection';

            //main element with all the info except the price and cover
            let main = document.createElement('main');
            main.className = 'filmsSelection__main';

            //create films cover
            let image = document.createElement('img');
            image.className = 'filmsSelection__cover';
            image.setAttribute('src', films.cover);
            image.setAttribute('alt', reverseText(films.titel));

            //create films title
            let title = document.createElement('h3');
            title.className = 'filmsSelection__title';
            title.textContent = reverseText(films.titel);

            //add authors
            let authors = document.createElement('p');
            authors.className = 'filmsSelection__authors';
            //Reverse the first- and last name of the author
            films.regiseur[0] = reverseText(films.regiseur[0]);
            //Authors added to a array and changed into NL String
            authors.textContent = maakOpsomming(films.regiseur);

            //Add the extra info
            let extra = document.createElement('p');
            extra.className = 'filmsSelection__extra';
            extra.textContent = films.uitgave + ' |duur (min): ' + films.duur + ' | ' + films.taal + ' | ean ' + films.ean;

            //add the prices
            let price = document.createElement('div');
            price.className = 'filmsSelection__price';
            // https://freeformatter.com/netherlands-standards-code-snippets.html
            price.textContent = films.prijs.toLocaleString('nl-NL', {
                currency: 'EUR',
                style: 'currency'
            });

            //add price button
            let priceButton = document.createElement('button');
            priceButton.className = 'filmsSelection__priceButton';
            priceButton.innerHTML = 'add to<br>shoppingcart';
            priceButton.addEventListener('click', () => {
                shoppingcart.add(films);
            })

            //Add the element
            section.appendChild(image);
            main.appendChild(title);
            main.appendChild(authors);
            main.appendChild(extra);
            section.appendChild(main);
            price.appendChild(priceButton);
            section.appendChild(price);
            document.getElementById('uitvoer').appendChild(section);
        });

    }
}

document.getElementById('kenmerk').addEventListener('change', (e) => {
    sortfilmsObject.kenmerk = e.target.value;
    sortfilmsObject.sort();
});

document.getElementsByName('oplopend').forEach((item) => {
    item.addEventListener('click', (e) => {
        sortfilmsObject.oplopend = parseInt(e.target.value);
        sortfilmsObject.sort();
    });
});
