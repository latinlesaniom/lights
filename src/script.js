import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'lil-gui'
import { DirectionalLightHelper, PCFShadowMap } from 'three'

/**
 * Base
 */

//Debug
const gui = new dat.GUI({
    width: 400
})


//canvas
const canvas = document.querySelector('canvas.webgl')


/**
 * scene
 */
const scene = new THREE.Scene()


/**
 * ambient Light
 */
const AmbientLight = new THREE.AmbientLight(0xffffff, 0.3)
gui.add(AmbientLight, 'intensity').min(0).max(1).step(0.001).name('AmbientLight-Intensity')
scene.add(AmbientLight)


/**
 * directionalLight
 */
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3)
directionalLight.position.set(0, 1.8, -2)
directionalLight.lookAt(0, 0, 0)

directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 6
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.left = -2
directionalLight.shadow.camera.bottom = -2
directionalLight.shadow.radius = 10


const directionalLightaHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(directionalLightaHelper)
directionalLightaHelper.visible = false
gui.add(directionalLight, 'intensity').min(0).max(5).step(0.001).name('DirectionalLight-Intensity')
scene.add(directionalLight)

const material = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    metalness: 1,
    roughness: 0.5
})
gui.add(material, 'metalness').min(0).max(2).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)
gui.add(directionalLight.position, 'x').min(-2).max(4).step(0.001)

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = -Math.PI * 0.5
plane.position.y = -0.5
plane.receiveShadow = true

const plane2 = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    material
)
plane2.position.y =  0.5
plane2.castShadow = true
scene.add(plane, plane2)


const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    //update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    //update resize
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


/**
 * camera
 */
const camera = new THREE.PerspectiveCamera( 75, sizes.width /  sizes.height, 0.1, 100)
camera.position.set(5, 5, 7)
scene.add(camera)


/**
 * controls
 */
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap

/**
 * Anemate
 */

const clock = new THREE.Clock()



const tick = () => {

    const elapsedTime = clock.getElapsedTime()

    //update controls
    controls.update()


    directionalLight.position.x = Math.cos(elapsedTime) * 1.5 



    

    //render
    renderer.render(scene, camera)


    //call tick again the next frame
    window.requestAnimationFrame(tick)

}
tick()


