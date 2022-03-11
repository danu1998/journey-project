const { user, profile } = require("../../models");

// Get All User Data
exports.getUsers = async (req, res) => {
  try {
    const users = await user.findAll({
      include: {
        model: profile,
        as: "profile",
        attributes: {
          exclude: ["createdAt", "updatedAt", "idUser"],
        },
      },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });
    res.send({
      status: "Success !!!",
      message: "Get Data Users Success !",
      data: {
        users,
      },
    });
  } catch (err) {
    console.log(err);
    res.send({
      status: "Error !!!",
      message: "Get Data Users Error !",
    });
  }
};

// Get User Data By Id
exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const users = await user.findOne({
      where: {
        id,
      },
      include: {
        model: profile,
        as: "profile",
        attributes: {
          exclude: ["createdAt", "updatedAt", "idUser"],
        },
      },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });
    res.send({
      status: "Success !!!",
      message: "Get Data By Id User Success",
      data: {
        user: users,
      },
    });
  } catch (err) {
    console.log(err);
    res.send({
      status: "Error !!!",
      message: "Get Data By Id Users Error !",
    });
  }
};

// Add User Data
exports.addUser = async (req, res) => {
  try {
    await user.create(req.body);
    res.send({
      status: "Success !!!",
      message: "Add Data Users Success !",
    });
  } catch (err) {
    console.log(err);
    res.send({
      status: "Error !!!",
      message: "Add Data Users Error !",
    });
  }
};

// Delete User Data By Id
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await user.destroy({
      where: {
        id,
      },
    });
    res.send({
      status: "Success !!!",
      message: "Delete Data User Success !",
    });
  } catch (err) {
    res.send({
      status: "Error !!!",
      message: "Delete Data Users Error !",
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    await user.update(req.body, {
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      message: `Update user id: ${id} finished`,
      data: req.body,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};
