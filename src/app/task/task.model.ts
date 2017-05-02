import { Category } from './category.model';

export class Task {
    id: number;
    title: string;
    done?: boolean;
    category?: Category;

    constructor(data: any) {
        for (var propName in data)
            this[propName] = data[propName];
        return this;
    }
}