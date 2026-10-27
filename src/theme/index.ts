export const colors = {
  bg: '#040D0C', surface: '#0C1816', surfaceAlt: '#12211F',
  border: 'rgba(31,226,154,0.28)', primary: '#1FE29A', text: '#FFFFFF', muted: '#9AA9A5', verified: '#3B9BFF',
} as const;
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 } as const;
export const radius = { sm: 8, md: 14, lg: 22, pill: 999 } as const;
export const layout = { tabBarHeight: 64, miniHeight: 64 } as const;
export const spring = { damping: 18, stiffness: 180, mass: 0.9 } as const;
export const typography = {
  title: { fontSize: 30, fontWeight: '800' as const, color: colors.text },
  heading: { fontSize: 18, fontWeight: '700' as const, color: colors.text },
  body: { fontSize: 15, fontWeight: '600' as const, color: colors.text },
  caption: { fontSize: 12, fontWeight: '500' as const, color: colors.muted },
};
