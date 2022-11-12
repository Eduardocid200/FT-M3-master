'use strict';
/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/
// // TU CÓDIGO AQUÍ:

function $Promise(executor){
    if(typeof executor !== 'function') throw new TypeError ('the executor must be a function');
    this._state = 'pending';
    executor(this._internalResolve.bind(this), this._internalReject.bind(this));
}
$Promise.prototype._internalResolve = function(value){
if ( this._state === 'pending'){
    this._state = 'fulfilled';
    this._value= value;
}
}
$Promise.prototype._internalReject = function(reason){
    if ( this._state === 'pending'){
        this._state = 'rejected';
        this._value= reason;
    }   
}
$Promise.prototype._callHandlers = function(){
    while(this._handlerGroups.length){
        const hd =this._handlerGroups.shift();
        if(this._state === 'fulfilled'){
        if(hd.successCb){
            try {
                const result =hd.successCb(this._value);
                if (result instanceof $Promise){
                    result.then(
                        value => hd.downstreamPromise._internalResolve(value),
                        error => hd.downstreamPromise._internalReject(error)
                    )
                }else{
                    hd.downstreamPromise._internalResolve(result);
                }                
            } catch (error) {
          }
         }
        }else if(this._state === ' rejected'){
            if(hd.errorCb){
                try {
                const result = hd.errorCb(this.value);
                if (result instanceof $Promise){
                    return result.then(
                        value => hd.downstreamPromise._internalResolve(value),
                        error => hd.downstreamPromise._internalReject(error)
                    )
                } else{
                    hd.downstreamPromise._internalResolve(result);
                }   
                } catch (error) {
                    hd.downstreamPromise._internalReject(error);
                }
            }
                else {
                    hd.downstreamPromise._internalReject(this._value)
                }
                
            }
        }
    }


$Promise.prototype.then = function(successCb, errorCb){
  if (typeof successCb !== 'function') successCb=false;
  if (typeof errorCb !== 'function') errorCb=false;
    this._handlerGroups.push({
        successCb,
        errorCb
    })
    if(this._state !== 'pending') this._callHandlers();
}
module.exports = $Promise;
/*-------------------------------------------------------
El spec fue diseñado para funcionar con Test'Em, por lo tanto no necesitamos
realmente usar module.exports. Pero aquí está para referencia:

module.exports = $Promise;

Entonces en proyectos Node podemos esribir cosas como estas:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
