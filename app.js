const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const folderPath = path.join(__dirname, "files");
const PORT = process.env.PORT || 5009;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running. Use the /createFile and /getFiles endpoints.");
});

app.get("/createFile", (req, res) => {
  try {
    const currentTimestamp = new Date().toString().replace(/:/g, "-");
    const fileName = `${currentTimestamp}.txt`;
    const fileContent = currentTimestamp;

    const filePath = path.join(folderPath, fileName);
    fs.writeFileSync(filePath, fileContent);
    res.status(200).json({
      message: `Text file '${fileName}' created successfully in folder '${folderPath}' `,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to create text file." });
  }
});

app.get("/getFiles", (req, res) => {
  try {
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        res.status(500).json({ error: "Failed to read folder content." });
        return;
      }

      // Filter out only text files
      const textFiles = files.filter((file) => file.endsWith(".txt"));

      res.status(200).json({ files: textFiles });
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve text files." });
  }
});

app.listen(PORT, (err) => {
  if (err) {
    console.log("Error");
  } else {
    console.log(`Port ${PORT} is running`);
  }
});
