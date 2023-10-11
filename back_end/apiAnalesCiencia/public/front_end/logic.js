class User {
    #id;
    #username;
    #name;
    #birthDate;
    #email;
    #password;
    #role;

    constructor(username, name, birthDate, email, role) {
        this.#username = username;
        this.#name = name;
        this.#birthDate = birthDate;
        this.#email = email;
        this.#role = role;
    }
    getId() {return this.#id; }
    setId(id) {this.#id = id; }
    getUsername() { return this.#username; }
    getRealName() { return this.#name; }
    getBirthDate() { return this.#birthDate; }
    getEmail() {return this.#email; }
    getPassword() {return this.#password; }
    getRole() {return this.#role; }
    setRole(role) {
        if(role == "writer" || role == "WRITER") {
            this.#role = "WRITER";
        }
        else if(role == "reader" || role == "READER"){
            this.#role = "READER";
        }
        else {
            this.#role = "INACTIVE";
        }
    }
}

class Collection {
    #id;
    #name;
    #startDate;
    #endDate;
    #image;
    #wiki;

    constructor(name, startDate, endDate, image, wiki) {
        this.#name = name;
        this.#startDate = startDate;
        this.#endDate = endDate;
        this.#image = image;
        this.#wiki = wiki;
    }

    getId() {return this.#id; }
    setId(id) {this.#id = id; }
    getName() { return this.#name; }
    getStartDate() { return this.#startDate; }
    getEndDate() { return this.#endDate; }
    getImage() { return this.#image; }
    getWiki() { return this.#wiki; }

    toJSON() {
        return {
            name: this.#name,
            startDate: this.#startDate,
            endDate: this.#endDate,
            image: this.#image,
            wiki: this.#wiki
        };
    }
}

class Entity extends Collection {
    #personList;
    #productList;

    constructor(name, startDate, endDate, image, wiki) {
        super(name, startDate, endDate, image, wiki);
        this.#personList = [];
        this.#productList = [];
    }

    getPersonList() { return this.#personList; }
    setPersonList(personList) {
        if(personList != null) {
            let list = personList;
            for (let i = 0; i < list.length; i++) {
                this.#personList.push(list[i]);
            }
        }
    }

    getProductList() { return this.#productList; }
    setProductList(productList) {
        if(productList != null) {
            let list = productList;
            for (let i = 0; i < list.length; i++) {
                this.#productList.push(list[i]);
            }
        }
    }

    toJSON() {
        let json = super.toJSON();
        json.personList = this.#personList;
        return json;
    }

    static fromJSON(json) {
        let entity = new Entity(
            json.name,
            json.startDate,
            json.endDate,
            json.image,
            json.wiki
        );
        entity.setPersonList(json.personList);
        return entity;
    }

}

class Product extends Collection {
    #personList;
    #entityList;

    constructor(name, startDate, endDate, image, wiki) {
        super(name, startDate, endDate, image, wiki);
        this.#personList = [];
        this.#entityList = [];
    }

    getPersonList() { return this.#personList; }
    getEntityList() { return this.#entityList; }
    setPersonList(personList) {
        if(personList != null) {
            let list = personList;
            for (let i = 0; i < list.length; i++) {
                this.#personList.push(list[i]);
            }
        }
    }
    setEntityList(entityList) {
        if(entityList != null) {
            let list = entityList;
            for (let i = 0; i < list.length; i++) {
                this.#entityList.push(list[i]);
            }
        }
    }

    toJSON() {
        let json = super.toJSON();
        json.personList = this.#personList;
        json.entityList = this.#entityList;
        return json;
    }

    static fromJSON(json) {
        let product = new Product(
            json.name,
            json.startDate,
            json.endDate,
            json.image,
            json.wiki
        );
        product.setPersonList(json.personList);
        product.setEntityList(json.entityList);
        return product;
    }
}

class Person extends Collection {
    #productList;
    #entityList;

    constructor(name, startDate, endDate, image, wiki) {
        super(name, startDate, endDate, image, wiki);
        this.#entityList = [];
        this.#productList = [];
    }

    getEntityList() { return this.#entityList; }
    setEntityList(entityList) {
        if(entityList != null) {
            let list = entityList;
            for (let i = 0; i < list.length; i++) {
                this.#entityList.push(list[i]);
            }
        }
    }
    getProductList() { return this.#productList; }
    setProductList(productList) {
        if(productList != null) {
            let list = productList;
            for (let i = 0; i < list.length; i++) {
                this.#productList.push(list[i]);
            }
        }
    }

    toJSON() {
        let json = super.toJSON();
        return json;
    }

    static fromJSON(json) {
        let person = new Person(
            json.name,
            json.startDate,
            json.endDate,
            json.image,
            json.wiki
        );
        return person;
    }
}

let productsDB = [];
let entitiesDB = [];
let personsDB = [];
let usersDB = [];
let productOK = false;
let entityOK = false;
let personOK = false;
let usersOK = false;
let pageInfoOK = true;
let interval = [];

class PageInfo {
    #productList
    #peopleList
    #entityList
    #userList

    constructor() {
        this.#productList = [];
        for (let i = 0; i < productsDB.length; i++) {
            let product = new Product(productsDB[i]["product"]["name"], productsDB[i]["product"]["birthDate"], productsDB[i]["product"]["deathDate"], 
            productsDB[i]["product"]["imageUrl"], productsDB[i]["product"]["wikiUrl"]);
            product.setId(productsDB[i]["product"]["id"]);
            product.setPersonList(productsDB[i]["product"]["persons"]);
            product.setEntityList(productsDB[i]["product"]["entities"]);
            this.#productList.push(product);
        }
        
        this.#peopleList = [];
        for (let i = 0; i < personsDB.length; i++) {
            let person = new Person(personsDB[i]["person"]["name"], personsDB[i]["person"]["birthDate"], personsDB[i]["person"]["deathDate"], 
            personsDB[i]["person"]["imageUrl"], personsDB[i]["person"]["wikiUrl"]);
            person.setId(personsDB[i]["person"]["id"]);
            person.setEntityList(personsDB[i]["person"]["entities"]);
            person.setProductList(personsDB[i]["person"]["products"]);
            this.#peopleList.push(person);
        }
        
        this.#entityList = []
        for (let i = 0; i < entitiesDB.length; i++) {
            let entity = new Entity(entitiesDB[i]["entity"]["name"], entitiesDB[i]["entity"]["birthDate"], entitiesDB[i]["entity"]["deathDate"], 
            entitiesDB[i]["entity"]["imageUrl"], entitiesDB[i]["entity"]["wikiUrl"]);
            entity.setId(entitiesDB[i]["entity"]["id"]);
            entity.setPersonList(entitiesDB[i]["entity"]["persons"]);
            entity.setProductList(entitiesDB[i]["entity"]["products"]);
            this.#entityList.push(entity);
        }

        this.#userList = [];
        for (let i = 0; i < usersDB.length; i++) {
            let user = new User(usersDB[i]["user"]["username"], usersDB[i]["user"]["name"], usersDB[i]["user"]["birthDate"], usersDB[i]["user"]["email"], usersDB[i]["user"]["role"]);
            user.setId(usersDB[i]["user"]["id"]);
            this.#userList.push(user);
        }
    }

    getIdofUser(username) {
        for(let i = 0; i < this.#userList.length; i++) {
            if(this.#userList[i].getUsername() == username) {
                return this.#userList[i].getId();
            }
        }
    }

    getEmailofUser(username) {
        for(let i = 0; i < this.#userList.length; i++) {
            if(this.#userList[i].getUsername() == username) {
                return this.#userList[i].getEmail();
            }
        }
    }

    getRealNameofUser(username) {
        for(let i = 0; i < this.#userList.length; i++) {
            if(this.#userList[i].getUsername() == username) {
                return this.#userList[i].getRealName();
            }
        }
    }

    getBirthDateofUser(username) {
        for(let i = 0; i < this.#userList.length; i++) {
            if(this.#userList[i].getUsername() == username) {
                return this.#userList[i].getBirthDate();
            }
        }
    }

    getProducts() {
        return this.#productList;
    }

    getEntities() {
        return this.#entityList;
    }

    getPeople() {
        return this.#peopleList;
    }

    getUsers() {
        return this.#userList;
    }

    getLongest() {
        let longest = this.#entityList.length;
        if (this.#peopleList.length > longest) { longest = this.#peopleList.length }
        if (this.#productList.length > longest) { longest = this.#productList.length }
        return longest;
    }

    getIdofPerson(name) {
        for(let i = 0; i < this.#peopleList.length; i++) {
            if(this.#peopleList[i].getName() == name) {
                return this.#peopleList[i].getId();
            }
        }
    }

    getIdofProduct(name) {
        for(let i = 0; i < this.#productList.length; i++) {
            if(this.#productList[i].getName() == name) {
                return this.#productList[i].getId();
            }
        }
    }

    getIdofEntity(name) {
        for(let i = 0; i < this.#entityList.length; i++) {
            if(this.#entityList[i].getName() == name) {
                return this.#entityList[i].getId();
            }
        }
    }

    getProductFromList(id) {
        let product = null;
        let productList = this.#productList;
        for (i = 0; i < productList.length; i++) {
            if (productList[i].getId() == id) {
                product = productList[i];
            }
        }
        return product;
    }

    getPersonFromList(id) {
        let person = null;
        let peopleList = this.#peopleList;
        for (i = 0; i < peopleList.length; i++) {
            if (peopleList[i].getId() == id) {
                person = peopleList[i];
            }
        }
        return person;
    }

    getEntityFromList(id) {
        let entity = null;
        let entityList = this.#entityList;
        for (i = 0; i < entityList.length; i++) {
            if (entityList[i].getId() == id) {
                entity = entityList[i];
            }
        }
        return entity;
    }

    showInfoProduct(product) {
        let tbody = document.getElementById("tbody");
        let aside = document.createElement("aside");
        let pname = document.createElement("p");
        let b = document.createElement("b");
        let pfecha = document.createElement("p");
        let image = document.createElement("img");
        let iframe = document.createElement("iframe");
        let pfechaEnd = document.createElement("p");
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }
        let body = document.getElementById("body");
        let currentUserLabel = document.getElementById("currentUser");
        if(currentUserLabel != null) {body.removeChild(currentUserLabel);}
        let showYourInfoButton = document.getElementById("showYourInfoButton");
        if(showYourInfoButton != null) {body.removeChild(showYourInfoButton);}
        let sUBToDelete = document.getElementById("showUsersButton");
        if(sUBToDelete != null) {body.removeChild(sUBToDelete);}
        if (logged == "true") {
            let logoutButton = document.getElementById("logoutButton");
            if(logoutButton != null) {body.removeChild(logoutButton);}
        }
        else {
            let login = document.getElementById("loginForm");
            body.removeChild(login);
        }
        let backButton = document.createElement("button");
        backButton.innerHTML = "Volver a inicio";
        backButton.id = "backButton";
        backButton.addEventListener("click", function () {
            body.removeChild(backButton);
            body.removeChild(aside);
            body.removeChild(iframe);
            if (logged == "false") { loadLogin(); }
            else { loadLogout() }
            loadDataTable();
            if (logged == "false" || currentRole == "READER") { unloadButtons(); }
            unloadRelated();
        })
        body.insertBefore(backButton, table);
        b.innerHTML = product.getName();
        pname.appendChild(b);
        aside.appendChild(pname);
        pfecha.innerHTML = product.getStartDate();
        aside.appendChild(pfecha);
        if (product.getEndDate() != "") {
            pfechaEnd.innerHTML = product.getEndDate();
            aside.appendChild(pfechaEnd);
        }
        image.src = product.getImage();
        image.alt = product.getName();
        aside.appendChild(image);
        body.appendChild(aside);
        iframe.src = product.getWiki();
        iframe.name = "IFrame"
        body.appendChild(iframe);
        let relatedPeople = product.getPersonList();
        for (let i = 0; i < relatedPeople.length; i++) {
            let person = this.getPersonFromList(relatedPeople[i]);
            if (person != null) {
                let relatedPerson = document.createElement("img");
                relatedPerson.src = person.getImage();
                relatedPerson.alt = person.getName();
                relatedPerson.setAttribute("class", "relatedR");
                relatedPerson.addEventListener("click", function () {
                    body.removeChild(backButton);
                    body.removeChild(aside);
                    body.removeChild(iframe);
                    unloadRelated();
                    pageInfo.showInfoPerson(person);
                })
                body.appendChild(relatedPerson);
            }
        }

        let relatedEntities = product.getEntityList();
        for (let i = 0; i < relatedEntities.length; i++) {
            let entity = this.getEntityFromList(relatedEntities[i]);
            if (entity != null) {
                let relatedEntity = document.createElement("img");
                relatedEntity.src = entity.getImage();
                relatedEntity.alt = entity.getName();
                relatedEntity.setAttribute("class", "relatedL");
                relatedEntity.addEventListener("click", function () {
                    body.removeChild(backButton);
                    body.removeChild(aside);
                    body.removeChild(iframe);
                    unloadRelated();
                    pageInfo.showInfoEntity(entity);
                })
                body.appendChild(relatedEntity);
            }
        }
    }

    showInfoPerson(person) {
        let tbody = document.getElementById("tbody");
        let aside = document.createElement("aside");
        let pname = document.createElement("p");
        let b = document.createElement("b");
        let pfecha = document.createElement("p");
        let image = document.createElement("img");
        let iframe = document.createElement("iframe");
        let pfechaEnd = document.createElement("p");
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }
        let body = document.getElementById("body");
        let currentUserLabel = document.getElementById("currentUser");
        if(currentUserLabel != null) {body.removeChild(currentUserLabel);}
        let showYourInfoButton = document.getElementById("showYourInfoButton");
        if(showYourInfoButton != null) {body.removeChild(showYourInfoButton);}
        let sUBToDelete = document.getElementById("showUsersButton");
        if(sUBToDelete != null) {body.removeChild(sUBToDelete);}
        if (logged == "true") {
            let logoutButton = document.getElementById("logoutButton");
            if (logoutButton != null) {
                body.removeChild(logoutButton);
            }
        }
        else {
            let login = document.getElementById("loginForm");
            if (login != null) {
                body.removeChild(login);
            }
        }
        let backButton = document.createElement("button");
        backButton.innerHTML = "Volver a inicio";
        backButton.id = "backButton";
        backButton.addEventListener("click", function () {
            body.removeChild(backButton);
            body.removeChild(aside);
            body.removeChild(iframe);
            if (logged == "false") { loadLogin(); }
            else { loadLogout() }
            loadDataTable();
            if (logged == "false" || currentRole == "READER") { unloadButtons(); }
            unloadRelated();
        })
        body.insertBefore(backButton, table);
        b.innerHTML = person.getName();
        pname.appendChild(b);
        aside.appendChild(pname);
        pfecha.innerHTML = person.getStartDate();
        aside.appendChild(pfecha);
        if (person.getEndDate() != "") {
            pfechaEnd.innerHTML = person.getEndDate();
            aside.appendChild(pfechaEnd);
        }
        image.src = person.getImage();
        image.alt = person.getName();
        aside.appendChild(image);
        body.appendChild(aside);
        iframe.src = person.getWiki();
        iframe.name = "IFrame"
        body.appendChild(iframe);

        let relatedProducts = person.getProductList();
        for (let i = 0; i < relatedProducts.length; i++) {
            let product = this.getProductFromList(relatedProducts[i]);
            if (product != null) {
                let relatedProduct = document.createElement("img");
                relatedProduct.src = product.getImage();
                relatedProduct.alt = product.getName();
                relatedProduct.setAttribute("class", "relatedR");
                relatedProduct.addEventListener("click", function () {
                    body.removeChild(backButton);
                    body.removeChild(aside);
                    body.removeChild(iframe);
                    unloadRelated();
                    pageInfo.showInfoProduct(product);
                })
                body.appendChild(relatedProduct);
            }
        }

        let relatedEntities = person.getEntityList();
        for (let i = 0; i < relatedEntities.length; i++) {
            let entity = this.getEntityFromList(relatedEntities[i]);
            if (entity != null) {
                let relatedEntity = document.createElement("img");
                relatedEntity.src = entity.getImage();
                relatedEntity.alt = entity.getName();
                relatedEntity.setAttribute("class", "relatedL");
                relatedEntity.addEventListener("click", function () {
                    body.removeChild(backButton);
                    body.removeChild(aside);
                    body.removeChild(iframe);
                    unloadRelated();
                    pageInfo.showInfoEntity(entity);
                })
                body.appendChild(relatedEntity);
            }
        }
    }

    showInfoEntity(entity) {
        let tbody = document.getElementById("tbody");
        let aside = document.createElement("aside");
        let pname = document.createElement("p");
        let b = document.createElement("b");
        let pfecha = document.createElement("p");
        let image = document.createElement("img");
        let iframe = document.createElement("iframe");
        let pfechaEnd = document.createElement("p");
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }
        let body = document.getElementById("body");
        let currentUserLabel = document.getElementById("currentUser");
        if(currentUserLabel != null) {body.removeChild(currentUserLabel);}
        let showYourInfoButton = document.getElementById("showYourInfoButton");
        if(showYourInfoButton != null) {body.removeChild(showYourInfoButton);}
        let sUBToDelete = document.getElementById("showUsersButton");
        if(sUBToDelete != null) {body.removeChild(sUBToDelete);}
        if (logged == "true") {
            let logoutButton = document.getElementById("logoutButton");
            if (logoutButton != null) {
                body.removeChild(logoutButton);
            }
        }
        else {
            let login = document.getElementById("loginForm");
            if (login != null) {
                body.removeChild(login);
            }
        }
        let backButton = document.createElement("button");
        backButton.innerHTML = "Volver a inicio";
        backButton.id = "backButton";
        backButton.addEventListener("click", function () {
            body.removeChild(backButton);
            body.removeChild(aside);
            body.removeChild(iframe);
            if (logged == "false") { loadLogin(); }
            else { loadLogout() }
            loadDataTable();
            if (logged == "false" || currentRole == "READER") { unloadButtons(); }
            unloadRelated();
        })
        body.insertBefore(backButton, table);
        b.innerHTML = entity.getName();
        pname.appendChild(b);
        aside.appendChild(pname);
        pfecha.innerHTML = entity.getStartDate();
        aside.appendChild(pfecha);
        if (entity.getEndDate() != "") {
            pfechaEnd.innerHTML = entity.getEndDate();
            aside.appendChild(pfechaEnd);
        }
        image.src = entity.getImage();
        image.alt = entity.getName();
        aside.appendChild(image);
        body.appendChild(aside);
        iframe.src = entity.getWiki();
        iframe.name = "IFrame"
        body.appendChild(iframe);
        let relatedPeople = entity.getPersonList();
        for (let i = 0; i < relatedPeople.length; i++) {
            let person = this.getPersonFromList(relatedPeople[i]);
            if (person != null) {
                let relatedPerson = document.createElement("img");
                relatedPerson.src = person.getImage();
                relatedPerson.alt = person.getName();
                relatedPerson.setAttribute("class", "relatedR");
                relatedPerson.addEventListener("click", function () {
                    body.removeChild(backButton);
                    body.removeChild(aside);
                    body.removeChild(iframe);
                    unloadRelated();
                    pageInfo.showInfoPerson(person);
                })
                body.appendChild(relatedPerson);
            }
        }

        let relatedProducts = entity.getProductList();
        for (let i = 0; i < relatedProducts.length; i++) {
            let product = this.getProductFromList(relatedProducts[i]);
            if (product != null) {
                let relatedProduct = document.createElement("img");
                relatedProduct.src = product.getImage();
                relatedProduct.alt = product.getName();
                relatedProduct.setAttribute("class", "relatedL");
                relatedProduct.addEventListener("click", function () {
                    body.removeChild(backButton);
                    body.removeChild(aside);
                    body.removeChild(iframe);
                    unloadRelated();
                    pageInfo.showInfoProduct(product);
                })
                body.appendChild(relatedProduct);
            }
        }
    }
}


let logged = sessionStorage.getItem("logged");
let token = sessionStorage.getItem("Token");
let currentUser = sessionStorage.getItem("currentUser");
let currentRole = sessionStorage.getItem("currentRole");
let pageInfo;

function viewEditProductWindow(product) {
    let tbody = document.getElementById("tbody");
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
    let body = document.getElementById("body");
    let currentUserLabel = document.getElementById("currentUser");
    body.removeChild(currentUserLabel);
    let showYourInfoButton = document.getElementById("showYourInfoButton");
    body.removeChild(showYourInfoButton);
    let sUBToDelete = document.getElementById("showUsersButton");
    if(sUBToDelete != null) {body.removeChild(sUBToDelete);}
    let form = document.createElement("form");
    form.setAttribute("class", "form");

    let logoutButton = document.getElementById("logoutButton");
    body.removeChild(logoutButton);

    let nameLabel = document.createElement("label");
    nameLabel.innerHTML = "*Nombre: ";
    form.appendChild(nameLabel);

    let nameInput = document.createElement("input");
    nameInput.setAttribute("type", "text");
    nameInput.setAttribute("name", "name");
    nameInput.value = product.getName();
    form.appendChild(nameInput);

    let startDateLabel = document.createElement("label");
    startDateLabel.innerHTML = "*Fecha de creacion: ";
    form.appendChild(startDateLabel);

    let startDateInput = document.createElement("input");
    startDateInput.setAttribute("type", "date");
    startDateInput.setAttribute("name", "startDate");
    startDateInput.value = product.getStartDate();
    form.appendChild(startDateInput);

    let endDateLabel = document.createElement("label");
    endDateLabel.innerHTML = "Fecha de fin: ";
    form.appendChild(endDateLabel);

    let endDateInput = document.createElement("input");
    endDateInput.setAttribute("type", "date");
    endDateInput.setAttribute("name", "endDate");
    endDateInput.value = product.getEndDate();
    form.appendChild(endDateInput);

    let imageLabel = document.createElement("label");
    imageLabel.innerHTML = "*URL de imagen del logo: ";
    form.appendChild(imageLabel);

    let imageInput = document.createElement("input");
    imageInput.setAttribute("type", "text");
    imageInput.setAttribute("name", "image");
    imageInput.value = product.getImage();
    form.appendChild(imageInput);

    let wikilabel = document.createElement("label");
    wikilabel.innerHTML = "*URL de pagina de wikipedia ";
    form.appendChild(wikilabel);

    let wikiInput = document.createElement("input");
    wikiInput.setAttribute("type", "text");
    wikiInput.setAttribute("name", "wiki");
    wikiInput.value = product.getWiki();
    form.appendChild(wikiInput);

    let relatedPeopleLabel = document.createElement("label");
    relatedPeopleLabel.innerHTML = "Personas relacionadas: ";
    form.appendChild(relatedPeopleLabel);

    let relatedPersonsAddutton = document.createElement("button");
    relatedPersonsAddutton.innerHTML = "Añadir";
    relatedPersonsAddutton.setAttribute("class", "relatedAdd");
    relatedPersonsAddutton.setAttribute("type", "button");
    relatedPersonsAddutton.addEventListener("click", function () {
        editRelation(product.getId(), pageInfo.getIdofPerson(relatedPeopleInput.value), "products", "persons", "add", relatedPeopleInput.value);
    });
    form.appendChild(relatedPersonsAddutton);

    let relatedPersonsRemoveButton = document.createElement("button");
    relatedPersonsRemoveButton.innerHTML = "Quitar";
    relatedPersonsRemoveButton.setAttribute("class", "relatedRemove");
    relatedPersonsRemoveButton.setAttribute("type", "button");
    relatedPersonsRemoveButton.addEventListener("click", function () {
        editRelation(product.getId(), pageInfo.getIdofPerson(relatedPeopleInput.value), "products", "persons", "rem", relatedPeopleInput.value);
    });
    form.appendChild(relatedPersonsRemoveButton);

    let relatedPeopleInput = document.createElement("input");
    relatedPeopleInput.setAttribute("type", "text");
    relatedPeopleInput.setAttribute("name", "relatedPeople");
    form.appendChild(relatedPeopleInput);

    let relatedEntitiesLabel = document.createElement("label");
    relatedEntitiesLabel.innerHTML = "Entidades relacionadas: ";
    form.appendChild(relatedEntitiesLabel);

    let relatedEntitiesAddutton = document.createElement("button");
    relatedEntitiesAddutton.innerHTML = "Añadir";
    relatedEntitiesAddutton.setAttribute("type", "button");
    relatedEntitiesAddutton.setAttribute("class", "relatedAdd");
    relatedEntitiesAddutton.addEventListener("click", function () {
        editRelation(product.getId(), pageInfo.getIdofEntity(relatedEntitiesInput.value), "products", "entities", "add", relatedEntitiesInput.value);
    });
    form.appendChild(relatedEntitiesAddutton);

    let relatedEntitiesRemoveButton = document.createElement("button");
    relatedEntitiesRemoveButton.innerHTML = "Quitar";
    relatedEntitiesRemoveButton.setAttribute("class", "relatedRemove");
    relatedEntitiesRemoveButton.setAttribute("type", "button");
    relatedEntitiesRemoveButton.addEventListener("click", function () {
        editRelation(product.getId(), pageInfo.getIdofEntity(relatedEntitiesInput.value), "products", "entities", "rem", relatedEntitiesInput.value);
    });
    form.appendChild(relatedEntitiesRemoveButton);

    let relatedEntitiesInput = document.createElement("input");
    relatedEntitiesInput.setAttribute("type", "text");
    relatedEntitiesInput.setAttribute("name", "relatedEntities");
    form.appendChild(relatedEntitiesInput);

    let submitButton = document.createElement("input");
    submitButton.setAttribute("type", "submit");
    submitButton.setAttribute("name", "addProduct");
    submitButton.innerHTML = "Aceptar";
    form.appendChild(submitButton);

    let cancelButton = document.createElement("button");
    cancelButton.setAttribute("type", "button");
    cancelButton.setAttribute("name", "cancel");
    cancelButton.innerHTML = "Cancelar";
    cancelButton.setAttribute("class", "cancelButton");
    cancelButton.addEventListener("click", function () {
        location.reload();
    });
    form.appendChild(cancelButton);

    body.insertBefore(form, table);

    let infoText = document.createElement("h3");
    infoText.innerHTML = "Rellene los campos que quiera editar para " + product.getName();
    body.insertBefore(infoText, form);

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        let name = nameInput.value;
        let startDate = startDateInput.value;
        let endDate = endDateInput.value;
        let image = imageInput.value;
        let wiki = wikiInput.value;
        if (name == "" || startDate == "" || image == "" || wiki == "") {
            alert("Los campos marcados con * no pueden ser vacios.");
        }
        else {
            if (endDate != "" && startDate > endDate) {
                alert("La fecha de creación no puede ser posterior a la de fin");
            }
            else {
                let idtoEdit = product.getId();
                editFromDB(idtoEdit, name, startDate, endDate, image, wiki, "products", "producto");
            }
        }
    });
}

function viewAddProductWindow() {
    let tbody = document.getElementById("tbody");
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
    let body = document.getElementById("body");
    let currentUserLabel = document.getElementById("currentUser");
    body.removeChild(currentUserLabel);
    let showYourInfoButton = document.getElementById("showYourInfoButton");
    body.removeChild(showYourInfoButton);
    let sUBToDelete = document.getElementById("showUsersButton");
    if(sUBToDelete != null) {body.removeChild(sUBToDelete);}
    let form = document.createElement("form");
    form.setAttribute("class", "form");

    let logoutButton = document.getElementById("logoutButton");
    body.removeChild(logoutButton);

    let nameLabel = document.createElement("label");
    nameLabel.innerHTML = "*Nombre: ";
    form.appendChild(nameLabel);

    let nameInput = document.createElement("input");
    nameInput.setAttribute("type", "text");
    nameInput.setAttribute("name", "name");
    form.appendChild(nameInput);

    let startDateLabel = document.createElement("label");
    startDateLabel.innerHTML = "*Fecha de creacion: ";
    form.appendChild(startDateLabel);

    let startDateInput = document.createElement("input");
    startDateInput.setAttribute("type", "date");
    startDateInput.setAttribute("name", "startDate");
    form.appendChild(startDateInput);

    let endDateLabel = document.createElement("label");
    endDateLabel.innerHTML = "Fecha de fin: ";
    form.appendChild(endDateLabel);

    let endDateInput = document.createElement("input");
    endDateInput.setAttribute("type", "date");
    endDateInput.setAttribute("name", "endDate");
    form.appendChild(endDateInput);

    let imageLabel = document.createElement("label");
    imageLabel.innerHTML = "*URL de imagen del logo: ";
    form.appendChild(imageLabel);

    let imageInput = document.createElement("input");
    imageInput.setAttribute("type", "text");
    imageInput.setAttribute("name", "image");
    form.appendChild(imageInput);

    let wikilabel = document.createElement("label");
    wikilabel.innerHTML = "*URL de pagina de wikipedia: ";
    form.appendChild(wikilabel);

    let wikiInput = document.createElement("input");
    wikiInput.setAttribute("type", "text");
    wikiInput.setAttribute("name", "wiki");
    form.appendChild(wikiInput);

    let submitButton = document.createElement("input");
    submitButton.setAttribute("type", "submit");
    submitButton.setAttribute("name", "submit");
    submitButton.innerHTML = "Añadir";
    form.appendChild(submitButton);

    let cancelButton = document.createElement("button");
    cancelButton.setAttribute("type", "button");
    cancelButton.setAttribute("name", "cancel");
    cancelButton.innerHTML = "Cancelar";
    cancelButton.setAttribute("class", "cancelButton");
    cancelButton.addEventListener("click", function () {
        body.removeChild(infoText);
        body.removeChild(form);
        loadLogout();
        loadDataTable();
    });
    form.appendChild(cancelButton);

    body.insertBefore(form, table);

    let infoText = document.createElement("h3");
    infoText.innerHTML = "Introduce los datos del nuevo producto.";
    body.insertBefore(infoText, form);

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        let name = nameInput.value;
        let startDate = startDateInput.value;
        let endDate = endDateInput.value;
        let image = imageInput.value;
        let wiki = wikiInput.value;
        if (name == "" || startDate == "" || image == "" || wiki == "") {
            alert("Debes completar los campos obligatorios (marcados con * )");
        }
        else {
            if (endDate != "" && startDate > endDate) {
                alert("La fecha de creación no puede ser posterior a la de fin");
            }
            else {
                existElement(name, startDate, endDate, image, wiki, "products", "producto", "productname");
            }
        }
    });
}

function viewEditPersonWindow(person) {
    let tbody = document.getElementById("tbody");
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
    let body = document.getElementById("body");
    let currentUserLabel = document.getElementById("currentUser");
    body.removeChild(currentUserLabel);
    let showYourInfoButton = document.getElementById("showYourInfoButton");
    body.removeChild(showYourInfoButton);
    let sUBToDelete = document.getElementById("showUsersButton");
    if(sUBToDelete != null) {body.removeChild(sUBToDelete);}
    let form = document.createElement("form");
    form.setAttribute("class", "form");

    let logoutButton = document.getElementById("logoutButton");
    body.removeChild(logoutButton);

    let nameLabel = document.createElement("label");
    nameLabel.innerHTML = "*Nombre: ";
    form.appendChild(nameLabel);

    let nameInput = document.createElement("input");
    nameInput.setAttribute("type", "text");
    nameInput.setAttribute("name", "name");
    nameInput.value = person.getName();
    form.appendChild(nameInput);

    let startDateLabel = document.createElement("label");
    startDateLabel.innerHTML = "*Fecha de nacimiento: ";
    form.appendChild(startDateLabel);

    let startDateInput = document.createElement("input");
    startDateInput.setAttribute("type", "date");
    startDateInput.setAttribute("name", "startDate");
    startDateInput.value = person.getStartDate();
    form.appendChild(startDateInput);

    let endDateLabel = document.createElement("label");
    endDateLabel.innerHTML = "Fecha de fallecimiento: ";
    form.appendChild(endDateLabel);

    let endDateInput = document.createElement("input");
    endDateInput.setAttribute("type", "date");
    endDateInput.setAttribute("name", "endDate");
    endDateInput.value = person.getEndDate();
    form.appendChild(endDateInput);

    let imageLabel = document.createElement("label");
    imageLabel.innerHTML = "*URL de imagen: ";
    form.appendChild(imageLabel);

    let imageInput = document.createElement("input");
    imageInput.setAttribute("type", "text");
    imageInput.setAttribute("name", "image");
    imageInput.value = person.getImage();
    form.appendChild(imageInput);

    let wikilabel = document.createElement("label");
    wikilabel.innerHTML = "*URL de pagina de wikipedia ";
    form.appendChild(wikilabel);

    let wikiInput = document.createElement("input");
    wikiInput.setAttribute("type", "text");
    wikiInput.setAttribute("name", "wiki");
    wikiInput.value = person.getWiki();
    form.appendChild(wikiInput);

    let relatedProductsLabel = document.createElement("label");
    relatedProductsLabel.innerHTML = "Productos relacionados: ";
    form.appendChild(relatedProductsLabel);

    let relatedProductsAddutton = document.createElement("button");
    relatedProductsAddutton.innerHTML = "Añadir";
    relatedProductsAddutton.setAttribute("class", "relatedAdd");
    relatedProductsAddutton.setAttribute("type", "button");
    relatedProductsAddutton.addEventListener("click", function () {
        editRelation(person.getId(), pageInfo.getIdofProduct(relatedProductsInput.value), "persons", "products", "add", relatedProductsInput.value);
    });
    form.appendChild(relatedProductsAddutton);

    let relatedProductsRemoveButton = document.createElement("button");
    relatedProductsRemoveButton.innerHTML = "Quitar";
    relatedProductsRemoveButton.setAttribute("class", "relatedRemove");
    relatedProductsRemoveButton.setAttribute("type", "button");
    relatedProductsRemoveButton.addEventListener("click", function () {
        editRelation(person.getId(), pageInfo.getIdofProduct(relatedProductsInput.value), "persons", "products", "rem", relatedProductsInput.value);
    });
    form.appendChild(relatedProductsRemoveButton);

    let relatedProductsInput = document.createElement("input");
    relatedProductsInput.setAttribute("type", "text");
    relatedProductsInput.setAttribute("name", "relatedPeople");
    form.appendChild(relatedProductsInput);

    let relatedEntitiesLabel = document.createElement("label");
    relatedEntitiesLabel.innerHTML = "Entidades relacionadas: ";
    form.appendChild(relatedEntitiesLabel);

    let relatedEntitiesAddutton = document.createElement("button");
    relatedEntitiesAddutton.innerHTML = "Añadir";
    relatedEntitiesAddutton.setAttribute("type", "button");
    relatedEntitiesAddutton.setAttribute("class", "relatedAdd");
    relatedEntitiesAddutton.addEventListener("click", function () {
        editRelation(person.getId(), pageInfo.getIdofEntity(relatedEntitiesInput.value), "persons", "entities", "add", relatedEntitiesInput.value);
    });
    form.appendChild(relatedEntitiesAddutton);

    let relatedEntitiesRemoveButton = document.createElement("button");
    relatedEntitiesRemoveButton.innerHTML = "Quitar";
    relatedEntitiesRemoveButton.setAttribute("class", "relatedRemove");
    relatedEntitiesRemoveButton.setAttribute("type", "button");
    relatedEntitiesRemoveButton.addEventListener("click", function () {
        editRelation(person.getId(), pageInfo.getIdofEntity(relatedEntitiesInput.value), "persons", "entities", "rem", relatedEntitiesInput.value);
    });
    form.appendChild(relatedEntitiesRemoveButton);

    let relatedEntitiesInput = document.createElement("input");
    relatedEntitiesInput.setAttribute("type", "text");
    relatedEntitiesInput.setAttribute("name", "relatedEntities");
    form.appendChild(relatedEntitiesInput);

    let submitButton = document.createElement("input");
    submitButton.setAttribute("type", "submit");
    submitButton.setAttribute("name", "submit");
    submitButton.innerHTML = "Aceptar";
    form.appendChild(submitButton);

    let cancelButton = document.createElement("button");
    cancelButton.setAttribute("type", "button");
    cancelButton.setAttribute("name", "cancel");
    cancelButton.innerHTML = "Cancelar";
    cancelButton.setAttribute("class", "cancelButton");
    cancelButton.addEventListener("click", function () {
        location.reload();
    });
    form.appendChild(cancelButton);

    body.insertBefore(form, table);

    let infoText = document.createElement("h3");
    infoText.innerHTML = "Rellene los campos que quiera editar para " + person.getName();
    body.insertBefore(infoText, form);

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        let name = nameInput.value;
        let startDate = startDateInput.value;
        let endDate = endDateInput.value;
        let image = imageInput.value;
        let wiki = wikiInput.value;
        if (name == "" || startDate == "" || image == "" || wiki == "") {
            alert("Los campos marcados con * no pueden ser vacios.");
        }
        else {
            if (endDate != "" && startDate > endDate) {
                alert("La fecha de nacimiento no puede ser posterior a la de muerte");
            }
            else {
                let idtoEdit = person.getId();
                editFromDB(idtoEdit, name, startDate, endDate, image, wiki, "persons", "persona");
            }
        }
    });
}

function viewAddPersonWindow() {
    let tbody = document.getElementById("tbody");
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
    let body = document.getElementById("body");
    let currentUserLabel = document.getElementById("currentUser");
    body.removeChild(currentUserLabel);
    let showYourInfoButton = document.getElementById("showYourInfoButton");
    body.removeChild(showYourInfoButton);
    let sUBToDelete = document.getElementById("showUsersButton");
    if(sUBToDelete != null) {body.removeChild(sUBToDelete);}
    let form = document.createElement("form");
    form.setAttribute("class", "form");

    let logoutButton = document.getElementById("logoutButton");
    body.removeChild(logoutButton);

    let nameLabel = document.createElement("label");
    nameLabel.innerHTML = "*Nombre: ";
    form.appendChild(nameLabel);

    let nameInput = document.createElement("input");
    nameInput.setAttribute("type", "text");
    nameInput.setAttribute("name", "name");
    form.appendChild(nameInput);

    let startDateLabel = document.createElement("label");
    startDateLabel.innerHTML = "*Fecha de nacimiento: ";
    form.appendChild(startDateLabel);

    let startDateInput = document.createElement("input");
    startDateInput.setAttribute("type", "date");
    startDateInput.setAttribute("name", "startDate");
    form.appendChild(startDateInput);

    let endDateLabel = document.createElement("label");
    endDateLabel.innerHTML = "Fecha de muerte: ";
    form.appendChild(endDateLabel);

    let endDateInput = document.createElement("input");
    endDateInput.setAttribute("type", "date");
    endDateInput.setAttribute("name", "endDate");
    form.appendChild(endDateInput);

    let imageLabel = document.createElement("label");
    imageLabel.innerHTML = "*URL de imagen: ";
    form.appendChild(imageLabel);

    let imageInput = document.createElement("input");
    imageInput.setAttribute("type", "text");
    imageInput.setAttribute("name", "image");
    form.appendChild(imageInput);

    let wikilabel = document.createElement("label");
    wikilabel.innerHTML = "*URL de pagina de wikipedia ";
    form.appendChild(wikilabel);

    let wikiInput = document.createElement("input");
    wikiInput.setAttribute("type", "text");
    wikiInput.setAttribute("name", "wiki");
    form.appendChild(wikiInput);

    let submitButton = document.createElement("input");
    submitButton.setAttribute("type", "submit");
    submitButton.setAttribute("name", "addProduct");
    submitButton.innerHTML = "Añadir";
    form.appendChild(submitButton);

    let cancelButton = document.createElement("button");
    cancelButton.setAttribute("type", "button");
    cancelButton.setAttribute("name", "cancel");
    cancelButton.innerHTML = "Cancelar";
    cancelButton.setAttribute("class", "cancelButton");
    cancelButton.addEventListener("click", function () {
        body.removeChild(infoText);
        body.removeChild(form);
        loadLogout();
        loadDataTable();
    });
    form.appendChild(cancelButton);

    body.insertBefore(form, table);

    let infoText = document.createElement("h3");
    infoText.innerHTML = "Introduce los datos de la nueva persona.";
    body.insertBefore(infoText, form);

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        let name = nameInput.value;
        let startDate = startDateInput.value;
        let endDate = endDateInput.value;
        let image = imageInput.value;
        let wiki = wikiInput.value;
        if (name == "" || startDate == "" || image == "" || wiki == "") {
            alert("Debes completar los campos obligatorios (marcados con * )");
        }
        else {
            if (endDate != "" && startDate > endDate) {
                alert("La fecha de nacimiento no puede ser posterior a la de muerte");
            }
            else {
                existElement(name, startDate, endDate, image, wiki, "persons", "persona", "personname");
            }
        }
    });
}

function viewEditEntityWindow(entity) {
    let tbody = document.getElementById("tbody");
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
    let body = document.getElementById("body");
    let currentUserLabel = document.getElementById("currentUser");
    body.removeChild(currentUserLabel);
    let showYourInfoButton = document.getElementById("showYourInfoButton");
    body.removeChild(showYourInfoButton);
    let sUBToDelete = document.getElementById("showUsersButton");
    if(sUBToDelete != null) {body.removeChild(sUBToDelete);}
    let form = document.createElement("form");
    form.setAttribute("class", "form");

    let logoutButton = document.getElementById("logoutButton");
    body.removeChild(logoutButton);

    let nameLabel = document.createElement("label");
    nameLabel.innerHTML = "*Nombre: ";
    form.appendChild(nameLabel);

    let nameInput = document.createElement("input");
    nameInput.setAttribute("type", "text");
    nameInput.setAttribute("name", "name");
    nameInput.value = entity.getName();
    form.appendChild(nameInput);

    let startDateLabel = document.createElement("label");
    startDateLabel.innerHTML = "*Fecha de creacion: ";
    form.appendChild(startDateLabel);

    let startDateInput = document.createElement("input");
    startDateInput.setAttribute("type", "date");
    startDateInput.setAttribute("name", "startDate");
    startDateInput.value = entity.getStartDate();
    form.appendChild(startDateInput);

    let endDateLabel = document.createElement("label");
    endDateLabel.innerHTML = "Fecha de cierre: ";
    form.appendChild(endDateLabel);

    let endDateInput = document.createElement("input");
    endDateInput.setAttribute("type", "date");
    endDateInput.setAttribute("name", "endDate");
    endDateInput.value = entity.getEndDate();
    form.appendChild(endDateInput);

    let imageLabel = document.createElement("label");
    imageLabel.innerHTML = "*URL de imagen del logo: ";
    form.appendChild(imageLabel);

    let imageInput = document.createElement("input");
    imageInput.setAttribute("type", "text");
    imageInput.setAttribute("name", "image");
    imageInput.value = entity.getImage();
    form.appendChild(imageInput);

    let wikilabel = document.createElement("label");
    wikilabel.innerHTML = "*URL de pagina de wikipedia ";
    form.appendChild(wikilabel);

    let wikiInput = document.createElement("input");
    wikiInput.setAttribute("type", "text");
    wikiInput.setAttribute("name", "wiki");
    wikiInput.value = entity.getWiki();
    form.appendChild(wikiInput);

    let relatedProductsLabel = document.createElement("label");
    relatedProductsLabel.innerHTML = "Productos relacionados: ";
    form.appendChild(relatedProductsLabel);

    let relatedProductsAddutton = document.createElement("button");
    relatedProductsAddutton.innerHTML = "Añadir";
    relatedProductsAddutton.setAttribute("class", "relatedAdd");
    relatedProductsAddutton.setAttribute("type", "button");
    relatedProductsAddutton.addEventListener("click", function () {
        editRelation(entity.getId(), pageInfo.getIdofProduct(relatedProductsInput.value), "entities", "products", "add", relatedProductsInput.value);
    });
    form.appendChild(relatedProductsAddutton);

    let relatedProductsRemoveButton = document.createElement("button");
    relatedProductsRemoveButton.innerHTML = "Quitar";
    relatedProductsRemoveButton.setAttribute("class", "relatedRemove");
    relatedProductsRemoveButton.setAttribute("type", "button");
    relatedProductsRemoveButton.addEventListener("click", function () {
        editRelation(entity.getId(), pageInfo.getIdofProduct(relatedProductsInput.value), "entities", "products", "rem", relatedProductsInput.value);
    });
    form.appendChild(relatedProductsRemoveButton);

    let relatedProductsInput = document.createElement("input");
    relatedProductsInput.setAttribute("type", "text");
    relatedProductsInput.setAttribute("name", "relatedPeople");
    form.appendChild(relatedProductsInput);

    let relatedPeopleLabel = document.createElement("label");
    relatedPeopleLabel.innerHTML = "Personas relacionadas: ";
    form.appendChild(relatedPeopleLabel);

    let relatedPersonsAddutton = document.createElement("button");
    relatedPersonsAddutton.innerHTML = "Añadir";
    relatedPersonsAddutton.setAttribute("class", "relatedAdd");
    relatedPersonsAddutton.setAttribute("type", "button");
    relatedPersonsAddutton.addEventListener("click", function () {
        editRelation(entity.getId(), pageInfo.getIdofPerson(relatedPeopleInput.value), "entities", "persons", "add", relatedPeopleInput.value);
    });
    form.appendChild(relatedPersonsAddutton);

    let relatedPersonsRemoveButton = document.createElement("button");
    relatedPersonsRemoveButton.innerHTML = "Quitar";
    relatedPersonsRemoveButton.setAttribute("class", "relatedRemove");
    relatedPersonsRemoveButton.setAttribute("type", "button");
    relatedPersonsRemoveButton.addEventListener("click", function () {
        editRelation(entity.getId(), pageInfo.getIdofPerson(relatedPeopleInput.value), "entities", "persons", "rem", relatedPeopleInput.value);
    });
    form.appendChild(relatedPersonsRemoveButton);

    let relatedPeopleInput = document.createElement("input");
    relatedPeopleInput.setAttribute("type", "text");
    relatedPeopleInput.setAttribute("name", "relatedPeople");
    form.appendChild(relatedPeopleInput);

    let submitButton = document.createElement("input");
    submitButton.setAttribute("type", "submit");
    submitButton.setAttribute("name", "submit");
    submitButton.innerHTML = "Aceptar";
    form.appendChild(submitButton);

    let cancelButton = document.createElement("button");
    cancelButton.setAttribute("type", "button");
    cancelButton.setAttribute("name", "cancel");
    cancelButton.innerHTML = "Cancelar";
    cancelButton.setAttribute("class", "cancelButton");
    cancelButton.addEventListener("click", function () {
        location.reload();
    });
    form.appendChild(cancelButton);

    body.insertBefore(form, table);

    let infoText = document.createElement("h3");
    infoText.innerHTML = "Rellene los campos que quiera editar para " + entity.getName();
    body.insertBefore(infoText, form);

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        let name = nameInput.value;
        let startDate = startDateInput.value;
        let endDate = endDateInput.value;
        let image = imageInput.value;
        let wiki = wikiInput.value;
        if (name == "" || startDate == "" || image == "" || wiki == "") {
            alert("Los campos marcados con * no pueden ser vacios.");
        }
        else {
            if (endDate != "" && startDate > endDate) {
                alert("La fecha de creación no puede ser posterior a la de cierre");
            }
            else {
                let idtoEdit = entity.getId();
                editFromDB(idtoEdit, name, startDate, endDate, image, wiki, "entities", "entidad");
            }
        }
    });
}

function viewAddEntityWindow() {
    let tbody = document.getElementById("tbody");
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
    let body = document.getElementById("body");
    let currentUserLabel = document.getElementById("currentUser");
    body.removeChild(currentUserLabel);
    let showYourInfoButton = document.getElementById("showYourInfoButton");
    body.removeChild(showYourInfoButton);
    let sUBToDelete = document.getElementById("showUsersButton");
    if(sUBToDelete != null) {body.removeChild(sUBToDelete);}
    let form = document.createElement("form");
    form.setAttribute("class", "form");

    let logoutButton = document.getElementById("logoutButton");
    body.removeChild(logoutButton);

    let nameLabel = document.createElement("label");
    nameLabel.innerHTML = "*Nombre: ";
    form.appendChild(nameLabel);

    let nameInput = document.createElement("input");
    nameInput.setAttribute("type", "text");
    nameInput.setAttribute("name", "name");
    form.appendChild(nameInput);

    let startDateLabel = document.createElement("label");
    startDateLabel.innerHTML = "*Fecha de creacion: ";
    form.appendChild(startDateLabel);

    let startDateInput = document.createElement("input");
    startDateInput.setAttribute("type", "date");
    startDateInput.setAttribute("name", "startDate");
    form.appendChild(startDateInput);

    let endDateLabel = document.createElement("label");
    endDateLabel.innerHTML = "Fecha de cierre: ";
    form.appendChild(endDateLabel);

    let endDateInput = document.createElement("input");
    endDateInput.setAttribute("type", "date");
    endDateInput.setAttribute("name", "endDate");
    form.appendChild(endDateInput);

    let imageLabel = document.createElement("label");
    imageLabel.innerHTML = "*URL de imagen del logo: ";
    form.appendChild(imageLabel);

    let imageInput = document.createElement("input");
    imageInput.setAttribute("type", "text");
    imageInput.setAttribute("name", "image");
    form.appendChild(imageInput);

    let wikilabel = document.createElement("label");
    wikilabel.innerHTML = "*URL de pagina de wikipedia ";
    form.appendChild(wikilabel);

    let wikiInput = document.createElement("input");
    wikiInput.setAttribute("type", "text");
    wikiInput.setAttribute("name", "wiki");
    form.appendChild(wikiInput);

    let submitButton = document.createElement("input");
    submitButton.setAttribute("type", "submit");
    submitButton.setAttribute("name", "addProduct");
    submitButton.innerHTML = "Añadir";
    form.appendChild(submitButton);

    let cancelButton = document.createElement("button");
    cancelButton.setAttribute("type", "button");
    cancelButton.setAttribute("name", "cancel");
    cancelButton.innerHTML = "Cancelar";
    cancelButton.setAttribute("class", "cancelButton");
    cancelButton.addEventListener("click", function () {
        body.removeChild(infoText);
        body.removeChild(form);
        loadLogout();
        loadDataTable();
    });
    form.appendChild(cancelButton);

    body.insertBefore(form, table);

    let infoText = document.createElement("h3");
    infoText.innerHTML = "Introduce los datos de la nueva entidad.";
    body.insertBefore(infoText, form);

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        let name = nameInput.value;
        let startDate = startDateInput.value;
        let endDate = endDateInput.value;
        let image = imageInput.value;
        let wiki = wikiInput.value;
        if (name == "" || startDate == "" || image == "" || wiki == "") {
            alert("Debes completar los campos obligatorios (marcados con * )");
        }
        else {
            if (endDate != "" && startDate > endDate) {
                alert("La fecha de creación no puede ser posterior a la de cierre");
            }
            else {
                existElement(name, startDate, endDate, image, wiki, "entities", "entidad", "entityname");
            }
        }
    });
}

function unloadDatatable() {
    let tr = document.querySelectorAll(".tr");
    for (let i = 0; i < tr.length; i++) {
        tr[i].parentNode.removeChild(tr[i]);
    }
}

function loadDataTable() {
    let tbody = document.getElementById("tbody");
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
    let numProduct = 0;
    let numPeople = 0;
    let numEntity = 0;
    for (i = 0; i <= pageInfo.getLongest(); i++) {
        let tr = document.createElement("tr");
        tr.setAttribute("class", "tr");
        let tdProduct = document.createElement("td");
        let tdPeople = document.createElement("td");
        let tdEntity = document.createElement("td");
        if (numProduct < pageInfo.getProducts().length) {
            let div = document.createElement("div");
            let textProduct = document.createTextNode(pageInfo.getProducts()[numProduct].getName());
            let imgProduct = document.createElement("img");
            let product = pageInfo.getProducts()[numProduct];
            imgProduct.src = pageInfo.getProducts()[numProduct].getImage();
            imgProduct.alt = pageInfo.getProducts()[numProduct].getName();
            imgProduct.addEventListener("click", function () {
                pageInfo.showInfoProduct(product);
            });
            div.appendChild(imgProduct);
            div.appendChild(textProduct);
            let removeButtonProduct = document.createElement("button");
            removeButtonProduct.innerHTML = "Borrar"
            removeButtonProduct.setAttribute("class", "deleteButton");
            removeButtonProduct.addEventListener("click", function () {
                deleteFromDB(product.getId(), "products", "producto");
            });
            div.appendChild(removeButtonProduct);
            let editButtonProduct = document.createElement("button");
            editButtonProduct.innerHTML = "Editar";
            editButtonProduct.setAttribute("class", "editButton");
            editButtonProduct.addEventListener("click", function () {
                viewEditProductWindow(product);
            });
            div.appendChild(editButtonProduct);
            tdProduct.appendChild(div);
            numProduct++;
        }
        else {
            if (numProduct == pageInfo.getProducts().length) {
                let addButtonProduct = document.createElement("button");
                addButtonProduct.innerHTML = "Añadir";
                addButtonProduct.id = "addProductButton"
                addButtonProduct.addEventListener("click", function () {
                    viewAddProductWindow();
                });
                tdProduct.appendChild(addButtonProduct);
                numProduct++;
            }
        }
        if (numPeople < pageInfo.getPeople().length) {
            let div = document.createElement("div");
            let textPeople = document.createTextNode(pageInfo.getPeople()[numPeople].getName());
            let imgPeople = document.createElement("img");
            let person = pageInfo.getPeople()[numPeople];
            imgPeople.src = pageInfo.getPeople()[numPeople].getImage();
            imgPeople.alt = pageInfo.getPeople()[numPeople].getName()
            imgPeople.addEventListener("click", function () {
                pageInfo.showInfoPerson(person);
            });
            div.appendChild(imgPeople);
            div.appendChild(textPeople);
            let removeButtonPeople = document.createElement("button");
            removeButtonPeople.innerHTML = "Borrar"
            removeButtonPeople.setAttribute("class", "deleteButton");
            removeButtonPeople.addEventListener("click", function () {
                deleteFromDB(person.getId(), "persons", "persona");
            });
            div.appendChild(removeButtonPeople);
            let editButtonPeople = document.createElement("button");
            editButtonPeople.innerHTML = "Editar";
            editButtonPeople.setAttribute("class", "editButton");
            editButtonPeople.addEventListener("click", function () {
                viewEditPersonWindow(person);
            });
            div.appendChild(editButtonPeople);
            tdPeople.appendChild(div);
            numPeople++;
        }
        else {
            if (numPeople == pageInfo.getPeople().length) {
                let addButtonPeople = document.createElement("button");
                addButtonPeople.innerHTML = "Añadir";
                addButtonPeople.id = "addPeopleButton";
                addButtonPeople.addEventListener("click", function () {
                    viewAddPersonWindow();
                });
                tdPeople.appendChild(addButtonPeople);
                numPeople++;
            }
        }
        if (numEntity < pageInfo.getEntities().length) {
            let div = document.createElement("div");
            let textEntity = document.createTextNode(pageInfo.getEntities()[numEntity].getName());
            let imgEntity = document.createElement("img");
            let entity = pageInfo.getEntities()[numEntity];
            imgEntity.src = pageInfo.getEntities()[numEntity].getImage();
            imgEntity.alt = pageInfo.getEntities()[numEntity].getName();
            imgEntity.addEventListener("click", function () {
                pageInfo.showInfoEntity(entity);
            });
            div.appendChild(imgEntity);
            div.appendChild(textEntity);
            let removeButtonEntity = document.createElement("button");
            removeButtonEntity.innerHTML = "Borrar"
            removeButtonEntity.setAttribute("class", "deleteButton");
            removeButtonEntity.addEventListener("click", function () {
                deleteFromDB(entity.getId(), "entities", "entidad");
            });
            div.appendChild(removeButtonEntity);
            let editButtonEntity = document.createElement("button");
            editButtonEntity.innerHTML = "Editar";
            editButtonEntity.setAttribute("class", "editButton");
            editButtonEntity.addEventListener("click", function () {
                viewEditEntityWindow(entity);
            });
            div.appendChild(editButtonEntity);
            tdEntity.appendChild(div);
            numEntity++;
        }
        else {
            if (numEntity == pageInfo.getEntities().length) {
                let addButtonEntity = document.createElement("button");
                addButtonEntity.innerHTML = "Añadir";
                addButtonEntity.id = "addEntityButton";
                addButtonEntity.addEventListener("click", function () {
                    viewAddEntityWindow();
                });
                tdEntity.appendChild(addButtonEntity);
                numEntity++;
            }
        }
        tr.appendChild(tdProduct);
        tr.appendChild(tdPeople);
        tr.appendChild(tdEntity);
        tbody.appendChild(tr);
        if(currentRole == "READER") {unloadButtons()}
    }
}

function loadLogin() {
    unloadButtons();
    unloadDatatable();
    let body = document.getElementById("body");
    let form = document.createElement("form");
    form.id = "loginForm";

    let loginText = document.createElement("h3");
    loginText.innerHTML = "Iniciar sesion";
    form.appendChild(loginText);

    let userLabel = document.createElement("label");
    userLabel.innerHTML = "Usuario: ";
    form.appendChild(userLabel);

    let userInput = document.createElement("input");
    userInput.setAttribute("type", "text");
    userInput.setAttribute("name", "user");
    form.appendChild(userInput);

    let passwordLabel = document.createElement("label");
    passwordLabel.innerHTML = " Contraseña: ";
    form.appendChild(passwordLabel);

    let passwordInput = document.createElement("input");
    passwordInput.setAttribute("type", "password");
    passwordInput.setAttribute("name", "password");
    form.appendChild(passwordInput);

    let submitButton = document.createElement("input");
    submitButton.setAttribute("type", "submit");
    submitButton.setAttribute("name", "login");
    form.appendChild(submitButton);
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        let username = userInput.value;
        let password = passwordInput.value;
        getToken(username, password);
    });

    body.appendChild(form);

    let formRG = document.createElement("form");
    formRG.id = "formRG";

    let textRG = document.createElement("h3");
    textRG.innerHTML = "Registrarse";
    formRG.appendChild(textRG);

    let userLabelRG = document.createElement("label");
    userLabelRG.innerHTML = "Usuario: ";
    formRG.appendChild(userLabelRG);

    let userInputRG = document.createElement("input");
    userInputRG.setAttribute("type", "text");
    userInputRG.setAttribute("name", "user");
    formRG.appendChild(userInputRG);

    let emailLabel = document.createElement("label");
    emailLabel.innerHTML = " Correo: ";
    formRG.appendChild(emailLabel);

    let emailInput = document.createElement("input");
    emailInput.setAttribute("type", "text");
    emailInput.setAttribute("name", "email");
    formRG.appendChild(emailInput);

    let passwordLabelRG = document.createElement("label");
    passwordLabelRG.innerHTML = " Contraseña: ";
    formRG.appendChild(passwordLabelRG);

    let passwordInputRG = document.createElement("input");
    passwordInputRG.setAttribute("type", "password");
    passwordInputRG.setAttribute("name", "password");
    formRG.appendChild(passwordInputRG);

    let submitButtonRG = document.createElement("input");
    submitButtonRG.setAttribute("type", "submit");
    submitButtonRG.setAttribute("name", "login");
    formRG.appendChild(submitButtonRG);

    body.appendChild(formRG);

    formRG.addEventListener("submit", function (e) {
        e.preventDefault();
        existUser(userInputRG.value, emailInput.value, passwordInputRG.value);
    });
}

function completeUser(username, email, password) {
    let body = document.getElementById("body");

    let formRG = document.createElement("form");
    formRG.id = "formRG";

    let textRG = document.createElement("h3");
    textRG.innerHTML = "Completa los datos para terminar el registro de " + username;
    formRG.appendChild(textRG);

    let nameLabelRG = document.createElement("label");
    nameLabelRG.innerHTML = "Nombre: ";
    formRG.appendChild(nameLabelRG);

    let nameInputRG = document.createElement("input");
    nameInputRG.setAttribute("type", "text");
    nameInputRG.setAttribute("name", "name");
    formRG.appendChild(nameInputRG);

    let dateLabel = document.createElement("label");
    dateLabel.innerHTML = " Fecha de nacimiento: ";
    formRG.appendChild(dateLabel);

    let dateInput = document.createElement("input");
    dateInput.setAttribute("type", "date");
    dateInput.setAttribute("name", "birthDate");
    formRG.appendChild(dateInput);

    let submitButtonRG = document.createElement("input");
    submitButtonRG.setAttribute("type", "submit");
    submitButtonRG.setAttribute("name", "login");
    formRG.appendChild(submitButtonRG);

    let cancelButton = document.createElement("button");
    cancelButton.setAttribute("type", "button");
    cancelButton.setAttribute("name", "cancel");
    cancelButton.innerHTML = "Cancelar";
    cancelButton.addEventListener("click", function () {
        location.reload();
    });
    formRG.appendChild(cancelButton);

    body.appendChild(formRG);

    formRG.addEventListener("submit", function (e) {
        e.preventDefault();
        registUser(username, nameInputRG.value, dateInput.value, email, password);
    });
}

function unloadRelated() {
    let relatedPeople = document.querySelectorAll(".relatedR");
    for (let i = 0; i < relatedPeople.length; i++) {
        relatedPeople[i].parentNode.removeChild(relatedPeople[i]);
    }

    let relatedEntity = document.querySelectorAll(".relatedL");
    for (let i = 0; i < relatedEntity.length; i++) {
        relatedEntity[i].parentNode.removeChild(relatedEntity[i]);
    }
}

function unloadButtons() {
    let productButton = document.getElementById("addProductButton");
    if (productButton != null) { productButton.remove(); }

    let entityButton = document.getElementById("addEntityButton");
    if (entityButton != null) { entityButton.remove(); }

    let peopleButton = document.getElementById("addPeopleButton");
    if (peopleButton != null) { peopleButton.remove(); }

    let deleteButtons = document.querySelectorAll(".deleteButton");
    for (let i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].parentNode.removeChild(deleteButtons[i]);
    }

    let editButtons = document.querySelectorAll(".editButton");
    for (let i = 0; i < editButtons.length; i++) {
        editButtons[i].parentNode.removeChild(editButtons[i]);
    }
}

function loadLogout() {
    loadDataTable();
    let body = document.getElementById("body");
    let label = document.createElement("h1");
    let logoutButton = document.createElement("button");
    label.innerHTML = "Bienvenido " + currentUser;
    label.id = "currentUser";
    logoutButton.innerHTML = "Cerrar sesion";
    logoutButton.id = "logoutButton";
    logoutButton.addEventListener("click", function () {
        body.removeChild(logoutButton);
        body.removeChild(showYourInfoButton);
        body.removeChild(label);
        let sUBToDelete = document.getElementById("showUsersButton");
        if(sUBToDelete != null) {body.removeChild(sUBToDelete);}
        logged = "false";
        sessionStorage.setItem("logged", logged);
        currentUser = null;
        sessionStorage.setItem("currentUser", currentUser);
        currentRole = null;
        sessionStorage.setItem("currentRole", currentRole);
        token = null;
        sessionStorage.setItem("Token", token);
        loadLogin();
    });
    body.insertBefore(label, table);
    body.insertBefore(logoutButton, label);
    
    let showYourInfoButton = document.createElement("button");
    showYourInfoButton.innerHTML = "Ver datos personales";
    showYourInfoButton.id = "showYourInfoButton";
    showYourInfoButton.addEventListener("click", function () {
        body.removeChild(logoutButton);
        body.removeChild(label);
        body.removeChild(showYourInfoButton);
        if(currentRole == "WRITER") {body.removeChild(showUsersButton);}
        let backToMain = document.createElement("button");
        backToMain.innerHTML = "Atras";
        backToMain.id = "backToMain";
        backToMain.addEventListener("click", function () {
            body.removeChild(backToMain);
            body.removeChild(infoName);
            if(currentUser != "adminUser") {
                let infoOfUser = document.getElementById("infoRealName");
                if(infoOfUser != null) {body.removeChild(infoOfUser);}
                infoOfUser = document.getElementById("infoBirthDate");
                if(infoOfUser != null) {body.removeChild(infoOfUser);}
            }
            body.removeChild(infoEmail);
            body.removeChild(infoRole);
            if(currentUser != "adminUser") {
                let editInfoButtonToDelete = document.getElementById("editInfoButton");
                if(editInfoButtonToDelete != null) {body.removeChild(editInfoButtonToDelete);}
            }
            loadLogout();
        });
        body.appendChild(backToMain);

        let editInfoButton = document.createElement("button");
        editInfoButton.innerHTML = "Editar informacion";
        editInfoButton.id = "editInfoButton";
        editInfoButton.addEventListener("click", function () {
            body.removeChild(backToMain);
            body.removeChild(editInfoButton);
            body.removeChild(infoName);
            if(currentUser != "adminUser") {
                let infoOfUser = document.getElementById("infoRealName");
                if(infoOfUser != null) {body.removeChild(infoOfUser);}
                infoOfUser = document.getElementById("infoBirthDate");
                if(infoOfUser != null) {body.removeChild(infoOfUser);}
            }
            body.removeChild(infoEmail);
            body.removeChild(infoRole);

            let formEdit = document.createElement("form");
            formEdit.setAttribute("class", "form");

            let nameLabel = document.createElement("label");
            nameLabel.innerHTML = "Nombre: ";
            formEdit.appendChild(nameLabel)

            let nameinput = document.createElement("input");
            nameinput.setAttribute("type", "text");
            nameinput.setAttribute("name", "name");
            nameinput.value = pageInfo.getRealNameofUser(currentUser);
            formEdit.appendChild(nameinput);

            let birthDateLabel = document.createElement("label");
            birthDateLabel.innerHTML = "Fecha de nacimiento: ";
            formEdit.appendChild(birthDateLabel)

            let birthDateinput = document.createElement("input");
            birthDateinput.setAttribute("type", "date");
            birthDateinput.setAttribute("name", "birthDate");
            birthDateinput.value = pageInfo.getBirthDateofUser(currentUser);
            formEdit.appendChild(birthDateinput);

            let emailLabel = document.createElement("label");
            emailLabel.innerHTML = "Correo: "
            formEdit.appendChild(emailLabel)

            let emailInput = document.createElement("input");
            emailInput.setAttribute("type", "text");
            emailInput.setAttribute("name", "email");
            emailInput.value = pageInfo.getEmailofUser(currentUser);
            formEdit.appendChild(emailInput);

            let passwordLabel = document.createElement("label");
            passwordLabel.innerHTML = "Contraseña (rellenar solo si se desea cambiar la contraseña): "
            formEdit.appendChild(passwordLabel)

            let passwordInput = document.createElement("input");
            passwordInput.setAttribute("type", "password");
            passwordInput.setAttribute("name", "password");
            formEdit.appendChild(passwordInput);

            let cancelButton = document.createElement("button");
            cancelButton.setAttribute("type", "button");
            cancelButton.setAttribute("name", "cancel");
            cancelButton.innerHTML = "Cancelar";
            cancelButton.setAttribute("class", "cancelButton");
            cancelButton.addEventListener("click", function () {
                body.removeChild(formEdit);
                body.removeChild(infoText);
                loadLogout();
            });

            let submitButton = document.createElement("input");
            submitButton.setAttribute("type", "submit");
            submitButton.setAttribute("name", "submit");
            submitButton.innerHTML = "Aceptar";
            formEdit.appendChild(submitButton);
            formEdit.appendChild(cancelButton);

            formEdit.addEventListener("submit", function () {
                editUser(pageInfo.getIdofUser(currentUser), currentUser, nameinput.value, birthDateinput.value,
                    emailInput.value, passwordInput.value, currentRole);
            });
            body.appendChild(formEdit);

            let infoText = document.createElement("h3");
            infoText.innerHTML = "Rellene los campos que quiera editar.";
            body.insertBefore(infoText, formEdit);
        });
        body.appendChild(editInfoButton);
        if(currentUser == "adminUser") {body.removeChild(editInfoButton)}

        let infoName = document.createElement("h3");
        infoName.innerHTML = "Usuario: " + currentUser;
        body.appendChild(infoName);
        if(currentUser != "adminUser") {
            let infoRealName = document.createElement("h3");
            infoRealName.innerHTML = "Nombre: " + pageInfo.getRealNameofUser(currentUser);
            infoRealName.id = "infoRealName";
            body.appendChild(infoRealName);
            let infoBirthDate = document.createElement("h3");
            infoBirthDate.innerHTML = "Fecha de nacimiento: " + pageInfo.getBirthDateofUser(currentUser);
            infoBirthDate.id = "infoBirthDate";
            body.appendChild(infoBirthDate);
        }
        let infoEmail = document.createElement("h3");
        infoEmail.innerHTML = "Correo: " + pageInfo.getEmailofUser(currentUser);
        body.appendChild(infoEmail);
        let infoRole = document.createElement("h3");
        infoRole.innerHTML = "Rol actual: " + currentRole;
        body.appendChild(infoRole);
        unloadDatatable();
    });
    body.insertBefore(showYourInfoButton, logoutButton);
    if(currentRole == "WRITER") {
        let showUsersButton = document.createElement("button");
        showUsersButton.innerHTML = "Ver usuarios";
        showUsersButton.id = "showUsersButton";
        showUsersButton.addEventListener("click", function () {
            body.removeChild(logoutButton);
            body.removeChild(label);
            body.removeChild(showYourInfoButton);
            if(currentRole == "WRITER") {body.removeChild(showUsersButton);}
            let backToMain = document.createElement("button");
            backToMain.innerHTML = "Atras";
            backToMain.id = "backToMain";
            backToMain.addEventListener("click", function () {
                body.removeChild(backToMain);
                body.removeChild(tableUsers)
                loadLogout();
            });
            body.appendChild(backToMain);
            let tableUsers = document.createElement("tableUsers");
            tableUsers.id = "tableUsers";
            let tbodyUsers = document.createElement("tbody");
            tbodyUsers.id = "tbodyUsers";
            let userList = pageInfo.getUsers();
            let mainTr = document.createElement("tr");
            let idTd = document.createElement("td");
            let usernameTd = document.createElement("td");
            let emailTd = document.createElement("td");
            let roleTd = document.createElement("td");
            let tdDataId = document.createTextNode("ID");
            let tdDataUsername = document.createTextNode("Usuario");
            let tdDataEmail = document.createTextNode("Correo");
            let tdDataRole = document.createTextNode("Rol actual");
            idTd.appendChild(tdDataId);
            usernameTd.appendChild(tdDataUsername);
            emailTd.appendChild(tdDataEmail);
            roleTd.appendChild(tdDataRole);
            mainTr.appendChild(idTd);
            mainTr.appendChild(usernameTd);
            mainTr.appendChild(emailTd);
            mainTr.appendChild(roleTd);
            tbodyUsers.appendChild(mainTr)
            for(let i = 0; i < userList.length; i++) {
                let tr = document.createElement("tr");
                let tdID = document.createElement("td");
                let tdUsername = document.createElement("td");
                let tdEmail = document.createElement("td");
                let tdRole = document.createElement("td");
                let userID = document.createTextNode(userList[i].getId());
                let userUsername = document.createTextNode(userList[i].getUsername());
                let userEmail = document.createTextNode(userList[i].getEmail());
                let userRole = document.createTextNode(userList[i].getRole());
                tdID.appendChild(userID);
                tdUsername.appendChild(userUsername);
                tdEmail.appendChild(userEmail);
                tdRole.appendChild(userRole);
                tr.appendChild(tdID);
                tr.appendChild(tdUsername);
                tr.appendChild(tdEmail);
                tr.appendChild(tdRole);
                if(userList[i].getUsername() != "adminUser" && pageInfo.getIdofUser(currentUser) != userList[i].getId()) {
                    let div = document.createElement("div");
                    let tdButtons = document.createElement("td");

                    if(userList[i].getRole() != "INACTIVE") {
                        let inactiveButton = document.createElement("button");
                        inactiveButton.innerHTML = "Desactivar";
                        inactiveButton.addEventListener("click", function () {
                            editUser(userList[i].getId(), userList[i].getUsername(), userList[i].getRealName(), userList[i].getBirthDate(), userList[i].getEmail(), "", "inactive");
                        });
                        div.appendChild(inactiveButton);
                    }

                    let deleteUserButton = document.createElement("button");
                    deleteUserButton.innerHTML = "Eliminar";
                    deleteUserButton.addEventListener("click", function () {
                        let idToDelete = userList[i].getId();
                        deleteUser(idToDelete);
                    });
                    div.appendChild(deleteUserButton);

                    let changeRoleButton = document.createElement("button");
                    let roleToChange = userList[i].getRole();
                    if(roleToChange == "READER") {changeRoleButton.innerHTML = "Cambiar rol a WRITER";}
                    else {changeRoleButton.innerHTML = "Cambiar rol a READER";}
                    changeRoleButton.addEventListener("click", function () {
                        let newRole = "reader";
                        if(roleToChange == "READER") {newRole = "writer";}
                        editUser(userList[i].getId(), userList[i].getUsername(), userList[i].getRealName(), userList[i].getBirthDate(), userList[i].getEmail(), "", newRole);
                    });
                    div.appendChild(changeRoleButton);

                    tdButtons.appendChild(div);
                    tr.appendChild(tdButtons);
                }
                tbodyUsers.appendChild(tr);
            }
            tableUsers.appendChild(tbodyUsers);
            body.appendChild(tableUsers);
            
            unloadDatatable();
        });
        body.insertBefore(showUsersButton, showYourInfoButton);
    }
}

function getToken(username, password) {
    let reqToken = new XMLHttpRequest();
    reqToken.open("POST", encodeURI("http://127.0.0.1:8000/access_token"), true);
    reqToken.responseType = "json";
    reqToken.setRequestHeader("accept", "application/json");
    reqToken.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    reqToken.onload = () => {
        if (reqToken.status === 200) {
            sessionStorage.setItem("Token", reqToken.response['access_token']);
            let reqUsers = new XMLHttpRequest();
            reqUsers.open("GET", encodeURI("http://127.0.0.1:8000/api/v1/users"), true);
            reqUsers.responseType = "json";
            reqUsers.setRequestHeader("accept", "application/json");
            reqUsers.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
            reqUsers.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem("Token"));
            reqUsers.onload = () => {
                if(reqUsers.status === 200) {
                    let users = reqUsers.response;
                    for(let user in users['users']) {
                        if(username === users['users'][user]['user']['username']) {
                            if(users['users'][user]['user']['role'] === "INACTIVE") {
                                sessionStorage.removeItem("Token");
                                alert("Tu cuenta esta desactivada. Espera a que un usuario de tipo WRITER active tu cuenta para acceder.");
                            } else {
                                sessionStorage.setItem("Token", reqToken.response["access_token"]);
                                sessionStorage.setItem("currentUser", username);
                                sessionStorage.setItem("currentRole", users['users'][user]['user']['role']);
                                token = sessionStorage.getItem("Token");
                                currentUser = sessionStorage.getItem("currentUser");
                                currentRole = sessionStorage.getItem("currentRole");
                                let body = document.getElementById("body");
                                let form = document.getElementById("loginForm");
                                let formRG = document.getElementById("formRG");
                                body.removeChild(form);
                                body.removeChild(formRG);
                                logged = "true";
                                sessionStorage.setItem("logged", logged);
                                location.reload();
                            }
                        }
                    }
                } else {
                    alert("Error de conexion");
                }
            }
            reqUsers.send();
        } else {
            alert("Datos incorrectos");
        }
    };
    reqToken.send("username=" + username + "&password=" + password + "&scope=");
}

function registUser(username, name, birthDate, email, password) {
    let reqRegistUser = new XMLHttpRequest();

    reqRegistUser.open("POST", encodeURI("http://127.0.0.1:8000/api/v1/users"), true);
    reqRegistUser.responseType = "json";
    reqRegistUser.setRequestHeader("accept", "application/json");
    reqRegistUser.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    reqRegistUser.onload = () => {
        if (reqRegistUser.status === 201) {
            alert("Usuario creado. Espere a que un usuario WRITER le de acceso para acceder al sistema.");
            location.reload();
        } else if(reqRegistUser.status === 400){
            alert("El nombre de usuario o el correo ya existen");
        } else {
            alert("Error de conexion")
        }
    };
    reqRegistUser.send("username=" + username + "&name=" + name + "&birthDate=" + birthDate + "&email=" + email + "&password=" + password);
}

function deleteUser(id) {
    let reqDeleteUser = new XMLHttpRequest();
    reqDeleteUser.open("DELETE", encodeURI("http://127.0.0.1:8000/api/v1/users/" + id), true);
    reqDeleteUser.setRequestHeader("accept", "*/*");
    reqDeleteUser.setRequestHeader("Authorization", "Bearer " + token);
    reqDeleteUser.onload = () => {
        if (reqDeleteUser.status === 204) {
            alert("Usuario eliminado");
            location.reload();
        } else {
            alert("Error al borrar el usuario");
        }
    };
    reqDeleteUser.send();
}

function editUser(id, username, name, birthDate, email, password, role) {
    let reqEditUser = new XMLHttpRequest();
    reqEditUser.open("GET", encodeURI("http://127.0.0.1:8000/api/v1/users/" + id), true);
    reqEditUser.responseType = "json";
    reqEditUser.setRequestHeader("accept", "application/json");
    reqEditUser.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    reqEditUser.setRequestHeader("Authorization", "Bearer " + token);
    reqEditUser.onload = () => {
        if (reqEditUser.status === 200) {
            let etag = reqEditUser.getResponseHeader("Etag");
            reqEditUser.open("PUT", encodeURI("http://127.0.0.1:8000/api/v1/users/" + id), true);
            reqEditUser.responseType = "json";
            reqEditUser.setRequestHeader("accept", "application/json");
            reqEditUser.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            reqEditUser.setRequestHeader("Authorization", "Bearer " + token);
            reqEditUser.setRequestHeader("If-Match", etag);
            reqEditUser.onload = () => {
                if (reqEditUser.status === 209) {
                    location.reload();
                } else {
                    alert("Error en la edicion de usuario");
                }
            }
            reqEditUser.send("username=" + username + "&name=" + name + "&birthDate=" + birthDate +"&email=" + email + "&password=" + password + "&role=" + role);
            alert("Edicion de usuario completada con exito");
        } else {
            alert("Error en la obtencion de usuario");
        }
    }
    reqEditUser.send();
}

function editRelation(id1, id2, element1, element2, mode, name) {
    let reqEditRelation = new XMLHttpRequest();
    reqEditRelation.open("PUT", encodeURI("http://127.0.0.1:8000/api/v1/" + element1 + "/" + id1 + "/" + element2 + "/" + mode + "/" + id2), true);
    reqEditRelation.setRequestHeader("accept", "application/json");
    reqEditRelation.setRequestHeader("Authorization", "Bearer " + token);
    reqEditRelation.onload = () => {
        if (reqEditRelation.status === 209) {
            if(mode == "add") {alert("Relacion añadida con " + name);}
            else {alert("Relacion eliminada con " + name )}
        } else {
            alert("Error al crear la relacion");
        }
    };
    reqEditRelation.send();
}

function createElement(name, birthDate, deathDate, image, wiki, toCreate, toCreateName) {
    let reqCreate = new XMLHttpRequest();
    reqCreate.open("POST", encodeURI("http://127.0.0.1:8000/api/v1/" + toCreate), true);
    reqCreate.responseType = "json";
    reqCreate.setRequestHeader("accept", "application/json");
    reqCreate.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    reqCreate.setRequestHeader("Authorization", "Bearer " + token);
    reqCreate.onload = () => {
        if (reqCreate.status === 201) {
            location.reload();
        } else {
            alert("Error en la creación de " + toCreateName);
        }
    };
    reqCreate.send("name=" + name + "&birthDate=" + birthDate + "&deathDate=" + deathDate + "&imageUrl=" + image + "&wikiUrl=" + wiki);
    alert("Creacion de " + toCreateName + " completada con exito");
}

function editFromDB(id, name, birthDate, deathDate, image, wiki, toEdit, toEditName) {
    let reqEdit = new XMLHttpRequest();
    reqEdit.open("GET", encodeURI("http://127.0.0.1:8000/api/v1/" + toEdit + "/" + id), true);
    reqEdit.responseType = "json";
    reqEdit.setRequestHeader("accept", "application/json");
    reqEdit.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    reqEdit.setRequestHeader("Authorization", "Bearer " + token);
    reqEdit.onload = () => {
        if (reqEdit.status === 200) {
            let etag = reqEdit.getResponseHeader("Etag");
            reqEdit.open("PUT", encodeURI("http://127.0.0.1:8000/api/v1/" + toEdit + "/" + id), true);
            reqEdit.responseType = "json";
            reqEdit.setRequestHeader("accept", "application/json");
            reqEdit.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            reqEdit.setRequestHeader("Authorization", "Bearer " + token);
            reqEdit.setRequestHeader("If-Match", etag);
            reqEdit.onload = () => {
                if (reqEdit.status === 209) {
                    alert("Edicion de " + toEditName + " completada con exito");
                    location.reload();
                } else 
                if(reqEdit.status === 400) {
                    alert("Este elemento " + toEditName + " ya existe");
                }
            }
            reqEdit.send("name=" + name + "&birthDate=" + birthDate + "&deathDate=" + deathDate + "&imageUrl=" + image + "&wikiUrl=" + wiki);
        } else {
            alert("Error en la obtencion de " + toEditName);
        }
    }
    reqEdit.send();
}

function deleteFromDB(id, toDelete, toDeleteName) {
    let reqDeleteFromDB = new XMLHttpRequest();
    reqDeleteFromDB.open("DELETE", encodeURI("http://127.0.0.1:8000/api/v1/" + toDelete + "/" + id), true);
    reqDeleteFromDB.setRequestHeader("accept", "*/*");
    reqDeleteFromDB.setRequestHeader("Authorization", "Bearer " + token);
    reqDeleteFromDB.onload = () => {
        if (reqDeleteFromDB.status === 204) {
            alert("Borrado de " + toDeleteName + " completado con exito");
            location.reload();
        } else {
            alert("Error en el borrado de " + toDeleteName);
        }
    };
    reqDeleteFromDB.send();
}

function getProductsDB() {
    let reqgetProductsDB = new XMLHttpRequest();
    reqgetProductsDB.open("GET", encodeURI("http://127.0.0.1:8000/api/v1/products?order=id&ordering=ASC"), true);
    reqgetProductsDB.responseType = "json";
    reqgetProductsDB.setRequestHeader("accept", "application/json");
    reqgetProductsDB.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    reqgetProductsDB.setRequestHeader("Authorization", "Bearer " + token);
    reqgetProductsDB.onload = () => {
        if (reqgetProductsDB.status === 200) {
            productsDB = reqgetProductsDB.response["products"];
            productOK = true;
        } else {
            if(reqgetProductsDB.status === 404) {
                productOK = true;
            } else {
                alert("Error de conexion");
            }
        }
    };
    reqgetProductsDB.send();
}

function getPersonsDB() {
    let reqgetPersonsDB = new XMLHttpRequest();
    reqgetPersonsDB.open("GET", encodeURI("http://127.0.0.1:8000/api/v1/persons?order=id&ordering=ASC"), true);
    reqgetPersonsDB.responseType = "json";
    reqgetPersonsDB.setRequestHeader("accept", "application/json");
    reqgetPersonsDB.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    reqgetPersonsDB.setRequestHeader("Authorization", "Bearer " + token);
    reqgetPersonsDB.onload = () => {
        if (reqgetPersonsDB.status === 200) {
            personsDB = reqgetPersonsDB.response["persons"];
            personOK = true;
        } else {
            if(reqgetPersonsDB.status === 404) {
                personOK = true;
            } else {
                alert("Error de conexion");
            }
        }
    };
    reqgetPersonsDB.send();
}

function getEntitiesDB() {
    let reqgetEntitiesDB = new XMLHttpRequest();
    reqgetEntitiesDB.open("GET", encodeURI("http://127.0.0.1:8000/api/v1/entities?order=id&ordering=ASC"), true);
    reqgetEntitiesDB.responseType = "json";
    reqgetEntitiesDB.setRequestHeader("accept", "application/json");
    reqgetEntitiesDB.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    reqgetEntitiesDB.setRequestHeader("Authorization", "Bearer " + token);
    reqgetEntitiesDB.onload = () => {
        if (reqgetEntitiesDB.status === 200) {
            entitiesDB = reqgetEntitiesDB.response["entities"];
            entityOK = true;
        } else {
            if(reqgetEntitiesDB.status === 404) {
                entityOK = true;
            } else {
                alert("Error de conexion");
            }
        }
    };
    reqgetEntitiesDB.send();
}

function existUser (username, email, password) {
    let reqExistUser = new XMLHttpRequest();
    reqExistUser.open("GET", encodeURI("http://127.0.0.1:8000/api/v1/users/username/" + username), true);
    reqExistUser.responseType = "json";
    reqExistUser.setRequestHeader("accept", "application/json");
    reqExistUser.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    reqExistUser.onload = () => {
        if(reqExistUser.status === 404) {
            let body = document.getElementById("body");
            let formRG = document.getElementById("formRG");
            let form = document.getElementById("loginForm");
            body.removeChild(formRG);
            body.removeChild(form);
            completeUser(username, email, password);
        } else if(reqExistUser.status === 204) {
            alert("El nombre de usuario ya existe")
        } else {
            alert("Error de conexión");
        }
    }
    reqExistUser.send();
}

function existElement(name, startDate, endDate, image, wiki, toCheck, toCheckName, toCheck2) {
    let reqExistElement = new XMLHttpRequest();
    reqExistElement.open("GET", encodeURI("http://127.0.0.1:8000/api/v1/" + toCheck + "/" + toCheck2 + "/" + name), true);
    reqExistElement.responseType = "json";
    reqExistElement.setRequestHeader("accept", "application/json");
    reqExistElement.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    reqExistElement.onload = () => {
        if(reqExistElement.status === 404) {
            createElement(name, startDate, endDate, image, wiki, toCheck, toCheckName);
        } else if(reqExistElement.status === 204) {
            alert("Este elemento " + toCheckName + " ya existe");
        } else {
            alert("Error de conexión");
        }
    }
    reqExistElement.send();
} 

function getUsersDB() {
    let reqgetUsersDB = new XMLHttpRequest();

    reqgetUsersDB.open("GET", encodeURI("http://127.0.0.1:8000/api/v1/users"), true);
    reqgetUsersDB.responseType = "json";
    reqgetUsersDB.setRequestHeader("accept", "application/json");
    reqgetUsersDB.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    reqgetUsersDB.setRequestHeader("Authorization", "Bearer " + token);
    reqgetUsersDB.onload = () => {
        if (reqgetUsersDB.status === 200) {
            usersDB = reqgetUsersDB.response["users"];
            usersOK = true;
        } else {
            alert("Error de conexion");
        }
    };
    reqgetUsersDB.send();
}

function checkLoaded() {
    if(productOK && personOK && entityOK && usersOK && pageInfoOK) {
        pageInfo = new PageInfo();
        pageInfoOK = false;
    }

    if(productOK && personOK && entityOK && usersOK) {
        clearInterval(interval);
        if (logged == null) {
            logged = "false";
            sessionStorage.setItem("logged", logged);
        }
    
        if (logged == "true") {
            loadDataTable();
            loadLogout();
        }
        else {
            loadLogin();
        }
    }
}

function onLoad() {
    if(logged == "true") {
        getEntitiesDB();
        getProductsDB();
        getPersonsDB();
        getUsersDB();
        interval = setInterval(checkLoaded, 100);
    }
    else {
        loadLogin();
    }
}