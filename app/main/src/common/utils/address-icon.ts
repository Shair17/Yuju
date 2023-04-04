export const getAddressBottomSheetIconName = (iconName: string): string => {
  return (
    {
      Casa: 'home',
      Amigo: 'people',
      Pareja: 'heart',
      Trabajo: 'ios-briefcase',
      Universidad: 'school',
    }[iconName] || 'ellipsis-horizontal'
  );
};
