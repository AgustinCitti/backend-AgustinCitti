
const books=[
    {title:"Martin fiero",
    author:"José Hernández"},

    {title:"Biblia",
    author:"conjunto de autores"},

    {title:"El hobbit",
    author:"J. R. R. Tolkien"}


];



const pets=["señor gato", "señor perro","señora pez"];



class Usuarios{
 constructor(name,lastname,books,pets){
this.name = name;
this.lastname = lastname;
this.books = books;
this.pets = pets;
}
 
getFullName (){
    return `Nombre:${this.name} Apellido:${this.lastname}`;
}

addPets (newPet){
    this.pets.push(newPet);
}

countPets(){
   return this.pets.length  ;
}

addBooks(title, author){
    this.books.push({title,author});
}
getBookNames(){
    return this.books.map(({title}) => title).join("","");
}
}



const usuario1 = new Usuarios('Martina','Citti',books,pets);

//adicion de nueva mascota
usuario1.addPets("señora loro");



//obtencion de usuario 1
console.log(usuario1);

//obtencion de nombre y apellido
console.log(usuario1.getFullName());

//contador mascotas
console.log(usuario1.countPets());

//adicion libro
usuario1.addBooks("El principito","Antoine de Saint-Exupéry");

//obtencion de titulos de libros
console.log(`Libros del usuario: ${usuario1.getBookNames()}`);