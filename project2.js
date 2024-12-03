/**
 * @Instructions
 * 		@task1 : Complete the setTexture function to handle non power of 2 sized textures
 * 		@task2 : Implement the lighting by modifying the fragment shader, constructor,
 *      @task3: 
 *      @task4: 
 * 		setMesh, draw, setAmbientLight, setSpecularLight and enableLighting functions 
 */


function GetModelViewProjection(projectionMatrix, translationX, translationY, translationZ, rotationX, rotationY) {
	
	var trans1 = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		translationX, translationY, translationZ, 1
	];
	var rotatXCos = Math.cos(rotationX);
	var rotatXSin = Math.sin(rotationX);

	var rotatYCos = Math.cos(rotationY);
	var rotatYSin = Math.sin(rotationY);

	var rotatx = [
		1, 0, 0, 0,
		0, rotatXCos, -rotatXSin, 0,
		0, rotatXSin, rotatXCos, 0,
		0, 0, 0, 1
	]

	var rotaty = [
		rotatYCos, 0, -rotatYSin, 0,
		0, 1, 0, 0,
		rotatYSin, 0, rotatYCos, 0,
		0, 0, 0, 1
	]

	var test1 = MatrixMult(rotaty, rotatx);
	var test2 = MatrixMult(trans1, test1);
	var mvp = MatrixMult(projectionMatrix, test2);

	return mvp;
}


class MeshDrawer {
	// The constructor is a good place for taking care of the necessary initializations.
	constructor() {
		this.prog = InitShaderProgram(meshVS, meshFS);
		this.mvpLoc = gl.getUniformLocation(this.prog, 'mvp');
		this.showTexLoc = gl.getUniformLocation(this.prog, 'showTex');
	
		this.colorLoc = gl.getUniformLocation(this.prog, 'color');
	
		this.vertPosLoc = gl.getAttribLocation(this.prog, 'pos');
		this.texCoordLoc = gl.getAttribLocation(this.prog, 'texCoord');
		this.normalLoc = gl.getAttribLocation(this.prog, 'normal'); 
	
		this.vertbuffer = gl.createBuffer();
		this.texbuffer = gl.createBuffer();
		this.normalbuffer = gl.createBuffer(); 
	
		this.numTriangles = 0;
	
		this.ambientLightLoc = gl.getUniformLocation(this.prog, 'ambient');
		this.lightPosLoc = gl.getUniformLocation(this.prog, 'lightPos');
		this.enableLightingLoc = gl.getUniformLocation(this.prog, 'enableLighting');
		this.specularLightLoc = gl.getUniformLocation(this.prog, 'specularIntensity');
		this.enableLightingLoc = gl.getUniformLocation(this.prog, 'enableLighting');


	}
	

	setMesh(vertPos, texCoords, normalCoords) {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertbuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertPos), gl.STATIC_DRAW);
	
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texbuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
	
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalbuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalCoords), gl.STATIC_DRAW);
	
		this.numTriangles = vertPos.length / 3;
	}
	

	// This method is called to draw the triangular mesh.
	// The argument is the transformation matrix, the same matrix returned
	// by the GetModelViewProjection function above.
	draw(trans) {
		gl.useProgram(this.prog);
	
		// Set MVP matrix
		gl.uniformMatrix4fv(this.mvpLoc, false, trans);
	
		// Pass light and view positions
		gl.uniform3f(this.lightPosLoc, lightX, lightY, 3.0); // Light position
		gl.uniform3f(gl.getUniformLocation(this.prog, "viewPos"), 0.0, 0.0, transZ); // Camera position
	
		// Enable vertex positions, texture coordinates, and normals
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertbuffer);
		gl.enableVertexAttribArray(this.vertPosLoc);
		gl.vertexAttribPointer(this.vertPosLoc, 3, gl.FLOAT, false, 0, 0);
	
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texbuffer);
		gl.enableVertexAttribArray(this.texCoordLoc);
		gl.vertexAttribPointer(this.texCoordLoc, 2, gl.FLOAT, false, 0, 0);
	
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalbuffer);
		gl.enableVertexAttribArray(this.normalLoc);
		gl.vertexAttribPointer(this.normalLoc, 3, gl.FLOAT, false, 0, 0);
	
		// Draw triangles
		gl.drawArrays(gl.TRIANGLES, 0, this.numTriangles);
	}
	
	

	// This method is called to set the texture of the mesh.
	// The argument is an HTML IMG element containing the texture data.
	setTexture(img) {
		const texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
	
		// Set the texture image
		gl.texImage2D(
			gl.TEXTURE_2D,
			0,
			gl.RGB,
			gl.RGB,
			gl.UNSIGNED_BYTE,
			img
		);
	
		// Handle non-power-of-2 (NPOT) textures
		if (isPowerOf2(img.width) && isPowerOf2(img.height)) {
			// Generate mipmaps for power-of-2 textures
			gl.generateMipmap(gl.TEXTURE_2D);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		} else {
			// Set parameters for NPOT textures
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		}
	
		// Bind texture to the shader
		gl.useProgram(this.prog);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture);
	
		const sampler = gl.getUniformLocation(this.prog, 'tex');
		gl.uniform1i(sampler, 0);
	}
	
	

	showTexture(show) {
		gl.useProgram(this.prog);
		gl.uniform1i(this.showTexLoc, show);
	}

	enableLighting(enable) {
		gl.useProgram(this.prog);
		gl.uniform1i(this.enableLightingLoc, enable ? 1 : 0);
	}
	
	setAmbientLight(ambient) {
		ambientLight = ambient; 
		gl.useProgram(this.prog);
		gl.uniform1f(this.ambientLightLoc, ambient);
	}

	setSpecularLight(specular) {
		gl.useProgram(this.prog);
		gl.uniform1f(this.specularLightLoc, specular);
	}
	
	enableLighting(enable) {
		gl.useProgram(this.prog);
		gl.uniform1i(this.enableLightingLoc, enable ? 1 : 0);
		DrawScene(); // Redraw the scene to reflect changes
	}
	
	
}


function isPowerOf2(value) {
	return (value & (value - 1)) == 0;
}

function normalize(v, dst) {
	dst = dst || new Float32Array(3);
	var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
	// make sure we don't divide by 0.
	if (length > 0.00001) {
		dst[0] = v[0] / length;
		dst[1] = v[1] / length;
		dst[2] = v[2] / length;
	}
	return dst;
}

// Vertex shader source code
const meshVS = `
    attribute vec3 pos; 
    attribute vec2 texCoord; 
    attribute vec3 normal;

    uniform mat4 mvp; 

    varying vec2 v_texCoord; 
    varying vec3 v_normal; 
    varying vec3 v_pos; // Pass vertex position to the fragment shader

    void main()
    {
        v_texCoord = texCoord;
        v_normal = normal;
        v_pos = pos; // Assign position

        gl_Position = mvp * vec4(pos,1);
    }`;


// Fragment shader source code
/**
 * @Task2 : You should update the fragment shader to handle the lighting
 */
const meshFS = `
    precision mediump float;

    uniform bool showTex;
    uniform bool enableLighting;
    uniform sampler2D tex;
    uniform float ambient;
    uniform float specularIntensity; // Uniform for specular intensity
    uniform vec3 lightPos;
    uniform vec3 viewPos; // Camera/view position

    varying vec2 v_texCoord;
    varying vec3 v_normal;
    varying vec3 v_pos;

    void main() {
        // Normalize vectors
        vec3 normal = normalize(v_normal);
        vec3 lightDir = normalize(lightPos - v_pos);
        vec3 viewDir = normalize(viewPos - v_pos);

        // Ambient lighting
        vec3 ambientLight = vec3(ambient);

        // Diffuse lighting
        float diffuseFactor = max(dot(normal, lightDir), 0.0);
        vec3 diffuseLight = vec3(diffuseFactor);

        // Specular lighting (Phong model)
        vec3 reflectDir = reflect(-lightDir, normal);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0); // Shininess exponent
        vec3 specularLight = specularIntensity * vec3(spec);

        // Combine all lighting components
        vec3 lighting = ambientLight + diffuseLight + specularLight;

        if (showTex && enableLighting) {
            vec4 texColor = texture2D(tex, v_texCoord);
            gl_FragColor = vec4(texColor.rgb * lighting, texColor.a);
        } else if (showTex) {
            gl_FragColor = texture2D(tex, v_texCoord);
        } else if (enableLighting) {
            gl_FragColor = vec4(lighting, 1.0);
        } else {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); // Default color with no texture or lighting
        }
    }`;



// Light direction parameters for Task 2
var lightX = 1;
var lightY = 1;

const keys = {};
function updateLightPos() {
	const translationSpeed = 1;
	if (keys['ArrowUp']) lightY -= translationSpeed;
	if (keys['ArrowDown']) lightY += translationSpeed;
	if (keys['ArrowRight']) lightX -= translationSpeed;
	if (keys['ArrowLeft']) lightX += translationSpeed;
};

function SetSpecularLight(param) {
    specularIntensity = parseFloat(param.value); // Update global variable
    MeshDrawer.setSpecularLight(specularIntensity); // Update in the shader
    DrawScene(); // Redraw the scene
}


var ambientLight = 0.5;
var lightX = 1.0, lightY = 1.0;
var specularIntensity = 0.5; // Default value


///////////////////////////////////////////////////////////////////////////////////