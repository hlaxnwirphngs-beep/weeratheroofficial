import GenericCRUD from '../../components/admin/GenericCRUD';

export default function RolesManager() {
  const mockRoles = [
    { id: 1, name: 'Super Admin', permissions: 'เข้าถึงได้ทุกส่วน' },
    { id: 2, name: 'Admin', permissions: 'เข้าถึงได้เกือบทุกส่วน ยกเว้นการตั้งค่าขั้นสูง' },
    { id: 3, name: 'Editor', permissions: 'จัดการเนื้อหา ข่าวสาร และแกลเลอรี่' },
    { id: 4, name: 'Viewer', permissions: 'ดูข้อมูลหลังบ้านได้เท่านั้น' },
  ];

  const columns = [
    { key: 'name', label: 'ชื่อบทบาท (Role)' },
    { key: 'permissions', label: 'คำอธิบายสิทธิ์' },
  ];

  return (
    <GenericCRUD
      title="จัดการสิทธิ์ (Roles)"
      description="จัดการระดับสิทธิ์และนโยบาย RLS (Row Level Security)"
      columns={columns}
      data={mockRoles}
      onEdit={(row) => alert(`แก้ไขสิทธิ์: ${row.name}`)}
    />
  );
}
