const appointmentRoutes = require('./appointment');

const constructorMethod = (app) => {


  
app.use('/', appointmentRoutes);
app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;