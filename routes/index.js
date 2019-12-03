var express = require("express");
var router = express.Router();
const archiver = require("archiver");
const instagramPosts = require("instagram-posts");
const axios = require("axios");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/", async (req, res, next) => {
  var archive = archiver.create("zip");
  const { url = "" } = req.body;
  const wantedPosts = url.replace(/\r/g, "").split("\n");

  res.writeHead(200, {
    "Content-Type": "application/zip",
    "Content-disposition": "attachment; filename=myFile.zip"
  });

  const posts = await instagramPosts(req.body.handle, {
    count: 500
  });

  archive.pipe(res);

  const filtered = posts
    .filter(data => wantedPosts.find(url => url.includes(data.shortcode)))
    .map(({ shortcode, media }) => ({ shortcode, media }));

  for (filter of filtered) {
    const response = await axios({
      url: filter.media,
      responseType: "stream"
    });

    try {
      archive.append(response.data, { name: `${filter.shortcode}.jpg` });
    } catch (e) {
      throw e;
    }
  }

  archive.finalize();
  // res.json(filtered);

  // res.render("index", { title: "Express" });
});

module.exports = router;
