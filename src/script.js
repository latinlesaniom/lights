import './style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'
import { RectAreaLight } from 'three'


/**
 * Base
 */
const gui = new dat.GUI({
    width: 400
})
const debugObject = {}

//canvas
const canvas = document.querySelector('canvas.webgl')
debugObject.colorStart = '#36494f'
debugObject.colorEnd = '#263337'

/**
 * Scene
 */
const scene = new THREE.Scene()

/**
 * Geometry
 */
//plane
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    new THREE.MeshStandardMaterial(
        {
          //color: debugObject.colorStart, 
            side:  THREE.DoubleSide,
         // metalness: 0.7,
            roughness: 5
        })
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5
plane.receiveShadow = true
plane.castShadow = true
scene.add(plane)

//plane
const SecondPlane = new THREE.PlaneGeometry(2, 2)
const material = new THREE.MeshStandardMaterial(
    {
    //  color: debugObject.colorEnd,
        side: THREE.DoubleSide,
    //  metalness: 0.7,
        roughness: 5
    })
const mesh = new THREE.Mesh(SecondPlane, material)
mesh.position.y = 0.45
SecondPlane.receiveShadow = true
SecondPlane.castShadow = true
scene.add(mesh)

/**
 * Ambient Light
*/
const AmbientLight = new THREE.AmbientLight(0xffffff, 0.5)
AmbientLight.color = new THREE.Color(0xffffff)
AmbientLight.intensity = 0
scene.add(AmbientLight)

/**
 * ReactAreaLight
 */

const area = {}
area.width = 1
area.height = 1
const intensity = 2
const rectLight = new RectAreaLight(0Xffffff, intensity, area.width, area.height)
rectLight.position.set(0,  1.8, -2)
rectLight.lookAt(0, 0, 0)
rectLight.castShadow = true
rectLight.receiveShadow = true
scene.add(rectLight)


gui.add(rectLight, 'width').min(0).max(2).step(0.001)
gui.add(rectLight, 'height').min(0).max(5).step(0.001)
gui.add(rectLight, 'intensity').min(0).max(3).step(0.01)
gui.add(rectLight.position, 'x').min(-3).max(3).step(0.001)
gui.add(rectLight.position, 'y').min(-1).max(2).step(0.001)
gui.add(rectLight.position, 'z').min(-1).max(2).step(0.001)

const rectLightHelper = new RectAreaLightHelper(rectLight)
rectLight.add(rectLightHelper)





/**
 * sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
window.addEventListener('resize', () => {
    //update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //update Camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    //update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = - (event.clientY / sizes.height - 0.5)
})

/**
 * camera
 */
//base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(5, 5, 7)
scene.add(camera) 


//controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = false


//renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap


const clock = new THREE.Clock()

const tick = () => {

    
   /* camera.position.y = - scrollY / sizes.height * 2
    const parallaxX = cursor.x
    const parallaxY = cursor.y
    camera.position.x = parallaxX
    camera.position.y = parallaxY*/


    const elapsedTime = clock.getElapsedTime()

    const ghostAngle = elapsedTime * 0.5
    


//    sphere.material.uniforms.uTime.value = elapsedTime

//    matParticles.uniforms.uTime.value = elapsedTime

    //update controls
    controls.update()

    //renderer
    renderer.render(scene, camera)

    //call tick again on the next frame

    window.requestAnimationFrame(tick)

}

tick()
