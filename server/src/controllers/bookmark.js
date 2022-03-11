const { bookmark, journey, user } = require("../../models");

exports.addUserBookmark = async (req, res) => {
  const path = process.env.FILE_PATH;
  try {
    // const { journey, user } = req;
    // const journeyId = journey.id;
    // const userId = user.id;
    // const bookmarks = await bookmark.create({
    //   idJourney: journeyId,
    //   idUser: userId,
    // });

    const { body, user } = req;
    const userId = user.id;
    const bookmarks = await bookmark.create({
      ...body,
      idUser: userId,
    });

    JSON.parse(JSON.stringify(body.journey)).map(async (item) => {
      const { idJourney } = item;
      await bookmark.create({
        idBookmark: bookmarks.id,
        idJourney: idJourney,
      });
    });

    res.status(201).send({
      status: "Success",
      data: {
        ...bookmarks,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "add bookmark error",
    });
  }
};

exports.getUserBookmark = async (req, res) => {
  try {
    const { id } = req.user;
    const bookmarks = await bookmark.findAll({
      where: {
        idUser: id,
      },
      attributes: {
        exclude: ["idUser", "updatedAt"],
      },
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: [
              "id",
              "idUser",
              "idJourney",
              "password",
              "createdAt",
              "updatedAt",
            ],
          },
        },
        {
          model: journey,
          as: "journey",
          attributes: {
            exclude: ["id", "idUser", "password", "createdAt", "updatedAt"],
          },
        },
      ],
    });
    res.send({
      status: "success",
      data: {
        bookmarks,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
    });
  }
};
exports.deleteUserBookmark = async (req, res) => {
  try {
    const { id } = req.params;

    await bookmark.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      id: id,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
    });
  }
};
