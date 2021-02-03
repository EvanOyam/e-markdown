import { Payload } from 'recharts/types/component/DefaultTooltipContent';

declare module 'recharts/types/component/DefaultTooltipContent' {
  interface TodoChartPayload {
    finishedCount: number;
    todoCount: number;
    percent: number;
  }
  interface MarkdownChartPayload {
    createCount: number;
    inputCount: number;
  }
  interface MindmapChartPayload {
    createCount: number;
  }
  type CustomPayload = TodoChartPayload &
    MarkdownChartPayload &
    MindmapChartPayload;
  export interface Payload<TValue extends ValueType, TName extends NameType> {
    payload: CustomPayload;
  }
}
