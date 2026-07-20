import React, { useRef, useState, useEffect } from 'react';
import { X, Plus, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface MultiImageUploadProps {
  values: string[];
  onChange: (urlsOrBase64s: string[]) => void;
  onUploadingStateChange?: (isUploading: boolean) => void;
}

interface UploadTask {
  id: string;
  name: string;
  progress: number;
  preview: string;
  file?: File;
  finalUrl?: string;
}

export default function MultiImageUpload({ values = [], onChange, onUploadingStateChange }: MultiImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingItems, setUploadingItems] = useState<UploadTask[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (uploadingItems.length === 0 || isProcessing) return;

    const allFinished = uploadingItems.every(item => item.progress >= 100 && (item.finalUrl || !isSupabaseConfigured()));

    if (allFinished) {
      setIsProcessing(true);
      const timer = setTimeout(() => {
        const newUrls = uploadingItems.map(item => item.finalUrl || item.preview);
        onChange([...values, ...newUrls]);
        setUploadingItems([]);
        setIsProcessing(false);
        onUploadingStateChange?.(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [uploadingItems, values, onChange, onUploadingStateChange, isProcessing]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUploadingStateChange?.(true);

      const fileList = Array.from(files);
      const newTasks: UploadTask[] = fileList.map((file: File) => ({
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        progress: 1,
        preview: URL.createObjectURL(file),
        file,
      }));

      setUploadingItems(newTasks);

      newTasks.forEach(task => {
        uploadFile(task);
      });
    }
  };

  const uploadFile = async (task: UploadTask) => {
    if (isSupabaseConfigured() && task.file) {
      try {
        const fileExt = task.file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        // Simulate progress while uploading
        const interval = setInterval(() => {
          setUploadingItems(prev => prev.map(item => {
            if (item.id === task.id && item.progress < 90) {
              return { ...item, progress: item.progress + 10 };
            }
            return item;
          }));
        }, 200);

        const { error, data } = await supabase.storage
          .from('images')
          .upload(filePath, task.file);

        clearInterval(interval);

        if (error) {
          console.error('Error uploading image:', error);
          await convertToBase64(task);
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(filePath);
          
          setUploadingItems(prev => prev.map(item => 
            item.id === task.id ? { ...item, progress: 100, finalUrl: publicUrl } : item
          ));
        }
      } catch (error) {
        console.error(error);
        await convertToBase64(task);
      }
    } else {
      await convertToBase64(task);
    }
  };

  const convertToBase64 = (task: UploadTask) => {
    return new Promise<void>((resolve) => {
      if (!task.file) {
        setUploadingItems(prev => prev.map(item => item.id === task.id ? { ...item, progress: 100 } : item));
        return resolve();
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadingItems(prev => prev.map(item => 
          item.id === task.id ? { ...item, progress: 100, preview: reader.result as string } : item
        ));
        resolve();
      };
      reader.readAsDataURL(task.file);
    });
  };

  const removeImage = (indexToRemove: number) => {
    onChange(values.filter((_, idx) => idx !== indexToRemove));
  };

  const isUploading = uploadingItems.length > 0;

  return (
    <div className="w-full space-y-4">
      {/* Grid of images */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {/* Existing Images */}
        {values.map((url, index) => (
          <div key={index} className="relative rounded-2xl overflow-hidden border border-stone-200 aspect-square group bg-stone-50 shadow-sm hover:shadow-md transition-shadow">
            <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <button
              type="button"
              disabled={isUploading}
              onClick={() => removeImage(index)}
              className="absolute top-2.5 right-2.5 bg-black/50 hover:bg-red-600 text-white p-1.5 rounded-full hover:scale-105 transition-all shadow-md z-10 disabled:opacity-50 disabled:cursor-not-allowed"
              title="ลบรูปภาพ"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-2.5 left-3 text-white text-[11px] font-semibold bg-black/35 px-2 py-0.5 rounded-lg backdrop-blur-sm">
              รูปที่ {index + 1}
            </div>
          </div>
        ))}

        {/* Uploading Items */}
        {uploadingItems.map((item) => (
          <div key={item.id} className="relative rounded-2xl overflow-hidden border border-stone-200 aspect-square bg-stone-50 shadow-sm flex flex-col justify-center items-center p-2">
            {item.preview && (
              <img src={item.preview} alt={item.name} className="absolute inset-0 w-full h-full object-cover filter blur-[0.5px]" referrerPolicy="no-referrer" />
            )}
            <div className="absolute inset-0 bg-stone-900/70 flex flex-col items-center justify-center p-3 text-center z-10 backdrop-blur-[1px]">
              {item.progress < 100 ? (
                <>
                  <Loader2 className="w-8 h-8 text-accent-gold animate-spin mb-2" />
                  <span className="text-white text-xs font-bold font-mono">{item.progress}%</span>
                  <span className="text-white/70 text-[9px] mt-1 truncate max-w-[120px] font-medium">{item.name}</span>
                  {/* Progress Bar Container */}
                  <div className="w-20 h-1.5 bg-white/20 rounded-full mt-2.5 overflow-hidden">
                    <motion.div 
                      className="bg-accent-gold h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress}%` }}
                      transition={{ duration: 0.15 }}
                    />
                  </div>
                </>
              ) : (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center"
                >
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-1" />
                  <span className="text-emerald-400 text-xs font-bold">สำเร็จ</span>
                </motion.div>
              )}
            </div>
          </div>
        ))}

        {/* Upload Button */}
        <div 
          onClick={() => {
            if (!isUploading) {
              fileInputRef.current?.click();
            }
          }}
          className={`aspect-square border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all text-center p-4 bg-white group ${
            isUploading 
              ? 'border-stone-200 bg-stone-50/50 cursor-not-allowed opacity-50' 
              : 'border-stone-300 hover:border-accent-gold hover:bg-accent-gold/5'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center mb-2 group-hover:bg-accent-gold/10 group-hover:border-accent-gold/20 transition-all">
            <Plus className="w-5 h-5 text-stone-500 group-hover:text-accent-gold transition-colors" />
          </div>
          <span className="text-xs font-bold text-stone-700 group-hover:text-accent-deep transition-colors">เพิ่มรูปภาพ</span>
          <span className="text-[10px] text-stone-400 mt-1">คลิกเพื่อเลือกหลายไฟล์</span>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        disabled={isUploading}
        className="hidden"
      />
    </div>
  );
}
