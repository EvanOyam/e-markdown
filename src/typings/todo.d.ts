export interface ClassifyProps {
  activedClassify: number;
  customActivedClassify: (id: number) => void;
}

export interface CustomDayPickerProps {
  selectedDay: Date | undefined;
  customSelectDay: (day: Date) => void;
}
