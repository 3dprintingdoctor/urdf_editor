

class URDF_link	 {
  constructor(xmlobject) {
  	// name
  	this.xmlobject = xmlobject;
  	this.name = xmlobject.attributes.name;
  	this.escala = 100;
  	this.col = color(255, 255, 255);
	this.tx = 0;
	this.ty = 0;
	this.tz = 0;
	this.rx = 0;
	this.ry = 0;
	this.rz = 0;
	this.parentjoints = [];
	this.childjoints = [];
	for (let link of xmlobject.children){
		// VISUAL ===============================================
		if (link.name == "visual"){
			for (let visual of link.children){
				if (visual.name == "origin"){
					this.extraerorigen(visual.attributes.xyz);
					this.extraerrotacion(visual.attributes.rpy);
				}
				else if (visual.name == "geometry"){
					for (let geometry of visual.children){
						//<box size="0.4 0.1 0.1"/>
						if (geometry.name == "box"){
							this.geometry = 'box';
							this.extraersize(geometry.attributes.size);
						}
						//<cylinder length="0.6" radius="0.2"/>
						else if (geometry.name == "cylinder"){
							this.geometry = 'cylinder';
							this.slength = Number(geometry.attributes.length) * this.escala;
							this.sradius = Number(geometry.attributes.radius) * this.escala;
						}
						else if (geometry.name == "sphere"){
							this.geometry = 'sphere';
							this.sradius = Number(geometry.attributes.radius) * this.escala;
						}
					}
				}
				else if (visual.name == "material"){
          // <material name="white"/>
          this.col = color(visual.attributes.name);
				}
			}
		}
	}
  }


	draw(){
 		push();
 			translate(this.tx, -this.ty, this.tz);
			rotateX(this.rx);
			rotateY(this.ry);
			rotateZ(this.rz);
  			noStroke();
        ambientMaterial(this.col);
  			//fill(this.col);
  			if (this.geometry == 'box'){
  				box(this.sx, this.sy, this.sz);
  			}
  			// cylinder length="0.6" radius="0
  			else if (this.geometry == 'cylinder'){
  				rotateX(PI/2);
				//rotateY(PI/2);
				//rotateZ(PI/2);
  				cylinder(this.sradius, this.slength);
  			}
  			else if (this.geometry == 'sphere'){
  				sphere(this.sradius);
  			}
		pop();
 	}

 	drawtree(){
 		for (let ch of this.childjoints){
 			ch.drawtree();
 		}
 		if (ckverlinks.checked()) {
 			this.draw();
		}
 	}

    extraerorigen(xyz){
  	// mensaje tipo "0.133333333333 0 -0.085"
  	if (xyz === undefined)
  		return;
	let param = xyz.split(" ");
	this.tx = Number(param[0]) * this.escala;
	this.ty = Number(param[1]) * this.escala;
	this.tz = Number(param[2]) * this.escala;
  }

   extraerrotacion(rpy){
  	// mensaje tipo "0.133333333333 0 -0.085"
  	if (rpy === undefined)
  		return;
	let param = rpy.split(" ");
	this.rx = Number(param[0]);
	this.ry = Number(param[1]);
	this.rz = Number(param[2]);
	//console.log("" + this.rx + ", " + this.ry + ", " + this.rz);
   }

   extraersize(size){
  	// mensaje tipo "0.133333333333 0 -0.085"
  	if (size === undefined)
  		return;
	let param = size.split(" ");
	this.sx = Number(param[0]) * this.escala;
	this.sy = Number(param[1]) * this.escala;
	this.sz = Number(param[2]) * this.escala;
   }

}

class URDF_joint {
	constructor(xmlobject) {
		this.xmlobject = xmlobject;
		this.name = xmlobject.attributes.name;
		this.parent = null;
		this.child = null;
		this.vectorlength = 50;
		this.escala = 100;
		this.tx = 0;
		this.ty = 0;
		this.tz = 0;
		this.rx = 0;
		this.ry = 0;
		this.rz = 0;
		for (let jointsub of xmlobject.getChildren()){
			if (jointsub.name == "origin"){
				this.extraerorigen(jointsub.attributes.xyz);
				this.extraerrotacion(jointsub.attributes.rpy);
			}
			// inicialmente parent y child son los nombres, luego seran los objetos link
			else if (jointsub.name == "parent"){
				this.parent = jointsub.attributes.link;
			}
			else if (jointsub.name == "child"){
				this.child = jointsub.attributes.link;
			}
		}
	}

  draw(){
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

	drawtree (atx, aty, atz, arx, ary, arz) {
		push();
		 	translate(this.tx, -this.ty, this.tz);
			rotateX(this.rx);
			rotateY(this.ry);
			rotateZ(this.rz);
			if (this.child)
				this.child.drawtree(atx, aty, atz, arx, ary, arz);
			if (ckverjoints.checked())
				this.draw();
		pop();
	}

  extraerorigen(xyz){
  	// mensaje tipo "0.133333333333 0 -0.085"
  	if (xyz === undefined)
  		return;
  	let param = xyz.split(" ");
  	this.tx = Number(param[0]) * this.escala;
  	this.ty = Number(param[1]) * this.escala;
  	this.tz = Number(param[2]) * this.escala;
  }

   extraerrotacion(rpy){
  	// mensaje tipo "0.133333333333 0 -0.085"
  	if (rpy === undefined)
  		return;
  	let param = rpy.split(" ");
  	this.rx = Number(param[0]);
  	this.ry = Number(param[1]);
  	this.rz = Number(param[2]);
  	//console.log("" + this.rx + ", " + this.ry + ", " + this.rz);
   }

}
