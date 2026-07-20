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

  // Compress image before uploading
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Max dimensions
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            
            // Convert back to File with 0.7 quality WebP for better compression
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
                    type: 'image/webp',
                  });
                  resolve(newFile);
                } else {
                  resolve(file); // Fallback to original
                }
              },
              'image/webp',
              0.7
            );
          } else {
            resolve(file);
          }
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const originalFile = e.target.files?.[0];
    if (originalFile) {
      try {
        setIsUploading(true);
        
        // Show local preview immediately using object URL while uploading
        const localPreviewUrl = URL.createObjectURL(originalFile);
        onChange(localPreviewUrl);

        // Compress the image
        const file = await compressImage(originalFile);

        if (isSupabaseConfigured()) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
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
        } else {
          readAsBase64(file);
        }
      } catch (error) {
        console.error(error);
        readAsBase64(originalFile);
      } finally {
        setIsUploading(false);
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
