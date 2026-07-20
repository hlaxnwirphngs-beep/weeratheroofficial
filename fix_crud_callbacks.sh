cat << 'INNER_EOF' > src/components/admin/GenericCRUD.tsx
import { Plus, Search, Edit, Trash2, X } from 'lucide-react';
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
    if (onDelete) {
      onDelete(row);
    }
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

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-[#FDFBF7]">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-bold text-[#1B3022] uppercase tracking-wider"
                  >
                    {col.label}
                  </th>
                ))}
                <th scope="col" className="relative px-6 py-4">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredData.map((row, i) => (
                <tr key={row.id || i} className="hover:bg-gray-50/50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-[#2C2C2C]">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
                {renderForm ? renderForm(formData, setFormData) : columns.map(col => (
                  <div key={col.key}>
                    <label className="block text-sm font-medium text-[#1B3022] mb-1">{col.label}</label>
                    <input 
                      type="text" 
                      required
                      value={formData[col.key] || ''}
                      onChange={e => setFormData({...formData, [col.key]: e.target.value})}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 bg-white"
                    />
                  </div>
                ))}
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
                className="px-6 py-2.5 rounded-full text-sm font-bold bg-[#1B3022] text-white hover:bg-stone-800 transition-colors shadow-md"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
INNER_EOF
