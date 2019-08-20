var express = require('express');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/cuentas', {useNewUrlParser: true});

const Cuenta = mongoose.model('Cuenta', { Cedula: String, Nombre: String, Saldo: Number });

var app = express();
app.use(bodyParser());

app.listen(8080, () => {
    console.log("hey estoy corriendo");
});

app.post('/api/v1/cuenta/crear', (req, res) => {

    const result = Cuenta.findOne({ Cedula: req.body.Cedula });

    if(result == null)
    {
        const nuevaCuenta = new Cuenta({ Cedula: req.body.Cedula, Nombre: req.body.Nombre, Saldo: 0.0 });

        nuevaCuenta.save(function (err) {
            if (err) return handleError(err);
        });
    
        res.send({ success : true, cuenta: nuevaCuenta });
    }
    else
    {
        res.send({ success : false, message: "Cuenta no existe!", cuenta: result.cuenta });
    }
});

app.post('/api/v1/cuenta/retirar', (req, res) => {

    var Cantidad = req.body.Cantidad || 0;

    const result = Cuenta.findOne({ Cedula: req.body.Cedula }, function (err, doc) {
        if (err) console.log(err);
        doc.Saldo = doc.Saldo <= Cantidad ? doc.Saldo - Cantidad : doc.Saldo
        doc.save();   
    });

    if(result == null)
    {
        res.send({ success : false, message: "No puedo retirar de una cuenta q no existe!", cuenta: result.cuenta });
    }
    else
    {
        res.send({ success : true, message: "Se ha retirado de manera exitosa el pisto!", cuenta: result.cuenta });
    }
});


app.post('/api/v1/cuenta/depositar', (req, res) => {

    var cantidad = req.body.Cantidad || 0;

    const result = Cuenta.findOne({ Cedula: req.body.Cedula }, function (err, doc) {
        if (err) console.log(err);
        doc.Saldo = doc.Saldo + cantidad;
        doc.save();   
    });

    if(result == null)
    {
        res.send({ success : false, message: "No puedo retirar de una cuenta q no existe!", cuenta: result.cuenta });
    }
    else
    {
        res.send({ success : true, message: "Se ha depositadp de manera exitosa el pisto!", dinero: cantidad });
    }
});
