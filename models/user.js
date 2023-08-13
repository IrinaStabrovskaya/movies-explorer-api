const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const isLength = require('validator/lib/isLength');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      validate: {
        validator: (string) => isLength(string, { min: 2, max: 30 }),
        message: 'Имя должно содержать от 2 до 30 символов',
      },
    },

    email: {
      type: String,
      required: true,
      unique: true,
      email: {
        validate: {
          validator: (email) => isEmail(email),
          message: 'Неправильный формат почты',
        },
      },
    },

    password: {
      type: String,
      required: true,
      select: false,
    },
  },
);

// метод, который удаляет поле password из тела ответа

// eslint-disable-next-line func-names
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
