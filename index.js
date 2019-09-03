var express = require('express');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/banco', {useNewUrlParser: true});

const Cuenta = mongoose.model('cuenta', { Cedula: String, Nombre: String, Saldo: Number, FechaCreacion: Date, FechaModificacion: Date, CantidadRetiros: Number });

var app = express();
app.use(bodyParser());

app.listen(8080, () => {
    console.log("hey estoy corriendo");
});

app.post('/api/v1/cuenta/crear', (req, res, next) => {

    Cuenta.findOne({ Cedula: req.body.Cedula }, function (err, cuenta) {
        if (err) return handleError(err);

        if(cuenta != null) {
            res.status(400);
            res.send({ success : false, message: "Cuenta existe!", cuenta: cuenta });
        } else
            next();
    });

});

app.post('/api/v1/cuenta/crear', (req, res) => {

    const nuevaCuenta = new Cuenta({ Cedula: req.body.Cedula, Nombre: req.body.Nombre, Saldo: 0.0, FechaCreacion: new Date(), FechaModificacion: new Date(), CantidadRetiros: 0 });

    nuevaCuenta.save(function (err) {
        if (err) return handleError(err);
    });
    
    res.send({ success : true, cuenta: { Cedula: nuevaCuenta.Cedula, Nombre: nuevaCuenta.Nombre }});   
});


app.post('/api/v1/cuenta/retirar', (req, res) => {

    var Cantidad = req.body.Cantidad || 0;

    Cuenta.findOne({ Cedula: req.body.Cedula }, function (err, doc) {
        if (err) console.log(err);
        if(doc != null)
        {
            var result = doc.Saldo - Cantidad;

            if(result >= 0)
            {
                if(doc.CantidadRetiros > 2)
                {
                    res.status(400);
                    res.send({ success : false, message: "No puedo retirar porque exedi la cantidad maxima de retiros!", numeroRetiros: doc.CantidadRetiros  });                   
                } else { 
                    doc.Saldo = result;
                   
                    var tiempoms =  new Date() - doc.FechaModificacion;
                    var diffMins = Math.round(((tiempoms % 86400000) % 3600000) / 60000);
                    if(diffMins <= 1)
                        doc.CantidadRetiros += 1;
                    else {
                        doc.CantidadRetiros = 0;
                        doc.FechaModificacion = new Date();
                    }    
                    doc.save();
                    res.send({ success : true, message: "Se ha retirado de manera exitosa el pisto!", cuenta: doc });   
                }
            }  else {
                res.status(400);
                res.send({ success : false, message: "No puedo retirar porque no hay saldo!" });        
            }
        } else {
            res.status(400);
            res.send({ success : false, message: "No puedo retirar de una cuenta q no existe!" });     
        }  
    });
});


app.post('/api/v1/cuenta/depositar', (req, res) => {

    var cantidad = req.body.Cantidad || 0;

    Cuenta.findOne({ Cedula: req.body.Cedula }, function (err, doc) {
        if (err) console.log(err);
        if(doc != null){
            doc.Saldo = doc.Saldo + cantidad;
            doc.save();  
            res.send({ success : true, message: "Se ha depositadp de manera exitosa el pisto!", cuenta: doc });  
        } else {
            res.status(400);
            res.send({ success : false, message: "No puedo retirar de una cuenta q no existe!"});       
        }
    });
});

app.delete('/api/v1/cuenta/eliminar', (req, res) => {

    Cuenta.findOne({ Cedula: req.body.Cedula }, function (err, doc) {
        if (err) console.log(err);
        
        if(doc != null)
        {
            doc.delete();
            res.send({ success : true, message: "Se ha eliminado la cuenta"});
        } else {
            res.status(400);
            res.send({ success : false, message: "No Se encontro la cuenta" });
        } 
    });
});

function handleError(err){
    console.log(err);
}
