// rosrun xacro xacro model.xacro > model.urdf
let anglex, angley, anglez, translatex, translatey, translatez;
let xml;
let mdl;

let links = {};
let joints = {};

let defaultrobot = 'r2d2.urdf';

// DOM
let ckverlinks, ckverjoints;

function preload() {
  // mdl = loadModel('mdl.obj');
  // mdl = loadModel('base.stl');
  // mdl = loadModel('structure.dae');
  xml = loadXML(defaultrobot);
}

function setup() {
	var c = createCanvas(windowWidth * 0.8, windowHeight * 0.9, WEBGL); // 800, 600
  c.parent("canvasP");  // Atach to html canvas
	c.drop(gotFile);

	// DOM
  let rmargin = select('#rmargin');
	ckverlinks = createCheckbox('Show links');
  ckverlinks.attribute('checked', null);
  ckverlinks.parent(rmargin);
 	// ckverlinks.position(20, 5);
 	ckverjoints = createCheckbox('Show joints');
  ckverjoints.parent(rmargin);
  let button1 = createButton('Save urdf file');
  button1.parent(rmargin);
  // button1.position(screen.width * 0.7, canvasheight+20);
  button1.mousePressed(funcbutton1);
  let text = createP("Drag and drop urdf files into the view")
  text.parent(rmargin);
  loadnewURDF();
}

function draw() {
	background(80);
	// ambientLight(255, 0, 255);
  pointLight(250, 250, 250, 1, 1, 0);
	// directionalLight(255, 255, 255, 0, 0, 1);

	translate(translatex, translatey, translatez);
	rotateX(anglex);
	rotateY(angley);
	rotateZ(anglez);

	links.base_link.drawtree(); // Tiene que haber un base_link y desde ahi se renderiza todo de forma recursiva
	drawbasecoord();

 	//model(mdl);
	noLoop(); // no vuelve a renderizar hasta que se mueva o cambie algo
}

function mouseDragged(){
	if(abs(mouseX - pmouseX) > 50 || abs(mouseY - pmouseY) > 50) // demasiado rapido
		return;
	if (mouseButton === LEFT){
		angley += (mouseX - pmouseX) * 0.01;
		anglex += (mouseY - pmouseY) * 0.01;
	}
	else if (mouseButton === CENTER){
		translatex += (mouseX - pmouseX) * 1;
		translatey += (mouseY - pmouseY) * 1;
	}
	loop();
}

function mouseWheel(event) {
	if (mouseIsPressed && mouseButton === LEFT)
  		anglez += (event.delta) * 0.05;
  	else
		translatez += (event.delta) * -4;
	loop();
}

//function doubleClicked() {
function mouseClicked(){
  if (mouseButton === RIGHT){
    initialperspective();
  }
  loop();  // loop siempre para actualizar si se pulsan botones y checks
}

function funcbutton1(){
  // save(xml, 'temp.xml');
  downloadFile(defaultrobot,'robot','urdf')
}

function gotFile(file) {
  if (extraerextension(file.file.name) != 'urdf'){
		alert("Only urdf files are supported");
		return;
	}
  loadXML(file.data, cargarxacro , cargarxacroerror);
}

function cargarxacro(e) {
  xml = e;
  loadnewURDF();
}

function cargarxacroerror(e) {
	glob = e;
		console.log("error");
	console.log(e);
}

function drawbasecoord(){
 	let vectorlength = 30;
 	let vectorweight = 1;
 	let vectorbase = 3;

	// Centro
	fill('yellow');
	sphere(vectorbase);
	// X
	push();
		fill('red');
		//translate(50, 0, 0)
		//sphere(vectorbase);
		rotateZ(PI/2);
		translate(0, vectorlength/2, 0);
	 	cylinder(vectorweight, vectorlength);
	pop();
	// Y
	push();
		fill('green');
		// translate(0, -50, 0)
		// sphere(vectorbase);
		rotateY(PI/2);
		translate(0, -vectorlength/2, 0);
 		cylinder(vectorweight, vectorlength);
	pop();
	push();
		fill('blue');
		// translate(0, 0, 50)
		// sphere(vectorbase);
		rotateX(PI/2);
		translate(0, -vectorlength/2, 0);
	 	cylinder(vectorweight, vectorlength);
	pop();

}

function loadnewURDF(){
  links = {};
  joints = {};
  for (let elem of xml.getChildren()){
    if (elem.name == "link"){
      let link = new URDF_link(elem);
      //links.push(link);
      //console.log(elem.attributes.name);
      // cada link tiene un nombre unico, almacenarlos en un objeto clave valor
      links[elem.attributes.name] = link;
    }
    else if (elem.name == "joint"){
      let joint = new URDF_joint(elem);
      joints[elem.attributes.name] = joint;
    }
  }
  // añadir todos los joints a sus links correspondientes
  // y sustituye nombres (parent y child) por los objetos link
  for (let joint in joints) {
    if (joints[joint].parent){
      let parentname = joints[joint].parent
      links[parentname].childjoints.push(joints[joint]);
      joints[joint].parent = links[parentname];
    }
    if (joints[joint].child){
      let childname = joints[joint].child
      links[childname].parentjoints.push(joints[joint]);
      joints[joint].child = links[childname];
    }
  }
  initialperspective();
  loop();
}

function initialperspective(){
  anglex = PI + PI/2 + PI/6;
  angley = 0;
  anglez = PI + PI/2 - PI/6;
  translatex = 0;
  translatey = 0;
  translatez = 200;
}

function extraerextension(archivo){
	let partes = archivo.split('.');
	return partes[partes.length-1].toLowerCase();
}
