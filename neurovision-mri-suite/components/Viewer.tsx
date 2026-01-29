
import React, { useRef, useEffect } from 'react';
import { ViewState } from '../types';

interface ViewerProps {
  imageUrl: string;
  viewState: ViewState;
  onUpdateViewState: (state: Partial<ViewState>) => void;
}

const Viewer: React.FC<ViewerProps> = ({ imageUrl, viewState, onUpdateViewState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    img.onload = () => {
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = canvas.parentElement?.clientHeight || 600;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      
      // Apply filters via context if needed, or simple CSS on the canvas
      // But for reactivity, we'll draw centered and scaled
      const scale = (canvas.height / img.height) * viewState.zoom;
      const x = (canvas.width / 2) - (img.width * scale / 2);
      const y = (canvas.height / 2) - (img.height * scale / 2);

      ctx.translate(canvas.width/2, canvas.height/2);
      ctx.rotate((viewState.rotation * Math.PI) / 180);
      ctx.translate(-canvas.width/2, -canvas.height/2);

      ctx.filter = `brightness(${viewState.brightness}%) contrast(${viewState.contrast}%) ${viewState.invert ? 'invert(100%)' : ''}`;
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      
      ctx.restore();
      
      // Overlay HUD
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.font = "12px 'JetBrains Mono'";
      ctx.fillText(`ZOOM: ${Math.round(viewState.zoom * 100)}%`, 20, 30);
      ctx.fillText(`BRIGHTNESS: ${viewState.brightness}%`, 20, 50);
      ctx.fillText(`CONTRAST: ${viewState.contrast}%`, 20, 70);
    };
  }, [imageUrl, viewState]);

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden border border-slate-700 rounded-lg shadow-2xl">
      <canvas ref={canvasRef} className="cursor-crosshair max-w-full max-h-full" />
      
      {/* HUD Overlays */}
      <div className="absolute top-4 right-4 text-xs font-mono text-cyan-400 space-y-1 pointer-events-none text-right">
        <div>NEUROVISION v2.5</div>
        <div>ACC: #99421-XB</div>
        <div>SCAN_DATE: 2024-10-12</div>
      </div>
      
      <div className="absolute bottom-4 left-4 text-[10px] font-mono text-slate-500 uppercase">
        Medical Imaging Preview • Not for Diagnostic Use
      </div>
    </div>
  );
};

export default Viewer;
