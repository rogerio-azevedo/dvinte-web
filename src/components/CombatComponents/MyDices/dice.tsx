import * as CANNON from 'cannon'
import * as THREE from 'three'

declare const define: any

interface DiceOptions {
  size?: number
  fontColor?: string
  backColor?: string
}

interface DiceVectors {
  position: CANNON.Vec3
  quaternion: CANNON.Quaternion
  velocity: CANNON.Vec3
  angularVelocity: CANNON.Vec3
}

interface DiceValue {
  dice: DiceObject
  value: number
  vectors?: DiceVectors
  stableCount?: number
}

interface MaterialOptions {
  specular: number
  color: number
  shininess: number
  flatShading: boolean
  map?: THREE.Texture
}

interface ChamferGeometry {
  vectors: THREE.Vector3[]
  faces: number[][]
}

// Extend Three.js types with custom properties
interface DiceGeometry extends THREE.Geometry {
  cannon_shape?: CANNON.ConvexPolyhedron
}

interface DiceVector3 extends THREE.Vector3 {
  index?: number
}

interface DiceMesh extends THREE.Mesh {
  body?: CANNON.Body
  diceObject?: DiceObject
  geometry: DiceGeometry
}

class DiceManagerClass {
  public world: CANNON.World | null = null
  public throwRunning: boolean = false
  public diceBodyMaterial!: CANNON.Material
  public floorBodyMaterial!: CANNON.Material
  public barrierBodyMaterial!: CANNON.Material

  setWorld(world: CANNON.World): void {
    this.world = world

    this.diceBodyMaterial = new CANNON.Material()
    this.floorBodyMaterial = new CANNON.Material()
    this.barrierBodyMaterial = new CANNON.Material()

    world.addContactMaterial(
      new CANNON.ContactMaterial(
        this.floorBodyMaterial,
        this.diceBodyMaterial,
        {
          friction: 0.01,
          restitution: 0.5,
        }
      )
    )
    world.addContactMaterial(
      new CANNON.ContactMaterial(
        this.barrierBodyMaterial,
        this.diceBodyMaterial,
        { friction: 0, restitution: 1.0 }
      )
    )
    world.addContactMaterial(
      new CANNON.ContactMaterial(this.diceBodyMaterial, this.diceBodyMaterial, {
        friction: 0,
        restitution: 0.5,
      })
    )
  }

  prepareValues(diceValues: DiceValue[]): void {
    if (this.throwRunning) {
      throw new Error(
        'Cannot start another throw. Please wait, till the current throw is finished.'
      )
    }

    for (let i = 0; i < diceValues.length; i++) {
      if (
        diceValues[i].value < 1 ||
        diceValues[i].dice.values < diceValues[i].value
      ) {
        throw new Error(
          `Cannot throw die to value ${diceValues[i].value}, because it has only ${diceValues[i].dice.values} sides.`
        )
      }
    }

    this.throwRunning = true

    for (let i = 0; i < diceValues.length; i++) {
      diceValues[i].dice.simulationRunning = true
      diceValues[i].vectors = diceValues[i].dice.getCurrentVectors()
      diceValues[i].stableCount = 0
    }

    const check = (): void => {
      let allStable = true
      for (let i = 0; i < diceValues.length; i++) {
        if (diceValues[i].dice.isFinished()) {
          diceValues[i].stableCount = (diceValues[i].stableCount || 0) + 1
        } else {
          diceValues[i].stableCount = 0
        }

        if ((diceValues[i].stableCount || 0) < 50) {
          allStable = false
        }
      }

      if (allStable) {
        if (this.world) {
          this.world.removeEventListener('postStep', check)
        }

        for (let i = 0; i < diceValues.length; i++) {
          diceValues[i].dice.shiftUpperValue(diceValues[i].value)
          if (diceValues[i].vectors) {
            diceValues[i].dice.setVectors(diceValues[i].vectors)
          }
          diceValues[i].dice.simulationRunning = false
        }

        this.throwRunning = false
      } else {
        if (this.world) {
          this.world.step(this.world.dt)
        }
      }
    }

    if (this.world) {
      this.world.addEventListener('postStep', check)
    }
  }
}

export class DiceObject {
  public object: DiceMesh | null = null
  public size: number
  public invertUpside: boolean = false
  public materialOptions: MaterialOptions
  public labelColor: string
  public diceColor: string
  public simulationRunning: boolean = false
  public values!: number
  public mass!: number
  public inertia!: number
  public tab!: number
  public af!: number
  public chamfer!: number
  public vertices!: number[][]
  public faces!: number[][]
  public scaleFactor!: number
  public faceTexts!: (string | string[])[]
  public textMargin!: number
  public customTextTextureFunction?: (
    text: string | string[],
    color: string,
    backColor: string
  ) => THREE.Texture

  constructor(options: DiceOptions = {}) {
    const defaultOptions = this.setDefaults(options, {
      size: 100,
      fontColor: '#ffffff',
      backColor: '#200122',
    })

    this.size = defaultOptions.size
    this.materialOptions = {
      specular: 0x172022,
      color: 0xf0f0f0,
      shininess: 40,
      flatShading: true,
    }
    this.labelColor = defaultOptions.fontColor
    this.diceColor = defaultOptions.backColor
  }

  protected setDefaults(
    options: DiceOptions,
    defaults: Required<DiceOptions>
  ): Required<DiceOptions> {
    const result = { ...defaults }

    for (const key in defaults) {
      if (key in options) {
        ;(result as any)[key] = (options as any)[key]
      }
    }

    return result
  }

  emulateThrow(callback: (value: number) => void): void {
    let stableCount = 0

    const check = (): void => {
      if (this.isFinished()) {
        stableCount++

        if (stableCount === 50) {
          DiceManager.world?.removeEventListener('postStep', check)
          callback(this.getUpsideValue())
        }
      } else {
        stableCount = 0
      }

      if (DiceManager.world) {
        DiceManager.world.step(DiceManager.world.dt)
      }
    }

    DiceManager.world?.addEventListener('postStep', check)
  }

  isFinished(): boolean {
    const threshold = 1

    if (!this.object?.body) return false

    const angularVelocity = this.object.body.angularVelocity
    const velocity = this.object.body.velocity

    return (
      Math.abs(angularVelocity.x) < threshold &&
      Math.abs(angularVelocity.y) < threshold &&
      Math.abs(angularVelocity.z) < threshold &&
      Math.abs(velocity.x) < threshold &&
      Math.abs(velocity.y) < threshold &&
      Math.abs(velocity.z) < threshold
    )
  }

  getUpsideValue(): number {
    if (!this.object || !this.object.geometry.faces) return 0

    const vector = new THREE.Vector3(0, this.invertUpside ? -1 : 1, 0)
    let closest_face: THREE.Face3 | undefined
    let closest_angle = Math.PI * 2

    for (let i = 0; i < this.object.geometry.faces.length; ++i) {
      const face = this.object.geometry.faces[i]
      if (face.materialIndex === 0) continue

      const angle = face.normal
        .clone()
        .applyQuaternion(
          this.object.body?.quaternion || new CANNON.Quaternion()
        )
        .angleTo(vector)

      if (angle < closest_angle) {
        closest_angle = angle
        closest_face = face
      }
    }

    return closest_face ? closest_face.materialIndex - 1 : 0
  }

  getCurrentVectors(): DiceVectors {
    if (!this.object?.body) {
      throw new Error('Dice object not initialized')
    }

    return {
      position: this.object.body.position.clone(),
      quaternion: this.object.body.quaternion.clone(),
      velocity: this.object.body.velocity.clone(),
      angularVelocity: this.object.body.angularVelocity.clone(),
    }
  }

  setVectors(vectors: DiceVectors): void {
    if (!this.object?.body) return

    this.object.body.position = vectors.position
    this.object.body.quaternion = vectors.quaternion
    this.object.body.velocity = vectors.velocity
    this.object.body.angularVelocity = vectors.angularVelocity
  }

  shiftUpperValue(toValue: number): void {
    if (!this.object || !this.object.geometry.faces) return

    const geometry = this.object.geometry.clone() as DiceGeometry
    const fromValue = this.getUpsideValue()

    for (let i = 0, l = geometry.faces.length; i < l; ++i) {
      let materialIndex = geometry.faces[i].materialIndex
      if (materialIndex === 0) continue

      materialIndex += toValue - fromValue - 1
      while (materialIndex > this.values) materialIndex -= this.values
      while (materialIndex < 1) materialIndex += this.values

      geometry.faces[i].materialIndex = materialIndex + 1
    }

    if (this.values === 4 && toValue !== fromValue) {
      // to shift faces on a d4, we need to alter faceTexts and recreate the textures from it
      const num =
        toValue - fromValue < 0 ? toValue - fromValue + 4 : toValue - fromValue
      this.faceTexts = [
        [
          [],
          ['0', '0', '0'],
          ['2', '4', '3'],
          ['1', '3', '4'],
          ['2', '1', '4'],
          ['1', '2', '3'],
        ],
        [
          [],
          ['0', '0', '0'],
          ['2', '3', '4'],
          ['3', '1', '4'],
          ['2', '4', '1'],
          ['3', '2', '1'],
        ],
        [
          [],
          ['0', '0', '0'],
          ['4', '3', '2'],
          ['3', '4', '1'],
          ['4', '2', '1'],
          ['3', '1', '2'],
        ],
        [
          [],
          ['0', '0', '0'],
          ['4', '2', '3'],
          ['1', '4', '3'],
          ['4', '1', '2'],
          ['1', '3', '2'],
        ],
      ][num]
      this.object.material = this.getMaterials()
    }

    this.object.geometry = geometry
  }

  private getChamferGeometry(
    vectors: THREE.Vector3[],
    faces: number[][],
    chamfer: number
  ): ChamferGeometry {
    const chamfer_vectors: THREE.Vector3[] = []
    const chamfer_faces: number[][] = []
    const corner_faces: number[][] = new Array(vectors.length)

    for (let i = 0; i < vectors.length; ++i) {
      corner_faces[i] = []
    }

    for (let i = 0; i < faces.length; ++i) {
      const ii = faces[i]
      const fl = ii.length - 1
      const center_point = new THREE.Vector3()
      const face = new Array(fl)

      for (let j = 0; j < fl; ++j) {
        const vv = vectors[ii[j]].clone()
        center_point.add(vv)
        corner_faces[ii[j]].push((face[j] = chamfer_vectors.push(vv) - 1))
      }

      center_point.divideScalar(fl)

      for (let j = 0; j < fl; ++j) {
        const vv = chamfer_vectors[face[j]]
        vv.subVectors(vv, center_point)
          .multiplyScalar(chamfer)
          .addVectors(vv, center_point)
      }

      face.push(ii[fl])
      chamfer_faces.push(face)
    }

    for (let i = 0; i < faces.length - 1; ++i) {
      for (let j = i + 1; j < faces.length; ++j) {
        const pairs: number[][] = []
        let lastm = -1

        for (let m = 0; m < faces[i].length - 1; ++m) {
          const n = faces[j].indexOf(faces[i][m])
          if (n >= 0 && n < faces[j].length - 1) {
            if (lastm >= 0 && m !== lastm + 1) {
              pairs.unshift([i, m], [j, n])
            } else {
              pairs.push([i, m], [j, n])
            }
            lastm = m
          }
        }

        if (pairs.length !== 4) continue

        chamfer_faces.push([
          chamfer_faces[pairs[0][0]][pairs[0][1]],
          chamfer_faces[pairs[1][0]][pairs[1][1]],
          chamfer_faces[pairs[3][0]][pairs[3][1]],
          chamfer_faces[pairs[2][0]][pairs[2][1]],
          -1,
        ])
      }
    }

    for (let i = 0; i < corner_faces.length; ++i) {
      const cf = corner_faces[i]
      const face = [cf[0]]
      let count = cf.length - 1

      while (count) {
        for (let m = faces.length; m < chamfer_faces.length; ++m) {
          const index = chamfer_faces[m].indexOf(face[face.length - 1])
          if (index >= 0 && index < 4) {
            const nextIndex = index === 0 ? 3 : index - 1
            const next_vertex = chamfer_faces[m][nextIndex]
            if (cf.indexOf(next_vertex) >= 0) {
              face.push(next_vertex)
              break
            }
          }
        }
        --count
      }

      face.push(-1)
      chamfer_faces.push(face)
    }

    return { vectors: chamfer_vectors, faces: chamfer_faces }
  }

  private makeGeometry(
    vertices: THREE.Vector3[],
    faces: number[][],
    radius: number,
    tab: number,
    af: number
  ): DiceGeometry {
    const geom = new THREE.Geometry() as DiceGeometry

    for (let i = 0; i < vertices.length; ++i) {
      const vertex = vertices[i].multiplyScalar(radius) as DiceVector3
      vertex.index = geom.vertices.push(vertex) - 1
    }

    for (let i = 0; i < faces.length; ++i) {
      const ii = faces[i]
      const fl = ii.length - 1
      const aa = (Math.PI * 2) / fl

      for (let j = 0; j < fl - 2; ++j) {
        const face = new THREE.Face3(
          ii[0],
          ii[j + 1],
          ii[j + 2],
          [
            geom.vertices[ii[0]],
            geom.vertices[ii[j + 1]],
            geom.vertices[ii[j + 2]],
          ],
          undefined,
          ii[fl] + 1
        )
        geom.faces.push(face)

        geom.faceVertexUvs[0].push([
          new THREE.Vector2(
            (Math.cos(af) + 1 + tab) / 2 / (1 + tab),
            (Math.sin(af) + 1 + tab) / 2 / (1 + tab)
          ),
          new THREE.Vector2(
            (Math.cos(aa * (j + 1) + af) + 1 + tab) / 2 / (1 + tab),
            (Math.sin(aa * (j + 1) + af) + 1 + tab) / 2 / (1 + tab)
          ),
          new THREE.Vector2(
            (Math.cos(aa * (j + 2) + af) + 1 + tab) / 2 / (1 + tab),
            (Math.sin(aa * (j + 2) + af) + 1 + tab) / 2 / (1 + tab)
          ),
        ])
      }
    }

    geom.computeFaceNormals()
    geom.boundingSphere = new THREE.Sphere(new THREE.Vector3(), radius)
    return geom
  }

  private createShape(
    vertices: THREE.Vector3[],
    faces: number[][],
    radius: number
  ): CANNON.ConvexPolyhedron {
    const cv = new Array(vertices.length)
    const cf = new Array(faces.length)

    for (let i = 0; i < vertices.length; ++i) {
      const v = vertices[i]
      cv[i] = new CANNON.Vec3(v.x * radius, v.y * radius, v.z * radius)
    }

    for (let i = 0; i < faces.length; ++i) {
      cf[i] = faces[i].slice(0, faces[i].length - 1)
    }

    return new CANNON.ConvexPolyhedron(cv, cf)
  }

  getGeometry(): DiceGeometry {
    const radius = this.size * this.scaleFactor

    const vectors = new Array(this.vertices.length)
    for (let i = 0; i < this.vertices.length; ++i) {
      vectors[i] = new THREE.Vector3().fromArray(this.vertices[i]).normalize()
    }

    const chamferGeometry = this.getChamferGeometry(
      vectors,
      this.faces,
      this.chamfer
    )
    const geometry = this.makeGeometry(
      chamferGeometry.vectors,
      chamferGeometry.faces,
      radius,
      this.tab,
      this.af
    )

    geometry.cannon_shape = this.createShape(vectors, this.faces, radius)

    return geometry
  }

  protected calculateTextureSize(approx: number): number {
    return Math.max(
      128,
      Math.pow(2, Math.floor(Math.log(approx) / Math.log(2)))
    )
  }

  private createTextTexture(
    text: string | string[],
    color: string,
    backColor: string
  ): THREE.Texture {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')!
    const ts =
      this.calculateTextureSize(this.size / 2 + this.size * this.textMargin) * 2

    canvas.width = canvas.height = ts
    context.font = `${ts / (1 + 2 * this.textMargin)}pt Arial`
    context.fillStyle = backColor
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillStyle = color

    const textContent = Array.isArray(text) ? text.join('') : text
    context.fillText(textContent, canvas.width / 2, canvas.height / 2)

    const texture = new THREE.Texture(canvas)
    texture.needsUpdate = true
    return texture
  }

  getMaterials(): THREE.Material[] {
    const materials: THREE.Material[] = []

    for (let i = 0; i < this.faceTexts.length; ++i) {
      let texture: THREE.Texture

      if (this.customTextTextureFunction) {
        texture = this.customTextTextureFunction(
          this.faceTexts[i],
          this.labelColor,
          this.diceColor
        )
      } else {
        texture = this.createTextTexture(
          this.faceTexts[i],
          this.labelColor,
          this.diceColor
        )
      }

      materials.push(
        new THREE.MeshPhongMaterial({
          ...this.materialOptions,
          map: texture,
        })
      )
    }

    return materials
  }

  getObject(): DiceMesh | null {
    return this.object
  }

  create(): DiceMesh {
    if (!DiceManager.world) {
      throw new Error('You must call DiceManager.setWorld(world) first.')
    }

    this.object = new THREE.Mesh(
      this.getGeometry(),
      this.getMaterials()
    ) as DiceMesh

    this.object.receiveShadow = true
    this.object.castShadow = true
    this.object.diceObject = this

    this.object.body = new CANNON.Body({
      mass: this.mass,
      shape: this.object.geometry.cannon_shape,
      material: DiceManager.diceBodyMaterial,
    })

    this.object.body.linearDamping = 0.1
    this.object.body.angularDamping = 0.1

    DiceManager.world.add(this.object.body)

    return this.object
  }

  updateMeshFromBody(): void {
    if (!this.simulationRunning && this.object?.body) {
      this.object.position.copy(this.object.body.position)
      this.object.quaternion.copy(this.object.body.quaternion)
    }
  }

  updateBodyFromMesh(): void {
    if (this.object?.body) {
      this.object.body.position.copy(this.object.position)
      this.object.body.quaternion.copy(this.object.quaternion)
    }
  }
}

export class DiceD4 extends DiceObject {
  constructor(options: DiceOptions = {}) {
    super(options)

    this.tab = -0.1
    this.af = (Math.PI * 7) / 6
    this.chamfer = 0.96
    this.vertices = [
      [1, 1, 1],
      [-1, -1, 1],
      [-1, 1, -1],
      [1, -1, -1],
    ]
    this.faces = [
      [1, 0, 2, 1],
      [0, 1, 3, 2],
      [0, 3, 2, 3],
      [1, 2, 3, 4],
    ]
    this.scaleFactor = 1.2
    this.values = 4
    this.faceTexts = [
      [],
      ['0', '0', '0'],
      ['2', '4', '3'],
      ['1', '3', '4'],
      ['2', '1', '4'],
      ['1', '2', '3'],
    ]

    this.customTextTextureFunction = (
      text: string | string[],
      color: string,
      backColor: string
    ): THREE.Texture => {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')!
      const ts = this.calculateTextureSize(this.size / 2 + this.size * 2) * 2

      canvas.width = canvas.height = ts
      context.font = `${ts / 5}pt Arial`
      context.fillStyle = backColor
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      context.fillStyle = color

      const textArray = Array.isArray(text) ? text : [text]
      for (const t of textArray) {
        context.fillText(t, canvas.width / 2, canvas.height / 2 - ts * 0.3)
        context.translate(canvas.width / 2, canvas.height / 2)
        context.rotate((Math.PI * 2) / 3)
        context.translate(-canvas.width / 2, -canvas.height / 2)
      }

      const texture = new THREE.Texture(canvas)
      texture.needsUpdate = true
      return texture
    }

    this.textMargin = 1.0
    this.mass = 300
    this.inertia = 5
    this.invertUpside = true

    this.create()
  }
}

export class DiceD6 extends DiceObject {
  constructor(options: DiceOptions = {}) {
    super(options)

    this.tab = 0.1
    this.af = Math.PI / 4
    this.chamfer = 0.96
    this.vertices = [
      [-1, -1, -1],
      [1, -1, -1],
      [1, 1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1],
    ]
    this.faces = [
      [0, 3, 2, 1, 1],
      [1, 2, 6, 5, 2],
      [0, 1, 5, 4, 3],
      [3, 7, 6, 2, 4],
      [0, 4, 7, 3, 5],
      [4, 5, 6, 7, 6],
    ]
    this.scaleFactor = 0.9
    this.values = 6
    this.faceTexts = [
      ' ',
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20',
    ]
    this.textMargin = 1.0
    this.mass = 300
    this.inertia = 13

    this.create()
  }
}

export class DiceD8 extends DiceObject {
  constructor(options: DiceOptions = {}) {
    super(options)

    this.tab = 0
    this.af = -Math.PI / 4 / 2
    this.chamfer = 0.965
    this.vertices = [
      [1, 0, 0],
      [-1, 0, 0],
      [0, 1, 0],
      [0, -1, 0],
      [0, 0, 1],
      [0, 0, -1],
    ]
    this.faces = [
      [0, 2, 4, 1],
      [0, 4, 3, 2],
      [0, 3, 5, 3],
      [0, 5, 2, 4],
      [1, 3, 4, 5],
      [1, 4, 2, 6],
      [1, 2, 5, 7],
      [1, 5, 3, 8],
    ]
    this.scaleFactor = 1
    this.values = 8
    this.faceTexts = [
      ' ',
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20',
    ]
    this.textMargin = 1.2
    this.mass = 340
    this.inertia = 10

    this.create()
  }
}

export class DiceD10 extends DiceObject {
  constructor(options: DiceOptions = {}) {
    super(options)

    this.tab = 0
    this.af = (Math.PI * 6) / 5
    this.chamfer = 0.945
    this.vertices = []
    this.faces = [
      [5, 7, 11, 0],
      [4, 2, 10, 1],
      [1, 3, 11, 2],
      [0, 8, 10, 3],
      [7, 9, 11, 4],
      [8, 6, 10, 5],
      [9, 1, 11, 6],
      [2, 0, 10, 7],
      [3, 5, 11, 8],
      [6, 4, 10, 9],
      [1, 0, 2, -1],
      [1, 2, 3, -1],
      [3, 2, 4, -1],
      [3, 4, 5, -1],
      [5, 4, 6, -1],
      [5, 6, 7, -1],
      [7, 6, 8, -1],
      [7, 8, 9, -1],
      [9, 8, 0, -1],
      [9, 0, 1, -1],
    ]

    for (let i = 0, b = 0; i < 10; ++i, b += (Math.PI * 2) / 10) {
      this.vertices.push([Math.cos(b), Math.sin(b), 0.105 * (i % 2 ? 1 : -1)])
    }
    this.vertices.push([0, 0, -1])
    this.vertices.push([0, 0, 1])

    this.scaleFactor = 0.9
    this.values = 10
    this.faceTexts = [
      ' ',
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20',
    ]
    this.textMargin = 1.0
    this.mass = 350
    this.inertia = 9

    this.create()
  }
}

export class DiceD12 extends DiceObject {
  constructor(options: DiceOptions = {}) {
    super(options)

    const p = (1 + Math.sqrt(5)) / 2
    const q = 1 / p

    this.tab = 0.2
    this.af = -Math.PI / 4 / 2
    this.chamfer = 0.968
    this.vertices = [
      [0, q, p],
      [0, q, -p],
      [0, -q, p],
      [0, -q, -p],
      [p, 0, q],
      [p, 0, -q],
      [-p, 0, q],
      [-p, 0, -q],
      [q, p, 0],
      [q, -p, 0],
      [-q, p, 0],
      [-q, -p, 0],
      [1, 1, 1],
      [1, 1, -1],
      [1, -1, 1],
      [1, -1, -1],
      [-1, 1, 1],
      [-1, 1, -1],
      [-1, -1, 1],
      [-1, -1, -1],
    ]
    this.faces = [
      [2, 14, 4, 12, 0, 1],
      [15, 9, 11, 19, 3, 2],
      [16, 10, 17, 7, 6, 3],
      [6, 7, 19, 11, 18, 4],
      [6, 18, 2, 0, 16, 5],
      [18, 11, 9, 14, 2, 6],
      [1, 17, 10, 8, 13, 7],
      [1, 13, 5, 15, 3, 8],
      [13, 8, 12, 4, 5, 9],
      [5, 4, 14, 9, 15, 10],
      [0, 12, 8, 10, 16, 11],
      [3, 19, 7, 17, 1, 12],
    ]
    this.scaleFactor = 0.9
    this.values = 12
    this.faceTexts = [
      ' ',
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20',
    ]
    this.textMargin = 1.0
    this.mass = 350
    this.inertia = 8

    this.create()
  }
}

export class DiceD20 extends DiceObject {
  constructor(options: DiceOptions = {}) {
    super(options)

    const t = (1 + Math.sqrt(5)) / 2

    this.tab = -0.2
    this.af = -Math.PI / 4 / 2
    this.chamfer = 0.955
    this.vertices = [
      [-1, t, 0],
      [1, t, 0],
      [-1, -t, 0],
      [1, -t, 0],
      [0, -1, t],
      [0, 1, t],
      [0, -1, -t],
      [0, 1, -t],
      [t, 0, -1],
      [t, 0, 1],
      [-t, 0, -1],
      [-t, 0, 1],
    ]
    this.faces = [
      [0, 11, 5, 1],
      [0, 5, 1, 2],
      [0, 1, 7, 3],
      [0, 7, 10, 4],
      [0, 10, 11, 5],
      [1, 5, 9, 6],
      [5, 11, 4, 7],
      [11, 10, 2, 8],
      [10, 7, 6, 9],
      [7, 1, 8, 10],
      [3, 9, 4, 11],
      [3, 4, 2, 12],
      [3, 2, 6, 13],
      [3, 6, 8, 14],
      [3, 8, 9, 15],
      [4, 9, 5, 16],
      [2, 4, 11, 17],
      [6, 2, 10, 18],
      [8, 6, 7, 19],
      [9, 8, 1, 20],
    ]
    this.scaleFactor = 1
    this.values = 20
    this.faceTexts = [
      ' ',
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20',
    ]
    this.textMargin = 1.0
    this.mass = 400
    this.inertia = 6

    this.create()
  }
}

export const DiceManager = new DiceManagerClass()

// Module exports for different environments
if (typeof define === 'function' && define.amd) {
  define(() => ({
    DiceManager,
    DiceD4,
    DiceD6,
    DiceD8,
    DiceD10,
    DiceD12,
    DiceD20,
  }))
} else if (
  typeof module !== 'undefined' &&
  typeof module.exports !== 'undefined'
) {
  module.exports = {
    DiceManager,
    DiceD4,
    DiceD6,
    DiceD8,
    DiceD10,
    DiceD12,
    DiceD20,
  }
} else if (typeof window !== 'undefined') {
  ;(window as any).Dice = {
    DiceManager,
    DiceD4,
    DiceD6,
    DiceD8,
    DiceD10,
    DiceD12,
    DiceD20,
  }
}
