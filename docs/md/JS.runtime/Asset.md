# class Asset

Sciter specific.

This class represents native assets - native scriptable objects defined in host application or in loadable extensions (Sciter plugins).

The class has no predefined instance properties or methods - they defined solely in native code.

## Static class methods

### `Asset.instanceOf(object,assetClassName):bool`

Returns _true_ if the _object_ is a) an asset and b) asset of native class _assetClassName_. 

Example, this code checks if db.exec() returns [Recordset object](https://gitlab.com/sciter-engine/sciter-js-sdk/-/blob/main/sqlite/sciter-sqlite.h#L63) :
```js
let rs = db.exec("select * from stocks order by price");

if ( Asset.instanceOf(rs,"Recordset") )
    showRecordset(rs);
else
    $("#result").innerText = "Wrong type:" + rs;
```

### `Asset.typeOf(assetObj):string`

Returns class name of the native asset.

```js
let rs = db.exec("select * from stocks order by price");

if ( rs instanceof Asset && Asset.typeOf(rs) === "Recordset" )
    showRecordset(rs);
else
    $("#result").innerText = "Wrong type:" + rs;
```
