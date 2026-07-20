import React, { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface ImageUploadProps {
  value: string;
  onChange: (urlOrBase64: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (isSupabaseConfigured()) {
        try {
          setIsUploading(true);
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError, data } = await supabase.storage
            .from('images')
            .upload(filePath, file);

          if (uploadError) {
            console.error('Error uploading image:', uploadError);
            // Fallback to base64 if bucket doesn't exist or error
            readAsBase64(file);
          } else {
            const { data: { publicUrl } } = supabase.storage
              .from('images')
              .getPublicUrl(filePath);
            onChange(publicUrl);
          }
        } catch (error) {
          console.error(error);
          readAsBase64(file);
        } finally {
          setIsUploading(false);
        }
      } else {
        readAsBase64(file);
      }
    }
  };

  const readAsBase64 = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full">
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-stone-50/50 flex items-center justify-center p-1.5 min-h-[160px] max-h-96 w-full">
          <img src={value} alt="Preview" className="max-w-full max-h-80 w-auto h-auto object-contain rounded-lg shadow-sm" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-3 right-3 bg-black/60 text-white p-1.5 rounded-full hover:bg-black/80 transition-all shadow-md"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div 
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`w-full h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#C5A059] hover:bg-[#C5A059]/5'}`}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 text-[#C5A059] mb-2 animate-spin" />
              <span className="text-sm text-gray-500">กำลังอัปโหลด...</span>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">คลิกเพื่ออัปโหลดรูปภาพ</span>
            </>
          )}
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
