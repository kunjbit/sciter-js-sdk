
import { mat4, mat3, vec3 } from "../libs/gl-matrix/index.js";

let gl;

const shaders = {
	'shader-fs': [
		'#ifdef GL_ES',
		'  precision mediump float;',
		'#endif',
		'varying vec2 vTextureCoord;',
		'varying vec3 vLightWeighting;',
		'uniform float uAlpha;',
		'uniform sampler2D uSampler;',
		'void main(void) {',
		'	vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));',
		'	gl_FragColor = vec4(textureColor.rgb * vLightWeighting, textureColor.a * uAlpha);',
		'}'
	].join('\n'),
	'shader-vs': [
		'attribute vec3 aVertexPosition;',
		'attribute vec3 aVertexNormal;',
		'attribute vec2 aTextureCoord;',
		'uniform mat4 uMVMatrix;',
		'uniform mat4 uPMatrix;',
		'uniform mat3 uNMatrix;',
		'uniform vec3 uAmbientColor;',
		'uniform vec3 uLightingDirection;',
		'uniform vec3 uDirectionalColor;',
		'uniform bool uUseLighting;',
		'varying vec2 vTextureCoord;',
		'varying vec3 vLightWeighting;',
		'void main(void) {',
		'	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);',
		'	vTextureCoord = aTextureCoord;',
		'	if (!uUseLighting) {',
		'		vLightWeighting = vec3(1.0, 1.0, 1.0);',
		'	} else {',
		'		vec3 transformedNormal = uNMatrix * aVertexNormal;',
		'		float directionalLightWeighting = max(dot(transformedNormal, uLightingDirection), 0.0);',
		'		vLightWeighting = uAmbientColor + uDirectionalColor * directionalLightWeighting;',
		'	}',
		'}'
	].join('\n')
};


function getShader(id) {
	let shader;
	
	if (!shaders[id]) {
		return null;
	}
	const str = shaders[id];

	if (id.match(/-fs/)) {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (id.match(/-vs/)) {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;
	}
	
	gl.shaderSource(shader, str);
	gl.compileShader(shader);
	
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.log(gl.getShaderInfoLog(shader));
		return null;
	}
	
	return shader;
}

let shaderProgram;

function initShaders() {
	const fragmentShader = getShader('shader-fs');
	const vertexShader = getShader('shader-vs');
	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);
	
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		console.error(
			`Could not initialise shaders. Error: ${
				gl.getProgramInfoLog(shaderProgram)
			}`
		);
	}
	
	gl.useProgram(shaderProgram);
	const t = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
  shaderProgram.vertexPositionAttribute = t;

	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
		
	shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, 'aVertexNormal');
	gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

	shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, 'aTextureCoord');
	gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
	
	//shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, 'aVertexColor');
	//gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
	
	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, 'uPMatrix');
	shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, 'uMVMatrix');
	shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, 'uNMatrix');
	shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, 'uSampler');
	shaderProgram.useLightingUniform = gl.getUniformLocation(shaderProgram, 'uUseLighting');
	shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, 'uAmbientColor');
	shaderProgram.lightingDirectionUniform = gl.getUniformLocation(shaderProgram, 'uLightingDirection');
	shaderProgram.directionalColorUniform = gl.getUniformLocation(shaderProgram, 'uDirectionalColor');
	shaderProgram.alphaUniform = gl.getUniformLocation(shaderProgram, 'uAlpha');
}


let glassTexture;

function initTexture() {
	const texture = gl.createTexture();
	texture.image = Graphics.Image.load(__DIR__ + 'img/glass.gif', true);
	//gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
  glassTexture = texture;	
}


let mvMatrix = mat4.create();
let pMatrix = mat4.create();


function setMatrixUniforms() {
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
	const normalMatrix = mat3.create();
	mat3.fromMat4(normalMatrix,mvMatrix);
	mat3.invert(normalMatrix,normalMatrix);
	mat3.transpose(normalMatrix,normalMatrix);
	gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
}


const degToRad = (degrees) => degrees * Math.PI / 180;


let xRot = 0;
let xSpeed = 5;

let yRot = 0;
let ySpeed = -5;

let z = -5.0;


const currentlyPressedKeys = {};

document.on('keydown', (evt) => {
	currentlyPressedKeys[evt.code] = true;
	handleKeys();
});

document.on('keyup', (evt) => {
	currentlyPressedKeys[evt.code] = false;
});


const handleKeys = () => {
	if (currentlyPressedKeys["PageDown"]) {
		z -= 0.5;
	}
	if (currentlyPressedKeys["PageUp"]) {
		z += 0.5;
	}
	if (currentlyPressedKeys["ArrowLeft"]) {
		ySpeed -= 1;
	}
	if (currentlyPressedKeys["ArrowRight"]) {
		ySpeed += 1;
	}
	if (currentlyPressedKeys["ArrowUp"]) {
		xSpeed -= 1;
	}
	if (currentlyPressedKeys["ArrowDown"]) {
		xSpeed += 1;
	}
};


let cubeVertexPositionBuffer;
let cubeVertexNormalBuffer;
let cubeVertexTextureCoordBuffer;
let cubeVertexIndexBuffer;

function initBuffers() {
	cubeVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
	const vertices = [
		// Front face
		-1.0, -1.0, 1.0,
		1.0, -1.0, 1.0,
		1.0, 1.0, 1.0,
		-1.0, 1.0, 1.0,
		
		// Back face
		-1.0, -1.0, -1.0,
		-1.0, 1.0, -1.0,
		1.0, 1.0, -1.0,
		1.0, -1.0, -1.0,
		
		// Top face
		-1.0, 1.0, -1.0,
		-1.0, 1.0, 1.0,
		1.0, 1.0, 1.0,
		1.0, 1.0, -1.0,
		
		// Bottom face
		-1.0, -1.0, -1.0,
		1.0, -1.0, -1.0,
		1.0, -1.0, 1.0,
		-1.0, -1.0, 1.0,
		
		// Right face
		1.0, -1.0, -1.0,
		1.0, 1.0, -1.0,
		1.0, 1.0, 1.0,
		1.0, -1.0, 1.0,
		
		// Left face
		-1.0, -1.0, -1.0,
		-1.0, -1.0, 1.0,
		-1.0, 1.0, 1.0,
		-1.0, 1.0, -1.0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	cubeVertexPositionBuffer.itemSize = 3;
	cubeVertexPositionBuffer.numItems = 24;
	
	cubeVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
	let vertexNormals = [
		// Front face
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		
		// Back face
		0.0, 0.0, -1.0,
		0.0, 0.0, -1.0,
		0.0, 0.0, -1.0,
		0.0, 0.0, -1.0,
		
		// Top face
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		
		// Bottom face
		0.0, -1.0, 0.0,
		0.0, -1.0, 0.0,
		0.0, -1.0, 0.0,
		0.0, -1.0, 0.0,
		
		// Right face
		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,
		
		// Left face
		-1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
	cubeVertexNormalBuffer.itemSize = 3;
	cubeVertexNormalBuffer.numItems = 24;
	
	cubeVertexTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
	let textureCoords = [
		// Front face
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
		
		// Back face
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
		0.0, 0.0,
		
		// Top face
		0.0, 1.0,
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		
		// Bottom face
		1.0, 1.0,
		0.0, 1.0,
		0.0, 0.0,
		1.0, 0.0,
		
		// Right face
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
		0.0, 0.0,
		
		// Left face
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
	];
	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
	cubeVertexTextureCoordBuffer.itemSize = 2;
	cubeVertexTextureCoordBuffer.numItems = 24;
	
	cubeVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
	let cubeVertexIndices = [
		0, 1, 2, 0, 2, 3, // Front face
		4, 5, 6, 4, 6, 7, // Back face
		8, 9, 10, 8, 10, 11, // Top face
		12, 13, 14, 12, 14, 15, // Bottom face
		16, 17, 18, 16, 18, 19, // Right face
		20, 21, 22, 20, 22, 23 // Left face
	];
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
	cubeVertexIndexBuffer.itemSize = 1;
	cubeVertexIndexBuffer.numItems = 36;
}


let P = {
	useBlending: true,
	blending: 0.5,
  useLighting: false,
	ambientR: 0.2,
	ambientG: 0.2,
	ambientB: 0.2,
	lightDirectionX: -0.25,
	lightDirectionY: -0.25,
	lightDirectionZ: -1,
	directionalR: 0.8,
	directionalG: 0.8,
	directionalB: 0.8,
};

function drawScene() {

	gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	mat4.perspective(pMatrix, 45, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 100.0);
	mat4.identity(mvMatrix);
	mat4.translate(mvMatrix, mvMatrix, [0.0, 0.0, z]);
	mat4.rotate(mvMatrix, mvMatrix, degToRad(xRot), [1, 0, 0]);
	mat4.rotate(mvMatrix, mvMatrix, degToRad(yRot), [0, 1, 0]);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
	gl.vertexAttribPointer(
		shaderProgram.vertexPositionAttribute,
		cubeVertexPositionBuffer.itemSize,
		gl.FLOAT,
		false,
		0,
		0
	);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
	gl.vertexAttribPointer(
		shaderProgram.vertexNormalAttribute,
		cubeVertexNormalBuffer.itemSize,
		gl.FLOAT,
		false,
		0,
		0
	);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
	gl.vertexAttribPointer(
		shaderProgram.textureCoordAttribute,
		cubeVertexTextureCoordBuffer.itemSize,
		gl.FLOAT,
		false,
		0,
		0
	);
	
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, glassTexture);
	gl.uniform1i(shaderProgram.samplerUniform, 0);


	if (P.useBlending) {
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
		gl.enable(gl.BLEND);
		gl.disable(gl.DEPTH_TEST);
		gl.uniform1f(	shaderProgram.alphaUniform, P.blending );
	} else {
		gl.disable(gl.BLEND);
		gl.enable(gl.DEPTH_TEST);
	}
	
	gl.uniform1i(shaderProgram.useLightingUniform, P.useLighting);
	if (P.useLighting) {
		gl.uniform3f(
			shaderProgram.ambientColorUniform,
			P.ambientR,
			P.ambientG,
			P.ambientB
		);
		
		const lightingDirection = [
			P.lightDirectionX,
			P.lightDirectionY,
			P.lightDirectionZ
		];
		const adjustedLD = vec3.create();
		vec3.normalize(adjustedLD,lightingDirection);
		vec3.scale(adjustedLD,adjustedLD,-1);
		gl.uniform3fv(shaderProgram.lightingDirectionUniform, adjustedLD);
		
		gl.uniform3f(
			shaderProgram.directionalColorUniform,
			P.directionalR,
			P.directionalG,
			P.directionalB
		);
	}
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}


let lastTime = 0;


function animate() {
	//let timeNow = new Date().getTime();
	let timeNow = Window.ticks();
	if (lastTime != 0) {
		let elapsed = timeNow - lastTime;
		xRot += (xSpeed * elapsed) / 1000.0;
		yRot += (ySpeed * elapsed) / 1000.0;
	}
	lastTime = timeNow;
}

function tick() {
	drawScene();
	animate();
	requestAnimationFrame(tick);
};

export function setParams(p) {
	P = p;
}

export function start(WebGL) {
	gl = WebGL;
	initShaders();
	initBuffers();
	initTexture();
	gl.clearColor(0.1, 0, 0.2, 1.0);
	gl.enable(gl.DEPTH_TEST);
	tick();
}

