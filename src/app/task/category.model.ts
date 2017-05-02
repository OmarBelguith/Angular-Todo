export class Category {
    id: number;
    name: string;
    color: string;

    constructor(data: any) {
        for (var propName in data)
            this[propName] = data[propName];
        return this;
    }
}