export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    featured?: boolean;
    inStock: boolean;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
}
