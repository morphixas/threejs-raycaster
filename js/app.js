/*
My WebGL App
*/

// Global variables
let mainContainer = null;
let fpsContainer
let stats = null;
let camera = null;
let renderer = null;
let scene = null;
let camControls = null;
// Global Meshes
let plane = null;
let box, bucket, vase, ellipse = null;

let gui, ctrl = null;

var gele = new THREE.Group();

// 3d models
const table = new THREE.Group();
const santa = new THREE.Group();
const gifts = new THREE.Group();
const gifts2 = new THREE.Group();
const tree = new THREE.Group();

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let intersects;

function init(){
	if ( THREE.WEBGL.isWebGLAvailable() === false ) container.appendChild( WEBGL.getWebGLErrorMessage() );
	fpsContainer = document.querySelector( '#fps' );
	mainContainer = document.querySelector( '#webgl-secne' );
	scene = new THREE.Scene();

	//fonas su paveiksliuku

	let loader = new THREE.CubeTextureLoader();
	loader.setPath( 'img/fonas/' );
	const background = loader.load( [
		'frozenft.png', 'frozenbk.png',
		'frozenup.png', 'frozendn.png',
		'frozenrt.png', 'frozenlf.png'
	]);
	background.format = THREE.RGBFormat;
	scene.background = background;

	createStats();
	createCamera();
	createControls();
	createMeshes();
	createLights();
	createRenderer();
	renderer.setAnimationLoop( () => {
    update();
    render();
  } );
}

// Animations
function update(){
// scene.traverse(function(e) {
//         if (e instanceof THREE.Group && e != plane ) {
//             e.rotation.x += ctrl.rotationSpeed;
//             e.rotation.y += ctrl.rotationSpeed;
//             e.rotation.z += ctrl.rotationSpeed;
//         }
//     });

box10 = scene.getObjectByName("box-10");
if (box10 != null){
	box10.rotation.x += ctrl.rotationSpeed;
	box10.rotation.y += ctrl.rotationSpeed;
	box10.rotation.z += ctrl.rotationSpeed;
}
}

// Statically rendered content
function render(){
	stats.begin();
	renderer.render( scene, camera );
	stats.end();
}

// FPS counter
function createStats(){
	stats = new Stats();
	stats.showPanel( 0 );	// 0: fps, 1: ms, 2: mb, 3+: custom
	fpsContainer.appendChild( stats.dom );
}

// Camera object
function createCamera(){
	const fov = 45;
	const aspect =  mainContainer.clientWidth / mainContainer.clientHeight;
	const near = 0.1;
	const far = 500;	// meters
	camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	
	// camera = new THREE.OrthographicCamera(
	// 	window.innerWidth / -32,
	// 	window.innerWidth / 32,
	// 	window.innerHeight / 32,
	// 	window.innerHeight / -32, -500, 500 ); 
	
	camera.position.x = 10;
	camera.position.y = 20;
	camera.position.z = 50;
	camera.lookAt(scene.position);
}

// Interactive controls
function createControls(){
	camControls = new THREE.OrbitControls(camera, mainContainer);
	camControls.autoRotate = false;
}

// Light objects
function createLights(){
	const spotLight = new THREE.SpotLight( 0xffffff );
	spotLight.position.set( -10, 18, 10 );
	spotLight.shadow.mapSize.width = 2048; // default 512
	spotLight.shadow.mapSize.height = 2048;	//default 512
	spotLight.intensity = 1.5;
	spotLight.distance = 200;
	spotLight.angle = Math.PI/3;
	spotLight.penumbra = 0.4; // 0 - 1
	spotLight.decay = 0.2;
	spotLight.castShadow = true;
	scene.add( spotLight );

	const ambientLight = new THREE.AmbientLight( 0xffffff, 0.2 ); // 0x111111 - 0xaaaaaa, 1 ; 0xffffff, 0.1 - 0.3;
	scene.add( ambientLight );
}

function createPlane(){

	const planeGeometry = new THREE.PlaneBufferGeometry(30,30);

	// medzio tekstura
	const texture = new THREE.TextureLoader().load( "img/wood.jpg" );
	texture.encoding = THREE.sRGBEncoding;
	texture.anisotropy = 16;

	texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(5,5);

	// filtrai
	texture.magFilter = THREE.LinearFilter;
	texture.minFilter = THREE.LinearMipMapLinearFilter;
	
	const planeMaterial =  new THREE.MeshStandardMaterial({ map: texture});
	
	plane = new THREE.Mesh(planeGeometry,planeMaterial);
	plane.rotation.x = -0.5*Math.PI;
	plane.position.x = 0;
	plane.position.y = 0;
	plane.position.z = 0;
	plane.receiveShadow = true;
	scene.add(plane);
}

function createCustomBox(length, width, height) {
    l = length/2;
	w = width/2;
	h = height/2;
	const vertices = [
		new THREE.Vector3( l,  h,  w),
		new THREE.Vector3( l,  h, -w),
		new THREE.Vector3( l, -h,  w),
		new THREE.Vector3( l, -h, -w),
		new THREE.Vector3(-l,  h, -w),
		new THREE.Vector3(-l,  h,  w),
		new THREE.Vector3(-l, -h, -w),
		new THREE.Vector3(-l, -h,  w)
	];
	const faces = [
		new THREE.Face3(0,2,1),
		new THREE.Face3(2,3,1),
		new THREE.Face3(4,6,5),
		new THREE.Face3(6,7,5),
		new THREE.Face3(4,5,1),
		new THREE.Face3(5,0,1),
		new THREE.Face3(7,6,2),
		new THREE.Face3(6,3,2),
		new THREE.Face3(5,7,0),
		new THREE.Face3(7,2,0),
		new THREE.Face3(1,3,4),
		new THREE.Face3(3,6,4)
	];

	let geom = new THREE.Geometry();
	geom.vertices = vertices;
	geom.faces = faces;

	const materials = [
		new THREE.MeshLambertMaterial( { opacity:0.6, color: Math.random() * 0xffffff, transparent:true} ),
		new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true } )
	];

	let mesh = THREE.SceneUtils.createMultiMaterialObject(geom,materials);

	mesh.children.forEach(function(e) {
		e.castShadow=true;
	});
	
	return mesh;
}

// geles kotas
function createStem(width){
	let points = [];

	for ( let i = 0; i < 20; i ++ ) {
		points.push( new THREE.Vector2( width,  i ) ); 
	}
	
	const latheGeom = new THREE.LatheGeometry( points );

	const materials = [
		new THREE.MeshLambertMaterial( {color: 0x013220, transparent:false, side:THREE.DoubleSide } )
	];

	const mesh = THREE.SceneUtils.createMultiMaterialObject(latheGeom,materials);

	mesh.children.forEach(function(e) {
		e.castShadow=true;
		e.geometry.computeFaceNormals(); //skaiciuoja normales vektorius geram apsvietimui
		});	
		
	return mesh;
}


// geles ziedas
function createBlossom(rotatePrec, heightPrec){
	const pts = [
		new THREE.Vector2( 6, 0),
		new THREE.Vector2( 3, 1),
		new THREE.Vector2( 4, 2),
		new THREE.Vector2( 5, 3),
		new THREE.Vector2( 6, 4),
		new THREE.Vector2( 5, 5),
		new THREE.Vector2( 0, 8)
		];
	
	const spline = new THREE.SplineCurve(pts);
	let splineGeometry = new THREE.Geometry();

	splineGeometry.vertices = spline.getPoints(heightPrec);
	
	const latheGeom = new THREE.LatheGeometry(splineGeometry.vertices, rotatePrec);

	const materials = [
		//vidine puse
		new THREE.MeshLambertMaterial( { opacity:0.6, color: 0xef4e4e, transparent:false, side:THREE.DoubleSide} ),
		//isore
		new THREE.MeshLambertMaterial( { opacity:0.6, color: 0xf50404, transparent:false} ),
	];
	
	let mesh = THREE.SceneUtils.createMultiMaterialObject(latheGeom,materials);
	
	mesh.children.forEach(function(e) {
		e.castShadow=true;
		e.geometry.computeFaceNormals();
	    });

	return mesh;
}

// geles lapelis
function createLeaf(){
	var path = new THREE.Shape();
	path.absellipse(0,0,4,8,0, Math.PI*2, false,0);
	var geometry = new THREE.ShapeBufferGeometry( path );
	var material = new THREE.MeshBasicMaterial( { color: 0x197440} );
	ellipse = new THREE.Mesh( geometry, material );
	ellipse.material.side = THREE.DoubleSide;
	return ellipse;
}

// geles vazonas
function createVase(rotatePrec, heightPrec){

	const pts = [
		new THREE.Vector2( 2, 0),
		new THREE.Vector2( 3, 1),
		new THREE.Vector2( 4, 2),
		new THREE.Vector2( 3, 3),
		new THREE.Vector2( 4, 4),
		new THREE.Vector2( 1.5, 5),
		new THREE.Vector2( 2, 6)
		];
	
	const spline = new THREE.SplineCurve(pts);
	let splineGeometry = new THREE.Geometry();

	splineGeometry.vertices = spline.getPoints(heightPrec);
	
	const latheGeom = new THREE.LatheGeometry(splineGeometry.vertices, rotatePrec);

	const texture = new THREE.TextureLoader().load( "img/marble.jpg" );
	texture.encoding = THREE.sRGBEncoding;
	texture.anisotropy = 16;

	const materials = [
		// vidus
		new THREE.MeshLambertMaterial( { opacity:0.6, color: 0x0c7078, transparent:false, side:THREE.DoubleSide} ),
		// isore
		new THREE.MeshStandardMaterial({ map: texture}),
	];
	
	let mesh = THREE.SceneUtils.createMultiMaterialObject(latheGeom,materials);
	
	mesh.children.forEach(function(e) {
		e.castShadow=true;
		e.geometry.computeFaceNormals();
	    });

	return mesh;
}

function createTable() {
	const mtlLoader = new THREE.MTLLoader();
    mtlLoader.load( 'models/table_and_chairs2.mtl', function( materials ) {
        materials.preload();
        const objloader = new THREE.OBJLoader();
        objloader.setMaterials( materials );
         objloader.load( 'models/table_and_chairs2.obj', function( object ){
            object.traverse( function ( child ){
                if ( child instanceof THREE.Mesh ){
					child.castShadow = true;
					child.receiveShadow = true;
                }
            });
			object.scale.set(6, 6, 6);
			object.castShadow = true;
			
			table.add(object);
		});
	});
	
	table.name = "table";
	scene.add(table);
}

function createTree() {
	const mtlLoader = new THREE.MTLLoader();
    mtlLoader.load( 'models/12150_Christmas_Tree_V2_L2.mtl', function( materials ) {
        materials.preload();
        const objloader = new THREE.OBJLoader();
        objloader.setMaterials( materials );
         objloader.load( 'models/12150_Christmas_Tree_V2_L2.obj', function( object ){
            object.traverse( function ( child ){
                if ( child instanceof THREE.Mesh ){
					child.castShadow = true;
					child.receiveShadow = true;
                }
            });
			object.scale.set(0.07, 0.07, 0.07);
			object.castShadow = true;
			
			tree.add(object);
		});
	});
	scene.add(tree);
}

function createGifts() {
	const mtlLoader = new THREE.MTLLoader();
    mtlLoader.load( 'models/13495_Stack_of_Gifts_v2_L2.mtl', function( materials ) {
        materials.preload();
        const objloader = new THREE.OBJLoader();
        objloader.setMaterials( materials );
         objloader.load( 'models/13495_Stack_of_Gifts_v2_L2.obj', function( object ){
            object.traverse( function ( child ){
                if ( child instanceof THREE.Mesh ){
					child.castShadow = true;
					child.receiveShadow = true;
                }
            });
			object.scale.set(0.07, 0.07, 0.07);
			object.castShadow = true;
			
			gifts.add(object);
		});
	});
	scene.add(gifts);
}

function createGifts2() {
	const mtlLoader = new THREE.MTLLoader();
    mtlLoader.load( 'models/13495_Stack_of_Gifts_v2_L2.mtl', function( materials ) {
        materials.preload();
        const objloader = new THREE.OBJLoader();
        objloader.setMaterials( materials );
         objloader.load( 'models/13495_Stack_of_Gifts_v2_L2.obj', function( object ){
            object.traverse( function ( child ){
                if ( child instanceof THREE.Mesh ){
					child.castShadow = true;
					child.receiveShadow = true;
                }
            });
			object.scale.set(0.07, 0.07, 0.07);
			object.castShadow = true;
			
			gifts2.add(object);
		});
	});
	scene.add(gifts2);
}

function createSanta() {
	const mtlLoader = new THREE.MTLLoader();
    mtlLoader.load( 'models/12165_Santa_Claus_v1_l2.mtl', function( materials ) {
        materials.preload();
        const objloader = new THREE.OBJLoader();
        objloader.setMaterials( materials );
         objloader.load( 'models/12165_Santa_Claus_v1_l2.obj', function( object ){
            object.traverse( function ( child ){
                if ( child instanceof THREE.Mesh ){
					child.castShadow = true;
					child.receiveShadow = true;
                }
            });
			object.scale.set(0.07, 0.07, 0.07);
			object.castShadow = true;
			
			santa.add(object);
		});
	});
	scene.add(santa);
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

class ObjectGenerator{
	numOfObjects = scene.children.length;
	rotationSpeed = 0.02;

	constructor(){}

	showObjectsInfo(){
		this.numOfObjects = scene.children.length;
		console.log(scene.children);
	}

	cloneFlower(){
		let flowerClone= gele.clone();
		flowerClone.position.set(getRandomInt(-2,2),4.5,getRandomInt(-3,3));
		scene.add(flowerClone);
	}

	removeLastObject() {
        const allChildren = scene.children;
        const lastObject = allChildren[allChildren.length-1];
        if (lastObject instanceof THREE.Group) {
            scene.remove(lastObject);
        }
        this.numOfObjects = scene.children.length;
    }
}

// Meshes and other visible objects
function createMeshes(){

	createPlane(plane);

	// geles kotas
	var stem = createStem(0.5);
	
	stem.scale.set(0.3,0.3,0.3);
	gele.add(stem);
	
	// geles ziedas
	blossom = createBlossom(5, 10);
	blossom.rotation.x = Math.PI;
	blossom.scale.set(0.2,0.2,0.2);
	blossom.position.y = 7;
	gele.add(blossom);

	// geles vazonas
	vase = createVase(10, 10);
	vase.rotation.x = Math.PI;
	vase.scale.set(0.5,0.5,0.5);
	vase.rotation.z = Math.PI ;
	gele.add(vase);

	// geles lapas
	leaf = createLeaf();
	leaf.scale.set(0.1,0.1,0.1);
	leaf.position.y = 4;
	leaf.position.x = 0.5;
	leaf.rotation.z = Math.PI/4;
	leaf.rotation.y = Math.PI;
	gele.add(leaf);

	
	gele.scale.set(0.4,0.4,0.4);
	gele.position.y = 4.5;
	gele.position.z = -1;

	gele.name = "flower";
	scene.add(gele);

	createTable();

	createTree();
	tree.rotation.y = Math.PI;
	tree.rotation.x = Math.PI/2;
	tree.position.set(10,0,10);

	createGifts(gifts);
	gifts.rotation.y = Math.PI;
	gifts.rotation.x = Math.PI/2;
	gifts.scale.set(0.5,0.5,0.5);
	gifts.position.set(12,0,2);

	createGifts2(gifts2);
	gifts2.rotation.y = Math.PI;
	gifts2.rotation.x = Math.PI/2;
	gifts2.scale.set(0.5,0.5,0.5);
	gifts2.position.set(5,0,10);

	createSanta();
	santa.rotation.y = Math.PI;
	santa.rotation.x = Math.PI/2;
	santa.scale.set(0.8,0.8,0.8);
	santa.position.set(-8,0,5);
	santa.rotation.z = - (Math.PI / 4);
	
	// let smallBucket= gele.clone();
	// smallBucket.translateZ(10.0);
	// smallBucket.scale.set(0.5,0.5,0.5);
	// scene.add(smallBucket);

	gui = new dat.GUI();
	ctrl = new ObjectGenerator({ autoplace: false, width: 500 });
	gui.add(ctrl, 'numOfObjects').name("Number of objects").listen();
	gui.add(ctrl, 'showObjectsInfo').name("Show info");
	gui.add(ctrl, 'cloneFlower').name("Clone flower");
	gui.add(ctrl, 'removeLastObject').name("Remove flower"); 
}

// Renderer object and features
function createRenderer(){
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize(mainContainer.clientWidth, mainContainer.clientHeight);
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap; //THREE.BasicShadowMap | THREE.PCFShadowMap | THREE.PCFSoftShadowMap
	// set the gamma correction so that output colors look correct on our screens
  renderer.gammaFactor = 2.2;
  renderer.gammaOutput = true;
	mainContainer.appendChild( renderer.domElement );
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function onMouseMove( event ) {
	mouse.x = 2 * ( event.clientX / window.innerWidth ) - 1;
	mouse.y = 1 - 2 * ( event.clientY / window.innerHeight );
}

function onMouseDown( event ) {
    raycaster.setFromCamera( mouse, camera );
    intersects = raycaster.intersectObjects( scene.children, true );
    for ( var i = 0; i < intersects.length; i++ ) {
        if(intersects[ i ].object != plane){
        //intersects[ i ].object.material.color.set( Math.random() * 0xffffff );
        }
        if(intersects[ i ].object.parent.name == "flower"){
            window.location.href ='https://www.google.com/';
            console.log("Paspausta");
        }
    }
}

//mouse clicko listneriai
window.addEventListener( 'mousemove', onMouseMove, false );
window.addEventListener( 'mousedown', onMouseDown, false );
//---------

window.addEventListener( 'resize', onWindowResize, false );
init();
