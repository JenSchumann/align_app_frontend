const express = require('express');
const app = express();
const PORT = process.env.PORT || 4060;

app.use(express.static('public'));

app.listen(PORT, function() {
  console.log('align_app_frontend running on port: ', 4060);
});
