export interface Trip {
  _id: string, // primary key in MongoDB
  code: string, // Internal primary key in MongoDB
  name: string,
  length: string,
  start: Date,
  resort: string,
  perPerson: string,
  image: string,
  description: string
}