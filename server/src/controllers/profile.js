const { profile, user } = require("../../models");

exports.getProfiles = async (req, res) => {
  try {
    const idUser = req.user.id;
    console.log(idUser);
    let data = await profile.findOne({
      where: {
        idUser,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    data = JSON.parse(JSON.stringify(data));
    data = {
      ...data,
    };

    res.send({
      status: "success",
      data,
    });
    console.log();
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: "Failed",
      message: "Get Profile Error",
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    let data = await profile.findOne({
      where: {
        id,
      },
      include: [
        {
          model: user,
          as: "user",
          attributes: ["createdAt", "updatedAt"],
        },
      ],
    });

    data = JSON.parse(JSON.stringify(data));
    data = {
      ...data,
    };

    res.send({
      status: "Success",
      message: "Get Profile id Success",
      data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed",
      message: "Get Failed",
    });
  }
};

exports.updateProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const data = {
      image: req?.file?.filename,
    };

    await profile.update(data, {
      where: {
        id,
      },
    });
    res.send({
      status: "success",
      message: "Update Profile Success",
      data: {
        id,
        data,
        image: req?.file?.filename,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed",
      message: "Update Profile Failed",
    });
  }
};
