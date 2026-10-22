import React, { useState, useRef } from 'react';
import { 
  Camera, 
  PenTool, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  FileCheck, 
  Upload, 
  ShieldCheck, 
  Sliders
} from 'lucide-react';
import { resizeGovImage } from '../api/client';

export default function GovDocStudio() {
  const [selectedPreset, setSelectedPreset] = useState('ssc_nic_photo');
  const [previewOriginal, setPreviewOriginal] = useState(null);
  const [previewResized, setPreviewResized] = useState(null);
  const [downloadBlob, setDownloadBlob] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);

  const presets = [
    {
      id: 'ssc_nic_photo',
      title: 'SSC / NIC Passport Photo',
      specs: '200 x 230 px • 20 to 50 KB',
      icon: Camera,
      tag: 'NIC / SSC / Central'
    },
    {
      id: 'ssc_nic_signature',
      title: 'SSC / NIC Signature',
      specs: '140 x 60 px • 10 to 20 KB',
      icon: PenTool,
      tag: 'NIC / SSC'
    },
    {
      id: 'ibps_banking_photo',
      title: 'IBPS SO IT Photo',
      specs: '200 x 230 px • 20 to 50 KB',
      icon: Camera,
      tag: 'Public Sector Banks'
    },
    {
      id: 'ibps_banking_signature',
      title: 'IBPS Signature',
      specs: '140 x 60 px • 10 to 20 KB',
      icon: PenTool,
      tag: 'IBPS Banks'
    },
    {
      id: 'state_psc_photo',
      title: 'State PSC Photo',
      specs: '300 x 350 px • 20 to 100 KB',
      icon: Camera,
      tag: 'State PSCs'
    }
  ];

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProcessing(true);
    setError(null);
    setPreviewOriginal(URL.createObjectURL(file));

    try {
      const { blob, headers } = await resizeGovImage(file, selectedPreset);
      setDownloadBlob(blob);
      setPreviewResized(URL.createObjectURL(blob));
      setMetadata(headers);
    } catch (err) {
      setError(err.message || 'Image processing failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!downloadBlob) return;
    const url = URL.createObjectURL(downloadBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gov_compliant_${selectedPreset}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-white border-2 border-[#1c1f33] p-6 shadow-[4px_4px_0px_0px_#1c1f33] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 bg-[#fbf9f5] border-1.5 border-[#1c1f33] flex items-center justify-center text-[#1c1f33] shrink-0" style={{ border: '1.5px solid #1c1f33' }}>
            <Camera className="w-6 h-6 text-[#065f46]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-title font-bold text-[#1c1f33] tracking-tight flex items-center space-x-2">
              <span>GovDoc Studio: Document Attestation & Resizer</span>
              <span className="gazette-stamp border-[#065f46] text-[#065f46] bg-[#ecfdf5]">
                Bureau Compliant
              </span>
            </h2>
            <p className="text-xs font-serif italic text-[#383e5c]">
              Eliminate portal upload rejection: Compress photos & signatures to exact NIC, SSC, and IBPS 20–50 KB limits.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-sans font-bold uppercase text-[#065f46] bg-[#ecfdf5] px-3 py-1.5 border border-[#065f46] shrink-0">
          <ShieldCheck className="w-4 h-4" />
          <span>Guaranteed Server Compliance</span>
        </div>
      </div>

      {/* Main Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Choose Target Government Spec */}
        <div className="space-y-3">
          <h3 className="text-xs font-sans font-extrabold uppercase tracking-wider text-[#1c1f33] flex items-center space-x-1.5">
            <Sliders className="w-3.5 h-3.5" />
            <span>1. Select Government Portal Spec</span>
          </h3>

          <div className="space-y-2">
            {presets.map(p => {
              const Icon = p.icon;
              const isSelected = selectedPreset === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPreset(p.id)}
                  className={`p-3.5 border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#1c1f33] text-white border-[#1c1f33] shadow-[3px_3px_0px_0px_#1c1f33]'
                      : 'bg-white text-[#1c1f33] border-[#1c1f33]/40 hover:border-[#1c1f33] hover:bg-[#f9f7f1]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-sans font-extrabold flex items-center space-x-1.5">
                      <Icon className="w-3.5 h-3.5" />
                      <span>{p.title}</span>
                    </span>
                    <span className={`text-[9px] font-sans font-bold uppercase px-1.5 py-0.5 border ${
                      isSelected ? 'border-white text-white' : 'border-[#1c1f33] text-[#1c1f33]'
                    }`}>
                      {p.tag}
                    </span>
                  </div>
                  <p className={`text-[11px] font-mono ${isSelected ? 'text-slate-300' : 'text-[#686f8a]'}`}>
                    {p.specs}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center/Right: Dropzone & Resized Preview */}
        <div className="lg:col-span-2 bg-white border-2 border-[#1c1f33] p-6 shadow-[4px_4px_0px_0px_#1c1f33] space-y-5">
          <h3 className="text-xs font-sans font-extrabold uppercase tracking-wider text-[#1c1f33] flex items-center space-x-1.5">
            <Upload className="w-3.5 h-3.5" />
            <span>2. Upload File & Generate Output</span>
          </h3>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />

          {/* Upload Area */}
          {!previewResized ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-10 border-2 border-dashed border-[#1c1f33] bg-[#fbf9f5] cursor-pointer text-center space-y-3 hover:bg-[#f2eee3] transition-all"
            >
              <div className="w-12 h-12 border border-[#1c1f33] bg-white text-[#1c1f33] mx-auto flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-sans font-extrabold uppercase text-[#1c1f33]">
                  {processing ? 'Compressing to Strict Gov Specs...' : 'Click to Upload Photo or Signature'}
                </p>
                <p className="text-xs font-serif italic text-[#686f8a] mt-0.5">
                  Accepts JPG, PNG, WEBP of any resolution or megabyte size
                </p>
              </div>
              <span className="gazette-btn-ink inline-block px-4 py-1.5 text-xs">
                Select Local File
              </span>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                
                {/* Original */}
                <div className="p-3 bg-[#fbf9f5] border border-[#1c1f33] text-center">
                  <span className="text-[10px] font-sans font-extrabold text-[#686f8a] block mb-2 uppercase">Original Input</span>
                  <div className="w-full h-44 bg-white border border-[#1c1f33]/20 flex items-center justify-center overflow-hidden">
                    <img src={previewOriginal} alt="Original" className="max-h-full object-contain" />
                  </div>
                </div>

                {/* Resized Gov Spec Output */}
                <div className="p-3 bg-[#ecfdf5] border-2 border-[#065f46] text-center">
                  <span className="text-[10px] font-sans font-extrabold text-[#065f46] block mb-2 uppercase flex items-center justify-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Compliant Output (JPEG)</span>
                  </span>
                  <div className="w-full h-44 bg-white border border-[#065f46]/30 flex items-center justify-center overflow-hidden">
                    <img src={previewResized} alt="Resized" className="max-h-full object-contain" />
                  </div>
                </div>

              </div>

              {/* Compliance Metadata Box */}
              {metadata && (
                <div className="p-4 bg-[#ecfdf5] border-2 border-[#065f46] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-sans">
                  <div>
                    <div className="font-extrabold text-[#065f46] uppercase flex items-center space-x-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      <span>{metadata.presetName}: 100% Attestation Ready</span>
                    </div>
                    <p className="text-[#1c1f33] text-[11px] mt-0.5 font-mono">
                      Output Size: <strong>{metadata.sizeKb} KB</strong> • Dimensions: <strong>{metadata.dimensions}</strong>
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="gazette-btn-outline px-3 py-1.5 text-xs"
                    >
                      Change Image
                    </button>
                    <button
                      onClick={handleDownload}
                      className="gazette-btn-ink px-4 py-1.5 text-xs flex items-center space-x-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download JPG</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="p-3 bg-[#fef2f2] border-2 border-[#991b1b] text-xs font-sans text-[#991b1b] flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

      </div>

      {/* Pre-Flight Document Compliance Checklist */}
      <div className="bg-white border-2 border-[#1c1f33] p-6 shadow-[4px_4px_0px_0px_#1c1f33] space-y-4">
        <h3 className="text-sm font-title font-bold text-[#1c1f33] flex items-center space-x-2 uppercase">
          <FileCheck className="w-4 h-4 text-[#065f46]" />
          <span>Official Pre-Flight Attestation Checklist (Avoid Disqualification)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-serif">
          <div className="p-3.5 bg-[#fbf9f5] border border-[#1c1f33] space-y-1">
            <span className="font-sans font-extrabold text-[#1c1f33] uppercase text-[11px] block">1. Central Govt / NIC Photo Norms</span>
            <p className="text-[#383e5c] italic text-[12px]">
              Must possess a pure white or neutral background. Both ears and neck must be visible. Hats, spectacles, or heavy filters cause automatic AI rejection.
            </p>
          </div>

          <div className="p-3.5 bg-[#fbf9f5] border border-[#1c1f33] space-y-1">
            <span className="font-sans font-extrabold text-[#1c1f33] uppercase text-[11px] block">2. Signature Formatting</span>
            <p className="text-[#383e5c] italic text-[12px]">
              Execute on plain unruled white sheet with black or blue ballpoint ink. Do NOT sign in capitalized block characters.
            </p>
          </div>

          <div className="p-3.5 bg-[#fbf9f5] border border-[#1c1f33] space-y-1">
            <span className="font-sans font-extrabold text-[#1c1f33] uppercase text-[11px] block">3. 10th Standard Certificate (DOB Proof)</span>
            <p className="text-[#383e5c] italic text-[12px]">
              Your candidate full name and father's name entered on the recruitment portal must strictly match your 10th Class Matriculation mark sheet.
            </p>
          </div>

          <div className="p-3.5 bg-[#fbf9f5] border border-[#1c1f33] space-y-1">
            <span className="font-sans font-extrabold text-[#1c1f33] uppercase text-[11px] block">4. Category & EWS Certificate Validity</span>
            <p className="text-[#383e5c] italic text-[12px]">
              OBC-NCL and EWS reservation certificates must bear an issuance date on or after April 1st of the relevant financial cycle.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
