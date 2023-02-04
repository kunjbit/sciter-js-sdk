
const kernelGroups = new Map();

// Each kerner is an object {
//   id : "group/item"
//   render(node,control,output) -> vnode
//   async evaluate(node,input,control,output) -> shall set output using input & control values
//   inputs -> {A:"number",B:"number"}
//   outputs -> {"A+B":"number"}
//   name : "human readable name"
// }

export function registerKernel(id,render,evaluate,inputs,outputs,name) {
  const [groupName,itemName] = id.split("/");
  let group = kernelGroups.get(groupName);
  if(!group) { group = new Map(); kernelGroups.set(groupName,group); }
  const kd = {id,render,evaluate,inputs,outputs,name};
  group.set(itemName,kd);
  return kd;
}

export function getKernel(id) {
  const [groupName,itemName] = id.split("/");
  const group = kernelGroups.get(groupName);
  if(group) return group.get(itemName);
  return null;
}

export function kernelGroupNames() {
  return Array.from(kernelGroups.keys()).sort();  
}

export function kernelGroupItems(groupName) {
  let group = kernelGroups.get(groupName);
  return group ? Array.from(group.keys()).sort() : [];  
}

export function registerFormula(id,formula) {

  const input = {};
  const output = {};
  const control = {};

  const inputProxy = new Proxy({},{
    get: function(target, prop, receiver) { input[prop] = 1; return 1; }
  });
  const outputProxy = new Proxy({},{
    set: function(obj, prop, value) { output[prop] = value; }
  });

  const func = new Function("input","output","control", formula);
  func.call(null,inputProxy,outputProxy,control);
  //console.log("formula", input,output,control);
}

//registerFormula("formula/sphere volume", "output.volume = 4/3 * Math.PI * input.R^3");

// some default kernels

registerKernel(
  "math/sum", 
  null, //(node,control,output) => <output|number value={output["A+B"]} />,
  (node,input,control,output) => { output["A+B"] = input.A + input.B } , // can be async
  {"A":"number","B":"number"},
  {"A+B":"number"},
  "Sum"
);

registerKernel(
  "math/sub", 
  null, //(node,control,output) => <output|number value={output["A-B"]} />,
  (node,input,control,output) => { output["A-B"] = input.A - input.B } , // can be async
  {"A":"number","B":"number"},
  {"A-B":"number"},
  "Sub"
);

registerKernel(
  "math/mul", 
  null, //(node,control,output) => <output|number value={output["A*B"]} />,
  (node,input,control,output) => { output["A*B"] = input.A * input.B } , // can be async
  {"A":"number","B":"number"},
  {"A*B":"number"},
  "Mul"
);

registerKernel(
  "math/div", 
  null, //(node,control,output) => <output|number value={output["A/B"]} />,
  (node,input,control,output) => { output["A/B"] = input.A / input.B } , // can be async
  {"A":"number","B":"number"},
  {"A/B":"number"},
  "Div"
);

registerKernel(
  "input/number", 
  (node,control,output) => <input|number(val) value={control.val} step="1" max="10000" />,
  (node,input,control,output) => { output.A = control.val; },
  {},
  {"A":"number"},
  "Number"
);


