sed -i "s/import { useState } from 'react';/import { useState } from 'react';\nimport { useStore } from '..\/..\/store\/useStore';/g" src/components/layout/Navbar.tsx
