import mongoose from 'mongoose';
import { Password } from './../services/password';

// An interface that describe properties
// that are required to create a new User
interface UserAttr {
  email: string;
  password: string;
}

// An interface that describe properties
// that are a User model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attr: UserAttr): UserDoc;
}

// An interface that describe properties
// that are a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchemaa = new mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchemaa.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

userSchemaa.statics.build = (attr: UserAttr) => {
  return new User(attr);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchemaa);

export { User };
