const { user, profile } = require("../../models");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  //Melakukan verifikasi untuk inputan register
  const schema = Joi.object({
    fullName: Joi.string().min(3).required(),
    email: Joi.string().email().min(5).required(),
    password: Joi.string().min(3).required(),
    phone: Joi.string().min(3).required(),
  });
  // ================ || ===============

  //Melakukan pengecekan validasi dengan kondisi
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).send({
      error: {
        message: error.details[0].message,
      },
    });
  // =============== || ===============

  try {
    // Melakukan enkripsi password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // =============== || ===============

    // Melakukan input data ke dalam database
    const newUser = await user.create({
      fullName: req.body.fullName,
      email: req.body.email,
      password: hashedPassword,
      phone: req.body.phone,
    });

    await profile.create({
      idUser: newUser.id,
    });
    // ================ || ===============

    // Mengambil JWT TOKEN_KEY
    const token = jwt.sign({ id: user.id }, process.env.TOKEN_KEY);
    // ============== || ===============
    res.status(200).send({
      status: "Success",
      data: {
        fullName: newUser.fullName,
        email: newUser.email,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Registrasi Failed",
    });
  }
};
exports.login = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  // dekalari error dan pengecekan error
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).send({
      error: {
        message: error.details[0].message,
      },
    });
  // =============== || ================

  try {
    // deklarasi pencarian data user
    const userExist = await user.findOne({
      where: {
        email: req.body.email,
      },
      attributes: {
        exclude: ["createdAt", "updateAt"],
      },
    });
    // =============== || ===============

    // Deklarasi validasi dan pengecekan password
    const isValid = await bcrypt.compare(req.body.password, userExist.password);
    if (!isValid) {
      return res.status(400).send({
        status: "Failed",
        message: "Password Invalid",
      });
    }
    // =============== || ===============

    // deklarasi jwt dan mengirim respon
    const token = jwt.sign({ id: userExist.id }, process.env.TOKEN_KEY);
    res.status(200).send({
      data: {
        fullName: userExist.fullName,
        email: userExist.email,
        token,
      },
    });

    // =============== || ===============
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Login Failed",
    });
  }
};
exports.checkAuth = async (req, res) => {
  try {
    const id = req.user.id;
    const dataUser = await user.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    if (!dataUser) {
      return res.status(400).send({
        status: "Failed",
      });
    }

    res.send({
      status: "Success",
      data: {
        user: {
          id: dataUser.id,
          fullName: dataUser.fullName,
          email: dataUser.email,
          status: dataUser.status,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status({
      status: "Failed",
      message: "Server Error",
    });
  }
};
