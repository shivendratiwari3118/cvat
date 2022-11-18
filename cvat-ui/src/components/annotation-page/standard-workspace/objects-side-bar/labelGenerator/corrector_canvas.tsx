// import React ,{useEffect,useState, useRef}from 'react';
// import Draggable, { DraggableData,DraggableEventHandler, DraggableEvent, DraggableProps } from 'react-draggable';
// import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
// import './corrector-canvas.css';

// interface Props {
//     coordinates : any;
//     resolution : any;
//     image:any
// }

// // interface DragProps {
// //     // onStop:(a:any, b:any) => DraggableProps
// //     onStop: DraggableEventHandler,
// // }
// // type finalProps = Props & DragProps

// const CorrectorCanvas = (props:Props,onStop: DraggableEventHandler) => {
//     console.log("fprops", props)
    
//    const canvas = useRef<HTMLCanvasElement | null>(null);
//    let ctx:any = null;

    // const drawRect = (info:any, style = {}) => {
    //   const { x, y, w, h } = info;
    //   const { borderColor = 'yellow', borderWidth = 1 }:any = style;
   
    //   ctx.beginPath();
    //   ctx.strokeStyle = borderColor;
    //   ctx.lineWidth = borderWidth;
    //   ctx.rect(x, y, w, h);
    //   ctx.stroke();
    // }
   

  
//   console.log("ctx", ctx)
// //   const boxes = [
// //     { x: 200, y: 220, w: 100, h: 50 },
   
// //   ] 
//   let boxes = [{ x:props.coordinates[0], y:props.coordinates[1], w: props.resolution[1], h: props.resolution[0] }];
//   let isDown = false;
//   let dragTarget = null;
//   let startX = null;
//   let startY = null;

//   // initialize the canvas context
//   useEffect(() => {
//     // dynamically assign the width and height to canvas
//     const canvasEle = canvas.current;
//     // canvasEle.width = canvasEle.clientWidth;
//     // canvasEle.height = canvasEle.clientHeight;

//     // get context of the canvas
//     ctx = canvasEle.getContext("2d");
//     console.log("useEffect ctx", ctx)
//   }, []);

//   useEffect(() => {
//     draw();
//   }, []);

//   // draw rectangle
//   const draw = () => {
//     console.log(boxes,"boxes", canvas.current.clientWidth, canvas.current.clientHeight)
//     ctx.clearRect(0, 0, canvas.current.clientWidth, canvas.current.clientHeight);
//     boxes.map(info => drawRect(info));
//   }

//   // draw rectangle with background
//   // const drawFillRect = (info, style = {}) => {
//   //   const { x, y, w, h } = info;
//   //   const { backgroundColor = 'black' } = style;

//   //   ctx.beginPath();
//   //   ctx.fillStyle = backgroundColor;
//   //   ctx.fillRect(ctx.width, ctx.height, w, h);
//   // }

//   // identify the click event in the rectangle
//   const hitBox = (x, y) => {
//     console.log("x, y", x,y)
//     let isTarget = null;
//     for (let i = 0; i < boxes.length; i++) {
//       const box = boxes[i];
//       console.log(x,y," x box", box)
//       if (x >= box.x && x <= box.x + box.w && y >= box.y && y <= box.y + box.h) {
//         console.log("inside")
//         dragTarget = box;
//         isTarget = true;
//         break;
//       }
//     }
//     return isTarget;
//   }

//   const handleMouseDown = e => {
//     console.log("handleMouseDown", e)
//     startX = parseInt(e.nativeEvent.offsetX - canvas.current.clientLeft);
//     startY = parseInt(e.nativeEvent.offsetY - canvas.current.clientTop);
//     console.log("startX", startX, startY);
//     isDown = hitBox(startX, startY);
//   }
//   const handleMouseMove = e => {
//     console.log("mouse move",e)
//     if (!isDown) return;

//     const mouseX = parseInt(e.nativeEvent.offsetX - canvas.current.clientLeft);
//     const mouseY = parseInt(e.nativeEvent.offsetY - canvas.current.clientTop);
//     const dx = mouseX - startX;
//     const dy = mouseY - startY;
//     startX = mouseX;
//     startY = mouseY;
//     dragTarget.x += dx;
//     dragTarget.y += dy;
//     draw();
//   }
//   const handleMouseUp = e => {
//     console.log("mouse up", e)
//     dragTarget = null;
//     isDown = false;
//   }
//   const handleMouseOut = e => {
//     console.log("mouse out")
//     handleMouseUp(e);
//   }
//   const initial = { x: 0, y: 0 }
//   const [pos, setPos] = useState(initial);
//   const final={ x: 50, y: 50 }

// function _onStop(e: DraggableEvent, data: DraggableData){
//     setPos(final)
//     console.log("onStop",onStop(e,data));
//     onStop?.(e, data)
// }

//   return (
//     <div className='cans'>  
//     {/* <Draggable 
//         position={pos}
//         onStop={_onStop}       
//     >    */}
//       <TransformWrapper panning={{disabled:true}}>
//       <TransformComponent >

//       <canvas 
        // style={{backgroundImage: `url(${props.image})`,  backgroundPosition: 'center',
        // backgroundSize: 'cover',
        // backgroundRepeat: 'no-repeat'}}
//         onMouseDown={handleMouseDown}
//         onMouseMove={handleMouseMove}
//         onMouseUp={handleMouseUp}
//         onMouseOut={handleMouseOut}
//         ref={canvas}
//         >
//         </canvas>
//         </TransformComponent>
//         </TransformWrapper>
//         {/* </Draggable> */}
//     </div>
//   );
// }

// export default CorrectorCanvas;

import React, { useRef, useEffect, useState } from 'react';
// import { render } from 'react-dom';
// import './style.css'
import './corrector-canvas.css';

interface Props {
    coordinates : any;
    resolution : any;
    image:any
    classStyle:any
}

const CorrectorCanvas = (props:Props) =>{
  console.log("props", props)
  const canvas = useRef<HTMLCanvasElement | null >(null);
  let ctx = null;
  let boxes = [
    { x: props?.coordinates[0], y: props?.coordinates[1], w: props?.resolution[0], h: props?.resolution[1] },
   
  ]
  let isDown = false;
  let dragTarget = null;
  let startX = null;
  let startY = null;

  // initialize the canvas context
  useEffect(() => {
    // dynamically assign the width and height to canvas
    const canvasEle = canvas.current;
    canvasEle.width = canvasEle.clientWidth;
    canvasEle.height = canvasEle.clientHeight;

    // get context of the canvas
    ctx = canvasEle.getContext("2d");
  }, []);

  useEffect(() => {
    draw();
  }, []);

  // draw rectangle
  const draw = () => {
    ctx.clearRect(0, 0, canvas.current.clientWidth, canvas.current.clientHeight);
    boxes.map(info => drawRect(info));
  }

  // draw rectangle with background
  const drawFillRect = (info, style = {}) => {
    const { x, y, w, h } = info;
    const { backgroundColor = 'yellow' } = style;

    ctx.beginPath();
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(x, y, w, h);
  }

  const drawRect = (info:any, style = {}) => {
    const { x, y, w, h } = info;
    console.log("drawRect",x,y,w,h)
    const { borderColor = 'yellow', borderWidth = 1 }:any = style;
 
    ctx.beginPath();
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.rect(x, y, w, h);
    ctx.stroke();
  }
  // identify the click event in the rectangle
  const hitBox = (x, y) => {
    console.log("x,y",x, y)
    // setBoxDemo()
    let isTarget = null;
    for (let i = 0; i < boxes.length; i++) {
      let box = boxes[i];
      if (x >= box.x && x <= box.x + box.w && y >= box.y && y <= box.y + box.h) {
        dragTarget = box;
        isTarget = true;
        break;
      }
    }
    return isTarget;
  }

  const handleMouseDown = e => {
    console.log("aaa", e)
    startX = parseInt(e.nativeEvent.offsetX - canvas.current.clientLeft);
    startY = parseInt(e.nativeEvent.offsetY - canvas.current.clientTop);
    isDown = hitBox(startX, startY);
  }
  const handleMouseMove = e => {
    console.log("mouse move",e)
    if (!isDown) return;

    const mouseX = parseInt(e.nativeEvent.offsetX - canvas.current.clientLeft);
    const mouseY = parseInt(e.nativeEvent.offsetY - canvas.current.clientTop);
    const dx = mouseX - startX;
    const dy = mouseY - startY;
    startX = mouseX;
    startY = mouseY;
    dragTarget.x += dx;
    dragTarget.y += dy;
    draw();
  }
  const handleMouseUp = e => {
    console.log("mouse up", e)
    dragTarget = null;
    isDown = false;
  }
  const handleMouseOut = e => {
    console.log("mouse out")
    handleMouseUp(e);
  }

  return (
    <div className={props.classStyle}>
      <canvas        
        style={{backgroundImage: `url(${props.image})`,  backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat', height:'200px'}}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseOut}
        ref={canvas}>          
      </canvas>
    </div>
  );
}

export default CorrectorCanvas;


//resize code

// import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';

// const CorrectorCanvas = (props:any) => {
//   const [width, setWidth] = useState(0);
//   const [height, setHeight] = useState(0);
//   const pixelRatio = window.devicePixelRatio;
//   const ref = useRef(null);
//   const canvas = useRef(null);

//   // responsive width and height
//   useEffect(() => {
//     setWidth(ref.current.clientWidth);
//     setHeight(ref.current.clientHeight > 400 ? ref.current.clientHeight : 400);
//   }, []);

//   useLayoutEffect(() => {
//     const context = canvas.current.getContext('2d');

//     // some canvas stuff..
//     context.beginPath()
//     context.moveTo(0,height/2)
//     context.lineTo(width, height/2)
//     context.stroke()
//   }, [width, height]);

//   const displayWidth = Math.floor(pixelRatio * width);
//   const displayHeight = Math.floor(pixelRatio * height);
//   const style = { width, height };

// return (
//     <div style={{ width: '100%', height: '100%' }} ref={ref}>
//       <canvas
//         ref={canvas}
//         width={displayWidth}
//         height={displayHeight}
//         style={style}
//       />
//     </div>
//   );
// };

// export default CorrectorCanvas;