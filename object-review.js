/* three JS object creators:
class - prototype-based, built-in encapsulation with constructor, methods inside class
        easy inheritance with 'extends', memory effcient bc methods are in the prototype
        use class for structured, reusable objects with easy inheritance 
        uses new keyword
ES6 classes */
class AnimalClass {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} makes a noise.`;
  }
}

class Dog extends AnimalClass {
  speak() {
    return `${this.name} barks.`;
  }
}

// creates instances
const dog = new AnimalClass("Dog");
console.log(dog.speak());

const buddy = new Dog("Buddy");
console.log(buddy.speak());

/*
constructor function - prototype-based, no encapsulation and requires manual prototyp methods
                       manual setyp of inheritance with 'Object.create()'. memory efficient
                       bc methods are in the prototype
                       use constructor functions if supporting old JS 
                       uses new keyword */
function AnimalConstructor(name) {
  this.name = name;
}

AnimalConstructor.prototype.speak = function () {
  return `${this.name} makes a noise.`;
};

function Cat(name) {
  AnimalConstructor.call(this, name);
}

Cat.prototype = Object.create(AnimalConstructor.prototype);
Cat.prototype.constructor = Cat;

// creates instances
const cat = new AnimalConstructor("Cat");
console.log(cat.speak());

Cat.prototype.speak = function () {
  return `${this.name} meows.`;
};

/*
object literal - NOT prototype-based, no encapsulation and no shared behavior
                 no built-in inheritance, less memory efficient bc each object has its own
                 copy of methods
                 use object literals for simple, one-time objects 
                 does not use new keyword */
const bird = {
  name: "bird",
  speak: function () {
    return `${this.name} makes a noise.`;
  },
};

console.log(bird.speak());
/*
factory function - NOT prototype based, easy encapsulation/private data with closures
                   no inheritance, less memory efficient bc methods are copied per instance   
                   does not use new keyword              
*/
function createAnimal(name) {
  return {
    name,
    speak() {
      return `${this.name} makes a noise.`;
    },
  };
}

// creates instance
const mouse = createAnimal("Mouse");
console.log(mouse.speak());
