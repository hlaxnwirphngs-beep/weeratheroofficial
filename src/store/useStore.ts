import { create } from 'zustand';
import { persist, StateStorage, createJSONStorage } from 'zustand/middleware';
import { get, set, del } from 'idb-keyval';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

let isSupabaseInitialized = false;

// Custom storage object for IndexedDB
const idbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

export interface BaseEntity {
  id: number;
  [key: string]: any;
}


export interface StoreState {
  abbots: BaseEntity[];
  news: BaseEntity[];
  gallery: BaseEntity[];
  activities: BaseEntity[];
  templeInfo: BaseEntity[];
  donations: BaseEntity[];
  popups: BaseEntity[];
  announcements: BaseEntity[];
  menus: BaseEntity[];
  users: BaseEntity[];
  serverStatus: BaseEntity[];
  settings: BaseEntity[];
  contactMessages: BaseEntity[];
  activityLogs: BaseEntity[];
  backups: BaseEntity[];
  recycleBin: BaseEntity[];
  
  // Actions
  addItem: (table: keyof StoreState, item: BaseEntity) => Promise<void>;
  updateItem: (table: keyof StoreState, item: BaseEntity) => Promise<void>;
  deleteItem: (table: keyof StoreState, id: number) => Promise<void>;
  setItems: (table: keyof StoreState, items: BaseEntity[]) => void;
  initSupabaseSync: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      abbots: [
        { id: 1, name: 'พระอธิการสมชาย ปญฺญาโชโต', position: 'เจ้าอาวาสรูปปัจจุบัน', year: '2560 - ปัจจุบัน', image: '' }
      ],
      news: [
        {
          id: 1,
          title: 'ขอเชิญร่วมงานผูกพัทธสีมา ปิดทองฝังลูกนิมิต',
          date: '2024-03-15',
          excerpt: 'ขอเรียนเชิญพุทธศาสนิกชนทุกท่าน ร่วมงานบุญใหญ่ประจำปี ผูกพัทธสีมา ปิดทองฝังลูกนิมิต ณ วัดดอนสว่างธรรมเจริญศรัทธา',
          category: 'ข่าวประชาสัมพันธ์'
        }
      ],
      gallery: [
         { id: 1, title: 'ภาพบรรยากาศงานวิสาขบูชา 2567', count: 42, status: 'Published', category: 'วันสำคัญทางศาสนา', url: 'https://images.unsplash.com/photo-1542644287-6e6912384a86?q=80&w=800&auto=format&fit=crop' }
      ],
      activities: [
        {
          id: 1,
          name: 'งานทำบุญตักบาตรและฟังธรรมเทศนาเนื่องในวันอาสาฬหบูชา',
          type: 'งานบุญประเพณี',
          date: '2026-07-28',
          time: '07:00'
        },
        {
          id: 2,
          name: 'กิจกรรมเจริญสติภาวนาและปฏิบัติธรรมวิปัสสนา (ประจำเดือน)',
          type: 'ปฏิบัติธรรม',
          date: '2026-08-05',
          time: '09:00'
        },
        {
          id: 3,
          name: 'พิธีถวายผ้าอาบน้ำฝนและถวายเทียนพรรษา',
          type: 'งานบุญประเพณี',
          date: '2026-07-29',
          time: '08:30'
        }
      ],
      templeInfo: [],
      donations: [],
      popups: [],
      announcements: [],
      menus: [],
      users: [],
      serverStatus: [
        { id: 1, name: 'Server Status', value: 'Online', type: 'System' }
      ],
      settings: [
        { id: 1, key: 'Site Title', value: 'วัดดอนสว่างธรรมเจริญศรัทธา' },
        { id: 2, key: 'Contact Email', value: 'weeratheroofficial@gmail.com' },
        { id: 3, key: 'Contact Phone', value: '02-xxx-xxxx' },
        { id: 4, key: 'Temple Address', value: 'วัดดอนสว่างธรรมเจริญศรัทธา\nหมู่ 5 ตำบลเชียงใหม่\nอำเภอโพธิ์ชัย จังหวัดร้อยเอ็ด 45230' },
        { id: 5, key: 'Donation Bank', value: 'ธนาคารกรุงเทพ' },
        { id: 6, key: 'Donation Branch', value: 'สาขา โพธิ์ชัย' },
        { id: 7, key: 'Donation Account Name', value: 'วัดดอนสว่างธรรมเจริญศรัทธา' },
        { id: 8, key: 'Donation Account No', value: '123-4-56789-0' },
        { id: 9, key: 'Donation QR Code', value: '' }
      ],
      contactMessages: [],
      activityLogs: [
        { id: 1, action: 'เริ่มต้นระบบฐานข้อมูลใหม่', user: 'System', detail: 'สร้างฐานข้อมูลเริ่มต้นสำเร็จ', time: new Date().toISOString(), type: 'system' }
      ],
      backups: [
        { id: 1, name: `backup_initial.sql`, size: '1.2 MB', type: 'Auto (System)', status: 'Success', date: new Date().toISOString() }
      ],
      recycleBin: [],

      initSupabaseSync: async () => {
        if (isSupabaseInitialized || !isSupabaseConfigured()) return;
        isSupabaseInitialized = true;
        
        const tablesToSync: (keyof StoreState)[] = [
          'news', 'activities', 'gallery', 'users', 'donations', 'abbots', 'announcements', 'popups', 'contactInfo', 'settings'
        ];
        
        // Initial Fetch
        for (const table of tablesToSync) {
          try {
            const { data, error } = await supabase.from(table).select('*');
            if (!error && data) {
              set({ [table]: data } as any);
            }
          } catch (e) {
            console.error(`Failed to fetch ${table} from Supabase:`, e);
          }
        }

        // Realtime Subscription
        const channel = supabase.channel('schema-db-changes');
        for (const table of tablesToSync) {
          channel.on(
            'postgres_changes',
            { event: '*', schema: 'public', table: table },
            (payload) => {
              const currentItems = (get()[table] as BaseEntity[]) || [];
              if (payload.eventType === 'INSERT') {
                const item = payload.new as BaseEntity;
                if (!currentItems.find(i => i.id === item.id)) {
                  set({ [table]: [...currentItems, item] } as any);
                }
              } else if (payload.eventType === 'UPDATE') {
                const item = payload.new as BaseEntity;
                set({ [table]: currentItems.map(i => i.id === item.id ? { ...i, ...item } : i) } as any);
              } else if (payload.eventType === 'DELETE') {
                set({ [table]: currentItems.filter(i => String(i.id) !== String(payload.old.id)) } as any);
              }
            }
          );
        }
        channel.subscribe();
      },

      addItem: async (table, item) => {
        let finalItem = item;
        const syncableTables = ['news', 'activities', 'gallery', 'users', 'donations', 'abbots', 'announcements', 'popups', 'contactInfo', 'settings'];
        if (isSupabaseConfigured() && syncableTables.includes(table as string)) {
          try {
            const { data, error } = await supabase.from(table).insert(item).select().single();
            if (!error && data) {
              finalItem = data;
            }
          } catch (e) {
            console.error(e);
          }
        }
        
        set((state) => {
          const newState: any = {
            [table]: [...((state[table] as BaseEntity[]) || []), finalItem]
          };

          if (table !== 'activityLogs') {
            const logItem = {
              id: Date.now(),
              action: `เพิ่มข้อมูลใน ${table}`,
              user: 'Admin',
              detail: finalItem.title || finalItem.name || `ID: ${finalItem.id}`,
              time: new Date().toISOString(),
              type: 'create'
            };
            newState.activityLogs = [...((state.activityLogs as BaseEntity[]) || []), logItem];
          }

          return newState;
        });
      },
      updateItem: async (table, item) => {
        const syncableTables = ['news', 'activities', 'gallery', 'users', 'donations', 'abbots', 'announcements', 'popups', 'contactInfo', 'settings'];
        if (isSupabaseConfigured() && syncableTables.includes(table as string)) {
          try {
            await supabase.from(table).update(item).eq('id', item.id);
          } catch (e) {
            console.error(e);
          }
        }
        
        set((state) => {
          const newState: any = {
            [table]: ((state[table] as BaseEntity[]) || []).map(i => i.id === item.id ? { ...i, ...item } : i)
          };

          if (table !== 'activityLogs') {
            const logItem = {
              id: Date.now(),
              action: `แก้ไขข้อมูลใน ${table}`,
              user: 'Admin',
              detail: item.title || item.name || `ID: ${item.id}`,
              time: new Date().toISOString(),
              type: 'edit'
            };
            newState.activityLogs = [...((state.activityLogs as BaseEntity[]) || []), logItem];
          }

          return newState;
        });
      },
      deleteItem: async (table, id) => {
        const syncableTables = ['news', 'activities', 'gallery', 'users', 'donations', 'abbots', 'announcements', 'popups', 'contactInfo', 'settings'];
        if (isSupabaseConfigured() && syncableTables.includes(table as string)) {
          try {
            await supabase.from(table).delete().eq('id', id);
          } catch (e) {
            console.error(e);
          }
        }
        
        set((state) => {
          const currentItems = (state[table] as BaseEntity[]) || [];
          const itemToDelete = currentItems.find(i => String(i.id) === String(id));
          
          const newState: any = {
            [table]: currentItems.filter(i => String(i.id) !== String(id))
          };

          // If it's a recyclable table, add to recycle bin
          const recyclableTables = ['news', 'gallery', 'activities', 'announcements'];
          if (recyclableTables.includes(table) && itemToDelete) {
            const recycleBinItem = {
              ...itemToDelete,
              originalTable: table,
              deletedAt: new Date().toISOString(),
              type: table === 'news' ? 'ข่าวสาร' : 
                    table === 'gallery' ? 'แกลเลอรี่' : 
                    table === 'activities' ? 'กิจกรรม' : 
                    table === 'announcements' ? 'ป้ายประกาศ' : 'ทั่วไป',
              name: itemToDelete.title || itemToDelete.name || `รายการจาก ${table}`
            };
            newState.recycleBin = [...((state.recycleBin as BaseEntity[]) || []), recycleBinItem];
          }

          // Add activity log
          const logItem = {
            id: Date.now(),
            action: `ลบข้อมูลจาก ${table}`,
            user: 'Admin',
            detail: itemToDelete ? (itemToDelete.title || itemToDelete.name || `ID: ${id}`) : `ID: ${id}`,
            time: new Date().toISOString(),
            type: 'delete'
          };
          newState.activityLogs = [...((state.activityLogs as BaseEntity[]) || []), logItem];

          return newState;
        });
      },
      setItems: (table, items) => set(() => ({ [table]: items })),
    }),
    {
      name: 'temple-storage',
      storage: createJSONStorage(() => idbStorage),
    }
  )
);
