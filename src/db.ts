import mongoose from "mongoose";

class Db {
  connection: typeof mongoose;

  constructor(connection: typeof mongoose) {
    this.connection = connection;
  }

  static async init(connectionString: string) {
    const connection = await mongoose.connect(connectionString);
    return new Db(connection);
  }
}

export default Db;
