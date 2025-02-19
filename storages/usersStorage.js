/* storage class to hold the users I create 
simulates interacting with a database */
class UsersStorage {
  constructor() {
    /* UsersStorage has storage (initialized to empty object) and id properties 
    (initialized to 0) 
    storage is an object of user objects, { id, firstName, lastName } */
    this.storage = {};
    this.id = 0;
  }

  addUser({ firstName, lastName, email, age = null, bio = "" }) {
    const id = this.id;
    this.storage[id] = { id, firstName, lastName, email, age, bio };
    this.id++;
  }

  getUsers() {
    // Object.value takes in an object and returns its values
    return Object.values(this.storage);
  }

  getUser(id) {
    return this.storage[id];
  }

  // updates the id, firstName, and/or lastName of a user
  updateUser(id, { firstName, lastName, email, age, bio }) {
    const user = this.storage[id];

    // prevents update to a non-existent user
    if (!user) return;

    // retains existing values when updating only some fields
    this.storage[id] = {
      id,
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      email: email || user.email,
      age: age !== undefined ? age : user.age,
      bio: bio !== undefined ? bio : user.bio,
    };
  }

  deleteUser(id) {
    // deletes user object specified by id property in the storage object
    delete this.storage[id];
  }
}

// exports an instance of the class by instantiating it
// only one instance of this class can exist, this is called the singleton pattern
module.exports = new UsersStorage();
