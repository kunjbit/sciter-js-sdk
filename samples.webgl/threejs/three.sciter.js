
import * as THREE from "three.module.js";
import { OrbitControls } from "three.sciter.orbit-controls.js";

export { THREE };

class WebGL2RenderingContext { constructor() {} }
globalThis.WebGL2RenderingContext = WebGL2RenderingContext;

// redefine THREE ImageLoader::load() to use Sciter's Graphics.Image.load(url)
THREE.ImageLoader.prototype.load = async function (url, onLoad, onProgress, onError) {

   if ( this.path !== undefined ) url = this.path + url;
   url = this.manager.resolveURL( url );

   const cached = THREE.Cache.get( url );
   if ( cached !== undefined ) {
      this.manager.itemStart( url );
      if ( onLoad ) onLoad( cached );
      this.manager.itemEnd( url );
      return cached;
   }

   try {
     this.manager.itemStart( url );
     const image = await Graphics.Image.load(url);
     THREE.Cache.add( url, image );
     if ( onLoad ) onLoad( image );
     this.manager.itemEnd( url );
     return image;
   } catch (e) {
     if ( onError ) onError( e );
     this.manager.itemError( url );
     this.manager.itemEnd( url );
     return null;
   }
}


// generic canvas|3d controller, exposes WebGL configured for the THREE 
export class WebGL extends Element {
   getContext(t) {
      console.assert(t == "webgl" || t == "webgl2", "This canvas supports only WebGL");
      const gl = this.WebGL; // get native WebGL implementation - it is an asset, so
      // note: this is needed for THREE to determine WebGL2 support properly:        
      if(gl) {
         Object.defineProperty(gl, 'constructor', { value: WebGL2RenderingContext, writable: false});
      } else {
         this.content(<p>No WebGL in this backend</p>);
      }
      return gl;
   }
}

// canvas|three controller, exposes 
// 1. WebGL configured for the THREE;
// 2. updateSize(renderer,camera) method to be called on initialization,
//    this method is DPI aware - sets canvas size to physical pixels of inner box of the element
// 3. handles resize properly;

export class ThreeView extends WebGL {
  scene;
  renderer;
  camera;

  get THREE() { return THREE; }

  componentDidMount() {
    //this.postEvent(new Event("ready", {bubbles:true}));
  }

  updateSize(renderer, scene, camera) {
    this.scene = scene;
    this.renderer = renderer;
    this.camera = camera;
    if( this.hasAttribute("orbit-controls") )
      this.controls = new OrbitControls( camera, this );
    return this.onSizeChange(); // returns Size with .width/.height
  }

  onSizeChange() {
    const  size = this.box("inner").size;
    this.camera.aspect = size.width / size.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setDrawingBufferSize( size.width, size.height, devicePixelRatio );
    this.renderer.render( this.scene, this.camera );
    return size;
  }

  onAnimationTick() {
    this.controls?.update();
  }
}
