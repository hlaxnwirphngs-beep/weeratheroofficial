import { Plus, Search, Edit, Trash2, X, Loader2, Calendar, Clock } from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface Column {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
}

interface GenericCRUDProps {
  title: string;
  description: string;
  columns: Column[];
  data: any[];
  onAdd?: () => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onSave?: (data: any) => void;
  renderForm?: (formData: any, setFormData: (data: any) => void) => React.ReactNode;
}

export default function GenericCRUD({
  title,
  description,
  columns,
  data,
  onAdd,
  onEdit,
  onDelete,
  onSave,
  renderForm,
}: GenericCRUDProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  const [rowToDelete, setRowToDelete] = useState<any>(null);

  const handleAddClick = () => {
    if (onAdd) {
      onAdd();
    } else {
      setEditingRow(null);
      setFormData({});
      setIsModalOpen(true);
    }
  };

  const handleEditClick = (row: any) => {
    if (onEdit) {
      onEdit(row);
    } else {
      setEditingRow(row);
      setFormData({ ...row });
      setIsModalOpen(true);
    }
  };

  const handleDeleteClick = (row: any) => {
    setRowToDelete(row);
  };

  const handleConfirmDelete = () => {
    if (onDelete && rowToDelete) {
      onDelete(rowToDelete);
    }
    setRowToDelete(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave({ ...formData, id: editingRow?.id || Date.now() });
    }
    setIsModalOpen(false);
  };

  const filteredData = data.filter(row => 
    columns.some(col => 
      String(row[col.key] || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="flex flex-col h-full space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif text-[#1B3022] font-bold">{title}</h2>
          <p className="text-sm text-black/50 mt-1">{description}</p>
        </div>
        {(onAdd || onSave) && (
          <button
            onClick={handleAddClick}
            className="flex items-center px-4 py-2.5 bg-[#1B3022] text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-colors shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            เพิ่มข้อมูล
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl luxury-shadow border border-gray-50 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-[#FDFBF7]">
          <div className="relative w-full max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-[#8B7355]" />
            </div>
            <input
              type="text"
              placeholder="ค้นหา..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-[#C5A059] focus:border-[#C5A059] bg-white transition-colors"
            />
          </div>
        </div>

        {/* Mobile View: Clean layout with card cards so details can be seen clearly without scroll on mobile */}
        <div className="block md:hidden divide-y divide-gray-100">
          {filteredData.map((row, i) => (
            <div key={row.id || i} className="p-5 hover:bg-gray-50/30 transition-colors relative">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold text-[#8B7355] bg-stone-100 px-2.5 py-1 rounded-full">รายการที่ {i + 1}</span>
                <div className="flex gap-2.5">
                  {(onEdit || onSave) && (
                    <button
                      onClick={() => handleEditClick(row)}
                      className="p-1.5 bg-stone-50 hover:bg-stone-100 rounded-lg text-[#8B7355] transition-all border border-stone-200/50"
                      title="แก้ไข"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => handleDeleteClick(row)}
                      className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg text-red-500 transition-all border border-red-100/50"
                      title="ลบ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-3 pt-1">
                {columns.map((col) => (
                  <div key={col.key} className="grid grid-cols-3 gap-2 text-xs">
                    <span className="font-semibold text-[#1B3022] col-span-1">{col.label}</span>
                    <div className="text-[#2C2C2C] col-span-2 break-words">
                      {col.render ? col.render(row) : row[col.key]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {filteredData.length === 0 && (
            <div className="px-6 py-12 text-center text-black/50 text-sm">
              ไม่พบข้อมูล
            </div>
          )}
        </div>

        {/* Desktop View: Full descriptive table with elegant columns */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full divide-y divide-gray-100">
            <thead className="bg-[#FDFBF7]">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className="px-4 py-3.5 text-left text-xs font-bold text-[#1B3022] uppercase tracking-wider"
                  >
                    {col.label}
                  </th>
                ))}
                <th scope="col" className="relative px-4 py-3.5 w-24">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredData.map((row, i) => (
                <tr key={row.id || i} className="hover:bg-gray-50/50 transition-colors">
                  {columns.map((col) => {
                    const isShortText = ['image', 'status', 'date', 'time', 'year', 'role', 'id'].includes(col.key.toLowerCase());
                    return (
                      <td 
                        key={col.key} 
                        className={`px-4 py-4 text-sm text-[#2C2C2C] align-middle ${
                          isShortText 
                            ? 'whitespace-nowrap' 
                            : 'whitespace-normal break-words max-w-xs md:max-w-md'
                        }`}
                      >
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    );
                  })}
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium align-middle">
                    <div className="flex justify-end gap-3">
                      {(onEdit || onSave) && (
                        <button
                          onClick={() => handleEditClick(row)}
                          className="text-[#8B7355] hover:text-[#C5A059] transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => handleDeleteClick(row)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-black/50 text-sm">
                    ไม่พบข้อมูล
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg luxury-shadow overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-[#FDFBF7]">
              <h3 className="text-xl font-bold text-[#1B3022]">
                {editingRow ? 'แก้ไขข้อมูล' : 'เพิ่มข้อมูล'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="crud-form" onSubmit={handleSave} className="space-y-4">
                {renderForm ? renderForm(formData, setFormData) : columns.map(col => {
                  let inputType = 'text';
                  const lowerKey = col.key.toLowerCase();
                  if (lowerKey.includes('date')) {
                    inputType = 'date';
                  } else if (lowerKey.includes('time')) {
                    inputType = 'time';
                  }

                  if (inputType === 'date') {
                    return (
                      <div key={col.key} className="bg-stone-50/50 p-3 rounded-xl border border-stone-200/60 space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#1B3022] flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                          {col.label}
                        </label>
                        <div className="relative">
                          <input 
                            type="date" 
                            required
                            value={formData[col.key] || ''}
                            onChange={e => setFormData({...formData, [col.key]: e.target.value})}
                            className="w-full px-3 py-2 pl-9 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 bg-white text-stone-800 text-sm font-medium"
                          />
                          <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              const d = new Date();
                              const y = d.getFullYear();
                              const m = String(d.getMonth() + 1).padStart(2, '0');
                              const date = String(d.getDate()).padStart(2, '0');
                              setFormData({...formData, [col.key]: `${y}-${m}-${date}`});
                            }}
                            className="px-2 py-1 rounded-md text-[10px] font-bold bg-[#C5A059]/10 text-[#8B7355] border border-[#C5A059]/20 hover:bg-[#C5A059]/20 transition-all cursor-pointer"
                          >
                            📅 วันนี้
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const d = new Date();
                              d.setDate(d.getDate() + 1);
                              const y = d.getFullYear();
                              const m = String(d.getMonth() + 1).padStart(2, '0');
                              const date = String(d.getDate()).padStart(2, '0');
                              setFormData({...formData, [col.key]: `${y}-${m}-${date}`});
                            }}
                            className="px-2 py-1 rounded-md text-[10px] font-bold bg-[#8B7355]/10 text-[#8B7355] border border-[#8B7355]/20 hover:bg-[#8B7355]/20 transition-all cursor-pointer"
                          >
                            📅 พรุ่งนี้
                          </button>
                        </div>
                      </div>
                    );
                  }

                  if (inputType === 'time') {
                    const presets = ['07:00', '09:00', '13:00', '18:00'];
                    return (
                      <div key={col.key} className="bg-stone-50/50 p-3 rounded-xl border border-stone-200/60 space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#1B3022] flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                          {col.label}
                        </label>
                        <div className="relative">
                          <input 
                            type="time" 
                            required
                            value={formData[col.key] || ''}
                            onChange={e => setFormData({...formData, [col.key]: e.target.value})}
                            className="w-full px-3 py-2 pl-9 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 bg-white text-stone-800 text-sm font-medium"
                          />
                          <Clock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-0.5 items-center">
                          <span className="text-[10px] text-stone-400">ปุ่มลัดเวลา:</span>
                          {presets.map(timeStr => (
                            <button
                              key={timeStr}
                              type="button"
                              onClick={() => setFormData({...formData, [col.key]: timeStr})}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-all cursor-pointer ${
                                formData[col.key] === timeStr
                                  ? 'bg-[#1B3022] text-white border-[#1B3022] shadow-xs'
                                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                              }`}
                            >
                              {timeStr} น.
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={col.key}>
                      <label className="block text-sm font-medium text-[#1B3022] mb-1">{col.label}</label>
                      <input 
                        type={inputType} 
                        required
                        value={formData[col.key] || ''}
                        onChange={e => setFormData({...formData, [col.key]: e.target.value})}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 bg-white text-stone-800"
                      />
                    </div>
                  );
                })}
              </form>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 rounded-full text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                ยกเลิก
              </button>
              <button 
                type="submit" 
                form="crud-form"
                disabled={!!formData?.isUploading}
                className="px-6 py-2.5 rounded-full text-sm font-bold bg-[#1B3022] text-white hover:bg-stone-800 transition-colors shadow-md disabled:bg-stone-300 disabled:text-stone-500 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {formData?.isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    กำลังอัปโหลดรูปภาพ...
                  </>
                ) : (
                  'บันทึก'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {rowToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md luxury-shadow p-6">
            <h3 className="text-lg font-bold text-[#1B3022] mb-2">ยืนยันการลบข้อมูล</h3>
            <p className="text-sm text-stone-600 mb-6">
              คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setRowToDelete(null)}
                className="px-5 py-2.5 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-full text-xs font-bold bg-red-600 text-white hover:bg-red-700 transition-colors shadow-md animate-pulse"
              >
                ยืนยันการลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
