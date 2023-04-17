const fs = require('fs');

const actors = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/all_actors.json`)
);

const firstActor = actors[0].Id;
const lastActor = actors[actors.length - 1].Id;

const checkId = (req, res, next, value) => {
  if (value * 1 < firstActor || value * 1 > lastActor) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid ID'
    });
  }
  next();
};

const getAllActors = (req, res) => {
  let results = [];

  if (req.query.q != undefined || req.query.q != null) {
    let query = decodeURIComponent(req.query.q.toLowerCase());

    results = actors.filter(
      (item) =>
        item.FullName.toLowerCase().includes(query) ||
        item.StageName.toLowerCase().includes(query) ||
        item.KoreanName.includes(query) ||
        item.KoreanStageName.includes(query)
    );
    if (results.length == 0) {
      return res.status(404).json({
        status: 'failed',
        message: 'No entry found matching given criteria'
      });
    }
  } else {
    results = actors;
  }

  res.status(200).json({
    status: 'success',
    count: results.length,
    results: results
  });
};

const getActor = (req, res) => {
  const id = req.params.id * 1;
  const actor = actors.find((item) => item.Id == id);

  res.status(200).json({
    status: 'success',
    results: actor
  });
};

module.exports = {
  checkId,
  getAllActors,
  getActor
};
