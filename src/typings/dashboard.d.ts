export interface TodoCardType {
  id: string;
  title: string;
  desc: string;
  finished: boolean;
}

export interface TodoCardListType {
  list: TodoCardType[];
}

export interface CardWrapperType {
  finished: boolean;
}
