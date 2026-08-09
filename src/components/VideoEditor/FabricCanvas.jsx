import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { Maximize, MousePointer2, Layers, Crop } from 'lucide-react';

export const FabricCanvas = ({ state, onStateUpdate }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const fabricCanvas = useRef(null);
  const [activeLayer, setActiveLayer] = useState(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // Initialize Fabric Canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      backgroundColor: '#050505',
    });

    fabricCanvas.current = canvas;

    // Event listeners for state updates
    const handleEvents = () => {
      const layers = canvas.getObjects().map((obj) => ({
        id: obj.id || Math.random().toString(36).substr(2, 9),
        type: obj.type,
        x: Math.round(obj.left || 0),
        y: Math.round(obj.top || 0),
        zIndex: canvas.getObjects().indexOf(obj),
        scale: obj.scaleX || 1,
        opacity: obj.opacity || 1,
        text: obj.text,
        width: obj.width,
        height: obj.height,
        rotation: obj.angle
      }));

      onStateUpdate({
        ...state,
        layers,
        canvasWidth: canvas.getWidth(),
        canvasHeight: canvas.getHeight(),
      });
    };

    canvas.on('object:modified', handleEvents);
    canvas.on('object:added', handleEvents);
    canvas.on('selection:created', (e) => setActiveLayer(e.selected?.[0]?.id));
    canvas.on('selection:cleared', () => setActiveLayer(null));

    // Cleanup
    return () => {
      canvas.dispose();
    };
  }, []);

  // Sync state to canvas (simplified for demo)
  const addTextLayer = () => {
    if (!fabricCanvas.current) return;
    const text = new fabric.IText('NEW LAYER', {
      left: 100,
      top: 100,
      fontFamily: 'Inter',
      fill: '#A855F7',
      fontSize: 40,
    });
    text.id = `text_${Date.now()}`;
    fabricCanvas.current.add(text);
    fabricCanvas.current.setActiveObject(text);
  };

  const addSmartWatermark = () => {
    if (!fabricCanvas.current) return;
    const canvas = fabricCanvas.current;
    const text = new fabric.IText('© ATLAS CORE', {
      left: canvas.getWidth() - 150,
      top: canvas.getHeight() - 40,
      fontSize: 14,
      fill: 'rgba(168, 85, 247, 0.4)',
      fontFamily: 'JetBrains Mono',
      selectable: false
    });
    text.id = 'watermark';
    canvas.add(text);
  };

  const applyAutoCrop = () => {
    if (!fabricCanvas.current) return;
    const canvas = fabricCanvas.current;
    const width = canvas.getWidth();
    const height = canvas.getHeight();
    
    // Auto-center all layers for 9:16 portrait focus
    canvas.getObjects().forEach((obj) => {
      obj.set({
        left: width / 2 - (obj.width * obj.scaleX) / 2,
        top: height / 2 - (obj.height * obj.scaleY) / 2
      });
      obj.setCoords();
    });
    canvas.renderAll();
  };

  return (
    <div className="flex-1 relative bg-[#0F0F0F] overflow-hidden flex flex-col">
      {/* Canvas Header/Rulers Area */}
      <div className="h-8 border-b border-purple-500/10 flex items-center px-4 justify-between bg-black text-[10px] text-purple-400 font-mono">
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-1">
            <Maximize size={12} />
            <span>{state.canvasWidth}x{state.canvasHeight}</span>
          </div>
          <div className="flex items-center gap-1">
            <Crop size={12} />
            <span>Ratio: {state.resolution}</span>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={applyAutoCrop} className="hover:text-purple-300 transition-colors flex items-center gap-1">
            <Crop size={10} /> Auto-Crop
          </button>
          <button onClick={addSmartWatermark} className="hover:text-purple-300 transition-colors">Watermark</button>
          <button onClick={addTextLayer} className="hover:text-purple-300 transition-colors">Add Text</button>
          <span>Grid: ON</span>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar */}
        <div className="w-12 border-r border-purple-500/10 flex flex-col items-center py-4 gap-4 bg-black">
          <button title="Select" className="p-2 bg-purple-500/20 text-purple-400 rounded-lg border border-purple-500/40">
            <MousePointer2 size={18} />
          </button>
          <button title="Layers" className="p-2 text-purple-400/50 hover:text-purple-400 transition-colors">
            <Layers size={18} />
          </button>
        </div>

        {/* Canvas Area */}
        <div ref={containerRef} className="flex-1 relative flex items-center justify-center p-8 bg-[#050505] pattern-dots">
          <div className="shadow-[0_0_100px_rgba(168,85,247,0.1)] border border-purple-500/20">
            <canvas ref={canvasRef} />
          </div>
          
          {/* Coordinate Overlays (Visual Aid) */}
          <div className="absolute top-0 left-12 right-0 h-4 flex pointer-events-none">
             {[...Array(20)].map((_, i) => (
               <div key={i} className="flex-1 border-l border-purple-500/10 text-[8px] text-purple-500/30 pl-1">{i * 100}</div>
             ))}
          </div>
          <div className="absolute top-8 bottom-0 left-12 w-4 flex flex-col pointer-events-none">
             {[...Array(20)].map((_, i) => (
               <div key={i} className="flex-1 border-t border-purple-500/10 text-[8px] text-purple-500/30 pt-1">{i * 100}</div>
             ))}
          </div>
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="h-6 border-t border-purple-500/10 flex items-center px-4 bg-black text-[9px] text-purple-600 font-mono gap-4 uppercase tracking-tighter">
        <span>Cursor: (X:0, Y:0)</span>
        <span>Active Layer: {activeLayer || 'Null'}</span>
        <span className="ml-auto">Atlas Engine Stable</span>
      </div>
    </div>
  );
};
