/* Author(a): Kelly Daniella Marin
   Date of creation: 10 Agosto 2022
   Last Modification: 18 Agosto 2022 / 13:54 PM
 */

// var: Pueden declar sin inicializar. 
// let: Pueden declar sin inicializar.
// const: Pueden declar con valor.  
// console.log(THREE);

// Creando variables iniciales del programa
var scene = null,
    camera = null,
    renderer = null,
    controls = null;

var modPlayer = null;
var pointLight = null;

function start() {
    // Call function to create scene
    initScene();
    // Call function to Animate by Frame
    animate();
}
function redimensionar() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
}
function initScene() {
    // Scene, Camera, Renderer
    // Create Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xBFFDA9);

    // Create Camera (3D)
    camera = new THREE.PerspectiveCamera(75, // Fov (campo de vision)
        window.innerWidth / window.innerHeight, // aspect (tamaño pantalla)
        0.1, // near (Cercano)
        1000000); // far (Lejano)

    // To renderer
    const canvas = document.querySelector('.webgl');
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        antialias: true
    });
     
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    // To Make Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    camera.position.set(6600, 3200, 2000);
    controls.update();

    // To create Grid
    //const size = 50;
    //const divisions = 50;
    //const gridHelper = new THREE.GridHelper(size, divisions);
    //scene.add(gridHelper);
    
    // Axes Helper
    //const axesHelper = new THREE.AxesHelper(8000);
    //scene.add(axesHelper);
    

    // Make Adds
    scene.add(camera);
    camera.position.z = -120;
    window.addEventListener('resize', redimensionar);


    // Create Object with images texture
    const light = new THREE.AmbientLight(0xFFE74F, 0.5); // soft white light
    scene.add( light );

    pointLight = new THREE.PointLight(0xffffff, 1 , 5000);
    pointLight.position.set(700, 1000, -400);
    scene.add(pointLight);

    const sphereSize = 1;
    const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
    scene.add(pointLightHelper);

   

    let tex = new THREE.TextureLoader().load("./src/img/pisonegro.jpg");
    tex.anisotropy = 32;
    tex.repeat.set(10, 10);
    tex.wrapT = THREE.RepeatWrapping;
    tex.wrapS = THREE.RepeatWrapping;
    geo = new THREE.PlaneBufferGeometry(10000, 10000);
    mat = new THREE.MeshLambertMaterial({
       map: tex
    });
    mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(0, 0, 0);
    mesh.rotation.set(Math.PI / -2, 0, 0);
    scene.add(mesh);

    loadModel_objAndMtl("./src/modelo/OBJ/personajevox/mago/","mago", true);
    generateInterface();

}

// Agregar la scene hecha
function loadModel_objAndMtl(pathGeneralFolder, pathFile, show) {
    
    if (show==true){
        // Cargar Pesonaje MAGO
        var mtlLoader1 = new THREE.MTLLoader();
        mtlLoader1.setResourcePath(pathGeneralFolder);
        mtlLoader1.setPath(pathGeneralFolder);
        mtlLoader1.load( pathFile+".mtl", function (materials) {
         materials.preload();

           var objLoader1 = new THREE.OBJLoader();
           objLoader1.setMaterials(materials);
           objLoader1.setPath(pathGeneralFolder);
           objLoader1.load(pathFile+".obj", function (object) {
            
                object.scale.set(420,420,420);
                console.log(pathFile);
                 if(pathFile == "Mario"){
                 object.scale.set(15,15,15);
                 object.position.x = 0;
                // object.position.z = -10;
                 //object.position.y = 0;

                 console.log("soymario");


                }
                 modPlayer = object;
                 scene.add(object);
            });

        });

        // Fin mago
        
    }


}


function generateInterface(){

    var gui = new dat.GUI();
    var param = {
        typeArchive: "FBX",   // String
        showModel: true,    // Booleano
        ColorLight: "#ffffff",   // Color 
        Animations: "Idle",    // Animacion FBX
        Player: "Mago",  // Mi jugador
        Intensity: 0.5,
        moverx :10,
        movery :20,
        moverz :-30,
        rotarx :0,
        rotary :0,
        rotarz :0,
        scale: 1
        //escalarx :0,
        //escalary :0,
        //escalarz :0
    }

    
    var g = gui.addFolder("Geometry/Models");
    var l = gui.addFolder("Lights")
   
    var r = gui.addFolder("Rotar");
    var e = gui.addFolder("Escalar");

    
    var myPlayer = null;
    var ShowPlayer = g.add(param, 'showModel');
    var mycolor = l.addColor(param,'ColorLight' );
    var MyIntensity = l.add(param, 'Intensity').min(-80).max(1).step(0.1);
    
   
    

    // Rotar
    var Rotarx = r.add(param, 'rotarx').min(-1).max(1).step(0.1);
    var Rotary = r.add(param, 'rotary').min(-1).max(1).step(0.1);
    var Rotarz = r.add(param, 'rotarz').min(-1).max(1).step(0.1);

    Rotarx.onChange(function (rot) {
        modPlayer.rotation.x = -Math.PI * rot;
    });
    Rotary.onChange(function (rot) {
        modPlayer.rotation.y = -Math.PI * rot;
    });
    Rotarz.onChange(function (rot) {
        modPlayer.rotation.z = -Math.PI * rot;
    });

    // Escalar
    var myScale = e.add(param, 'scale' ).min(-1000).max(1000).step(1).name("Scale");
    myScale.onChange(function(myScalemago){
        modPlayer.scale.set(myScalemago,myScalemago,myScalemago);
    });



        myPlayer = g.add(param, 'Player', ["mago", "mario"]);
        myPlayer.onChange(function (params) {
                    //saca los valores de mago y mario
                scene.remove(modPlayer);

                loadModel_objAndMtl("./src/modelo/OBJ/personajevox/" + params + "/", params, true);
       });
            

    function LoadGLTF() {

        // Instantiate a loader
        const loader = new THREE.GLTFLoader();

        // Optional: Provide a DRACOLoader instance to decode compressed mesh data
        const dracoLoader = new THREE.DRACOLoader();
        dracoLoader.setDecoderPath('./src/modelo/GLTF/');
        loader.setDRACOLoader(dracoLoader);

        // Load a glTF resource
        loader.load(
            // resource URL
            './src/modelo/GLTF/Pato/Duck.gltf',
            // called when the resource is loaded
            function (gltf) {

                scene.add(gltf.scene);

                gltf.animations; // Array<THREE.AnimationClip>
                gltf.scene; // THREE.Group
                gltf.scenes; // Array<THREE.Group>
                gltf.cameras; // Array<THREE.Camera>
                gltf.asset; // Object

            },
            // called while loading is progressing
            function (xhr) {

                console.log((xhr.loaded / xhr.total * 100) + '% loaded');

            },
            // called when loading has errors
            function (error) {

                console.log('An error happened');

            }
        );
        

        dracoLoader.scale.set(1, 1, 1);
        dracoLoader.position.y = 20;
        dracoLoader.position.z = -30;
        dracoLoader.position.x = 10;
        dracoLoader.rotation.y = 3;
        
       

    }


    // Cambiar el Color
    mycolor.onChange(function(colorGet){
        console.log("Chage Color"+colorGet);
        pointLight.color.setHex(Number(colorGet.toString().replace('#','0x')));
    });

    MyIntensity.onChange(function(intensityGet){
        console.log("change color" + intensityGet);
        pointLight.intensity= intensityGet;
    });




    ShowPlayer.onChange(function(params){
        if(params==false){
            scene.remove(modPlayer);
        }else{ 
            scene.add(modPlayer)
        }
    });

    
}


function animate() {
    requestAnimationFrame(animate);
    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();
    renderer.render(scene, camera);
}