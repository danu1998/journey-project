const { journey, user } = require("../../models");

exports.getJourneys = async (req, res) => {
  try {
    let journeys = await journey.findAll({
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password", "email", "image"],
          },
        },
      ],
      attributes: {
        exclude: ["updatedAt", "idUser"],
      },
    });

    journeys = JSON.parse(JSON.stringify(journeys));
    journeys = journeys.map((item) => {
      return { ...item, image: process.env.FILE_PATH + item.image };
    });

    res.send({
      status: "Success !!!",
      message: "Get All Data Journey Success !",
      data: {
        journeys,
      },
    });
  } catch (err) {
    res.send({
      status: "Failed !!!",
      message: "Get All Data Journey Failed !",
    });
  }
};
exports.getJourney = async (req, res) => {
  try {
    const { id } = req.params;
    let data = await journey.findOne({
      where: {
        id,
      },
      include: [
        {
          model: user,
          as: "user",
          attributes: ["updatedAt", "password", "fullName"],
        },
      ],
      attributes: {
        exclude: ["updatedAt", "idUser"],
      },
    });

    data = JSON.parse(JSON.stringify(data));
    data = {
      ...data,
      image: process.env.FILE_PATH + data.image,
    };

    res.send({
      status: "Success !!!",
      message: "Get All Data By Id Success",
      data,
    });
  } catch (err) {
    res.send({
      status: "Failed",
      message: "Get Data By Id Failed",
    });
  }
};
// exports.addJourney = async (req, res) => {
//   try {
//     const data = {
//       title: req.body.title,
//       description: req.body.description,
//       image: req.file.filename,
//       idUser: req.user.id,
//     };

//     let newJourney = await journey.create(data);

//     let journeyData = await journey.findOne({
//       where: {
//         id: newJourney.id,
//       },
//       include: [
//         {
//           model: user,
//           as: "user",
//           attributes: {
//             exclude: ["createdAt", "updatedAt", "password"],
//           },
//         },
//       ],
//       attributes: {
//         exclude: ["createdAt", "updatedAt", "idUser"],
//       },
//     });
//     journeyData = JSON.parse(JSON.stringify(journeyData));

//     res.send({
//       status: "success...",
//       data: {
//         ...journeyData,
//         image: process.env.FILE_PATH + journeyData.image,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       status: "failed",
//       message: "Server Error",
//     });
//   }
// };
exports.addJourney = async (req, res) => {
  const path = process.env.FILE_PATH;
  try {
    const { body, user } = req;
    const userId = user.id;

    const journeys = await journey.create({
      ...body,
      title: req.body.title,
      description: req.body.description,
      image: req.file.filename,
      idUser: userId,
    });

    res.status(201).send({
      status: "Success",
      data: {
        journeys,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
    });
  }
};
exports.deleteJourney = async (req, res) => {
  try {
    const { id } = req.params;
    await journey.destroy({
      where: {
        id,
      },
    });
    res.send({
      status: "Success !!!",
      message: "Delete Success",
    });
  } catch (error) {
    res.send({
      status: "Failed !!!",
      message: "Delete Failed",
    });
  }
};
exports.updateJourney = async (req, res) => {
  try {
    const { id } = req.params;
    const data = {
      title: req?.body?.title,
      description: req?.body?.description,
      image: req?.file?.filename,
      idUser: req?.user?.id,
    };

    // ============== || ==============

    await journey.update(data, {
      where: {
        id,
      },
    });

    res.send({
      status: "Success !!!",
      message: "Update Data Success !",
      data: {
        id,
        data,
        image: req?.file?.filename,
      },
    });
  } catch (err) {
    console.log(err);
    res.send({
      status: "Failed",
      message: "Update Data Failed",
    });
  }
};

exports.getUserJourney = async (req, res) => {
  try {
    const { id } = req.user;
    let journeys = await journey.findAll({
      where: {
        idUser: id,
      },
      attributes: {
        exclude: ["idUser", "idJourney", "updatedAt"],
      },
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["id", "idUser", "password", "updatedAt"],
          },
        },
      ],
    });
    journeys = JSON.parse(JSON.stringify(journeys));
    journeys = journeys.map((item) => {
      return { ...item, image: process.env.FILE_PATH + item.image };
    });
    res.send({
      status: "success",
      data: {
        journeys,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
    });
  }
};
